(function(){"use strict";
var T=null,pop=null,sx=0,sy=0;
function kill(){if(pop){pop.remove();pop=null}}
function toast(t){try{window.XMM_API.toast(t)}catch(e){}}
function copy(t){try{navigator.clipboard.writeText(t).then(function(){toast("Copied")},fb)}catch(e){fb()}function fb(){var a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast("Copied")}catch(e){}a.remove()}}
function show(el,isUser){kill();var txt=(el.innerText||"").trim();if(!txt)return;
 var r=el.getBoundingClientRect();pop=document.createElement("div");pop.className="hold-pop";
 var c=document.createElement("button");c.type="button";c.textContent="Copy";c.onclick=function(){copy(txt);kill()};pop.appendChild(c);
 if(isUser){var e=document.createElement("button");e.type="button";e.textContent="Edit";e.onclick=function(){var m=document.getElementById("msg");if(m){m.value=txt;m.dispatchEvent(new Event("input",{bubbles:true}));m.focus()}kill()};pop.appendChild(e)}
 document.body.appendChild(pop);var w=pop.offsetWidth,h=pop.offsetHeight;
 var x=Math.min(Math.max(8,r.left+r.width/2-w/2),innerWidth-w-8),y=r.top-h-8;if(y<8)y=Math.min(r.bottom+8,innerHeight-h-8);
 pop.style.left=x+"px";pop.style.top=y+"px"}
function target(t){var u=t.closest&&t.closest(".m-user");if(u)return[u,1];var b=t.closest&&t.closest(".m-bot .body");if(b&&!t.closest("pre,a,button"))return[b,0];return null}
document.addEventListener("touchstart",function(e){var f=target(e.target);if(!f)return;var t0=e.touches[0];sx=t0.clientX;sy=t0.clientY;clearTimeout(T);T=setTimeout(function(){try{getSelection().removeAllRanges()}catch(x){}show(f[0],f[1]);if(navigator.vibrate)try{navigator.vibrate(10)}catch(x){}},500)},{passive:true});
document.addEventListener("touchmove",function(e){var t0=e.touches[0];if(Math.abs(t0.clientX-sx)>8||Math.abs(t0.clientY-sy)>8)clearTimeout(T)},{passive:true});
["touchend","touchcancel"].forEach(function(n){document.addEventListener(n,function(){clearTimeout(T)},{passive:true})});
document.addEventListener("contextmenu",function(e){var f=target(e.target);if(f){e.preventDefault();show(f[0],f[1])}});
document.addEventListener("pointerdown",function(e){if(pop&&!pop.contains(e.target))kill()},true);
document.addEventListener("selectstart",function(e){var n=e.target.nodeType===1?e.target:e.target.parentElement;if(n&&target(n))e.preventDefault()},true);
document.addEventListener("touchstart",function(e){if(target(e.target)&&pop===null){}},{passive:true});
document.addEventListener("scroll",kill,true);
})();
(function(){var m=document.getElementById("msg"),pv=null,last="";if(!m)return;
function mk(){pv=document.createElement("div");pv.className="g-pv";document.body.appendChild(pv)}
function pos(){var r=m.getBoundingClientRect(),c=getComputedStyle(m);pv.style.left=(r.left+parseFloat(c.paddingLeft||0))+"px";pv.style.top=(r.top+parseFloat(c.paddingTop||0))+"px";pv.style.width=(r.width-parseFloat(c.paddingLeft||0)-parseFloat(c.paddingRight||0))+"px";pv.style.font=c.font;pv.style.lineHeight=c.lineHeight}
function tick(){if(!pv)mk();var r=m.getBoundingClientRect(),vis=!m.value&&r.width>0&&getComputedStyle(m).visibility!=="hidden";var t=m.placeholder||"";
 if(!vis){pv.classList.remove("in");pv.style.opacity="0";last="";return}
 pv.style.opacity="";pos();
 if(t!==last){var first=!last;last=t;
  if(first){pv.textContent=t;pv.className="g-pv pre";void pv.offsetWidth;pv.className="g-pv in"}
  else{pv.className="g-pv out";setTimeout(function(){pv.textContent=t;pv.className="g-pv pre";void pv.offsetWidth;pv.className="g-pv in"},430)}}}
setInterval(tick,150);addEventListener("resize",tick);m.addEventListener("input",tick)})();
