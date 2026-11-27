(function(){
var $=function(s,r){return (r||document).querySelector(s)};
var P=function(d){return '<svg viewBox="0 0 24 24">'+d+'</svg>'};
var IC={vid:'<rect x="3.5" y="6" width="12" height="12" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3z"/>',chats:'<path d="M20 12a8 8 0 01-11.8 7L4 20l1.2-3.8A8 8 0 1120 12z"/>',proj:'<rect x="4" y="9" width="16" height="11" rx="3"/><path d="M7 5.5h10M9 2.5h6"/>',code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14"/>',art:'<rect x="8" y="3.5" width="12" height="13" rx="3"/><path d="M5.5 7.5A2.5 2.5 0 003.5 10v7.5a3 3 0 003 3H14"/>',panel:'<rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M8.5 9v6"/>',cam:'<path d="M4 8.5A2.5 2.5 0 016.5 6h1.2l1.3-2h6l1.3 2h1.2A2.5 2.5 0 0120 8.5v9a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5z"/><circle cx="12" cy="13" r="3.4"/>',img:'<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.5"/><path d="M4 17l5-4 4 3.5 3-2.5 4 3.5"/>',file:'<path d="M14 3.5H8A2.5 2.5 0 005.5 6v12A2.5 2.5 0 008 20.5h8a2.5 2.5 0 002.5-2.5V8z"/><path d="M14 3.5V8h4.5M12 17v-5M9.5 14.5L12 12l2.5 2.5"/>',recent:'<rect x="3.5" y="7.5" width="13" height="13" rx="3"/><path d="M7.5 4.5h10a3 3 0 013 3v10"/>',conn:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/><path d="M17 3.5v7M13.5 7h7"/>',chev:'<path d="M9 6l6 6-6 6"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',edit:'<path d="M12 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-4"/><path d="M18.5 3.5l2 2L12 14l-3 1 1-3z"/>',doc:'<path d="M14 3.5H8A2.5 2.5 0 005.5 6v12A2.5 2.5 0 008 20.5h8a2.5 2.5 0 002.5-2.5V8z"/><path d="M14 3.5V8h4.5"/>',dots:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8l1.4 2.4 2.7-.6.9 2.6 2.6.9-.6 2.7 2.4 1.4-2.4 1.4.6 2.7-2.6.9-.9 2.6-2.7-.6L12 21.2l-1.4-2.4-2.7.6-.9-2.6-2.6-.9.6-2.7L2.6 12l2.4-1.4-.6-2.7 2.6-.9.9-2.6 2.7.6z"/>',plus:'<path d="M12 5v14M5 12h14"/>'};
function click(sel){var e=$(sel);if(e)e.click()}
function mob(){return false}
var body=document.body;
function sideOpen(){return mob()?$("#sideChat").classList.contains("open"):!body.classList.contains("collapsed")}
function setSide(o){
 if(mob()){click(o?'[data-act="openDrawer"]':'[data-act="closeDrawer"]');var s=$("#sideChat");if(s){s.classList.toggle("open",o);var c=$("#scrim");c&&c.classList.toggle("on",o)}}
 else{body.classList.toggle("xhide",!o);body.classList.toggle("collapsed",!o)}}
function toast(t){var e=$("#toast");if(!e)return;e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(function(){e.hidden=true},2200)}
function init(){
 var side=$("#sideChat");if(!side||side.dataset.x)return;side.dataset.x=1;
 // ---- sidebar
 var wm=document.createElement("div");wm.className="xwm serif";wm.textContent="XMM AI";
 var nav=document.createElement("div");nav.className="xnav";
 [["chats","Chats",function(){click('#chatNav [data-k="newchat"]')}],
  ["code","Code",function(){click("#sideCode")}]].forEach(function(n){
  var b=document.createElement("button");b.type="button";b.innerHTML=P(IC[n[0]])+'<span>'+n[1]+'</span>';
  b.onclick=function(e){e.stopPropagation();n[2]();if(mob())setSide(false)};nav.appendChild(b)});
 side.insertBefore(nav,side.firstChild);side.insertBefore(wm,side.firstChild);
 var cl=side.querySelector(".side-label");if(cl)cl.textContent="Recents";
 // all-chats link removed — more room for recents
 // fab new chat + avatar
 var u=$(".user");if(u){u.style.cursor="pointer";u.onclick=function(){click('[data-act="settings"]');if(mob())setSide(false)};var av=$(".av",u);if(av){av.innerHTML=P(IC.gear);av.classList.add("gear")}var nm=$(".uname",u);if(nm)nm.style.display="none"}
 var fab=document.createElement("button");fab.type="button";fab.className="xfab";fab.setAttribute("aria-label","New chat");fab.innerHTML=P(IC.edit);
 fab.onclick=function(){click('#chatNav [data-k="newchat"]');if(mob())setSide(false)};side.appendChild(fab);
 // mobile close (X) on sidebar
 var xc=side.querySelector(".xclose");if(!xc){xc=document.createElement("button");xc.type="button";xc.className="xclose";xc.setAttribute("aria-label","Close sidebar");xc.innerHTML=P(IC.x);side.appendChild(xc)}xc.onclick=function(e){e.stopPropagation();setSide(false)};
 // force drawer closed on tablet/iPad so it never covers New chat
 try{
  if(0){
   side.classList.remove("open");
   var sc=$("#scrim");if(sc)sc.classList.remove("on");
   body.classList.add("xhide");
  }
 }catch(z){}


 // ---- topbar
 var tb=$(".topbar");
 if(tb){
  var t=document.createElement("button");t.type="button";t.className="xtog";t.setAttribute("aria-label","Sidebar");t.innerHTML=P(IC.panel);
  t.onclick=function(e){e.stopPropagation();setSide(!sideOpen())};tb.insertBefore(t,tb.firstChild);
  // single circular new-chat control — no wrapper, never square
  var nb=document.createElement("button");
  nb.type="button";
  nb.className="xnew";
  nb.setAttribute("aria-label","New chat");
  nb.innerHTML=P(IC.edit);
  nb.onclick=function(){click('#chatNav [data-k="newchat"]')};
  tb.appendChild(nb);
 }
 
 // ---- greeting + composer text
 var g=$(".greeting");if(g){var x=document.createElement("div");x.className="xg";
  x.innerHTML='<h2>What do you need?</h2>';g.appendChild(x)}
 var m=$("#msg");if(m)m.placeholder="Message…";
 var comp=document.querySelector(".composer");
 function syncExpand(){
  if(!comp||!m)return;
  // only grow when text is actually multi-line / too long — not on focus
  if(!m.value){comp.classList.remove("expanded");if(m.style.height)m.style.height="";return}
  var o=m.style.height;m.style.height="auto";
  var h=m.scrollHeight;
  var on=h>52;
  if(comp.classList.contains("expanded")!==!!on)comp.classList.toggle("expanded",!!on);
  var n=Math.min(h,160)+"px";m.style.height=n===o?o:n;
 }
 if(m){
  m.addEventListener("input",syncExpand);
  m.addEventListener("blur",function(){setTimeout(syncExpand,50)});
  window.XMM_SYNC_EXPAND=syncExpand;
  syncExpand();
 }

 // ---- add to chat sheet
 var f=$("#file"),w=document.createElement("div");w.className="xsw";
 w.innerHTML='<div class="xs"><div class="grab"></div><div class="h"><button data-c aria-label="Close">'+P(IC.x)+'</button>Add to Chat</div><div class="tri"><button data-a="cam">'+P(IC.cam)+'Camera</button><button data-a="img">'+P(IC.img)+'Photos</button><button data-a="vid">'+P(IC.vid)+'Video</button><button data-a="file">'+P(IC.file)+'Files</button></div><button class="row blue" data-a="img">'+P(IC.recent)+'Show recent photos</button></div>';
 body.appendChild(w);
 function open(o){w.classList.toggle("on",o);body.classList.toggle("xsheet",o)}
 var ACC=f?f.getAttribute("accept"):"";
 w.onclick=function(e){
  if(e.target===w||e.target.closest("[data-c]")){open(false);return}
  var b=e.target.closest("[data-a]");if(!b)return;var a=b.dataset.a;
  if(!f)return;f.removeAttribute("capture");f.setAttribute("accept",a==="file"?ACC:a==="vid"?"video/*":"image/*,video/*");
  if(a==="cam")f.setAttribute("capture","environment");open(false);f.click()};
 addEventListener("keydown",function(e){if(e.key==="Escape"){open(false);if(mob())setSide(false)}});
 // close drawer on chat pick (mobile)
 var cl2=$("#chatList");cl2.addEventListener("click",function(e){if(mob()&&e.target.closest(".chat-i")&&!e.target.closest("[data-dots]"))setTimeout(function(){setSide(false)},0)});
 // scrim closes drawer
 var sc=$("#scrim");if(sc)sc.addEventListener("click",function(){setSide(false)});
 // empty-state class sync
 var mc=$("#mainChat");
 function sync(){var v=$("#viewChat");body.classList.toggle("xempty",!!(v&&!v.hidden&&v.classList.contains("empty")))}
 new MutationObserver(sync).observe(document.body,{subtree:true,attributes:true,attributeFilter:["class","hidden"]});sync();
}
if(document.readyState!=="loading")init();else document.addEventListener("DOMContentLoaded",init);
setTimeout(init,300);
})();
