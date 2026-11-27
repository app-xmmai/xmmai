/* XMM AI gemini.js — Gemini layer: greeting name, suggestion chips, avatar, sidebar toggle. */
(function(){
"use strict";
var $=function(s){return document.querySelector(s)};
var CH=[["image","Create image",2],["write","Write",0],["analyze","Analyze",1],["code","Code",3],["trip","Plan a trip",5],["translate","Translate",4]];
function nm(){try{return String(JSON.parse(localStorage.getItem("xmm.name"))||"").trim()}catch(e){return""}}
function tick(){
 var g=$("#gmName");if(g){var t="Hi "+(nm()||"there");if(g.textContent!==t)g.textContent=t}
 var dock=$("#viewChat .dock"),comp=$(".composer");
 if(dock&&comp&&!$("#gmChips")){
  var c=document.createElement("div");c.id="gmChips";
  CH.forEach(function(x){var b=document.createElement("button");b.type="button";b.innerHTML="<i>"+XMI(x[0])+"</i><span>"+x[1]+"</span>";
   b.onclick=function(){var z=document.querySelector('#zhero .zc[data-i="'+x[2]+'"]');if(z)z.click()};c.appendChild(b)});
  comp.insertAdjacentElement("afterend",c)}
 var top=$("#clTop");
 if(top&&!$(".gm-av")){var a=document.createElement("button");a.type="button";a.className="gm-av";a.setAttribute("aria-label","Account");a.onclick=function(){var v=$("#clAv");if(v)v.click()};top.appendChild(a)}
 var av=$(".gm-av");if(av){var l=(nm()||"X").charAt(0).toUpperCase();if(av.textContent!==l)av.textContent=l}
}
document.addEventListener("click",function(e){
 var t=e.target;if(!t.closest)return;
 if(t.closest("#gmMenu")){var m=$("#clMenu");if(m)m.click();return}
 if(t.closest(".gm-sh")){var v=$("#clAv");if(v)v.click()}
},true);
/* word "galaxy" in a sent message unlocks XMMGPT-7 Galaxy */
function galCheck(){try{var m=$("#msg");if(m&&/\bgalaxy\b/i.test(m.value)&&window.XMM_SUN&&XMM_SUN.galOk&&!XMM_SUN.galOk())XMM_SUN.unlockGalaxy()}catch(e){}}
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey&&e.target&&e.target.id==="msg")galCheck()},true);
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#sendBtn"))galCheck()},true);
/* Siri-style edge glow while any pop-up is open */
var gl=document.createElement("div");gl.id="gmSiri";gl.innerHTML='<svg viewBox="0 0 900 120" preserveAspectRatio="none"><defs><linearGradient id="gmWg" x1="0" x2="1"><stop offset="0" stop-color="#4285f4"/><stop offset=".3" stop-color="#2fd0ff"/><stop offset=".55" stop-color="#7b5cff"/><stop offset=".8" stop-color="#d96cf0"/><stop offset="1" stop-color="#ff6fa5"/></linearGradient></defs><path class="w w1" d="M0 60 Q 150 34 300 60 T 600 60 T 900 60 T 1200 60 T 1500 60 T 1800 60"/><path class="w w2" d="M0 70 Q 150 44 300 70 T 600 70 T 900 70 T 1200 70 T 1500 70 T 1800 70"/><path class="w w3" d="M0 80 Q 150 54 300 80 T 600 80 T 900 80 T 1200 80 T 1500 80 T 1800 80"/></svg>';document.body.appendChild(gl);
var gT=0,gSeen=false;
setInterval(function(){var has=!!document.querySelector(".sunpop,#xgp");if(has&&!gSeen){gSeen=true;gl.classList.add("on");clearTimeout(gT);gT=setTimeout(function(){gl.classList.remove("on")},1000)}else if(!has)gSeen=false},120);
setInterval(tick,600);tick();
})();
