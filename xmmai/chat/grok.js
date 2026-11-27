(function(){
"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
var I=function(p,w){return '<svg viewBox="0 0 24 24" width="'+(w||20)+'" height="'+(w||20)+'" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'};
var IC={
 panel:I('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/>'),
 panelR:I('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M15 4v16"/>'),
 search:I('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>'),
 img:I('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/>'),
 lib:I('<path d="M5 20 9 4M11 5v15M15 5v15M19 5v15"/>'),
 plus:I('<path d="M12 5v14M5 12h14"/>'),
 code:I('<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>'),
 layers:I('<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>'),
 bot:I('<circle cx="12" cy="12" r="8.5"/><circle cx="14.5" cy="9.8" r="1.1" fill="currentColor"/>'),
 priv:'<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-dasharray="3.2 3.2"><circle cx="12" cy="12" r="9"/></svg>',
 mic:I('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',19),
 gear:I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>'),
 menu:I('<path d="M4 7h16M4 12h16M4 17h10"/>'),
 grid:I('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M17 13.5v7M13.5 17h7"/>',20),
 wave:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#4da3ff" stroke-width="2" stroke-linecap="round"><path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/></svg>'
};
function el(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function btn(c,h,attrs){var b=el("button",c,h);b.type="button";for(var k in(attrs||{}))b.setAttribute(k,attrs[k]);return b}
function api(){return window.XMM_API||{}}
function prefill(t){
 var a=api();if(a.newChat)a.newChat();var m=$("#msg");if(!m)return;
 var sc=$("#scrim");if(sc&&sc.classList.contains("on"))sc.click();
 m.value=t;m.dispatchEvent(new Event("input",{bubbles:true}));m.focus();try{m.setSelectionRange(t.length,t.length)}catch(e){}}
function uname(){try{var n=String(JSON.parse(localStorage.getItem("xmm.name")||'""')||"").trim();return n||"XMM User"}catch(e){return"XMM User"}}
function closeSide(){var sc=$("#scrim");if(sc&&sc.classList.contains("on"))sc.click()}
function goBuild(){var vc=$("#viewChat");if(vc&&vc.hidden){var n=$('#chatNav [data-k="newchat"]');if(n)n.click()}var b=$('.vseg button[data-v="build"]')||$('#seg [data-m="code"]');if(b)b.click();closeSide();var m=$("#msg");if(m)setTimeout(function(){try{m.focus()}catch(e){}},350)}
function fabs(){if($("#gFabM"))return;
 document.body.appendChild(btn("g-fab g-fabS",IC.gear,{id:"gFabS","data-act":"settings","aria-label":"Settings"}));
 document.body.appendChild(btn("g-fab g-fabM",IC.menu,{id:"gFabM","data-act":"openDrawer","aria-label":"Menu"}));
 document.body.appendChild(btn("g-fab g-fabD",IC.panel,{id:"gFabD","data-act":"toggleSide","aria-label":"Open sidebar"}))}
function build(){fabs();
 var side=$("#sideChat");if(!side||side.dataset.g)return;side.dataset.g="1";
 var cl=$("#chatList"),cs=$("#codeSec"),ss=$("#sideSearch"),sl=ss&&ss.closest("label");
 var top=el("div","g-keep g-top");
 top.appendChild(btn("g-ib g-colD",IC.panel,{"data-act":"toggleSide","aria-label":"Collapse sidebar"}));
 top.appendChild(btn("g-ib g-colM",IC.panel,{"data-act":"closeDrawer","aria-label":"Close"}));
 var sb=btn("g-ib",IC.search,{"aria-label":"Search chats"});top.appendChild(sb);
 side.appendChild(top);
 var sw=el("div","g-keep g-search");sw.hidden=true;if(sl)sw.appendChild(sl);side.appendChild(sw);
 sb.onclick=function(){sw.hidden=!sw.hidden;if(!sw.hidden&&ss)ss.focus()};
 var nc=btn("g-keep g-new",'<span class="g-plus">'+I('<path d="M12 6v12M6 12h12"/>',14)+'</span>New chat',{"data-act":"newchat"});nc.addEventListener("click",function(){if(document.body.classList.contains("v-build")){var a=$('.vseg button[data-v="ask"]');if(a)a.click()}});side.appendChild(nc);
 var nav=el("div","g-keep g-nav");
 side.appendChild(nav);
 side.appendChild(el("div","g-keep g-sec","Chats"));
 if(cl){cl.classList.add("g-keep");side.appendChild(cl)}
 var more=btn("g-keep g-more","Show more");more.onclick=function(){side.classList.toggle("g-all");more.textContent=side.classList.contains("g-all")?"Show less":"Show more"};side.appendChild(more);
 if(cs){cs.classList.add("g-keep");side.appendChild(cs)}
 var bt=el("div","g-keep g-bottom");
 var u=btn("g-user",'<span class="g-av"></span><span class="g-un"></span>',{"data-act":"settings"});bt.appendChild(u);
 side.appendChild(bt);
 /* top bar */
 var tb=$("#mainChat > .topbar");
 if(tb&&!$(".g-tb",tb)){
  var g=el("div","g-tb");
  g.appendChild(btn("g-ib g-menu",IC.menu,{"data-act":"openDrawer","aria-label":"Menu"}));
  g.appendChild(btn("g-ib g-open",IC.panel,{"data-act":"toggleSide","aria-label":"Open sidebar"}));
  g.appendChild(el("span","g-sp"));
  g.appendChild(btn("g-ib g-dmo",IC.panelR,{"data-act":"settings","aria-label":"Settings"}));
  tb.appendChild(g)}
 /* home list */
 var v=$("#viewChat");
 if(v&&!$(".g-sug",v)){
  var l=el("div","g-sug");
  [[IC.img,"Create an image","make image of "],[IC.code,"Make a website","make a website for "],[IC.layers,"Design a presentation","design a presentation about "]].forEach(function(p){
   var b=btn("g-srow",p[0]+"<span>"+p[1]+"</span>");b.onclick=function(){var m=$("#msg");if(!m)return;m.value=p[2];m.dispatchEvent(new Event("input",{bubbles:true}));m.focus()};l.appendChild(b)});
  v.appendChild(l)}
 /* composer extras */
 var c=$(".composer"),send=$("#sendBtn");
 if(c&&send&&!$("#gMic")){
  var mic=btn("g-ib g-mic",IC.mic,{id:"gMic","aria-label":"Dictate"});
  var wv=btn("g-ib g-wave",IC.wave,{id:"gWave","aria-label":"Voice mode"});
  var sp=send.parentNode||c;sp.insertBefore(mic,send);sp.insertBefore(wv,send);
  wv.onclick=function(){if(window.XMM_VOICE)XMM_VOICE.open()};
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null;
  mic.onclick=function(){
   if(!SR){if(api().toast)api().toast("no mic on this browser");return}
   if(rec){rec.stop();return}
   rec=new SR();rec.interimResults=false;rec.lang=navigator.language||"en-US";mic.classList.add("on");
   rec.onresult=function(e){var t="";for(var i=e.resultIndex;i<e.results.length;i++)t+=e.results[i][0].transcript;var m=$("#msg");m.value=(m.value?m.value+" ":"")+t.trim();m.dispatchEvent(new Event("input",{bubbles:true}))};
   rec.onend=function(){rec=null;mic.classList.remove("on")};rec.onerror=function(){};try{rec.start()}catch(e){rec=null;mic.classList.remove("on")}}}
}
function tick(){
 var m=$("#msg"),c=$(".composer"),s=$("#sendBtn");
 if(m&&c&&s){var busy=s.classList.contains("is-busy"),has=!!(m.value.trim()||($("#atts")&&$("#atts").children.length));
  c.dataset.has=(busy||has)?"1":"0";
  phPos();var fs=$("#gFabS"),st=$("#settings");if(fs)fs.style.visibility=(st&&!st.hidden)?"hidden":""}
 var n=document.querySelector(".g-un");if(n){var t=uname();if(n.textContent!==t){n.textContent=t;var a=document.querySelector(".g-av");if(a)a.textContent=t.charAt(0).toUpperCase()}}
 var side=$("#sideChat"),more=$(".g-more");if(side&&more){var cnt=side.querySelectorAll("#chatList .chat-i").length;more.style.display=cnt>5?"":"none"}
}
document.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&(e.key||"").toLowerCase()==="k"){var sw=$(".g-search");if(sw){sw.hidden=false}}},true);

var PH=["Ask anything","Tell me what to build"],pi=0;
function phInit(){var m=$("#msg");if(!m||m.__g)return;m.__g=1;var cur=PH[0],set=Element.prototype.setAttribute;
 try{Object.defineProperty(m,"placeholder",{get:function(){return cur},set:function(){},configurable:true})}catch(e){}
 m.setAttribute=function(k,v){if(String(k).toLowerCase()==="placeholder")return;return set.call(m,k,v)};
 set.call(m,"placeholder",cur);
 setInterval(function(){m.classList.add("g-phx");setTimeout(function(){pi=(pi+1)%PH.length;cur=PH[pi];set.call(m,"placeholder",cur);m.classList.remove("g-phx")},520)},3000)}
function phPos(){var s=$(".g-ph"),m=$("#msg");if(!s||!m)return;var cs=getComputedStyle(m),op=s.offsetParent||document.body,r=m.getBoundingClientRect(),o=op.getBoundingClientRect();
 s.style.left=(r.left-o.left+(op.scrollLeft||0)+parseFloat(cs.paddingLeft||0)+(parseFloat(cs.borderLeftWidth)||0))+"px";
 s.style.top=(r.top-o.top+(op.scrollTop||0)+parseFloat(cs.paddingTop||0)+(parseFloat(cs.borderTopWidth)||0))+"px";
 s.style.fontSize=cs.fontSize;s.style.fontFamily=cs.fontFamily;s.style.lineHeight=cs.lineHeight==="normal"?"1.4":cs.lineHeight;
 s.style.display=m.value?"none":"block"}
var EXT={html:"html",htm:"html",css:"css",js:"js",javascript:"js",jsx:"jsx",ts:"ts",typescript:"ts",tsx:"tsx",py:"py",python:"py",json:"json",sh:"sh",bash:"sh",shell:"sh",zsh:"sh",java:"java",c:"c",cpp:"cpp","c++":"cpp",cs:"cs",csharp:"cs",go:"go",rust:"rs",rs:"rs",php:"php",rb:"rb",ruby:"rb",sql:"sql",md:"md",markdown:"md",xml:"xml",yaml:"yaml",yml:"yml",kt:"kt",kotlin:"kt",swift:"swift",svg:"svg",lua:"lua",txt:"txt",text:"txt"};
var NAME={html:"index.html",css:"style.css",js:"script.js",py:"main.py",json:"data.json",sh:"run.sh"};
var KIND={html:"HTML",css:"CSS",js:"JavaScript",jsx:"React JSX",ts:"TypeScript",tsx:"React TSX",py:"Python",json:"JSON",sh:"Shell",java:"Java",c:"C",cpp:"C++",cs:"C#",go:"Go",rs:"Rust",php:"PHP",rb:"Ruby",sql:"SQL",md:"Markdown",xml:"XML",yaml:"YAML",yml:"YAML",kt:"Kotlin",swift:"Swift",svg:"SVG",lua:"Lua",txt:"Text"};
function detect(c){var t=c.trim().slice(0,400).toLowerCase();
 if(/^<!doctype html|^<html/.test(t))return"html";if(/^<svg/.test(t))return"svg";
 if(/^[\[{]/.test(t)){try{JSON.parse(c);return"json"}catch(e){}}
 if(/^#include/.test(t))return"cpp";if(/^(def |import |from \w+ import |class \w+.*:)/m.test(t))return"py";
 if(/(^|\n)\s*(const|let|var|function|document\.|console\.)/.test(t))return"js";
 if(/^[.#a-z][^{]*\{[^}]*:/.test(t))return"css";if(/^#!.*(sh|bash)/.test(t))return"sh";return"txt"}
function fmtSize(n){return n<1024?n+" B":(n/1024).toFixed(1)+" KB"}
function dl(name,code,ext){var b=new Blob([code],{type:ext==="html"?"text/html":"text/plain"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);if(api().toast)api().toast("Downloading "+name)}
var FI=I('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9.5 13l-2 2 2 2M14.5 13l2 2-2 2"/>',22);
var DI=I('<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',16);
function cards(){
 var box=$("#msgs");if(!box)return;
 [].forEach.call(box.querySelectorAll(".m-bot .xw-code,.m-bot pre"),function(n){
  if(n.closest(".g-file"))return;
  var pre=n.tagName==="PRE"?n:n.querySelector("pre");if(n.tagName==="PRE"&&n.closest(".xw-code"))return;if(!pre)return;
  var code=pre.textContent||"";if(!code.trim())return;
  var lab=n.querySelector&&n.querySelector(".xw-ch span");var l=(lab?lab.textContent:"").trim().toLowerCase();
  var ext=EXT[l]||detect(code);
  var msg=n.closest(".m-bot");var used=(msg.dataset.gn||"").split("|");
  var base=NAME[ext]||("code."+ext),name=base,k=2;while(used.indexOf(name)>-1){var d=base.lastIndexOf(".");name=base.slice(0,d)+"-"+k+base.slice(d);k++}
  used.push(name);msg.dataset.gn=used.join("|");try{var _R=window.__xmmChatFiles=window.__xmmChatFiles||{};_R[(msg.dataset.i||"")+"|"+name]={i:msg.dataset.i,name:name,code:code}}catch(_){}
  var c=el("div","g-file",'<div class="g-fi">'+FI+'</div><div class="g-fm"><b></b><span>'+(KIND[ext]||"File")+" · "+fmtSize(new Blob([code]).size)+'</span></div><span class="g-fd">'+DI+'Download</span>');
  c.querySelector("b").textContent=name;c.tabIndex=0;c.setAttribute("role","button");
  var go=function(){dl(name,code,ext)};c.onclick=go;c.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}};
  n.replaceWith(c)})}
var gr=0;function gsched(){if(gr)return;gr=requestAnimationFrame(function(){gr=0;try{cards()}catch(e){}})}
function placeGear(){try{var g=$("#gFabS"),r=$(".vtop .vright");if(g&&r&&g.parentNode!==r&&matchMedia("(max-width:899px)").matches)r.insertBefore(g,r.firstChild)}catch(e){}}
function init(){build();phInit();tick();placeGear();setInterval(placeGear,400);setInterval(tick,400);var box=$("#msgs");if(box){new MutationObserver(gsched).observe(box,{childList:true,subtree:true});gsched()}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(init,500)});else setTimeout(init,500);
})();
