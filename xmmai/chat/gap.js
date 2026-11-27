/* gap.js: the strip above the app in the home-screen app (PWA) always matches the page you are on.
   Samples the real background at the top of the screen (through shadow DOM too) and mirrors it to the page background + theme-color. */
(function(){"use strict";
var H=document.documentElement,last="",busy=0,bar=null,lastH=-1;
function parse(c){var m=/rgba?\(([^)]+)\)/.exec(c||"");if(!m)return null;var p=m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat);if(p.length<3||p.some(isNaN))return null;return[p[0],p[1],p[2],p.length>3?p[3]:1]}
function deep(x,y){var e=document.elementFromPoint(x,y),g=0;while(e&&e.shadowRoot&&g++<6){var i=e.shadowRoot.elementFromPoint(x,y);if(!i||i===e)break;e=i}return e}
function up(e){if(!e)return null;if(e.parentElement)return e.parentElement;var r=e.getRootNode&&e.getRootNode();return r&&r.host?r.host:null}
function sample(){
 var top=0,v=document.getElementById("v3");
 if(v){var r=v.getBoundingClientRect();if(r&&r.top>0&&r.top<120)top=r.top}
 else{var sh=document.getElementById("shell-chat");if(sh){var r2=sh.getBoundingClientRect();if(r2&&r2.top>0&&r2.top<120)top=r2.top}}
 var x=Math.round(innerWidth/2),y=Math.round(top)+6,e=deep(x,y),layers=[],n=0;
 while(e&&n++<40){var cs=getComputedStyle(e),c=parse(cs.backgroundColor);if(c&&c[3]>0){layers.push(c);if(c[3]>=.98)break}e=up(e)}
 var base=H.getAttribute("data-cl-theme")==="light"?[250,249,245,1]:[25,25,25,1];
 if(!layers.length||layers[layers.length-1][3]<.98)layers.push(base);
 var out=layers[layers.length-1].slice(0,3);
 for(var i=layers.length-2;i>=0;i--){var a=layers[i][3];out=[out[0]*(1-a)+layers[i][0]*a,out[1]*(1-a)+layers[i][1]*a,out[2]*(1-a)+layers[i][2]*a]}
 if(out[0]+out[1]+out[2]<36&&H.getAttribute("data-cl-theme")!=="light")out=[25,25,25];
 return"rgb("+Math.round(out[0])+","+Math.round(out[1])+","+Math.round(out[2])+")"}
function inset(){try{var d=document.createElement("div");d.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px)";H.appendChild(d);var v=parseFloat(getComputedStyle(d).paddingTop)||0;H.removeChild(d);return v}catch(e){return 0}}
function gapH(){var v=document.getElementById("v3"),t=0;if(v){var r=v.getBoundingClientRect();if(r&&r.top>0&&r.top<160)t=r.top}if(!t){var sh=document.getElementById("shell-chat");if(sh){var r2=sh.getBoundingClientRect();if(r2&&r2.top>0&&r2.top<160)t=r2.top}}return Math.max(t,inset())}
function paint(c){
 var h=Math.round(gapH());
 if(!bar||!bar.isConnected){bar=document.createElement("div");bar.id="xgapbar";bar.setAttribute("aria-hidden","true");H.appendChild(bar);lastH=-1}
 bar.style.cssText="position:fixed!important;left:0!important;right:0!important;top:0!important;height:"+h+"px!important;background:"+c+"!important;z-index:2147483647!important;pointer-events:none!important;display:"+(h>0?"block":"none")+"!important;transition:background-color .2s ease";
 H.style.setProperty("background-color",c,"important");if(document.body)document.body.style.setProperty("background-color",c,"important")}
function apply(){
 busy=0;
 try{
  var c=sample(),h=Math.round(gapH());if(c===last&&h===lastH)return;last=c;lastH=h;paint(c);
  H.style.setProperty("--xgapbg",c);
  var m=document.querySelector('meta[name="theme-color"]');
  if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}
  m.setAttribute("content",c);
 }catch(e){}}
function sched(){if(busy)return;busy=1;(window.requestAnimationFrame||setTimeout)(apply)}
["click","touchend","transitionend","animationend","popstate","resize","orientationchange","pageshow","focusin","focusout"].forEach(function(t){addEventListener(t,function(){sched();setTimeout(sched,120);setTimeout(sched,380)},true)});
try{new MutationObserver(sched).observe(H,{attributes:true,subtree:true,childList:true,attributeFilter:["class","style","hidden","data-cl-theme","data-th"]})}catch(e){}
try{matchMedia("(prefers-color-scheme:dark)").addEventListener("change",sched)}catch(e){}
setInterval(sched,350);
sched();
})();
