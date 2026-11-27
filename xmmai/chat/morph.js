(function(){"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
function sv(p){return'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
var IC={vid:'<rect x="3.5" y="6" width="12" height="12" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3z"/>',cam:'<path d="M4 8.5A2.5 2.5 0 016.5 6h1.2l1.3-2h6l1.3 2h1.2A2.5 2.5 0 0120 8.5v8a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 16.5z"/><circle cx="12" cy="12.5" r="3.2"/>',img:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',file:'<path d="M14 3.5H8A2.5 2.5 0 005.5 6v12A2.5 2.5 0 008 20.5h8a2.5 2.5 0 002.5-2.5V8z"/><path d="M14 3.5V8h4.5"/>',proj:'<rect x="4" y="9" width="16" height="11" rx="3"/><path d="M7 5.5h10M9 2.5h6"/>',eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',share:'<path d="M12 16V4M7.5 8.5L12 4l4.5 4.5M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>',gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8l1.4 2.4 2.7-.6.9 2.6 2.6.9-.6 2.7 2.4 1.4-2.4 1.4.6 2.7-2.6.9-.9 2.6-2.7-.6L12 21.2l-1.4-2.4-2.7.6-.9-2.6-2.6-.9.6-2.7L2.6 12l2.4-1.4-.6-2.7 2.6-.9.9-2.6 2.7.6z"/>'};
function click(s){var e=$(s);if(e)e.click()}
var cur=null;
/* ---- liquid-glass morph: button grows into the panel, panel shrinks back into the button ---- */
function make(items){var p=document.createElement("div");p.className="mg-panel";p.hidden=true;
 p.innerHTML=items.map(function(i,n){return'<button type="button" class="mg-i" data-n="'+n+'">'+sv(IC[i[0]])+'<span>'+i[1]+'</span></button>'}).join("");
 p.onclick=function(e){var b=e.target.closest(".mg-i");if(!b)return;var f=items[+b.dataset.n][2];close(function(){f()})};
 document.body.appendChild(p);return p}
function open(btn,panel,dir){if(cur)close();cur={btn:btn,panel:panel,dir:dir};
 var B=btn.getBoundingClientRect();panel.hidden=false;panel.removeAttribute("hidden");panel.style.cssText="display:flex;visibility:visible;opacity:1;pointer-events:auto;z-index:120";var w=panel.offsetWidth,h=panel.offsetHeight,vw=innerWidth,vh=innerHeight;
 var L=dir==="up"?B.left:B.right-w,T=dir==="up"?B.bottom-h:B.top;
 L=Math.max(10,Math.min(L,vw-w-10));T=Math.max(10,Math.min(T,vh-h-10));
 panel.style.left=L+"px";panel.style.top=T+"px";
 var t=B.top-T,r=(L+w)-B.right,b=(T+h)-B.bottom,l=B.left-L,R=Math.min(B.width,B.height)/2;
 var from="inset("+t+"px "+r+"px "+b+"px "+l+"px round "+R+"px)",to="inset(0px 0px 0px 0px round 26px)";
 cur.from=from;cur.to=to;
 var ease="cubic-bezier(.22,1,.36,1)";
 panel.animate([{clipPath:from,opacity:.9},{clipPath:to,opacity:1}],{duration:460,easing:ease,fill:"both"});
 [].forEach.call(panel.children,function(c,i){c.animate([{opacity:0,transform:"translateY("+(dir==="up"?10:-10)+"px) scale(.96)"},{opacity:1,transform:"none"}],{duration:320,delay:110+i*40,easing:ease,fill:"both"})});
 btn.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(.7)"}],{duration:180,easing:"ease-out",fill:"forwards"});
 btn.classList.add("mg-open")}
function close(after){if(!cur){after&&after();return}var c=cur;cur=null;var p=c.panel,btn=c.btn;
 [].forEach.call(p.children,function(ch){ch.animate([{opacity:1},{opacity:0}],{duration:160,fill:"forwards"})});
 var a=p.animate([{clipPath:c.to,transform:"scale(1)"},{clipPath:c.from,transform:"scale(.94)"}],{duration:420,easing:"cubic-bezier(.32,.72,0,1)",fill:"forwards"});
 setTimeout(function(){btn.getAnimations().forEach(function(x){x.cancel()});btn.animate([{opacity:0,transform:"scale(.7)"},{opacity:1,transform:"scale(1)"}],{duration:420,easing:"cubic-bezier(.3,1.5,.4,1)",fill:"both"});btn.classList.remove("mg-open")},240);
 a.onfinish=function(){p.getAnimations().forEach(function(x){x.cancel()});p.hidden=true;p.setAttribute("hidden","");p.style.pointerEvents="none"};
 if(after)setTimeout(after,260)}
document.addEventListener("pointerdown",function(e){if(cur&&!e.target.closest(".mg-panel")&&!e.target.closest(".mg-open"))close()},true);
addEventListener("keydown",function(e){if(e.key==="Escape")close()});
addEventListener("resize",function(){close()});
/* ---- + (attach) ---- */
var file=$("#file"),ACC=file?file.getAttribute("accept"):"";
function pick(accept,cap){return function(){
  var f=document.createElement("input");
  f.type="file";f.className="xmm-file";f.multiple=!cap;
  f.accept=accept||"image/*,video/*";
  if(cap)f.setAttribute("capture","environment");
  f.style.cssText="position:fixed;left:-99999px;width:0;height:0;opacity:0;pointer-events:none";
  document.body.appendChild(f);
  f.onchange=function(){
    try{
      if(f.files&&f.files.length){
        var real=document.getElementById("file");
        if(!real){real=document.createElement("input");real.type="file";real.id="file";real.className="xmm-file";real.multiple=true;real.style.cssText=f.style.cssText;document.body.appendChild(real)}
        try{var dt=new DataTransfer();[].forEach.call(f.files,function(x){dt.items.add(x)});real.files=dt.files}catch(e){}
        real.dispatchEvent(new Event("change",{bubbles:true}));
      }
    }catch(e){}
    try{f.remove()}catch(e){}
  };
  try{f.click()}catch(e){try{f.remove()}catch(e2){}}
}}
var plus=null;
document.addEventListener("click",function(e){
 var a=e.target.closest&&e.target.closest("#attBtn");
 if(a){e.stopImmediatePropagation();e.preventDefault();
  if(!plus)plus=make([["cam","Camera",pick("image/*",true)],["img","Photos",pick("image/*")],["vid","Video",pick("video/*")],["file","Files",pick("image/*,.txt,.md,.csv,.json,.js,.ts,.py,.html,.css,.xml,.log,.pdf")]]);
  if(cur&&cur.btn===a)close();else open(a,plus,"up");return}
 var d=e.target.closest&&e.target.closest("#tbPreview");
 if(d){e.stopImmediatePropagation();e.preventDefault();
  if(!dots)dots=make([,["share","Share",function(){click('[data-act="share"]')}],["gear","Settings",function(){click('[data-act="settings"]')}]]);
  if(cur&&cur.btn===d)close();else open(d,dots,"down");return}
 var c=e.target.closest&&e.target.closest('#seg [data-m="chat"]');
 if(c&&window.XMM_CODE&&XMM_CODE.isOpen())XMM_CODE.close()
},true);
var dots=null;
var seg=$("#seg");
function pos(n){if(!seg)return;n=n===2?1:(n?1:0);seg.dataset.pos=String(n);[].forEach.call(seg.querySelectorAll(".xp-b"),function(b,i){b.classList.toggle("on",i===n)})}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#seg [data-m]");if(!b)return;var k=b.dataset.m,C=window.XMM_CODE;
 if(k==="code"){e.stopImmediatePropagation();e.preventDefault();pos(1);document.body.classList.add("v-build");document.body.classList.remove("code-on");if(C&&C.isOpen())C.close();
  try{var s=document.getElementById("sideChat");if(s&&s.classList.contains("open")){s.classList.remove("open");var sc=document.getElementById("scrim");if(sc)sc.classList.remove("on")}document.body.classList.add("xhide");var cd=document.querySelector('[data-act="closeDrawer"]');if(cd)cd.click()}catch(z){}}
 else if(k==="chat"){pos(0);document.body.classList.remove("v-build","code-on");if(C&&C.isOpen())C.close()}
 else if(k==="imagine"){/* removed */}else if(k==="code"){pos(1)}
},true);
var wasCode=document.body.classList.contains("code-on");
new MutationObserver(function(){var on=document.body.classList.contains("code-on");if(on===wasCode)return;wasCode=on;if(on)pos(2);else if(seg&&seg.dataset.pos==="2")pos(0)}).observe(document.body,{attributes:true,attributeFilter:["class"]});

/* ---- Build mode placeholder ---- */
var PH=new WeakMap();
function ph(){var on=document.body.classList.contains("code-on")||document.body.classList.contains("v-build")||(window.XMM_VMODE==="build");[].forEach.call(document.querySelectorAll("#msg,#code textarea"),function(t){if(!PH.has(t))PH.set(t,t.placeholder);t.placeholder=on?"What do you want to build?":PH.get(t)})}
new MutationObserver(ph).observe(document.body,{attributes:true,attributeFilter:["class"],childList:true});setInterval(ph,600);

/* ---- send button = voice mode when empty, arrow when something is typed ---- */
function upd(){var b=$("#sendBtn"),t=$("#msg");if(!b||!t)return;var has=t.value.trim()||document.querySelector("#atts>*"),busy=b.classList.contains("is-busy");b.classList.toggle("xvoice",!has&&!busy)}
setInterval(upd,250);document.addEventListener("input",upd,true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#sendBtn");if(!b||!b.classList.contains("xvoice"))return;
 e.stopImmediatePropagation();e.preventDefault();var v=document.getElementById("speakBtn");if(!v){v=document.createElement("button");v.id="speakBtn";v.hidden=true;document.body.appendChild(v)}v.click()},true);

/* ---- liquid open/close for every popup menu + settings ---- */
var lastBtn=null,R=new WeakMap();
document.addEventListener("pointerdown",function(e){lastBtn=e.target.closest&&e.target.closest("button,[data-act],.chat-i")||lastBtn},true);
function insetOf(B,P){return"inset("+(B.top-P.top)+"px "+(P.right-B.right)+"px "+(P.bottom-B.bottom)+"px "+(B.left-P.left)+"px round "+Math.min(B.width,B.height)/2+"px)"}
var EASE="cubic-bezier(.22,1,.36,1)";
function animIn(el,B,rad){var P=el.getBoundingClientRect();if(!P.width)return;var f=insetOf(B,P),t="inset(0px 0px 0px 0px round "+(rad||22)+"px)";R.set(el,{B:B,rad:rad});
 el.animate([{clipPath:f,opacity:.85},{clipPath:t,opacity:1}],{duration:420,easing:EASE});
 [].forEach.call(el.children,function(c,i){c.animate([{opacity:0,transform:"translateY(6px)"},{opacity:1,transform:"none"}],{duration:280,delay:90+i*30,easing:EASE,fill:"backwards"})})}
new MutationObserver(function(ms){ms.forEach(function(x){
 x.addedNodes.forEach(function(n){if(n.nodeType===1&&n.classList.contains("menu")&&!n.dataset.mgc&&lastBtn){animIn(n,lastBtn.getBoundingClientRect(),18)}});
 x.removedNodes.forEach(function(n){if(n.nodeType!==1||!n.classList.contains("menu")||n.dataset.mgc)return;var info=R.get(n);if(!info)return;
  var c=n.cloneNode(true);c.dataset.mgc=1;c.style.pointerEvents="none";document.body.appendChild(c);var P=c.getBoundingClientRect();
  var a=c.animate([{clipPath:"inset(0px 0px 0px 0px round 18px)",opacity:1},{clipPath:insetOf(info.B,P),opacity:.85}],{duration:300,easing:"cubic-bezier(.65,0,.35,1)",fill:"forwards"});a.onfinish=function(){c.remove()}})})}).observe(document.body,{childList:true});
var st=$("#settings");
if(st){var busy=false;new MutationObserver(function(){if(busy||window.__xmmTabletUI)return;var sh=st.querySelector(".sheet");if(!sh)return;
 if(!st.hidden){if(lastBtn){var B=lastBtn.getBoundingClientRect();requestAnimationFrame(function(){animIn(sh,B,28)})}}
 else{var info=R.get(sh);if(!info)return;busy=true;st.hidden=false;var P=sh.getBoundingClientRect();
  var a=sh.animate([{clipPath:"inset(0px 0px 0px 0px round 28px)",opacity:1},{clipPath:insetOf(info.B,P),opacity:.85}],{duration:320,easing:"cubic-bezier(.65,0,.35,1)",fill:"forwards"});
  a.onfinish=function(){a.cancel();st.hidden=true;setTimeout(function(){busy=false},30)}}
}).observe(st,{attributes:true,attributeFilter:["hidden"]})}
})();

/* backup: direct + bind if capture path fails */
(function(){
  function bind(){
    var a=document.getElementById("attBtn");
    if(!a||a.dataset.mg)return;
    a.dataset.mg="1";
    a.addEventListener("click",function(e){
      e.preventDefault();e.stopPropagation();
      if(!plus)plus=make([["cam","Camera",pick("image/*",true)],["img","Photos",pick("image/*")],["vid","Video",pick("video/*")],["file","Files",pick("image/*,.txt,.md,.csv,.json,.js,.ts,.py,.html,.css,.xml,.log,.pdf")]]);
      if(cur&&cur.btn===a)close();else open(a,plus,"up");
    },true);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);
  else bind();
  setTimeout(bind,500);
  setTimeout(bind,1500);
})();
