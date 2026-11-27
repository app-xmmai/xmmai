/* companion.js — stretch (iOS 26+/Android 14+ phones), auto XMMGPT 6.2 in Code, update popup, iPhone flag */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)};
var ua=navigator.userAgent||"";
var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var ls={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function api(){return window.XMM_API||{}}

/* ---------- iPhone flag ---------- */
var isIphone=/iPhone/.test(ua),isIpad=/iPad/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),isApple=isIphone||isIpad;
if(isApple)document.documentElement.classList.add("x-ios");

/* ================= STRETCH (phones only) ================= */
function stretchAllowed(){
 if(!(navigator.maxTouchPoints>0))return Promise.resolve(false);
 if(isApple){
  var v=/Version\/(\d+)/.exec(ua);if(v)return Promise.resolve(+v[1]>=26);
  var ok=false;try{ok=!!(window.CSS&&CSS.supports&&CSS.supports("position-anchor","--a"))}catch(e){}
  return Promise.resolve(ok);
 }
 if(/Android/.test(ua)){
  var uad=navigator.userAgentData;
  if(uad&&uad.getHighEntropyValues)return uad.getHighEntropyValues(["platformVersion"]).then(function(h){return parseInt(h.platformVersion,10)>=14}).catch(function(){return false});
  var a=/Android (\d+)/.exec(ua);return Promise.resolve(!!a&&+a[1]>=14);
 }
 return Promise.resolve(false);
}
var XSEL='button,[role="button"],.icon-btn,.chip,.vc,.vgl,.circle,.composer,.cd-in,.bnav,.m-user,.m-bot .body,.card';
function scrollableAncestor(el){
 for(var n=el.parentElement;n&&n!==document.body;n=n.parentElement){
  var cs=getComputedStyle(n),oy=cs.overflowY,ox=cs.overflowX;
  if(((oy==="auto"||oy==="scroll")&&n.scrollHeight>n.clientHeight+2)||((ox==="auto"||ox==="scroll")&&n.scrollWidth>n.clientWidth+2))return true}
 return false}
function initStretch(){
 document.body.classList.add("xs-on");
 var cur=null,sx=0,sy=0,moved=false,sup=false;
 function apply(el,dx,dy,w,h,hold){
  var kx=Math.tanh(Math.abs(dx)/(w*1.1)),ky=Math.tanh(Math.abs(dy)/(h*1.4));
  var scx=1+.55*kx,scy=1+.55*ky;
  var tx=Math.sign(dx)*Math.min(Math.abs(dx)*.28,38),ty=Math.sign(dy)*Math.min(Math.abs(dy)*.28,38);
  var ox=dx>0?"0%":"100%",oy=dy>0?"0%":"100%";
  el.style.setProperty("transform-origin",ox+" "+oy,"important");
  el.style.setProperty("transform","translate("+tx.toFixed(1)+"px,"+ty.toFixed(1)+"px) scale("+(scx*(1-.08*ky)).toFixed(3)+","+(scy*(1-.08*kx)).toFixed(3)+")","important");
 }
 function release(el){
  el.style.setProperty("transition","transform .6s cubic-bezier(.3,1.9,.5,1)","important");
  el.style.setProperty("transform","none","important");
  setTimeout(function(){["transition","transform","transform-origin"].forEach(function(p){el.style.removeProperty(p)});el.classList.remove("xs-drag")},650);
 }
 addEventListener("pointerdown",function(e){
  if(e.pointerType==="mouse"||!e.isPrimary)return;
  var t=e.target.closest&&e.target.closest(XSEL);
  if(t&&t.closest(".vtop,#code>header.topbar"))return; /* top bar bend is done by liquid.js */
  if(!t||t.closest("#xwn .card")&&!t.closest("button"))return;
  if(t.matches("textarea,input")||scrollableAncestor(t))return;
  var r=t.getBoundingClientRect();if(r.width>520&&r.height>260)return;
  cur={el:t,w:Math.max(r.width,28),h:Math.max(r.height,28)};sx=e.clientX;sy=e.clientY;moved=false;
  t.style.setProperty("transition","none","important");t.classList.add("xs-drag");
 },true);
 addEventListener("pointermove",function(e){
  if(!cur)return;var dx=e.clientX-sx,dy=e.clientY-sy;
  if(!moved&&Math.hypot(dx,dy)<7)return;moved=true;apply(cur.el,dx,dy,cur.w,cur.h);
 },{passive:true});
 function up(){if(!cur)return;var el=cur.el;cur=null;if(moved){sup=true;setTimeout(function(){sup=false},350)}release(el)}
 addEventListener("pointerup",up,true);addEventListener("pointercancel",up,true);
 addEventListener("click",function(e){if(sup){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();sup=false}},true);
}
stretchAllowed().then(function(ok){if(ok)initStretch()});

/* ================= CODE EDITOR → XMM AI ENGINE 5.2 ================= */
var prevMode=null;
function toEngine(){return;
 var a=api();if(!a.S)return;
 if(a.S.mode!=="x25"&&a.S.mode!=="sun62"){prevMode=a.S.mode;a.S.mode="x25";var sp=$("#modeBtn span");if(sp)sp.textContent="Models";
  if(a.toast)a.toast("Code uses XMMGPT 6.2")}
}
function fromEngine(){return;
 var a=api();if(!a.S||!prevMode)return;
 if(a.S.mode==="x25"){a.S.mode=prevMode;var M={x12:"XMMGPT 5.0",x20:"XMMGPT 5.2",x25:"XMMGPT Engine 6.2",sun62:"XMMGPT 6.2 Sun"};var sp=$("#modeBtn span");if(sp)sp.textContent="Models"}
 prevMode=null;
}
var wasCode=false;
new MutationObserver(function(){var on=document.body.classList.contains("code-on");if(on&&!wasCode)toEngine();if(!on&&wasCode)fromEngine();wasCode=on}).observe(document.body,{attributes:true,attributeFilter:["class"]});
addEventListener("xmm-code-start",toEngine);

/* ================= UPDATE POPUP ================= */
var KEY="xmm.whatsnew.v6";
function showPopup(){
 if(ls.get(KEY)||window.XMM_SUN)return;
 var busy=function(id){var e=document.getElementById(id);return e&&!e.hidden&&getComputedStyle(e).display!=="none"};
 if(busy("login")||busy("welcome")||document.getElementById("cine")){setTimeout(showPopup,700);return}
 var o=document.createElement("div");o.id="xwn";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","New features");
 o.innerHTML='<div class="card"><button class="x" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button><video class="bv" autoplay muted loop playsinline preload="auto" poster="update-banner.jpg?v=3" aria-label="New features"><source src="update-banner.mp4?v=3" type="video/mp4"><source src="update-banner.webm?v=3" type="video/webm"></video><div class="tx"><h3>New features!</h3><ul class="fl"><li><b>Liquid glass buttons</b><span>Highlighted buttons now look like Apple\u2019s liquid glass, with a soft bend at the corners.</span></li><li><b>Floating top bar and chat input</b><span>No header bar and no black lines. Your chat shows through the glass as it scrolls underneath.</span></li><li><b>Liquid bend animations</b><span>Top bar buttons grow big, shrink small and glow with new highlights. It happens when you slide them and also when you just tap them.</span></li><li><b>New glass icon</b><span>A slightly 3D, slightly see-through icon that loads instantly.</span></li><li><b>Fast on every browser</b><span>Built to run smoothly on Safari, Firefox and Chrome.</span></li></ul><button class="go" type="button">Let\u2019s go</button></div></div>';
 document.body.appendChild(o);
 var bv=o.querySelector("video");if(bv){bv.muted=true;bv.defaultMuted=true;try{var pr=bv.play();if(pr&&pr.catch)pr.catch(function(){})}catch(e){}}
 requestAnimationFrame(function(){requestAnimationFrame(function(){o.classList.add("in")})});
 var closed=false;function close(){if(closed)return;closed=true;ls.set(KEY,"closed");o.classList.remove("in");setTimeout(function(){o.remove()},320)}
 o.querySelector(".x").addEventListener("click",close);o.querySelector(".go").addEventListener("click",close);
 o.addEventListener("click",function(e){if(e.target===o)close()});
}
setTimeout(showPopup,1600);
})();
