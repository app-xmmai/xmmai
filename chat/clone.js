/* XMM AI clone.js v89 — new UI layer: drawer, top bar, greeting, composer, sheets, settings, voice screen. Loaded last. */
(function(){
"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var B=document.body,H=document.documentElement;
var API=function(){return window.XMM_API||{}};
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function uname(){return String(ld("xmm.name","")||"").trim()}
function toast(m){try{API().toast(m)}catch(e){}}

/* ---------- icons ---------- */
function I(p,w){return'<svg viewBox="0 0 24 24" width="'+(w||22)+'" height="'+(w||22)+'" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
var IC={
 video:I('<rect x="3.5" y="6" width="12" height="12" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3z"/>'),
 menu:I('<path d="M4 7h16M4 12h16M4 17h10"/>'),
 compose:I('<path d="M12 5H7.5A3.5 3.5 0 0 0 4 8.5v8A3.5 3.5 0 0 0 7.5 20h8a3.5 3.5 0 0 0 3.5-3.5V12"/><path d="M17.6 3.6a2 2 0 0 1 2.8 2.8L12 14.8l-3.6.8.8-3.6z"/>'),
 dots:'<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/></svg>',
 chats:I('<path d="M11 4a7.5 7.5 0 1 0 4.6 13.4L20 18.5l-1.2-4.2A7.5 7.5 0 0 0 11 4z" transform="translate(0 .5) scale(.9)"/><circle cx="17" cy="17" r="3.2"/><path d="m19.4 19.4 2 2"/>'),
 projects:I('<path d="M6 4.5h12M4.5 8.5h15"/><path d="M5 12h14l-.7 6.5a2 2 0 0 1-2 1.8H7.7a2 2 0 0 1-2-1.8z"/>'),
 code:I('<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'),
 art:I('<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>'),
 bub:I('<path d="M12 3.8a8.2 8.2 0 1 1-3.6 15.5L4 20.2l1-3.9A8.2 8.2 0 0 1 12 3.8z"/>'),
 chev:I('<path d="m9 6 6 6-6 6"/>',17),
 back:I('<path d="m15 6-6 6 6 6"/>',20),
 plus:I('<path d="M12 5v14M5 12h14"/>'),
 mic:I('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
 micoff:I('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M4 4l16 16"/>'),
 wave:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3.5 10.5v3M7.5 7v10M12 3.5v17M16.5 7v10M20.5 10.5v3"/></svg>',
 up:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>',
 x:I('<path d="M6 6l12 12M18 6 6 18"/>',22),
 gear:I('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
 copy:I('<rect x="9" y="9" width="11" height="11" rx="2.6"/><path d="M5.5 15.5A2.5 2.5 0 0 1 4 13.2V6.5A2.5 2.5 0 0 1 6.5 4h6.7a2.5 2.5 0 0 1 2.3 1.5"/>',21),
 share:I('<path d="M12 15V3.5M8 7.2l4-3.7 4 3.7"/><path d="M5 11.5v6A3.5 3.5 0 0 0 8.5 21h7a3.5 3.5 0 0 0 3.5-3.5v-6"/>',21),
 play:I('<path d="M7.5 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8a.8.8 0 0 0-1.2.7z"/>',21),
 stop:I('<rect x="6" y="6" width="12" height="12" rx="2.5"/>',21),
 up_:I('<path d="M7 10v11"/><path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8a2 2 0 0 1-1.9 1.4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9z"/>',21),
 dn_:I('<path d="M17 14V3"/><path d="M9 18.1 10 14H4.2a2 2 0 0 1-1.9-2.6l2.3-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.8a2 2 0 0 0-1.8 1.1L12 22a3.1 3.1 0 0 1-3-3.9z"/>',21),
 regen:I('<path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2L3.5 8.5"/><path d="M3.5 3.5v5h5"/>',21),
 camera:I('<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.3-2h5.4L16 6h1.5A2.5 2.5 0 0 1 20 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.6"/>',25),
 photos:I('<rect x="3.5" y="4" width="17" height="16" rx="3.2"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/>',25),
 files:I('<path d="M14 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7z"/><path d="M14 3v4h4M12 17v-6M9.5 13.3 12 11l2.5 2.3"/>',25),
 brain:I('<path d="M9.5 4A3 3 0 0 0 6.6 6.2 3.2 3.2 0 0 0 4.5 9.4a3.2 3.2 0 0 0 1.3 2.6 3.2 3.2 0 0 0 .8 4.3A3 3 0 0 0 12 17.5V6.5A2.6 2.6 0 0 0 9.5 4zM14.5 4a3 3 0 0 1 2.9 2.2 3.2 3.2 0 0 1 2.1 3.2 3.2 3.2 0 0 1-1.3 2.6 3.2 3.2 0 0 1-.8 4.3A3 3 0 0 1 12 17.5"/>'),
 person:I('<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>'),
 bell:I('<path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.6 8.5-2.6 8.5h17.2S18 15 18 8.5M10.3 20.5a2 2 0 0 0 3.4 0"/>'),
 shield:I('<path d="M12 3 4.5 6v6c0 4.6 3.2 7.7 7.5 9 4.3-1.3 7.5-4.4 7.5-9V6z"/><rect x="9.3" y="10.5" width="5.4" height="4.3" rx="1"/><path d="M10.4 10.5V9.2a1.6 1.6 0 0 1 3.2 0v1.3"/>'),
 sliders:I('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
 voice:I('<path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>'),
 globe:I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'),
 haptic:I('<rect x="8" y="3" width="8" height="18" rx="2.2"/><path d="M4.5 8v8M19.5 8v8"/>'),
 logout:I('<path d="M9 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H9M16 8l4 4-4 4M20 12H9"/>'),
 dl:I('<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>'),
 spk:I('<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="M15.5 8.7a4.7 4.7 0 0 1 0 6.6M18.4 6a8.6 8.6 0 0 1 0 12"/>',23),
 spkoff:I('<path d="M11 5 6.5 9H3.5v6h3L11 19z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',23),
 updn:I('<path d="m8 9.5 4-4 4 4M8 14.5l4 4 4-4"/>',16),
 check:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
 info:'<span style="font:600 19px Georgia,serif;font-style:italic">i</span>',
 term:I('<path d="M14 3H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7z"/><path d="M14 3v4h4M9 12h6M9 16h4"/>'),
 trash:I('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>'),
 help:I('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.01"/>')
};

/* ---------- sheets ---------- */
function sheet(id,opts){
 var old=document.getElementById(id);if(old)old.remove();var oldbg=document.getElementById(id+"Bg");if(oldbg)oldbg.remove();
 var bg=el("div","cl-sbg");bg.id=id+"Bg";
 var sh=el("div","cl-sheet");sh.id=id;
 if(opts.grab)sh.appendChild(el("div","cl-grab","<i></i>"));
 var hd=el("div","cl-sh");
 var left=el("button","cl-b");left.type="button";left.innerHTML=IC.x;left.setAttribute("aria-label","Close");
 var ttl=el("h3");ttl.textContent=opts.title||"";
 var right=el("span");
 hd.appendChild(left);hd.appendChild(ttl);hd.appendChild(right);
 var body=el("div","cl-sb");
 sh.appendChild(hd);sh.appendChild(body);
 document.body.appendChild(bg);document.body.appendChild(sh);
 if(opts.height)sh.style.height=opts.height;
 var api={el:sh,bg:bg,body:body,left:left,right:right,title:ttl,closed:false,onclose:opts.onclose};
 api.close=function(){if(api.closed)return;api.closed=true;bg.classList.remove("on");sh.classList.remove("on");sh.style.transform="";
  setTimeout(function(){bg.remove();sh.remove()},520);if(api.onclose)try{api.onclose()}catch(e){}};
 left.onclick=function(){if(api.back)api.back();else api.close()};
 bg.onclick=api.close;
 /* drag down to dismiss */
 var sy=0,dy=0,dr=false;
 function dstart(e){if(e.target.closest&&e.target.closest("button"))return;dr=true;sy=e.clientY;dy=0;sh.classList.add("drag");try{e.currentTarget.setPointerCapture(e.pointerId)}catch(_){}}
 function dmove(e){if(!dr)return;dy=Math.max(0,e.clientY-sy);sh.style.transform="translate3d(0,"+dy+"px,0)"}
 function dend(){if(!dr)return;dr=false;sh.classList.remove("drag");if(dy>110)api.close();else sh.style.transform=""}
 [hd,sh.querySelector(".cl-grab")].forEach(function(n){if(!n)return;n.addEventListener("pointerdown",dstart);n.addEventListener("pointermove",dmove);n.addEventListener("pointerup",dend);n.addEventListener("pointercancel",dend)});
 void sh.offsetWidth;requestAnimationFrame(function(){bg.classList.add("on");sh.classList.add("on")});
 return api;
}
function closeSheets(){var dk=document.getElementById("clDesk");if(dk){dk.remove();setS=null}["clAdd","clModel","clSet"].forEach(function(i){var s=document.getElementById(i);if(s){var b=document.getElementById(i+"Bg");s.classList.remove("on");if(b)b.classList.remove("on");setTimeout(function(){s.remove();if(b)b.remove()},520)}})}

/* ---------- theme / haptics / links ---------- */
function themePref(){return ld("xmm.cl.theme","dark")}
function applyTheme(){
 var p=themePref(),dark=true;
 if(p==="light")dark=false;else if(p==="system"){try{dark=matchMedia("(prefers-color-scheme:dark)").matches}catch(e){}}
 H.dataset.clTheme=dark?"dark":"light";
 var m=$('meta[name="theme-color"]');if(m)m.content=dark?"#141414":"#faf9f5";
}
try{matchMedia("(prefers-color-scheme:dark)").addEventListener("change",applyTheme)}catch(e){}
applyTheme();
function hapOn(){return ld("xmm.cl.hap",true)!==false}
document.addEventListener("pointerdown",function(e){if(hapOn()&&e.target.closest&&e.target.closest("button")&&navigator.vibrate)try{navigator.vibrate(6)}catch(_){}},true);
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest(".m-bot .body a[href]");if(!a)return;
 if(ld("xmm.cl.links","tab")==="same"&&/^https?:/i.test(a.href)){e.preventDefault();location.href=a.href}},true);

/* mute switch for speech (voice screen speaker button) */
try{var SS=window.speechSynthesis;if(SS&&!SS.__cl){var _sp=SS.speak.bind(SS);SS.speak=function(u){if(window.__clSpkOff){setTimeout(function(){try{u.onend&&u.onend({})}catch(e){}},0);return}return _sp(u)};SS.__cl=1}}catch(e){}

/* ---------- greeting ---------- */
function greetWord(){var h=new Date().getHours();return h>=5&&h<12?"Good morning":h>=12&&h<18?"Good afternoon":"Good evening"}
function buildGreeting(){
 var cv=$("#convo");if(!cv||$(".cl-greet",cv))return;
 var g=el("div","cl-greet");g.innerHTML='<img class="cl-logo" src="icon.svg?v=gpu6" alt=""><div class="cl-gt"></div>';
 cv.insertBefore(g,cv.firstChild);
}
function updGreeting(){var t=$(".cl-gt");if(!t)return;var n=uname(),s=greetWord()+(n?", "+n:"");if(t.textContent!==s)t.textContent=s}

/* ---------- top bar ---------- */
function buildTop(){
 var m=$("#mainChat");if(!m||$("#clTop"))return;
 var t=el("div");t.id="clTop";
 t.innerHTML='<button class="cl-b" id="clMenu" type="button" aria-label="Sidebar"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15"/></svg></button><span class="cl-sp"></span><div class="cl-pill" id="clPill"><button id="clNew" type="button" aria-label="New chat">'+IC.compose+'</button><button id="clMore" type="button" aria-label="More">'+IC.dots+'</button></div>';
 m.insertBefore(t,m.firstChild);
 $("#clMenu").onclick=function(){B.classList.contains("cl-drawer")?closeDrawer(1):openDrawer()};
 $("#clNew").onclick=function(){try{API().newChat()}catch(e){}closeDrawer()};
 $("#clMore").onclick=function(e){e.stopPropagation();moreMenu(this)};
}
function moreMenu(btn){
 var items=[],c=null;try{c=API().cur&&API().cur()}catch(e){}
 if(c&&c.msgs&&c.msgs.length){
  try{if(window.XMM_TWIN&&XMM_TWIN.chatItems)items=items.concat(XMM_TWIN.chatItems(c.id)||[])}catch(e){}
  items.push({label:"Delete chat",danger:1,fn:function(){try{API().delChat(c.id)}catch(e){}}});
 }
 items.push({label:"Settings",fn:function(){openSettings()}});
 try{API().showMenu(btn,items,"right")}catch(e){openSettings()}
}

/* ---------- drawer ---------- */
function openDrawer(){var m=$("#msg");if(m)m.blur();B.classList.add("cl-drawer");rebuildRecents()}
function closeDrawer(f){if(!f&&innerWidth>=700)return;B.classList.remove("cl-drawer")}
function buildDrawer(){
 var sh=$("#shell-chat");if(!sh||$("#clDrawer"))return;
 var d=el("div");d.id="clDrawer";
 d.innerHTML='<div class="cl-dh"><span class="cl-logo"></span></div>'+
  '<button class="cl-ws" id="clWs" type="button"><span class="cl-wa">X</span><span class="cl-wn">xmm\'s workspace</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 10 5 5 5-5"/></svg></button>'+
  '<div class="cl-ds" id="clDs">'+
  '<button class="cl-nr on" data-n="chats" style="--i:0">'+IC.compose+'<span>New</span></button>'+
  '<button class="cl-nr" data-n="search" style="--i:1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><span>Search</span></button>'+
  '<button class="cl-nr" data-n="projects" style="--i:2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg><span>Projects</span></button>'+
  '<div class="cl-rl" style="--i:3">Recents</div><div id="clRecents"></div>'+
  '<button class="cl-all" id="clAll"><span>All chats</span>'+IC.chev+'</button></div>'+
  '<div class="cl-db"><button class="cl-av" id="clAv" type="button" aria-label="Settings">X</button><button class="cl-nc" id="clNc" type="button">'+IC.plus+'New chat</button></div>';
 sh.insertBefore(d,sh.firstChild);
 d.addEventListener("click",function(e){
  if(e.target.closest("#clWs")){closeDrawer();openSettings();return}
  var n=e.target.closest(".cl-nr");
  if(n){var k=n.dataset.n;
   if(k==="chats"){try{API().newChat()}catch(_){}closeDrawer();return}
   closeDrawer();
   if(k==="projects"){var b=$('.sidenav2 [data-k="notebooks"]');if(b)b.click()}
   else if(k==="search"){var sb=$('.sidenav2 [data-k="search"]')||$("#sideSearch");if(sb)sb.click()}
   else if(k==="code"){var c=$("#sideCode");if(c)c.click()}
   else if(k==="artifacts"){var s=$('#seg [data-m="code"]');if(s)s.click()}
   return}
  if(e.target.closest("#clAll")){B.classList.toggle("cl-allc");var al=$("#clAll span");if(al)al.textContent=B.classList.contains("cl-allc")?"Show less":"All chats";return}
  if(e.target.closest("#clAv")){closeDrawer();openSettings();return}
  if(e.target.closest("#clNc")){try{API().newChat()}catch(_){}closeDrawer();return}
  var dt=e.target.closest(".cl-dots");
  if(dt){e.stopPropagation();var ro=dt.closest(".cl-ci"),rid=ro.dataset.id,its=[];try{if(window.XMM_TWIN&&XMM_TWIN.chatItems)its=XMM_TWIN.chatItems(rid)||[]}catch(_){}
   its.push({label:"Delete chat",danger:1,fn:function(){try{API().delChat(rid)}catch(_){}}});
   try{API().showMenu(dt,its,"right")}catch(_){}return}
  var ci=e.target.closest(".cl-ci");
  if(ci){if(ci.__lp){ci.__lp=0;return}var id=ci.dataset.id;closeDrawer();var src=$('#chatList .chat-i[data-id="'+id+'"]');if(src)src.click()}
 });
 /* long press = chat menu */
 var lt=0;
 d.addEventListener("pointerdown",function(e){var ci=e.target.closest(".cl-ci");if(!ci)return;clearTimeout(lt);lt=setTimeout(function(){ci.__lp=1;
  var id=ci.dataset.id,items=[];try{if(window.XMM_TWIN&&XMM_TWIN.chatItems)items=XMM_TWIN.chatItems(id)||[]}catch(_){}
  items.push({label:"Delete chat",danger:1,fn:function(){try{API().delChat(id)}catch(_){}}});
  try{API().showMenu(ci,items,"right")}catch(_){}},520)});
 ["pointerup","pointermove","pointercancel","pointerleave"].forEach(function(ev){d.addEventListener(ev,function(){clearTimeout(lt)})});
 /* tapping the pushed main view closes */
 $("#mainChat").addEventListener("click",function(e){if(innerWidth>=700)return;if(B.classList.contains("cl-drawer")){e.preventDefault();e.stopPropagation();closeDrawer()}},true);
 /* swipe gestures */
 var sx=0,sy=0,tr=false;
 document.addEventListener("touchstart",function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;tr=true},{passive:true});
 document.addEventListener("touchend",function(e){if(!tr)return;tr=false;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dy)>Math.abs(dx)*.8)return;
  if(!B.classList.contains("cl-drawer")&&sx<22&&dx>70&&!$("#clVoice.on"))openDrawer();
  else if(B.classList.contains("cl-drawer")&&dx<-70)closeDrawer()},{passive:true});
 var sc=$("#sideChat");if(sc)new MutationObserver(function(){if(!sc.classList.contains("open")&&B.classList.contains("cl-drawer")&&sc.__was){closeDrawer()}sc.__was=sc.classList.contains("open")}).observe(sc,{attributes:true,attributeFilter:["class"]});
}
function rebuildRecents(){
 var box=$("#clRecents");if(!box)return;
 var src=$$("#chatList .chat-i[data-id]"),h="",i=0;
 src.forEach(function(c){var sp=c.querySelector("span");var t=(sp?sp.textContent:c.textContent||"").trim()||"Untitled";
  h+='<button class="cl-ci'+(c.classList.contains("on")?" on":"")+(i>=10?" cl-x":"")+'" data-id="'+esc(c.dataset.id)+'" style="--i:'+Math.min(i+5,16)+'">'+IC.bub+'<span dir="auto">'+esc(t)+'</span><span class="cl-dots" role="button" aria-label="Chat options">'+IC.dots+'</span></button>';i++});
 if(!src.length)h='<div class="cl-none">No conversations yet</div>';
 if(box.__h!==h){box.innerHTML=h;box.__h=h}
 B.classList.toggle("cl-more",src.length>10);
 var av=$("#clAv");if(av){var l=(uname()||"X").charAt(0).toUpperCase();if(av.textContent!==l)av.textContent=l}
}

/* ---------- composer ---------- */
var comp,msg,ph,hold,tip,keep=0,holding=0,dict=0;
function hasContent(){var a=$("#atts");var S=API().S||{};return !!(msg&&msg.value.trim())||!!(a&&a.children.length)||!!S.busy}
function setExp(v){if(!comp)return;v=!!v;if(comp.classList.contains("cl-exp")===v)return;
 var ch=Array.prototype.slice.call(comp.children),b0=comp.getBoundingClientRect(),h0=b0.height,r0=ch.map(function(c){return c.offsetParent?c.getBoundingClientRect():null});
 comp.classList.toggle("cl-exp",v);
 var h1=comp.getBoundingClientRect().height;
 if(!comp.animate)return;var ez="cubic-bezier(.22,.8,.24,1)",D=420;
 try{
  
  ch.forEach(function(c,k){if(!c.offsetParent||c.classList.contains("cl-hold")||c.classList.contains("cl-ph"))return;var r1=c.getBoundingClientRect(),o=r0[k];
   if(o){var dx=o.left-r1.left,dy=o.top-r1.top;if(Math.abs(dx)>1||Math.abs(dy)>1)c.animate([{transform:"translate("+dx+"px,"+dy+"px)"},{transform:"none"}],{duration:D,easing:ez})}
   else c.animate([{opacity:0,transform:"scale(.7)"},{opacity:1,transform:"none"}],{duration:D-80,delay:80,easing:ez,fill:"backwards"})});
 }catch(_){}}
function chatEmpty(){var v=$("#viewChat");return !v||v.classList.contains("empty")}
function sentFx(){if(!comp)return;comp.classList.add("cl-sent");if(ph)ph.classList.add("hide");setTimeout(function(){if(comp)comp.classList.remove("cl-sent")},1400)}
function ensureComposer(){
 comp=$(".composer");msg=$("#msg");if(!comp||!msg)return false;
 var att=$("#attBtn"),wave=$("#gWave"),mic=$("#gMic");
 if(att&&!att.__cl){att.__cl=1;att.removeAttribute("data-ic");att.innerHTML=IC.plus;att.setAttribute("aria-label","Add to chat")}
 if(wave&&!wave.__cl){var nw=wave.cloneNode(false);nw.id="gWave";nw.type="button";nw.__cl=1;nw.className="g-ib g-wave";nw.setAttribute("aria-label","Voice mode");nw.innerHTML=IC.wave;wave.parentNode.replaceChild(nw,wave);nw.onclick=function(){openVoice()}}
 if(mic&&!mic.__cl){mic.__cl=1;mic.innerHTML=IC.mic}
 var send=$("#sendBtn");if(send&&!send.__cl){send.__cl=1;send.addEventListener("pointerdown",sentFx,true);send.addEventListener("click",sentFx,true)}
 if(msg&&!msg.__clk){msg.__clk=1;msg.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey&&msg.value.trim())sentFx()});msg.addEventListener("input",function(){if(ph)ph.classList.toggle("hide",!!msg.value)})}
 if(!ph){ph=el("div","cl-ph");comp.appendChild(ph)}
 if(!hold){hold=el("div","cl-hold");comp.appendChild(hold);wireHold()}
 if(!comp.__cl){comp.__cl=1;
  msg.addEventListener("focus",function(){keep=Date.now();setExp(true)});
  msg.addEventListener("blur",function(){setTimeout(function(){if(document.activeElement===msg||Date.now()-keep<450)return;if(!hasContent())setExp(false)},220)});
  msg.addEventListener("input",function(){setExp(true)});
  comp.addEventListener("pointerdown",function(){keep=Date.now()});
  var dock=comp.parentNode;if(dock&&!$(".cl-tip",dock)){tip=el("div","cl-tip","Try voice mode to talk with XMM AI");dock.appendChild(tip);
   if(!ld("xmm.cl.tip",0)){setTimeout(function(){tip.classList.add("on");sv("xmm.cl.tip",1);setTimeout(function(){tip.classList.remove("on")},6500)},2200)}
   document.addEventListener("pointerdown",function(){if(tip)tip.classList.remove("on")},true)}}
 return true;
}
function wireHold(){
 var t0=0,tm=0,moved=false,sx=0,sy=0;
 hold.addEventListener("pointerdown",function(e){holding=0;moved=false;sx=e.clientX;sy=e.clientY;clearTimeout(tm);
  tm=setTimeout(function(){if(moved)return;holding=1;var mc=$("#gMic");if(mc&&!mc.classList.contains("on")){dict=1;comp.classList.add("cl-listen");mc.click();if(navigator.vibrate)try{navigator.vibrate(12)}catch(_){}}},420)});
 hold.addEventListener("pointermove",function(e){if(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10){moved=true;clearTimeout(tm)}});
 function up(){clearTimeout(tm);if(dict){dict=0;var mc=$("#gMic");if(mc&&mc.classList.contains("on"))mc.click();setTimeout(function(){comp.classList.remove("cl-listen");setExp(true)},500)}}
 hold.addEventListener("pointerup",up);hold.addEventListener("pointercancel",up);
 hold.addEventListener("click",function(e){if(holding){holding=0;e.preventDefault();return}setExp(true);try{msg.focus()}catch(_){}});
 hold.addEventListener("contextmenu",function(e){e.preventDefault()});
}
function tick(){
 ensureComposer();
 updGreeting();
 if(comp&&msg){
  var has=hasContent();comp.classList.toggle("cl-has",has);if(has)setExp(true);
  else if(comp.classList.contains("cl-exp")&&document.activeElement!==msg&&Date.now()-keep>700)setExp(false);
  var empty=chatEmpty(),exp=comp.classList.contains("cl-exp");
  var txt=comp.classList.contains("cl-listen")?"Listening…":"Ask XMM AI";
  if(ph){if(ph.textContent!==txt)ph.textContent=txt;ph.classList.toggle("hide",!!msg.value)}
 }
 var vw=$("#mainChat");if(vw){var pg=$("#viewSearch")&&!$("#viewSearch").hidden||$("#viewNotebooks")&&!$("#viewNotebooks").hidden;vw.dataset.vw=pg?"page":"chat"}
 rebuildRecentsLite();decorate();
}
var lastCount=-1;
function rebuildRecentsLite(){var n=$$("#chatList .chat-i").length,s=(API().S&&API().S.cur)||"";var key=n+"|"+s;var bx=$("#clRecents");if(key!==lastCount||(bx&&bx.__h===undefined)){lastCount=key;rebuildRecents()}}

/* ---------- visual viewport (keyboard) ---------- */
function vv(){var h=window.visualViewport?Math.round(visualViewport.height):innerHeight;var d=innerHeight-h;if(d>0&&d<=60)h=innerHeight;/* iOS app mode reports a viewport ~status-bar shorter -> useless strip at the bottom; real keyboards are far bigger than 60px */H.style.setProperty("--vvh",h+"px");if(window.visualViewport&&visualViewport.offsetTop>0)window.scrollTo(0,0)}
vv();if(window.visualViewport){visualViewport.addEventListener("resize",vv);visualViewport.addEventListener("scroll",vv)}addEventListener("resize",vv);addEventListener("orientationchange",function(){setTimeout(vv,200)});

/* ---------- messages decoration ---------- */
var speakingEl=null;
function readAloud(i,btn){
 var ss=window.speechSynthesis;if(!ss){toast("Read aloud not supported");return}
 if(speakingEl===btn){ss.cancel();return}
 var b=$('.m-bot[data-i="'+i+'"] .body');if(!b)return;
 var t=(b.innerText||"").replace(/\s+/g," ").trim();if(!t)return;
 ss.cancel();var u=new SpeechSynthesisUtterance(t);var l=(H.lang||"en").slice(0,2);u.lang={de:"de-DE",en:"en-US",fa:"fa-IR",ar:"ar-SA",es:"es-ES"}[l]||"en-US";
 var reset=function(){if(speakingEl){speakingEl.innerHTML=IC.play;speakingEl=null}};
 u.onend=u.onerror=reset;speakingEl=btn;btn.innerHTML=IC.stop;try{ss.speak(u)}catch(e){reset()}
}
function decorate(){
 $$("#msgs .m-acts").forEach(function(a){
  if(a.dataset.cl)return;a.dataset.cl="1";
  var map={copy:IC.copy,share:IC.share,like:IC.up_,dislike:IC.dn_,regen:IC.regen};
  $$("[data-ma]",a).forEach(function(b){var k=b.dataset.ma;if(map[k])b.innerHTML=map[k];
   if(k==="share"){var p=el("button","icon-btn cl-act");p.type="button";p.setAttribute("aria-label","Read aloud");p.innerHTML=IC.play;p.dataset.i=b.dataset.i;
    p.onclick=function(){readAloud(p.dataset.i,p)};b.parentNode.insertBefore(p,b.nextSibling)}});
 });
 notifCard();
}
/* response notifications card */
function notifState(){return ld("xmm.cl.notif","")}
function notifCard(){
 var m=$("#msgs");if(!m||notifState()||!("Notification" in window)||Notification.permission!=="default")return;
 if(m.querySelector(".cl-notif"))return;var b=m.querySelector(".m-bot");if(!b)return;
 var c=el("div","cl-notif",'<div class="nh"><div class="ni">'+IC.bell+'</div><div><b>Turn On Response Notifications</b><span>Feel free to step away, we will notify you as soon as XMM AI responds.</span></div></div><div class="nb"><button type="button" class="n">Not now</button><button type="button" class="y">Turn On</button></div>');
 c.querySelector(".n").onclick=function(){sv("xmm.cl.notif","no");c.remove()};
 c.querySelector(".y").onclick=function(){c.remove();askNotif()};
 m.insertBefore(c,b);
}
function askNotif(cb){
 try{Notification.requestPermission().then(function(p){sv("xmm.cl.notif",p==="granted"?"yes":"no");cb&&cb(p)})}catch(e){sv("xmm.cl.notif","no");cb&&cb("denied")}
}
var wasBusy=false;
setInterval(function(){var S=API().S;if(!S)return;var b=!!S.busy;
 if(wasBusy&&!b&&document.hidden&&ld("xmm.cl.notif","")==="yes"&&"Notification" in window&&Notification.permission==="granted"){
  try{var c=API().cur&&API().cur();var last=c&&c.msgs&&c.msgs[c.msgs.length-1];var t=last&&last.text?String(last.text).replace(/\s+/g," ").slice(0,110):"Your response is ready.";new Notification("XMM AI",{body:t,icon:"icon-192.png"})}catch(e){}}
 wasBusy=b},700);

/* ---------- add to chat sheet ---------- */
function pickFile(kind){
 var i=document.createElement("input");i.type="file";i.className="xmm-file";i.style.cssText="position:fixed;left:-999px;opacity:0";
 if(kind==="camera"){i.accept="image/*";i.setAttribute("capture","environment")}
 else if(kind==="photos"){i.accept="image/*,video/*";i.multiple=true}
 else if(kind==="video"){i.accept="video/*";i.multiple=true}
 else i.multiple=true;
 document.body.appendChild(i);i.addEventListener("change",function(){setTimeout(function(){i.remove()},2000)});
 i.click();
}
function skillsMem(){var s=window.XMM_SKILLS;return s?s.memory!==false:true}
function openAdd(){
 if(window.__ipPlus){window.__ipPlus(document.querySelector("#clVoice.on #cvPlus")||document.getElementById("attBtn"));return}
 var s=sheet("clAdd",{title:"Add to Chat",grab:true});
 s.body.innerHTML='<div class="cl-tiles"><button class="cl-tile" data-k="camera" type="button">'+IC.camera+'<span>Camera</span></button><button class="cl-tile" data-k="photos" type="button">'+IC.photos+'<span>Photos</span></button><button class="cl-tile" data-k="video" type="button">'+IC.video+'<span>Video</span></button><button class="cl-tile" data-k="files" type="button">'+IC.files+'<span>Files</span></button></div>'+
  '<div class="cl-grp"><div class="cl-row nl" id="clMemRow">'+IC.brain+'<div class="rt">Memory<small>Let XMM AI use what you told it about you</small></div><button class="cl-sw'+(skillsMem()?" on":"")+'" id="clMemSw" type="button" aria-label="Memory"></button></div></div>';
 s.body.addEventListener("click",function(e){
  var t=e.target.closest(".cl-tile");if(t){var k=t.dataset.k;pickFile(k);setTimeout(s.close,60);return}
  if(e.target.closest("#clMemRow")){var sw=$("#clMemSw",s.body),on=!sw.classList.contains("on");sw.classList.toggle("on",on);
   try{window.XMM_SKILLS=window.XMM_SKILLS||{};XMM_SKILLS.memory=on;var sk=ld("xmm.skills",{});sk.memory=on;sv("xmm.skills",sk)}catch(_){}}
 });
}

/* ---------- model sheet ---------- */
function scrapeModels(){
 var b=$("#modeBtn");if(!b||!b.onclick)return[];
 var fake={stopPropagation:function(){},preventDefault:function(){}};
 var old=document.getElementById("modeSheet");if(old)old.remove();
 try{b.onclick(fake)}catch(e){}
 var out=$$("#modeSheet .ms-i").map(function(i){var bb=i.querySelector("b"),sm=i.querySelector("small");return{k:i.dataset.k,name:bb?bb.textContent:i.dataset.k,desc:sm?sm.textContent:"",on:i.classList.contains("on"),lock:i.classList.contains("lock"),gal:!!i.closest(".ms-gal")}});
 var ms=document.getElementById("modeSheet");if(ms)ms.remove();
 return out;
}
function pickModel(k){
 var b=$("#modeBtn");if(!b||!b.onclick)return;
 var fake={stopPropagation:function(){},preventDefault:function(){}};
 var old=document.getElementById("modeSheet");if(old)old.remove();
 try{b.onclick(fake)}catch(e){}
 var it=$('#modeSheet [data-k="'+k+'"]');if(it)it.click();
 setTimeout(function(){var ms=document.getElementById("modeSheet");if(ms)ms.remove();syncModelLabel()},350);
}

/* ===== v406 model picker: card + Effort + More models (desktop popovers, mobile bottom sheet) ===== */
var XM_EFF=[["low","Low"],["medium","Medium","Recommended"],["high","High"],["extra","Extra"],["max","Max","5x more power"]];
function xmEff(){try{var v=JSON.parse(localStorage.getItem("xmm.effort"));return XM_EFF.some(function(e){return e[0]===v})?v:"medium"}catch(e){return"medium"}}
function xmSetEff(v){try{localStorage.setItem("xmm.effort",JSON.stringify(v))}catch(e){}}
function xmEffName(){var v=xmEff();return XM_EFF.filter(function(e){return e[0]===v})[0][1]}
window.XMM_EFFORT_HINT=function(){return({low:" EFFORT: low. Answer fast and briefly, skip extras.",medium:"",high:" EFFORT: high. Be thorough, check your reasoning and cover edge cases.",extra:" EFFORT: extra. Reason carefully step by step, verify your answer and write a detailed, complete response.",max:" EFFORT: max. Use maximum effort: reason deeply, consider alternatives, verify every part twice and give the most complete, highest-quality answer you can."})[xmEff()]||""};
function xmFam(m){return m.gal||/Galaxy/i.test(m.name)?"Galaxy":/Sun/i.test(m.name)?"Sun":/Engine/i.test(m.name)?"Engine":"Classic"}
var XM_CHK='<svg class="xm-ck" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.500"/></svg>',XM_CH='<svg class="xm-ch" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
function xmCss(){if(document.getElementById("xmCss"))return;var c=document.createElement("style");c.id="xmCss";c.textContent=
'.xm-bg{position:fixed;inset:0;z-index:2147483100;background:transparent}.xm-bg.m{background:rgba(0,0,0,.5);opacity:0;transition:opacity .25s}.xm-bg.m.in{opacity:1}'+
'.xm-card,.xm-sub{position:fixed;z-index:2147483101;background:#2b2b2d;color:#ececec;border:1px solid rgba(255,255,255,.1);border-radius:16px;box-shadow:0 18px 50px rgba(0,0,0,.5);font:14px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden}'+
'.xm-card.xm-d{width:400px;padding:4px 14px}.xm-sub{padding:10px 14px;min-width:250px;overflow-y:auto}'+
'.xm-row,.xm-it{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;background:none;border:0;color:inherit;font:inherit;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent}'+
'.xm-row{padding:14px 0}.xm-row b{display:block;font-size:15px;font-weight:600}.xm-row small{display:block;color:#9a9a9e;font-size:13px;margin-top:3px}.xm-row>span:first-child{flex:1}'+
'.xm-sel .xm-ck{color:#4a8cf0}.xm-sep{height:1px;background:rgba(255,255,255,.09)}.xm-sm .xm-l{flex:1;font-size:15px}.xm-v{color:#9a9a9e;font-size:14px}.xm-ch{color:#9a9a9e}'+
'.xm-sm:hover .xm-l,.xm-sm.on .xm-l{color:#fff}.xm-sm.on{background:rgba(255,255,255,.05);margin:0 -14px;padding:14px;width:calc(100% + 28px)}'+
'.xm-note{color:#9a9a9e;font-size:14px;padding:2px 0 10px}.xm-it{padding:8px 0;font-size:15px;border-radius:8px}.xm-it:hover{color:#fff;background:rgba(255,255,255,.05);margin:0 -8px;padding:8px;width:calc(100% + 16px)}'+
'.xm-it>span{flex:0 1 auto}.xm-it .xm-ck{margin-left:auto;color:#4a8cf0}.xm-it.on{color:#fff}'+
'.xm-it em{font-style:normal;font-size:11px;color:#9a9a9e;background:rgba(255,255,255,.08);padding:2px 8px;border-radius:99px}.xm-it em.xm-warn{color:#e8b04a;background:rgba(232,176,74,.13)}.xm-it.lock{opacity:.55}'+
'.xm-card.xm-m{left:0;right:0;bottom:0;width:auto;border-radius:22px 22px 0 0;border-bottom:0;padding:8px 18px calc(env(safe-area-inset-bottom,0px) + 16px);transform:translateY(100%);transition:transform .32s cubic-bezier(.22,1,.36,1);max-height:82dvh;overflow-y:auto;-webkit-overflow-scrolling:touch}.xm-card.xm-m.in{transform:none}'+
'.xm-grab{width:40px;height:4px;border-radius:9px;background:rgba(255,255,255,.2);margin:4px auto 6px}.xm-back{display:flex;align-items:center;gap:6px;background:none;border:0;color:#9a9a9e;font:inherit;font-size:14px;padding:8px 0;cursor:pointer}.xm-back svg{transform:rotate(180deg)}'+
'.xm-m .xm-it{padding:13px 0}.xm-m .xm-it:hover{margin:0;padding:13px 0;width:100%;background:none}'+
'html[data-cl-theme="light"] .xm-card,html[data-cl-theme="light"] .xm-sub{background:#fff;color:#1f1f1f;border-color:rgba(0,0,0,.12);box-shadow:0 18px 50px rgba(0,0,0,.18)}html[data-cl-theme="light"] .xm-sep{background:rgba(0,0,0,.09)}html[data-cl-theme="light"] .xm-it:hover,html[data-cl-theme="light"] .xm-sm.on{background:rgba(0,0,0,.05);color:#000}html[data-cl-theme="light"] .xm-it em{background:rgba(0,0,0,.06)}';
document.head.appendChild(c)}
function closeXm(){["xmBg","xmCard","xmSub"].forEach(function(i){var n=document.getElementById(i);if(n)n.remove()});document.removeEventListener("keydown",xmKey,true)}
function xmKey(e){if(e.key==="Escape")closeXm()}
function openModel(anchor){
 var list=scrapeModels();if(!list.length)return openModelOld();
 xmCss();closeXm();
 var cur=list.filter(function(m){return m.on})[0]||list[0],mob=window.innerWidth<=820,view="main";
 var bg=el("div","xm-bg"+(mob?" m":""));bg.id="xmBg";var card=el("div","xm-card "+(mob?"xm-m":"xm-d"));card.id="xmCard";var sub=null;
 document.body.appendChild(bg);document.body.appendChild(card);document.addEventListener("keydown",xmKey,true);bg.onclick=closeXm;
 function mainH(){return'<button class="xm-row xm-sel" type="button" data-a="cur"><span><b>'+esc(cur.name)+'</b><small>'+esc(cur.desc)+'</small></span>'+XM_CHK+'</button><div class="xm-sep"></div><button class="xm-row xm-sm" type="button" data-a="eff"><span class="xm-l">Effort</span><span class="xm-v">'+xmEffName()+'</span>'+XM_CH+'</button><div class="xm-sep"></div><button class="xm-row xm-sm" type="button" data-a="more"><span class="xm-l">More models</span>'+XM_CH+'</button>'}
 function effH(){return'<div class="xm-note">Higher effort means more thorough responses, but takes longer and uses your limits faster.</div>'+XM_EFF.map(function(e){return'<button class="xm-it'+(xmEff()===e[0]?" on":"")+'" type="button" data-e="'+e[0]+'"><span>'+e[1]+'</span>'+(e[2]?(e[0]==="max"?'<em class="xm-warn">\u26A0 '+e[2]+'</em>':'<em>'+e[2]+'</em>'):"")+(xmEff()===e[0]?XM_CHK:"")+'</button>'}).join("")}
 function moreH(){return list.filter(function(m){return m.k!==cur.k}).map(function(m){return'<button class="xm-it'+(m.lock?" lock":"")+'" type="button" data-k="'+esc(m.k)+'"><span>'+esc(m.name)+'</span><em>'+xmFam(m)+'</em>'+(m.lock?'<span style="margin-left:auto">\uD83D\uDD12</span>':"")+'</button>'}).join("")}
 function pickE(v){xmSetEff(v)}
 function pos(){var r=anchor&&anchor.getBoundingClientRect?anchor.getBoundingClientRect():{left:innerWidth/2-200,top:innerHeight-60,bottom:innerHeight-20};card.style.left=Math.max(12,Math.min(r.left,innerWidth-412))+"px";if(r.top>innerHeight/2){card.style.bottom=(innerHeight-r.top+8)+"px";card.style.top="auto"}else{card.style.top=(r.bottom+8)+"px";card.style.bottom="auto"}}
 function openSub(kind,row){
  if(sub){sub.remove();sub=null}
  card.querySelectorAll(".xm-sm").forEach(function(b){b.classList.toggle("on",b===row)});
  if(!kind)return;
  sub=el("div","xm-sub");sub.id="xmSub";sub.innerHTML=kind==="eff"?effH():moreH();document.body.appendChild(sub);
  var cr=card.getBoundingClientRect(),rr=row.getBoundingClientRect(),w=sub.offsetWidth;
  sub.style.maxHeight=(innerHeight-24)+"px";var h=sub.offsetHeight;
  var left=cr.right+8+w<=innerWidth-8?cr.right+8:Math.max(8,cr.left-w-8);
  var top=Math.max(12,Math.min(rr.top-8,innerHeight-h-12));sub.style.left=left+"px";sub.style.top=top+"px";
  sub.onclick=function(ev){var e=ev.target.closest("[data-e]"),k=ev.target.closest("[data-k]");if(e){pickE(e.dataset.e);card.innerHTML=mainH();bindMain();openSub(null)}else if(k){closeXm();pickModel(k.dataset.k)}}}
 function bindMain(){card.onclick=function(ev){var b=ev.target.closest("[data-a]");if(!b)return;var a=b.dataset.a;if(a==="cur"){closeXm();return}openSub(a,b)};
  if(!mob)card.onmouseover=function(ev){var b=ev.target.closest(".xm-sm");if(b&&!b.classList.contains("on"))openSub(b.dataset.a,b)}}
 function mobView(v){view=v;
  if(v==="main"){card.innerHTML='<div class="xm-grab"></div>'+mainH();card.onclick=function(ev){var b=ev.target.closest("[data-a]");if(!b)return;if(b.dataset.a==="cur")closeXm();else mobView(b.dataset.a)}}
  else{card.innerHTML='<div class="xm-grab"></div><button class="xm-back" type="button" data-b="1">'+XM_CH+(v==="eff"?"Effort":"More models")+'</button>'+(v==="eff"?effH():moreH());
   card.onclick=function(ev){if(ev.target.closest("[data-b]"))return mobView("main");var e=ev.target.closest("[data-e]"),k=ev.target.closest("[data-k]");if(e){pickE(e.dataset.e);mobView("main")}else if(k){closeXm();pickModel(k.dataset.k)}}}}
 if(mob){mobView("main");requestAnimationFrame(function(){bg.classList.add("in");card.classList.add("in")})}
 else{card.innerHTML=mainH();pos();bindMain()}
}
function openModelOld(){
 var list=scrapeModels();
 var s=sheet("clModel",{title:"Select model",grab:true});
 var mi=function(m){return'<button class="cl-mi'+(m.lock?" lock":"")+'" data-k="'+esc(m.k)+'" type="button"><div class="t"><b>'+esc(m.name)+'</b><small>'+esc(m.desc)+'</small></div>'+(m.on?IC.check:"")+'</button>'};
 var gopen=list.some(function(m){return m.gal&&m.on});
 var fam=function(m){return m.gal||/Galaxy/i.test(m.name)?"Galaxy":/Sun/i.test(m.name)?"Sun":/Engine/i.test(m.name)?"Engine":"Classic"},gr={};list.forEach(function(m){(gr[fam(m)]=gr[fam(m)]||[]).push(m)});
 s.body.innerHTML='<div class="cl-grp" style="padding:4px 0">'+["Galaxy","Sun","Engine","Classic"].filter(function(f){return gr[f]}).map(function(f){return'<div class="cl-fam"><span class="cl-fh">'+f+' family</span>'+gr[f].map(mi).join("")+'</div>'}).join("")+'</div>';

 s.body.addEventListener("click",function(e){var x=e.target.closest(".cl-gx");if(x){var g=s.body.querySelector(".cl-gal"),on=g.hidden;g.hidden=!on;x.textContent=(on?"\u25BC":"\u25B6")+" Galaxy models";return}var r=e.target.closest(".cl-mi");if(!r)return;pickModel(r.dataset.k);s.close()});
}
function syncModelLabel(){var sp=$("#modeBtn span"),v=$("#cvModel span");if(sp&&sp.textContent!=="Models")sp.textContent="Models";if(v&&v.textContent!=="Models")v.textContent="Models"}

/* ---------- settings sheet ---------- */
var setS=null,stack=[];
function curLang(){try{return localStorage.getItem("xmm.lang")||"en"}catch(e){return"en"}}
function setLang(l){["setLang","topLang"].forEach(function(id){var s=document.getElementById(id);if(s){s.value=l;if(s.onchange)s.onchange()}});setTimeout(function(){updGreeting()},50)}
var LANGS=[["en","English"],["de","Deutsch"],["es","Español"],["fa","فارسی"],["ar","العربية"]];
function langSel(){return'<select data-lang>'+LANGS.map(function(l){return'<option value="'+l[0]+'"'+(curLang()===l[0]?" selected":"")+'>'+l[1]+'</option>'}).join("")+'</select>'}
function langName(){var f=LANGS.filter(function(l){return l[0]===curLang()})[0];return f?f[1]:"English"}
function row(icon,label,opts){opts=opts||{};return'<button class="cl-row'+(opts.cls?" "+opts.cls:"")+'" type="button" data-go="'+(opts.go||"")+'" '+(opts.act?'data-do="'+opts.act+'"':"")+'>'+(icon||"")+'<span class="rt">'+label+(opts.sub?'<small>'+opts.sub+'</small>':"")+'</span>'+(opts.val!=null?'<span class="rv">'+opts.val+'</span>':"")+(opts.chev===false?"":(opts.val!=null?"":IC.chev.replace('<svg','<svg class="ch"')))+(opts.extra||"")+'</button>'}
function pageRoot(){
 var n=uname()||"XMM User",l=(uname()||"X").charAt(0).toUpperCase(),th=themePref();
 return'<div class="cl-prof"><div class="a">'+esc(l)+'</div><div><b>'+esc(n)+'</b><span>XMM AI</span></div></div>'+
 '<div class="cl-lbl" style="padding-top:6px">Account</div><div class="cl-grp">'+
  row(IC.person,"Profile",{go:"profile"})+row(IC.bell,"Notifications",{go:"notif"})+row(IC.shield,"Privacy",{go:"privacy"})+'</div>'+
 '<div class="cl-lbl">App</div><div class="cl-grp">'+
  row(IC.help,"Support",{act:"support"})+row(IC.sliders,"Memory",{go:"caps"})+row(IC.voice,"Voice and dictation",{go:"voice"})+
  '<div class="cl-row" style="cursor:default">'+IC.globe+'<span class="rt">Open links in</span><span class="rv">'+(ld("xmm.cl.links","tab")==="same"?"This tab":"New tab")+IC.updn+'</span><select data-links><option value="tab"'+(ld("xmm.cl.links","tab")==="tab"?" selected":"")+'>New tab</option><option value="same"'+(ld("xmm.cl.links","tab")==="same"?" selected":"")+'>This tab</option></select></div>'+
  '<div class="cl-row" style="cursor:default" data-do="hap">'+IC.haptic+'<span class="rt">Haptic feedback</span><button class="cl-sw'+(hapOn()?" on":"")+'" data-sw="hap" type="button" aria-label="Haptic feedback"></button></div>'+
  (window.XMM_APP?(window.xmmDesktop?row(IC.dl,"Download local model",{act:"localmodel"}):""):row(IC.dl,"Install app",{act:"install"}))+'</div>'+
 '<div class="cl-note">Links that open without asking, such as sources in XMM AI’s responses, follow this setting.</div>'+
 '<div class="cl-lbl" style="padding-top:6px">Appearance</div><div class="cl-themes">'+
  [["light","Light","l"],["dark","Dark","d"],["system","System","s"]].map(function(t){return'<button class="cl-th'+(th===t[0]?" on":"")+'" data-th="'+t[0]+'" type="button"><div class="p '+t[2]+'"></div>'+t[1]+'</button>'}).join("")+'</div>'+
 '<div class="cl-grp">'+row(IC.logout,"Log out",{act:"logout",cls:"dg",chev:false})+'</div>';
}
function pageProfile(){return'<div class="cl-lbl" style="padding-top:6px">Name</div><input class="cl-in" id="clName" maxlength="40" placeholder="Your name" value="'+esc(uname())+'" autocapitalize="words" dir="auto"><div class="cl-lbl">Language</div><div class="cl-grp"><div class="cl-row nl" style="cursor:default">'+IC.globe+'<span class="rt">Language</span><span class="rv">'+esc(langName())+IC.updn+'</span>'+langSel()+'</div></div>'}
function pageNotif(){var p="Notification" in window?Notification.permission:"denied",on=ld("xmm.cl.notif","")==="yes"&&p==="granted";
 return'<div class="cl-grp" style="margin-top:6px"><div class="cl-row nl" style="cursor:default" data-do="notif">'+IC.bell+'<span class="rt">Response notifications<small>Get notified when XMM AI finishes a reply while you are away.</small></span><button class="cl-sw'+(on?" on":"")+'" data-sw="notif" type="button" aria-label="Response notifications"></button></div></div>'+(p==="denied"?'<div class="cl-note">Notifications are blocked for this site. Allow them in your browser settings to turn this on.</div>':"")}
function pagePrivacy(){return'<div class="cl-grp" style="margin-top:6px">'+row(IC.term,"Privacy policy",{act:"privacy"})+row(IC.term,"Terms of Service",{act:"terms"})+row(IC.help,"Support",{act:"support"})+'</div><div class="cl-grp">'+row(IC.trash,"Delete all chats",{act:"clear",cls:"dg",chev:false})+'</div>'}
function pageCaps(){return'<div class="cl-lbl" style="padding-top:6px">Memory</div><textarea class="cl-in" id="clMem" maxlength="2000" placeholder="Things XMM AI should always remember about you…" dir="auto">'+esc(ld("xmm.mem",""))+'</textarea><div class="cl-note">XMM AI uses this in every chat. You can change it any time.</div>'}
function pageVoice(){return'<div class="cl-grp" style="margin-top:6px"><div class="cl-row nl" style="cursor:default">'+IC.globe+'<span class="rt">Voice language<small>Voice mode and dictation listen and speak in this language.</small></span><span class="rv">'+esc(langName())+IC.updn+'</span>'+langSel()+'</div></div>'}
function pageInfo(){return'<div class="cl-prof" style="margin-top:6px"><div class="a" style="background:none"><img src="icon.svg?v=gpu6" alt="" width="40" height="40" style="border-radius:11px"></div><div><b>XMM AI</b><span>by XMM Bayat · v89</span></div></div><div class="cl-grp">'+row(IC.term,"Terms of Service",{act:"terms"})+row(IC.term,"Privacy policy",{act:"privacy"})+row(IC.help,"Support",{act:"support"})+'</div><div class="cl-note" style="text-align:center">© XMMAI. All rights reserved.</div>'}
var PAGES={root:{t:"Settings",h:pageRoot},profile:{t:"Profile",h:pageProfile},notif:{t:"Notifications",h:pageNotif},privacy:{t:"Privacy",h:pagePrivacy},caps:{t:"Memory",h:pageCaps},voice:{t:"Voice and dictation",h:pageVoice},info:{t:"About",h:pageInfo}};
function show(pg,anim){
 if(!setS)return;
 if(setS.desk){setS.page=pg;setS.body.innerHTML=deskPage(pg);var nb=setS.el.querySelectorAll("[data-dk]");for(var i=0;i<nb.length;i++)nb[i].classList.toggle("on",nb[i].dataset.dk===pg);setS.body.scrollTop=0;return}var P=PAGES[pg]||PAGES.root;setS.title.textContent=P.t;setS.body.innerHTML=P.h();setS.page=pg;
 setS.left.innerHTML=pg==="root"?IC.x:IC.back;
 setS.right.innerHTML="";
 if(pg==="root"){var ib=el("button","cl-b");ib.type="button";ib.innerHTML=IC.info;ib.setAttribute("aria-label","About");ib.onclick=function(){stack.push("root");show("info",1)};setS.right.appendChild(ib)}
 setS.back=pg==="root"?null:function(){var p=stack.pop()||"root";show(p,1)};
 if(anim){setS.body.classList.remove("sl");void setS.body.offsetWidth;setS.body.classList.add("sl")}
 setS.body.scrollTop=0;
}
function openSettings(){
 if(window.innerWidth>=760){openSettingsDesk();return}
 closeDrawer();var m=$("#msg");if(m)m.blur();
 stack=[];setS=sheet("clSet",{title:"Settings",height:"90dvh",onclose:function(){setS=null}});
 show("root",0);
 wireSet();
}

function wireSet(){
 setS.body.addEventListener("click",function(e){
  var g=e.target.closest("[data-go]");if(g&&g.dataset.go){stack.push(setS.page);show(g.dataset.go,1);return}
  var th=e.target.closest(".cl-th");if(th){sv("xmm.cl.theme",th.dataset.th);applyTheme();$$(".cl-th",setS.body).forEach(function(x){x.classList.toggle("on",x===th)});return}
  var sw=e.target.closest("[data-sw]");
  if(sw){var k=sw.dataset.sw;
   if(k==="hap"){var v=!hapOn();sv("xmm.cl.hap",v);sw.classList.toggle("on",v)}
   else if(k==="notif"){
    if(sw.classList.contains("on")){sv("xmm.cl.notif","no");sw.classList.remove("on")}
    else if(!("Notification" in window)){toast("Notifications not supported here")}
    else askNotif(function(p){sw.classList.toggle("on",p==="granted");if(p!=="granted")show("notif",0)});
   }return}
  var d=e.target.closest("[data-do]");
  if(d){var a=d.dataset["do"];
   if(a==="hap"){var w=$('[data-sw="hap"]',d);if(w)w.click()}
   else if(a==="notif"){var w2=$('[data-sw="notif"]',d);if(w2)w2.click()}
   else if(a==="privacy")window.open("https://support.xmm-ai.com/privacy","_blank","noopener");
   else if(a==="terms")window.open("https://support.xmm-ai.com/terms","_blank","noopener");
   else if(a==="support")window.open("https://support.xmm-ai.com/","_blank","noopener");
   else if(a==="localmodel"){setS.close();if(window.XMMD)XMMD.openLocal()}
   else if(a==="install"){var ib=$('[data-act="install"]');setS.close();if(ib)setTimeout(function(){ib.click()},300)}
   else if(a==="clear"){var c=$("#clearAll");if(c)c.click()}
   else if(a==="logout"){var lo=$("#logout");if(lo)lo.click()}
  }
 });
 setS.body.addEventListener("change",function(e){
  if(e.target.matches("[data-lang]")){setLang(e.target.value);show(setS.page,0)}
  else if(e.target.matches("[data-links]")){sv("xmm.cl.links",e.target.value);show("root",0)}
 });
 setS.body.addEventListener("input",function(e){
  if(e.target.id==="clMem")sv("xmm.mem",e.target.value);
  else if(e.target.id==="clName"){if(e.target.value.trim()){try{API().setName(e.target.value)}catch(_){}updGreeting()}}
 });
}
var DESK=[["acc","Account"],["app","Appearance"],["mem","Memory"],["notif","Notifications"],["priv","Privacy"],["about","About"]];
function dkRow(l,c){return'<div class="dk-row"><label>'+l+'</label><div>'+c+'</div></div>'}
function themesHtml(){var th=themePref();return'<div class="cl-themes">'+[["light","Light","l"],["dark","Dark","d"],["system","System","s"]].map(function(t){return'<button class="cl-th'+(th===t[0]?" on":"")+'" data-th="'+t[0]+'" type="button"><div class="p '+t[2]+'"></div>'+t[1]+'</button>'}).join("")+'</div>'}
function deskPage(k){
 var n=uname()||"";
 if(k==="acc")return'<h4>Profile</h4>'+dkRow("Profile photo",'<span class="dk-av">'+esc((n||"X").charAt(0).toUpperCase())+'</span>')+dkRow("Full name",'<input class="dk-in" id="clName" maxlength="40" value="'+esc(n)+'" dir="auto">')+dkRow("Language",langSel().replace("<select","<select class=\"dk-in\""))+dkRow("Open links in",'<select class="dk-in" data-links><option value="tab"'+(ld("xmm.cl.links","tab")==="tab"?" selected":"")+'>New tab</option><option value="same"'+(ld("xmm.cl.links","tab")==="same"?" selected":"")+'>This tab</option></select>')+'<div class="dk-btns"><button class="dk-b" data-do="install" type="button">Install app</button><button class="dk-b dg" data-do="logout" type="button">Log out</button></div>';
 if(k==="app")return'<h4>Appearance</h4>'+themesHtml()+'<div class="cl-grp"><div class="cl-row nl" style="cursor:default" data-do="hap">'+IC.haptic+'<span class="rt">Haptic feedback</span><button class="cl-sw'+(hapOn()?" on":"")+'" data-sw="hap" type="button" aria-label="Haptic feedback"></button></div></div>'+(window.xmmDesktop?'<h4 style="margin-top:22px">Local model</h4><div class="cl-grp">'+row(IC.dl,"Download local model",{act:"localmodel",sub:"Run an AI on this computer instead of the online one"})+'</div>':"");
 if(k==="mem")return'<h4>Memory</h4>'+pageCaps();
 if(k==="notif")return'<h4>Notifications</h4>'+pageNotif();
 if(k==="priv")return'<h4>Privacy</h4>'+pagePrivacy();
 return'<h4>About</h4>'+pageInfo();
}
function openSettingsDesk(){
 closeDrawer();var m=$("#msg");if(m)m.blur();
 var old=document.getElementById("clDesk");if(old)old.remove();
 var bg=el("div","dk-bg");bg.id="clDesk";
 bg.innerHTML='<div class="dk-m"><div class="dk-h"><h3>Settings</h3><button class="dk-x" type="button" aria-label="Close">'+IC.x+'</button></div><div class="dk-c"><nav class="dk-n">'+DESK.map(function(d){return'<button type="button" data-dk="'+d[0]+'">'+d[1]+'</button>'}).join("")+'</nav><div class="dk-p"></div></div></div>';
 document.body.appendChild(bg);
 var pane=bg.querySelector(".dk-p");
 setS={el:bg,body:pane,desk:1,page:"acc",title:{},left:{},right:{},close:function(){bg.remove();setS=null}};
 bg.addEventListener("mousedown",function(e){if(e.target===bg)setS&&setS.close()});
 bg.querySelector(".dk-x").onclick=function(){setS&&setS.close()};
 bg.querySelector(".dk-n").addEventListener("click",function(e){var b=e.target.closest("[data-dk]");if(b)show(b.dataset.dk,0)});
 wireSet();show("acc",0);
}

/* ---------- voice screen ---------- */
var vEl,vTimer=0,vState="",vMuted=false,vT0=0;
function vTitle(t){var x=$(".cl-vt",vEl);if(x&&x.textContent!==t)x.textContent=t}
function vSub(t){var x=$(".cl-vs",vEl);if(x&&x.textContent!==t){x.textContent=t;x.scrollTop=x.scrollHeight}}
function buildVoice(){
 if($("#clVoice"))return;
 vEl=el("div");vEl.id="clVoice";
 vEl.innerHTML='<div class="cl-vglow"></div><div class="cl-vtop"><button class="cl-b" id="cvMenu" type="button" aria-label="Menu">'+IC.menu+'</button><span class="cl-sp"></span><button class="cl-b" id="cvGear" type="button" aria-label="Settings">'+IC.gear+'</button></div>'+
  '<div class="cl-vmid"><img class="cl-logo" src="icon.svg?v=gpu6" alt=""><div class="cl-vt">Hold tight, connecting…</div><div class="cl-vs"></div></div>'+
  '<button class="cl-vmic" id="cvMic" type="button" aria-label="Microphone">'+IC.mic+'</button>'+
  '<div class="cl-vbar"><button class="cl-b" id="cvPlus" type="button" aria-label="Add">'+IC.plus+'</button><button class="cl-vmodel" id="cvModel" type="button"><span></span>'+IC.updn+'</button><span class="cl-sp"></span><button class="cl-b" id="cvSpk" type="button" aria-label="Speaker">'+IC.spk+'</button><button class="cl-vx" id="cvX" type="button" aria-label="End">'+IC.x+'</button></div>';
 document.body.appendChild(vEl);
 $("#cvX").onclick=closeVoice;
 $("#cvMenu").onclick=function(){closeVoice();setTimeout(openDrawer,200)};
 $("#cvGear").onclick=function(){openSettings()};
 $("#cvPlus").onclick=function(){openAdd()};
 $("#cvModel").onclick=function(){openModel(this)};
 $("#cvSpk").onclick=function(){window.__clSpkOff=!window.__clSpkOff;vEl.classList.toggle("spkoff",!!window.__clSpkOff);$("#cvSpk").innerHTML=window.__clSpkOff?IC.spkoff:IC.spk;if(window.__clSpkOff){try{speechSynthesis.cancel()}catch(_){}}};
 $("#cvMic").onclick=function(){
  vMuted=!vMuted;vEl.classList.toggle("muted",vMuted);$("#cvMic").innerHTML=vMuted?IC.micoff:IC.mic;
  if(vMuted){try{XMM_VOICE.close()}catch(_){}vTitle("Microphone is off");vSub("")}
  else{vTitle("Hold tight, connecting…");vState="conn";vT0=Date.now();try{XMM_VOICE.open()}catch(_){}}
 };
}
function openVoice(){
 if(/firefox|fxios/i.test(navigator.userAgent)&&!/seamonkey/i.test(navigator.userAgent)){toast("Unsupported browser — voice mode needs Chrome, Edge or Safari");return}
 if(!window.XMM_VOICE){toast("Voice mode is not available");return}
 buildVoice();var m=$("#msg");if(m)m.blur();
 vMuted=false;vEl.classList.remove("muted","talk","speak","spkoff");window.__clSpkOff=false;$("#cvMic").innerHTML=IC.mic;$("#cvSpk").innerHTML=IC.spk;
 vEl.classList.add("conn");void vEl.offsetWidth;vEl.classList.add("on");
 vTitle("Hold tight, connecting…");vSub("");vState="conn";vT0=Date.now();syncModelLabel();
 try{XMM_VOICE.open()}catch(e){}
 clearInterval(vTimer);vTimer=setInterval(vPoll,140);
}
function vPoll(){
 if(!vEl||!vEl.classList.contains("on")){clearInterval(vTimer);return}
 var vo=$("#vo"),on=vo&&vo.classList.contains("on");
 if(vMuted)return;
 if(vState==="conn"){
  if(on){vState="live";vEl.classList.remove("conn");vTitle("Let’s talk, "+(uname()||"there"))}
  else if(Date.now()-vT0>4200){var h=vo&&$(".hint",vo);var tx=h&&h.textContent;if(tx&&!/Listening/.test(tx))toast(tx);closeVoice();return}
  return;
 }
 if(!on){closeVoice();return}
 var talk=vo.classList.contains("talk"),speak=vo.classList.contains("speak"),think=vo.classList.contains("think");
 vEl.classList.toggle("talk",talk);vEl.classList.toggle("speak",speak);
 var heard=($(".txt span",vo)||{}).textContent||"";
 var logs=$$(".log .a",vo),lastA=logs.length?logs[logs.length-1].textContent:"";
 var hint=($(".hint",vo)||{}).textContent||"";
 if(talk&&heard){vTitle("Listening…");vSub(heard)}
 else if(speak||(think&&lastA)){vTitle("");vSub(lastA)}
 else if(think){vTitle("Thinking…");vSub("")}
 else if(/blocked|error|No micro|unavailable/i.test(hint)){vTitle(hint);vSub("")}
 else{vTitle("Let’s talk, "+(uname()||"there"));vSub(lastA&&false?lastA:"")}
 syncModelLabel();
}
function closeVoice(){
 clearInterval(vTimer);
 try{XMM_VOICE.close()}catch(e){}
 try{speechSynthesis.cancel()}catch(e){}
 if(vEl){vEl.classList.remove("on","talk","speak","conn","muted");}
 vState="";
}

/* ---------- global click interception (beat old handlers) ---------- */
window.addEventListener("click",function(e){
 var t=e.target;if(!t||!t.closest)return;
 var stop=function(){e.stopImmediatePropagation();e.stopPropagation();e.preventDefault()};
 if(t.closest("#attBtn"))return;
 if(t.closest("#modeBtn")){stop();openModel(t.closest("#modeBtn"));return}
 var s=t.closest('[data-act="settings"]');if(s&&!t.closest(".cl-sheet")){stop();openSettings();return}
 var d=t.closest('[data-act="openDrawer"],[data-act="toggleSide"]');if(d){stop();openDrawer();return}
 var gw=t.closest("#gWave");if(gw&&!gw.__cl){stop();openVoice()}
},true);
document.addEventListener("keydown",function(e){if(e.key==="Escape"){if(B.classList.contains("cl-drawer"))closeDrawer(1);closeSheets()}});

/* old settings modal -> new sheet */
var oldSet=document.getElementById("settings");
if(oldSet)new MutationObserver(function(){if(!oldSet.hidden){oldSet.hidden=true;openSettings()}}).observe(oldSet,{attributes:true,attributeFilter:["hidden"]});

/* ---------- boot ---------- */
function start(){
 buildTop();buildDrawer();buildGreeting();ensureComposer();decorate();rebuildRecents();updGreeting();syncModelLabel();
 var ms=$("#msgs");if(ms)new MutationObserver(decorate).observe(ms,{childList:true});
 var cl=$("#chatList");if(cl)new MutationObserver(function(){lastCount=-1}).observe(cl,{childList:true,subtree:true});
 var mo=$("#modeBtn span");if(mo)new MutationObserver(syncModelLabel).observe(mo,{childList:true,characterData:true,subtree:true});
 setInterval(tick,350);tick();
}
(function wait(n){
 if(window.XMM_API&&$("#mainChat")&&$("#msg")){start();return}
 if(n>200){try{start()}catch(e){}return}
 setTimeout(function(){wait((n||0)+1)},50);
})(0);
window.XMM_CLONE={openDrawer:openDrawer,closeDrawer:closeDrawer,openSettings:openSettings,openVoice:openVoice,closeVoice:closeVoice,openAdd:openAdd,openModel:openModel};
})();
