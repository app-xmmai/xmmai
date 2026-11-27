/* XMM AI v117 */
/* XMM AI ipad.js v1 — tablet-app layer on top of clone.js: drawer nav, pages, plus menu, feedback card. Loaded last. */
(function(){
"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var B=document.body;
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function API(){return window.XMM_API||{}}
function toast(m){try{API().toast(m)}catch(e){}}
function I(p,w){return'<svg viewBox="0 0 24 24" width="'+(w||20)+'" height="'+(w||20)+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
var IC={
 video:I('<rect x="3.5" y="6" width="12" height="12" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3z"/>'),
 search:I('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>'),
 images:I('<rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 3.5 3L16 12l4 4"/>'),
 sched:I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
 lib:I('<rect x="4" y="4.5" width="5" height="15" rx="1.3"/><rect x="10.5" y="4.5" width="4" height="15" rx="1.3"/><path d="m16.5 6.5 3.6-1 2 .5-3.7 13.4-3.5-.9z" transform="translate(-2 0) scale(.9)"/>'),
 cust:I('<path d="M4 8h9M17 8h3M4 16h3M11 16h9"/><circle cx="15" cy="8" r="2"/><circle cx="9" cy="16" r="2"/>'),
 explore:I('<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>'),
 compose:I('<path d="M12 5H7.5A3.5 3.5 0 0 0 4 8.5v8A3.5 3.5 0 0 0 7.5 20h8a3.5 3.5 0 0 0 3.5-3.5V12"/><path d="M17.6 3.6a2 2 0 0 1 2.8 2.8L12 14.8l-3.6.8.8-3.6z"/>'),
 menu:I('<path d="M4 8h16M4 16h10"/>'),
 x:I('<path d="M6 6l12 12M18 6 6 18"/>'),
 plus:I('<path d="M12 5v14M5 12h14"/>'),
 chev:I('<path d="m9 6 6 6-6 6"/>',15),
 check:I('<path d="m5 12.5 4.5 4.5L19 7.5"/>',18),
 camera:I('<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.3-2h5.4L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"/><circle cx="12" cy="12.5" r="3.3"/>',21),
 photos:I('<rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 3.5 3L16 12l4 4"/>',21),
 files:I('<path d="m20 11-8.2 8.2a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.6 1.6 0 0 1-2.3-2.3L15 7"/>',21),
 plug:I('<path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0zM12 17v4"/>',21),
 write:I('<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="m14 8 3 3"/>'),
 globe:I('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.7 5.3 3.7 8.5s-1.2 6.1-3.7 8.5c-2.5-2.4-3.7-5.3-3.7-8.5s1.2-6.1 3.7-8.5z"/>'),
 learn:I('<path d="m3 9 9-4.5L21 9l-9 4.5z"/><path d="M7 11.5V16c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8v-4.5"/>'),
 brain:I('<path d="M5 5.5h14v13H5z" transform="translate(0 0)"/><path d="M9 9.5h6M9 13h4"/>'),
 face:I('<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c1.8 2 5.2 2 7 0M9 9.5v.5M15 9.5v.5"/>'),
 up:I('<path d="M7 10v11"/><path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8a2 2 0 0 1-1.9 1.4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9z"/>'),
 dn:I('<path d="M17 14V3"/><path d="M9 18.1 10 14H4.2a2 2 0 0 1-1.9-2.6l2.3-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.8a2 2 0 0 0-1.8 1.1L12 22a3.1 3.1 0 0 1-3-3.9z"/>'),
 spark:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12 2.5c.6 4.8 2.7 6.9 7.5 7.5-4.8.6-6.9 2.7-7.5 7.5-.6-4.8-2.7-6.9-7.5-7.5 4.8-.6 6.9-2.7 7.5-7.5zM19 15.5c.3 2 1.1 2.8 3 3-1.9.2-2.7 1-3 3-.3-2-1.1-2.8-3-3 1.9-.2 2.7-1 3-3z"/></svg>',
 up2:I('<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>',18),
 dl:I('<path d="M12 4v11M7.5 11 12 15.5 16.5 11M5 19.5h14"/>'),
 trash:I('<path d="M5 7h14M9.5 7V4.5h5V7M7 7l.8 12.5h8.4L17 7"/>'),
 globe2:I('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/>'),
 shield:I('<path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.3 7 9 4.1-1.7 7-4.8 7-9V6z"/>'),
 person:I('<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5"/>')
};
var PAGE=null,pageEl=null;

/* ============ drawer ============ */
function buildDrawer(){
 var d=$("#clDrawer");if(!d||d.__ip)return false;d.__ip=1;
 d.innerHTML='<div class="cl-dh"><button class="gm-menu" id="gmMenu" type="button" aria-label="Collapse sidebar">'+IC.menu+'</button><button class="ip-circ" id="ipSearch" type="button" aria-label="Search">'+IC.search+'</button></div>'+
 '<button class="cl-nc ip-chat" id="clNc" type="button">'+IC.compose+'<span>New chat</span></button>'+
 '<div class="cl-ds" id="clDs">'+
 [["scheduled","Scheduled",IC.sched],["library","Library",IC.lib],["customize","Customize",IC.cust],["explore","Explore",IC.explore]].map(function(n,i){return'<button class="cl-nr" data-ip="'+n[0]+'" style="--i:'+i+'">'+n[2]+'<span>'+n[1]+'</span></button>'}).join("")+
 '<div class="cl-rl" id="ipPinL" style="display:none">Pinned</div><div id="ipPinned"></div>'+
 '<div class="cl-rl">Chats</div><div id="clRecents"></div>'+
 '<button class="cl-all" id="clAll"><span>All chats</span></button></div>'+
 '<div class="cl-db"><button class="cl-av" id="clAv" type="button" aria-label="Settings">X</button><span class="gm-sh">Settings &amp; help</span></div>';
 d.addEventListener("click",function(e){
  if(e.target.closest("#ipSearch")){if(innerWidth<700)B.classList.remove("cl-drawer");openPage("library",{focus:1});return}
  var n=e.target.closest("[data-ip]");if(n){if(innerWidth<700)B.classList.remove("cl-drawer");if(n.dataset.ip==="imagine"){try{closePage()}catch(_){}try{window.XMM_IMAGINE&&XMM_IMAGINE()}catch(_){}return}openPage(n.dataset.ip)}
 },true);
 var rc=$("#clRecents");
 new MutationObserver(function(){splitPins()}).observe(rc,{childList:true});
 splitPins();
 return true;
}
var splitBusy=0;
function splitPins(){
 if(splitBusy)return;splitBusy=1;
 try{
  var pins={};(ld("xmm.chats",[])||[]).forEach(function(c){if(c.pin)pins[c.id]=1});
  var box=$("#ipPinned"),rc=$("#clRecents");if(!box||!rc)return;
  $$(".cl-ci",box).forEach(function(b){rc.appendChild(b)});
  $$(".cl-ci",rc).forEach(function(b){if(pins[b.dataset.id]){b.classList.remove("cl-x");box.appendChild(b)}});
  var lab=$("#ipPinL");if(lab)lab.style.display=box.children.length?"":"none";
 }catch(e){}
 splitBusy=0;
}

/* ============ top bar + empty state ============ */
function buildTop(){
 var t=$("#clTop");if(!t||t.__ip)return false;t.__ip=1;
 var m=el("button","ip-pill",IC.spark+"<span>XMM AI</span>");m.id="ipModel";m.type="button";
 t.insertBefore(m,t.children[1]);
 m.onclick=function(e){e.stopPropagation();var b=$("#modeBtn");if(b)b.click()};
 return true;
}
function syncModel(){var s=$("#modeBtn span"),p=$("#ipModel span");if(s&&s.textContent!=="Models")s.textContent="Models";if(p&&p.textContent!=="Models")p.textContent="Models"}
function buildSug(){
 var dock=$("#viewChat .dock");if(!dock||$("#ipSug"))return;
 var s=el("div");s.id="ipSug";
 var items=[[IC.images,"Create an image","make image of "],[IC.write,"Write or edit","Help me write "],[IC.globe,"Search the web","Search the web for "],[IC.learn,"Learn something","Teach me about "]];
 s.innerHTML=items.map(function(x,i){return'<button type="button" data-i="'+i+'">'+x[0]+'<span>'+x[1]+'</span></button>'}).join("");
 dock.insertBefore(s,dock.firstChild);
 s.onclick=function(e){var b=e.target.closest("button");if(!b)return;var m=$("#msg");m.focus();m.value=items[+b.dataset.i][2];m.dispatchEvent(new Event("input",{bubbles:true}));try{m.setSelectionRange(m.value.length,m.value.length)}catch(_){}};
}

/* ============ pages ============ */
function ensurePage(){
 if(pageEl&&pageEl.isConnected)return pageEl;
 pageEl=el("div");pageEl.id="ipPage";$("#mainChat").appendChild(pageEl);return pageEl;
}
function header(title,left,right){
 return'<div class="ip-h"><button class="ip-circ" data-x="'+(left||"menu")+'" type="button" aria-label="Back">'+(left==="back"?IC.chev.replace("<svg",'<svg style="transform:rotate(180deg)"'):IC.menu)+'</button><h2>'+esc(title)+'</h2><span>'+(right||"")+'</span></div>';
}
function closePage(){PAGE=null;if(pageEl)pageEl.classList.remove("on");if(pageEl)pageEl.innerHTML=""}
var stack=[];
function openPage(name,opts){
 var p=ensurePage();p.classList.add("on");
 if(!opts||!opts.sub)stack=[];
 PAGE=name;var R=PAGES[name]||PAGES.library;
 R(p,opts||{});
 var m=$("#msg");if(m)m.blur();
}
function wireHead(p,back){
 var b=$(".ip-h [data-x]",p);if(!b)return;
 b.onclick=function(){
  if(b.dataset.x==="back"&&stack.length){var s=stack.pop();openPage(s,{sub:1})}
  else if(b.dataset.x==="back")closePage();
  else B.classList.add("cl-drawer"),$("#clDrawer")&&0;
 };
}
function menuBtn(p){
 var b=$(".ip-h [data-x]",p);if(!b)return;
 if(b.dataset.x==="menu")b.onclick=function(){var o=$("#clMenu");if(o)o.click()};
 else b.onclick=function(){if(stack.length){var s=stack.pop();openPage(s,{sub:1})}else closePage()};
}
function startChat(text,autosend){
 closePage();
 try{API().newChat()}catch(e){}
 setTimeout(function(){
  var m=$("#msg");if(!m)return;
  if(autosend){try{API().send(text)}catch(e){}}
  else{m.value=text;m.dispatchEvent(new Event("input",{bubbles:true}));m.focus()}
 },60);
}
function allChats(){return(ld("xmm.chats",[])||[]).slice().sort(function(a,b){return(b.t||b.ts||0)-(a.t||a.ts||0)})}
function collectImages(){
 var out=[];(ld("xmm.chats",[])||[]).forEach(function(c){(c.msgs||[]).forEach(function(m){
  if(m.gen&&m.gen.url)out.push({url:m.gen.url,label:m.gen.prompt||m.gen.p||c.title||"Image",cid:c.id});
  else if(m.role==="user"&&m.atts)m.atts.forEach(function(a){if(a.img)out.push({url:a.img,label:m.text||a.name||"Upload",cid:c.id})});
 })});return out.reverse();
}
function openChatById(id){closePage();var s=$('#chatList .chat-i[data-id="'+id+'"]');if(s)s.click();else try{API().newChat()}catch(e){}}
function imgTiles(list){return list.map(function(x,i){return'<div class="ip-img" data-c="'+esc(x.cid)+'"><img src="'+esc(x.url)+'" alt="" loading="lazy"><span>'+esc(x.label)+'</span></div>'}).join("")}

var STYLES=[["Stickers","Die-cut sticker pack","linear-gradient(145deg,#ffe35a,#ff9d3c)","sticker sheet of "],["Diagram","Labeled infographic","linear-gradient(145deg,#e9f5df,#b6dca0)","clean labeled educational diagram of "],["Vintage map","Aged parchment","linear-gradient(145deg,#d9c08f,#a98a52)","vintage hand-drawn map of "],["Poster","Bold typography","linear-gradient(145deg,#ff6a4a,#c4260f)","bold retro poster of "],["Portrait","Studio lighting","linear-gradient(145deg,#d4d8ff,#8d98f5)","studio portrait photo of "],["Logo","Minimal mark","linear-gradient(145deg,#f1f1f1,#bfbfc4)","minimal vector logo for "],["Anime","Cel-shaded art","linear-gradient(145deg,#ffc9e8,#ff7ec0)","anime style illustration of "],["3D render","Soft clay look","linear-gradient(145deg,#bff0ff,#52b5e6)","3D clay render of "]];

var PAGES={
 images:function(p,o){
  var tab=o.tab||"ideas",mine=collectImages();
  p.innerHTML=header("Images")+'<div class="ip-b"><div class="ip-w"><div class="ip-chips"><button class="ip-chip'+(tab==="ideas"?" on":"")+'" data-t="ideas">Styles</button><button class="ip-chip'+(tab==="mine"?" on":"")+'" data-t="mine">Your images'+(mine.length?" · "+mine.length:"")+'</button></div>'+
   (tab==="ideas"?'<div class="ip-grid">'+STYLES.map(function(s,i){return'<button class="ip-style" data-s="'+i+'" style="background:'+s[2]+'"><b>'+esc(s[0])+'</b><small>'+esc(s[1])+'</small></button>'}).join("")+'</div>':
    (mine.length?'<div class="ip-grid">'+imgTiles(mine)+'</div>':'<div class="ip-empty">No images yet.<br>Describe one below and it will appear here.</div>'))+
   '</div></div><div class="ip-bar"><form><input id="ipImgIn" placeholder="Describe an image" dir="auto" autocomplete="off"><button type="submit" aria-label="Create">'+IC.up2+'</button></form></div>';
  menuBtn(p);
  p.onclick=function(e){
   var c=e.target.closest("[data-t]");if(c){PAGES.images(p,{tab:c.dataset.t});return}
   var s=e.target.closest("[data-s]");if(s){var st=STYLES[+s.dataset.s];var inp=$("#ipImgIn");inp.value=st[3];inp.focus();return}
   var im=e.target.closest(".ip-img");if(im)openChatById(im.dataset.c);
  };
  $("form",p).onsubmit=function(e){e.preventDefault();var v=$("#ipImgIn").value.trim();if(!v)return;startChat(/^make image/i.test(v)?v:"make image of "+v,true)};
 },
 scheduled:function(p){
  var L=ld("xmm.ip.sched",[]);
  p.innerHTML=header("Scheduled")+'<div class="ip-b"><div class="ip-w">'+
   '<div class="ip-lbl">New scheduled prompt</div><textarea class="ip-in" id="ipSTx" placeholder="What should XMM AI do? e.g. Give me a morning briefing" dir="auto"></textarea>'+
   '<input class="ip-in" id="ipSAt" type="datetime-local"><select class="ip-in" id="ipSRep"><option value="once">Once</option><option value="daily">Every day</option><option value="weekly">Every week</option></select>'+
   '<button class="ip-btn" id="ipSAdd" type="button">Schedule</button>'+
   '<div class="ip-lbl" style="margin-top:26px">Upcoming</div>'+
   (L.length?L.map(function(s){return'<div class="ip-card" data-id="'+s.id+'"><b dir="auto">'+esc(s.text)+'</b><span>'+new Date(s.at).toLocaleString()+' · '+({once:"Once",daily:"Every day",weekly:"Every week"}[s.rep])+'</span><br><button class="ip-btn r" data-del="'+s.id+'" style="margin-top:10px;height:36px;padding:0 16px">Delete</button></div>'}).join(""):'<div class="ip-empty" style="padding:24px">Nothing scheduled.</div>')+
   '<div class="ip-lbl">Scheduled prompts run while XMM AI is open in your browser or installed app.</div></div></div>';
  menuBtn(p);
  var d=new Date(Date.now()+3600e3);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());$("#ipSAt").value=d.toISOString().slice(0,16);
  p.onclick=function(e){
   if(e.target.id==="ipSAdd"){var t=$("#ipSTx").value.trim(),at=new Date($("#ipSAt").value).getTime();if(!t||!at){toast("Add a prompt and a time");return}
    var Ls=ld("xmm.ip.sched",[]);Ls.push({id:"s"+Date.now(),text:t,at:at,rep:$("#ipSRep").value});sv("xmm.ip.sched",Ls);
    try{if("Notification" in window&&Notification.permission==="default")Notification.requestPermission()}catch(_){}
    toast("Scheduled");PAGES.scheduled(p);return}
   var del=e.target.closest("[data-del]");if(del){sv("xmm.ip.sched",ld("xmm.ip.sched",[]).filter(function(s){return s.id!==del.dataset.del}));PAGES.scheduled(p)}
  };
 },
 library:function(p,o){
  var tab=o.tab||"suggested",q=o.q||"",chats=allChats(),imgs=collectImages();
  var fav=chats.filter(function(c){return c.pin||(c.msgs||[]).some(function(m){return m.liked===1})});
  var list=tab==="favorites"?fav:tab==="all"?chats:chats.slice(0,12);
  if(q)list=chats.filter(function(c){return(c.title||"").toLowerCase().indexOf(q.toLowerCase())>-1||(c.msgs||[]).some(function(m){return(m.text||"").toLowerCase().indexOf(q.toLowerCase())>-1})});
  var body;
  if(tab==="images"&&!q)body=imgs.length?'<div class="ip-grid">'+imgTiles(imgs)+'</div>':'<div class="ip-empty">No images yet.</div>';
  else body=list.length?list.map(function(c){var last=(c.msgs||[]).slice(-1)[0];return'<div class="ip-card" data-c="'+esc(c.id)+'"><b dir="auto">'+esc(c.title||"Untitled")+'</b><span dir="auto">'+esc(((last&&last.text)||"").slice(0,110))+'</span></div>'}).join(""):'<div class="ip-empty">Nothing here yet.</div>';
  p.innerHTML=header("Library",0,'<button class="ip-circ" data-new type="button" aria-label="New chat">'+IC.compose+'</button>')+'<div class="ip-b"><div class="ip-w"><div class="ip-chips">'+[["suggested","Suggested"],["favorites","Favorites"],["images","Images"],["all","All"]].map(function(t){return'<button class="ip-chip'+(tab===t[0]&&!q?" on":"")+'" data-t="'+t[0]+'">'+t[1]+'</button>'}).join("")+'</div>'+body+'</div></div>'+
   '<div class="ip-bar"><form><input id="ipLq" placeholder="Search" value="'+esc(q)+'" dir="auto" autocomplete="off"><button type="submit" aria-label="Search">'+IC.search+'</button></form></div>';
  menuBtn(p);
  p.onclick=function(e){
   if(e.target.closest("[data-new]")){startChat("");return}
   var c=e.target.closest("[data-t]");if(c){PAGES.library(p,{tab:c.dataset.t});return}
   var it=e.target.closest("[data-c]");if(it)openChatById(it.dataset.c);
  };
  $("form",p).onsubmit=function(e){e.preventDefault();PAGES.library(p,{q:$("#ipLq").value.trim(),tab:tab})};
  if(o.focus)setTimeout(function(){var i=$("#ipLq");i&&i.focus()},80);
 },
 customize:function(p){
  var sk=window.XMM_SKILLS||{},n=Object.keys(sk).filter(function(k){return sk[k]}).length;
  p.innerHTML=header("Customize")+'<div class="ip-b"><div class="ip-w">'+
   '<div class="ip-grp"><button class="ip-row" data-go="plugins">'+IC.plug+'<span class="t">Plugins</span><span class="v">'+n+' on</span>'+IC.chev.replace("<svg",'<svg class="ch"')+'</button>'+
   '<button class="ip-row" data-go="memory">'+IC.brain+'<span class="t">Memory</span>'+IC.chev.replace("<svg",'<svg class="ch"')+'</button>'+
   '<button class="ip-row" data-go="persona">'+IC.face+'<span class="t">Personality</span><span class="v">'+esc(personaName())+'</span>'+IC.chev.replace("<svg",'<svg class="ch"')+'</button></div>'+
   '<div class="ip-grp"><button class="ip-row" data-go="name">'+IC.person+'<span class="t">Your name</span><span class="v">'+esc(String(ld("xmm.name","")||"Not set"))+'</span>'+IC.chev.replace("<svg",'<svg class="ch"')+'</button>'+
   '<button class="ip-row" data-go="lang">'+IC.globe+'<span class="t">Language</span><span class="v">'+esc(langName())+'</span>'+IC.chev.replace("<svg",'<svg class="ch"')+'</button></div>'+
   '</div></div>';
  menuBtn(p);
  p.onclick=function(e){var g=e.target.closest("[data-go]");if(g){stack.push("customize");openPage(g.dataset.go,{sub:1})}};
 },
 plugins:function(p,o){
  var SK=[["web","Web browsing","Let chat open websites you mention."],["image","Image creation","Make images from a chat description."],["code","Code agent","Write and fix code in the Code tab."],["voice","Voice","Talk and listen hands-free."],["notes","Notes and projects","Save notes and group your chats."],["memory","Use AI memory","Apply what you saved under Memory."],["translate","Auto-translate","Reply in the language you write in."],["summary","Chat summaries","Short summaries of long chats."]];
  var sk=window.XMM_SKILLS=window.XMM_SKILLS||{};
  p.innerHTML=header("Plugins",o.sub?"back":"menu")+'<div class="ip-b"><div class="ip-w"><div class="ip-lbl">Installed</div><div class="ip-grp">'+SK.map(function(s){return'<div class="ip-row" style="cursor:default">'+IC.plug+'<span class="t">'+s[1]+'<small>'+s[2]+'</small></span><button class="ip-sw'+(sk[s[0]]!==false?" on":"")+'" data-k="'+s[0]+'" type="button" aria-label="'+s[1]+'"></button></div>'}).join("")+'</div></div></div>';
  menuBtn(p);
  p.onclick=function(e){var b=e.target.closest("[data-k]");if(!b)return;var k=b.dataset.k,on=!b.classList.contains("on");b.classList.toggle("on",on);sk[k]=on;var s=ld("xmm.skills",{});s[k]=on;sv("xmm.skills",s)};
 },
 memory:function(p,o){
  p.innerHTML=header("Memory","back")+'<div class="ip-b"><div class="ip-w"><div class="ip-lbl">What XMM AI should always remember about you</div><textarea class="ip-in" id="ipMem" maxlength="2000" placeholder="e.g. I am a developer. I prefer short answers." dir="auto">'+esc(memText())+'</textarea><div class="ip-lbl">Used in every chat while the Memory plugin is on. Saved automatically.</div></div></div>';
  menuBtn(p);
  $("#ipMem").oninput=function(){setMem(this.value)};
 },
 persona:function(p){
  var cur=personaKey();
  p.innerHTML=header("Personality","back")+'<div class="ip-b"><div class="ip-w"><div class="ip-grp">'+Object.keys(PERSONAS).map(function(k){return'<button class="ip-row ip-opt'+(k===cur?" on":"")+'" data-k="'+k+'"><span class="t">'+PERSONAS[k][0]+'<small>'+PERSONAS[k][1]+'</small></span>'+IC.check.replace("<svg",'<svg class="ck"')+'</button>'}).join("")+'</div></div></div>';
  menuBtn(p);
  p.onclick=function(e){var b=e.target.closest("[data-k]");if(!b)return;setPersona(b.dataset.k);PAGES.persona(p)};
 },
 name:function(p){
  p.innerHTML=header("Your name","back")+'<div class="ip-b"><div class="ip-w"><input class="ip-in" id="ipNm" maxlength="40" value="'+esc(String(ld("xmm.name","")||""))+'" placeholder="Your name" dir="auto"></div></div>';
  menuBtn(p);$("#ipNm").oninput=function(){try{API().setName(this.value)}catch(e){}}
 },
 lang:function(p){
  var L=[["de","Deutsch"],["en","English"],["fa","فارسی"],["ar","العربية"],["es","Español"]],c=langCode();
  p.innerHTML=header("Language","back")+'<div class="ip-b"><div class="ip-w"><div class="ip-grp">'+L.map(function(l){return'<button class="ip-row ip-opt'+(l[0]===c?" on":"")+'" data-k="'+l[0]+'"><span class="t">'+l[1]+'</span>'+IC.check.replace("<svg",'<svg class="ck"')+'</button>'}).join("")+'</div></div></div>';
  menuBtn(p);
  p.onclick=function(e){var b=e.target.closest("[data-k]");if(!b)return;["setLang","topLang"].forEach(function(id){var s=document.getElementById(id);if(s){s.value=b.dataset.k;if(s.onchange)s.onchange();s.dispatchEvent(new Event("change",{bubbles:true}))}});PAGES.lang(p)};
 },
 explore:function(p){
  var G=[["Write","Draft an email to my landlord asking to fix the heating","Writing"],["Write","Rewrite this paragraph to sound clearer and shorter: ","Writing"],["Learn","Explain how black holes work like I'm 12","Learning"],["Learn","Quiz me on world capitals, one question at a time","Learning"],["Code","Write a Python script that renames all files in a folder by date","Coding"],["Code","Explain this error and how to fix it: ","Coding"],["Plan","Plan a 3-day trip to Istanbul with a relaxed pace","Planning"],["Plan","Make me a weekly workout plan for beginners","Planning"],["Create","make image of a cozy cabin in a snowy forest at night","Images"],["Create","Write a short bedtime story about a brave little robot","Creative"],["Think","Help me decide between two job offers: ","Decisions"],["Think","Give me 10 startup ideas for students","Ideas"]];
  p.innerHTML=header("Explore")+'<div class="ip-b"><div class="ip-w">'+G.map(function(g,i){return'<div class="ip-card" data-i="'+i+'"><b>'+g[2]+'</b><span dir="auto">'+esc(g[1])+'</span></div>'}).join("")+'</div></div>';
  menuBtn(p);
  p.onclick=function(e){var c=e.target.closest("[data-i]");if(!c)return;var g=G[+c.dataset.i];startChat(g[1],!/: $|: ?$| $/.test(g[1]))};
 }
};
function langCode(){try{return localStorage.getItem("xmm.lang")||"en"}catch(e){return"en"}}
function langName(){return({de:"Deutsch",en:"English",fa:"فارسی",ar:"العربية",es:"Español"})[langCode()]||"English"}

/* personality + memory (style line is kept inside xmm.mem, which the chat engine already reads) */
var PERSONAS={default:["Default","Balanced and helpful",""],friendly:["Friendly","Warm, upbeat and encouraging","Be warm, friendly and encouraging."],professional:["Professional","Polished and precise","Use a polished, professional tone."],concise:["Concise","Short and direct","Keep answers short and direct; no filler."],candid:["Candid","Direct and honest","Be direct and candid; say what you really think."],quirky:["Quirky","Playful and imaginative","Be playful and a little quirky."],nerdy:["Nerdy","Curious and detailed","Be curious and nerdy; explain the details."]};
var PRE="Response style:";
function rawMem(){return String(ld("xmm.mem","")||"")}
function memText(){return rawMem().split("\n").filter(function(l){return l.indexOf(PRE)!==0}).join("\n")}
function personaKey(){var l=rawMem().split("\n").filter(function(l){return l.indexOf(PRE)===0})[0];if(!l)return"default";for(var k in PERSONAS)if(PERSONAS[k][2]&&l.indexOf(PERSONAS[k][2])>-1)return k;return"default"}
function personaName(){return PERSONAS[personaKey()][0]}
function writeMem(t,pk){var s=PERSONAS[pk][2];sv("xmm.mem",(s?PRE+" "+s+"\n":"")+t)}
function setMem(t){writeMem(t,personaKey())}
function setPersona(k){writeMem(memText(),k)}

/* ============ scheduler ============ */
function tickSched(){
 var L=ld("xmm.ip.sched",[]),now=Date.now(),ch=false,due=[];
 L=L.filter(function(s){
  if(s.at>now)return true;
  due.push(s);ch=true;
  if(s.rep==="daily"){s.at+=864e5*Math.max(1,Math.ceil((now-s.at)/864e5));return true}
  if(s.rep==="weekly"){s.at+=6048e5*Math.max(1,Math.ceil((now-s.at)/6048e5));return true}
  return false;
 });
 if(!ch)return;sv("xmm.ip.sched",L);
 due.forEach(function(s,i){
  try{if("Notification" in window&&Notification.permission==="granted")new Notification("XMM AI",{body:s.text})}catch(_){}
  if(i===0){try{API().newChat()}catch(_){}setTimeout(function(){try{API().send(s.text)}catch(_){}},120)}
 });
 if(PAGE==="scheduled")PAGES.scheduled(pageEl);
}

/* ============ feedback card + settings extras ============ */
function feedback(){
 var msgs=$("#msgs");if(!msgs)return;
 var last=msgs.lastElementChild;
 var old=$(".ip-fb",msgs);
 if(!last||!last.classList.contains("m-bot")||!$(".m-acts",last)||(API().S&&API().S.busy)){if(old&&(!last||last!==old))old.remove();return}
 if(old&&old.previousElementSibling===last)return;if(old)old.remove();
 var f=el("div","ip-fb",'<span>How was this conversation?</span><div><button data-v="-1" aria-label="Bad">'+IC.dn+'</button><button data-v="1" aria-label="Good">'+IC.up+'</button></div>');
 f.onclick=function(e){var b=e.target.closest("button");if(!b)return;var v=+b.dataset.v;try{var c=API().cur();var m=c.msgs[c.msgs.length-1];m.liked=v;localStorage.setItem("xmm.chats",JSON.stringify(API().S.chats))}catch(_){}f.classList.add("done");toast("Thanks for the feedback")};
 msgs.appendChild(f);
}
function settingsExtras(){
 var sb=$("#clSet .cl-sb");if(!sb||$(".ip-x",sb)||!$(".cl-prof",sb))return;
 var d=el("div","cl-grp ip-x",'<button class="cl-row" type="button" data-ipx="cust">'+IC.cust+'<span class="rt">Customize XMM AI<small>Personality, memory, plugins and more</small></span></button><button class="cl-row" type="button" data-ipx="export">'+IC.dl+'<span class="rt">Export chats<small>Download all your chats as a file</small></span></button><button class="cl-row" type="button" data-ipx="sched">'+IC.sched+'<span class="rt">Scheduled prompts</span></button>');
 var prof=$(".cl-prof",sb);prof.parentNode.insertBefore(d,prof.nextSibling);
 d.onclick=function(e){var b=e.target.closest("[data-ipx]");if(!b)return;var k=b.dataset.ipx;
  if(k==="export"){var blob=new Blob([JSON.stringify(ld("xmm.chats",[]),null,2)],{type:"application/json"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="xmm-ai-chats.json";document.body.appendChild(a);a.click();a.remove();return}
  var cl=$("#clSet .cl-b");if(cl)cl.click();setTimeout(function(){openPage(k==="cust"?"customize":"scheduled")},250)};
}

/* ============ settings (new UI) ============ */
var SET=null,sStack=[];
function hapOn(){return ld("xmm.cl.hap",true)!==false}
function R(icon,t,sub,val,go,cls){return'<button class="ip-row '+(cls||"")+'" data-g="'+go+'" type="button">'+icon+'<span class="t">'+t+(sub?'<small>'+sub+'</small>':"")+'</span>'+(val?'<span class="v">'+val+'</span>':"")+(cls==="dg"?"":IC.chev.replace("<svg",'<svg class="ch"'))+'</button>'}
function SW(icon,t,sub,key,on){return'<div class="ip-row" style="cursor:default">'+icon+'<span class="t">'+t+(sub?'<small>'+sub+'</small>':"")+'</span><button class="ip-sw'+(on?" on":"")+'" data-sw="'+key+'" type="button" aria-label="'+t+'"></button></div>'}
var SP={
 root:function(){var n=String(ld("xmm.name","")||"").trim()||"XMM User";
  return'<div class="ip-grp"><button class="ip-row" data-g="account" type="button"><span class="ip-av">'+esc(n.charAt(0).toUpperCase())+'</span><span class="t">'+esc(n)+'<small>Account</small></span>'+IC.chev.replace("<svg",'<svg class="ch"')+'</button></div>'+
  '<div class="ip-grp"><button class="ip-row" data-g="customize" type="button">'+IC.cust+'<span class="t">Customize XMM AI<small>Personality, memory, plugins and more</small></span>'+IC.chev.replace("<svg",'<svg class="ch"')+'</button></div>'+
  '<div class="ip-grp">'+R(IC.cust,"General","","","general")+R(IC.globe,"Voice","","","voice")+R(IC.shield,"Privacy and security","","","privacy")+R(IC.files,"Storage","","","storage")+R(IC.dl,"Data controls","","","data")+'</div>'+
  '<div class="ip-grp">'+R(IC.plus,"Install app","","","install")+R(IC.person,"About","","","about")+'</div>'+
  '<div class="ip-grp">'+R(IC.x,"Log out","","","logout","dg")+'</div>'},
 account:function(){return'<div class="ip-lbl">Name</div><input class="ip-in" id="ipNm2" maxlength="40" value="'+esc(String(ld("xmm.name","")||""))+'" placeholder="Your name" dir="auto">'},
 general:function(){var l=ld("xmm.cl.links","tab");return'<div class="ip-grp">'+R(IC.globe,"Language","",esc(langName()),"lang")+SW(IC.sched,"Haptic feedback","","hap",hapOn())+'<div class="ip-row" style="cursor:default">'+IC.globe2+'<span class="t">Open links in</span><select id="ipLinks" class="ip-in" style="width:auto;margin:0;padding:8px 10px"><option value="tab"'+(l==="tab"?" selected":"")+'>New tab</option><option value="same"'+(l==="same"?" selected":"")+'>This tab</option></select></div></div>'},
 notif:function(){var p="Notification" in window?Notification.permission:"denied",on=ld("xmm.cl.notif","")==="yes"&&p==="granted";return'<div class="ip-grp">'+SW(IC.sched,"Response notifications","Get notified when XMM AI finishes a reply while you are away.","notif",on)+'</div>'+(p==="denied"?'<div class="ip-lbl">Notifications are blocked for this site. Allow them in your browser settings.</div>':"")},
 voice:function(){return'<div class="ip-grp">'+R(IC.globe,"Voice language","Voice mode and dictation use this language.",esc(langName()),"lang")+'</div>'},
 privacy:function(){return'<div class="ip-grp">'+R(IC.shield,"Privacy policy","","","l:/privacy")+R(IC.files,"Terms of Service","","","l:/terms")+R(IC.person,"Support","","","l:/support")+'</div>'},
 storage:function(){var n=(ld("xmm.chats",[])||[]).length,kb=0;try{kb=Math.round((localStorage.getItem("xmm.chats")||"").length/1024)}catch(e){}return'<div class="ip-grp"><div class="ip-row" style="cursor:default">'+IC.files+'<span class="t">Chats on this device<small>'+n+' chats · about '+kb+' KB</small></span></div></div><div class="ip-grp">'+R(IC.trash,"Delete all chats","","","clear","dg")+'</div>'},
 data:function(){return'<div class="ip-grp">'+R(IC.dl,"Export chats","Download all chats as a file","","export")+R(IC.trash,"Delete all chats","","","clear","dg")+'</div>'},
 about:function(){return'<div class="ip-grp"><div class="ip-row" style="cursor:default"><img src="icon.svg?v=gpu6" width="36" height="36" style="border-radius:10px" alt=""><span class="t">XMM AI<small>by XMM Bayat · v117</small></span></div></div><div class="ip-lbl" style="text-align:center">© XMMAI. All rights reserved.</div>'},
 lang:function(){var L=[["de","Deutsch"],["en","English"],["fa","فارسی"],["ar","العربية"],["es","Español"]],c=langCode();return'<div class="ip-grp">'+L.map(function(l){return'<button class="ip-row ip-opt'+(l[0]===c?" on":"")+'" data-lg="'+l[0]+'"><span class="t">'+l[1]+'</span>'+IC.check.replace("<svg",'<svg class="ck"')+'</button>'}).join("")+'</div>'}
};
var STT={root:"Settings",account:"Account",general:"General",notif:"Notifications",voice:"Voice",privacy:"Privacy and security",storage:"Storage",data:"Data controls",about:"About",lang:"Language"};
function showSet(pg){
 if(!SET)return;SET.page=pg;
 SET.innerHTML='<div class="ip-h"><button class="ip-circ" data-b type="button" aria-label="Back">'+(pg==="root"?IC.x:IC.chev.replace("<svg",'<svg style="transform:rotate(180deg)"'))+'</button><h2>'+STT[pg]+'</h2><span></span></div><div class="ip-b"><div class="ip-w">'+SP[pg]()+'</div></div>';
}
function closeSet(){if(SET){SET.remove();SET=null}}
function openSet(){
 closeSet();if(innerWidth<700)B.classList.remove("cl-drawer");sStack=[];
 SET=el("div");SET.id="ipSet";document.body.appendChild(SET);showSet("root");
 SET.addEventListener("click",function(e){
  if(e.target.closest("[data-b]")){if(SET.page==="root")closeSet();else showSet(sStack.pop()||"root");return}
  var lg=e.target.closest("[data-lg]");if(lg){["setLang","topLang"].forEach(function(id){var s=document.getElementById(id);if(s){s.value=lg.dataset.lg;if(s.onchange)s.onchange();s.dispatchEvent(new Event("change",{bubbles:true}))}});showSet("lang");return}
  var sw=e.target.closest("[data-sw]");if(sw){var k=sw.dataset.sw,on=!sw.classList.contains("on");
   if(k==="hap"){sv("xmm.cl.hap",on);sw.classList.toggle("on",on)}
   else if(k==="notif"){if(!on){sv("xmm.cl.notif","no");sw.classList.remove("on")}else if(!("Notification" in window))toast("Notifications not supported here");else Notification.requestPermission().then(function(p){sv("xmm.cl.notif",p==="granted"?"yes":"no");showSet("notif")})}
   return}
  var g=e.target.closest("[data-g]");if(!g)return;var k=g.dataset.g;
  if(k==="customize"){closeSet();openPage("customize");return}
  if(k==="install"){var ib=$('[data-act="install"]');closeSet();if(ib)setTimeout(function(){ib.click()},200);return}
  if(k==="logout"){var lo=$("#logout");if(lo)lo.click();return}
  if(k==="clear"){var cl=$("#clearAll");if(cl)cl.click();return}
  if(k==="export"){var blob=new Blob([JSON.stringify(ld("xmm.chats",[]),null,2)],{type:"application/json"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="xmm-ai-chats.json";document.body.appendChild(a);a.click();a.remove();return}
  if(k.indexOf("l:")===0){window.open(k.slice(2),"_blank","noopener");return}
  sStack.push(SET.page);showSet(k);
 });
 SET.addEventListener("input",function(e){if(e.target.id==="ipNm2"){try{API().setName(e.target.value)}catch(_){}}});
 SET.addEventListener("change",function(e){if(e.target.id==="ipLinks")sv("xmm.cl.links",e.target.value)});
}
/* replace the old settings sheet with the new one */
new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.id==="clSet"){n.remove();var bg=document.getElementById("clSetBg");if(bg)bg.remove();openSet()}})})}).observe(document.body,{childList:true});
window.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("#clAv")){e.stopImmediatePropagation();e.preventDefault();openSet()}},true);

/* ============ voice screen (video style) ============ */
function voiceUI(){
 var v=$("#clVoice");if(!v||v.__ip)return;var bar=$(".cl-vbar",v),x=$("#cvX",v),mic=$("#cvMic",v),plus=$("#cvPlus",v),spk=$("#cvSpk",v);if(!bar||!x||!mic||!plus)return;v.__ip=1;
 var pill=el("div","ip-vpill");pill.appendChild(plus);pill.appendChild(el("span","ip-vph","Ask XMM AI"));if(spk)pill.appendChild(spk);pill.appendChild(mic);
 bar.insertBefore(pill,bar.firstChild);
}
/* ============ boot ============ */
function boot(){
 B.classList.add("ip");
 var tries=0,iv=setInterval(function(){
  tries++;
  var a=buildDrawer(),b=buildTop();buildSug();
  if((a&&b)||tries>60){clearInterval(iv);
   setInterval(function(){syncModel();splitPins();settingsExtras();voiceUI();var av=$("#clAv");if(av){var l=(String(ld("xmm.name","")||"X").trim().charAt(0)||"X").toUpperCase();if(av.textContent!==l)av.textContent=l}},500);
   setInterval(tickSched,15000);tickSched();
  }
 },150);
 var nm=$("#clNew");
 document.addEventListener("click",function(e){if(e.target.closest("#clNew,#clNc")&&PAGE)closePage()},true);
 /* opening a chat from the drawer closes any page */
 document.addEventListener("click",function(e){if(PAGE&&e.target.closest(".cl-ci"))closePage()},true);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
