/* extra.js: "See more" for long answers + map-in-app */
(function(){
var open=new Set(),T=0;
function clamp(){T=0;document.querySelectorAll(".m-bot").forEach(function(m){var b=m.querySelector(".body");if(!b||b.querySelector(".genbox"))return;var id=m.getAttribute("data-i");var btn=m.querySelector(":scope>.xm-btn");
 if(open.has(id)){b.classList.remove("xm-clamp");if(btn){btn.textContent="See less"}return}
 if(!btn&&b.scrollHeight>b.clientHeight+0&&b.scrollHeight>440){b.classList.add("xm-clamp");btn=document.createElement("button");btn.type="button";btn.className="xm-btn";btn.textContent="See more";m.insertBefore(btn,b.nextSibling)}
 else if(!btn&&b.classList.contains("xm-clamp")&&b.scrollHeight<=440){b.classList.remove("xm-clamp")}})}
document.addEventListener("click",function(e){var x=e.target.closest&&e.target.closest(".xm-btn");if(!x)return;e.preventDefault();var m=x.parentNode,id=m.getAttribute("data-i"),b=m.querySelector(".body");if(open.has(id)){open.delete(id);b.classList.add("xm-clamp");x.textContent="See more"}else{open.add(id);b.classList.remove("xm-clamp");x.textContent="See less"}},true);
new MutationObserver(function(){if(!T)T=setTimeout(clamp,350)}).observe(document.body,{childList:true,subtree:true,characterData:true});
/* galaxy unlock: asking for directions to "galaxy" -> tapping the card unlocks the space background */
window.addEventListener("click",function(ev){var b=ev.target.closest&&ev.target.closest("[data-xe=nav]");if(!b||true)return;ev.preventDefault();ev.stopImmediatePropagation();ev.stopPropagation();
 var had=document.documentElement.classList.contains("xm-galaxy");try{localStorage.setItem("xmm.galaxy","1")}catch(_){}document.documentElement.classList.add("xm-galaxy");
 if(document.getElementById("xgp"))return;var d=document.createElement("div");d.id="xgp";d.innerHTML='<div class="xgc"><div class="xgi">'+XMI("galaxy")+'</div><b>You got Galaxy Mode!</b><small>'+(had?"Space background is already on.":"Space background unlocked.")+'</small><button type="button">Awesome</button></div>';d.onclick=function(e){if(e.target===d||e.target.tagName==="BUTTON")d.remove()};document.body.appendChild(d)},true);
/* splash — only dismiss when content is ready; show patience text if slow */
function hideXl(){var x=document.getElementById("xl");if(!x||x.classList.contains("out"))return;x.classList.add("out");setTimeout(function(){try{x.remove()}catch(e){}},450)}
function xlReady(){
  var x=document.getElementById("xl");if(!x)return;
  var shell=document.getElementById("shell-chat")||document.querySelector(".shell");
  var ok=document.readyState==="complete" && shell && (shell.querySelector("#msg")||shell.querySelector(".composer")||shell.querySelector("#chatNav"));
  if(ok){var w=Math.max(0,900-(Date.now()-(window.__xlT||0)));setTimeout(hideXl,w);return true}
  return false
}
(function(){
  var s=document.getElementById("xls");
  var warned=0;
  function tick(){
    if(xlReady())return;
    var elapsed=Date.now()-(window.__xlT||0);
    if(elapsed>3200&&s&&!warned){warned=1;s.textContent="This is taking longer than expected…";s.style.color="#c4c4cc"}
    if(elapsed>12000){hideXl();return}
    setTimeout(tick,200)
  }
  if(document.readyState==="complete")tick();
  else addEventListener("load",function(){setTimeout(tick,50)});
  setTimeout(tick,400);
  setTimeout(function(){if(document.getElementById("xl"))hideXl()},14000);
})();
/* map opens inside the main app (URL stays /chat/). Old /map/<place> links are converted. */
var pending=null,loading=false,seen=false;
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xe=nav]");if(b)pending=b.getAttribute("data-q")},true);
setInterval(function(){var nv=document.getElementById("nv");
 if(nv&&!seen){seen=true;try{history.pushState({map:1},"",location.href)}catch(e){}}
 else if(!nv&&seen){seen=false;pending=null}},250);
addEventListener("popstate",function(){if(document.getElementById("nv")&&window.XMM_NAV)window.XMM_NAV.close()});
function boot(){var m=location.pathname.match(/^\/map\/(.+)$/);if(!m)return;var q;try{q=decodeURIComponent(m[1]).replace(/-+/g," ").trim()}catch(e){q=m[1]}
 try{history.replaceState(null,"",(/^app\./.test(location.hostname)?"/":"/chat/")+"")}catch(e){}if(!q)return;loading=true;
 var n=0,t=setInterval(function(){if(window.XMM_NAV&&window.XMM_NAV.open){clearInterval(t);pending=q;window.XMM_NAV.open(q,null);setTimeout(function(){loading=false},1500)}else if(++n>80){clearInterval(t);loading=false}},100)}
if(document.readyState==="complete")boot();else addEventListener("load",boot);
})();
