/* XMM AI desktop integration. Runs everywhere, but only does work inside the real desktop app (window.xmmDesktop from preload) or an installed PWA. */
(function(){
"use strict";
var D=window.xmmDesktop||null;
var ua=navigator.userAgent||"";
var sa=false;try{sa=matchMedia("(display-mode: standalone)").matches||!!navigator.standalone}catch(e){}
window.XMM_APP=!!D||/XMMAI-Desktop/.test(ua)||sa;
function css(t){var s=document.createElement("style");s.textContent=t;(document.head||document.documentElement).appendChild(s)}
if(window.XMM_APP)css('[data-act="install"],#installBanner,#installGuide,#v3Dev,#v3Ins{display:none!important}');
if(!D)return;
window.xmmDesktop=D;
var LS=window.localStorage;
function get(k){try{return LS.getItem(k)||""}catch(e){return ""}}
function set(k,v){try{LS.setItem(k,v)}catch(e){}}
function toast(t){try{var x=document.createElement("div");x.className="xd-toast";x.textContent=t;document.body.appendChild(x);setTimeout(function(){x.classList.add("out");setTimeout(function(){x.remove()},400)},3200)}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

css('.xd-toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#1f1f24;color:#fff;border:1px solid rgba(255,255,255,.14);padding:10px 16px;border-radius:12px;font:14px system-ui,sans-serif;z-index:2147483000;transition:opacity .4s}.xd-toast.out{opacity:0}'+
'#pcBtn{display:inline-flex;align-items:center;gap:7px}#pcBtn i{width:8px;height:8px;border-radius:50%;background:#7a7a84;flex:none}#pcBtn[data-m="ask"] i{background:#f5a524}#pcBtn[data-m="free"] i{background:#ff453a;box-shadow:0 0 8px #ff453a}'+
'.xd-pop{position:fixed;z-index:2147482000;min-width:260px;background:#1c1c21;color:#f2f2f5;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:6px;box-shadow:0 18px 50px rgba(0,0,0,.55);font:14px system-ui,sans-serif}'+
'.xd-pop button{display:block;width:100%;text-align:left;border:0;background:none;color:inherit;padding:10px 12px;border-radius:11px;cursor:pointer;font:inherit}.xd-pop button:hover{background:rgba(255,255,255,.08)}.xd-pop button b{display:block;font-weight:600}.xd-pop button span{display:block;font-size:12px;color:#9a9aa4;margin-top:2px}.xd-pop button.on{background:rgba(124,92,255,.22)}'+
'.xd-bg{position:fixed;inset:0;z-index:2147481000;background:rgba(0,0,0,.6);display:grid;place-items:center;font:14px system-ui,sans-serif}.xd-box{width:min(560px,94vw);max-height:90vh;overflow:auto;background:#17171b;color:#f2f2f5;border:1px solid rgba(255,255,255,.12);border-radius:20px;padding:20px}'+
'.xd-box h3{margin:0 0 4px;font-size:19px}.xd-box p{margin:0 0 14px;color:#9a9aa4}.xd-m{display:flex;align-items:center;gap:12px;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;margin-bottom:8px}.xd-m div{flex:1;min-width:0}.xd-m b{display:block}.xd-m small{color:#9a9aa4}'+
'.xd-b{border:0;border-radius:10px;padding:8px 14px;background:#7c5cff;color:#fff;font:600 13px system-ui;cursor:pointer}.xd-b.g{background:rgba(255,255,255,.1)}.xd-b.r{background:rgba(255,69,58,.2);color:#ff6b61}.xd-b:disabled{opacity:.5;cursor:default}'+
'.xd-bar{height:6px;border-radius:3px;background:rgba(255,255,255,.1);margin-top:7px;overflow:hidden}.xd-bar i{display:block;height:100%;width:0;background:#7c5cff;transition:width .3s}.xd-row{display:flex;gap:8px;justify-content:space-between;align-items:center;margin:14px 0 4px}.xd-st{font-size:13px;color:#b9b9c2;margin-bottom:12px}');

/* ---------------- PC control ---------------- */
var pcMode="off",pcInfo={platform:D.platform,home:""};
D.pc.info().then(function(i){pcInfo=i||pcInfo});
D.pc.getMode().then(function(m){pcMode=m||"off";paintBtn()});
var LABEL={off:"Don't allow",ask:"Allow with permissions",free:"Allow with no limit"};
function paintBtn(){var b=document.getElementById("pcBtn");if(!b)return;b.dataset.m=pcMode;b.title="PC control: "+LABEL[pcMode]}
function closePop(){var p=document.querySelector(".xd-pop");if(p)p.remove()}
function openPop(b){
  if(document.querySelector(".xd-pop")){closePop();return}
  var r=b.getBoundingClientRect(),p=document.createElement("div");p.className="xd-pop";
  p.innerHTML=[["off","Don\u2019t allow","The AI cannot touch your computer."],["ask","Allow with permissions","You approve every action before it runs."],["free","Allow with no limit","Runs anything without asking: folders, terminal, apps."]].map(function(o){return'<button type="button" data-m="'+o[0]+'" class="'+(pcMode===o[0]?"on":"")+'"><b>'+o[1]+'</b><span>'+o[2]+'</span></button>'}).join("");
  document.body.appendChild(p);
  var w=p.offsetWidth,h=p.offsetHeight;p.style.left=Math.max(8,Math.min(innerWidth-w-8,r.right-w))+"px";p.style.top=Math.max(8,r.top-h-8)+"px";
  p.onclick=function(e){var t=e.target.closest("button");if(!t)return;var m=t.dataset.m;closePop();
    D.pc.setMode(m).then(function(res){pcMode=res||pcMode;paintBtn();toast("PC control: "+LABEL[pcMode])})};
  setTimeout(function(){document.addEventListener("mousedown",function f(e){if(!e.target.closest(".xd-pop")&&e.target.id!=="pcBtn"){closePop();document.removeEventListener("mousedown",f)}})},0)}
function addBtn(){
  if(document.getElementById("pcBtn"))return true;
  var mb=document.getElementById("modeBtn");if(!mb||!mb.parentNode)return false;
  var b=document.createElement("button");b.className="mode";b.id="pcBtn";b.type="button";b.innerHTML="<i></i><span>PC control</span>";
  b.onclick=function(e){e.preventDefault();e.stopPropagation();openPop(b)};
  mb.parentNode.insertBefore(b,mb);paintBtn();return true}
function boot(){if(!addBtn()){var n=0,t=setInterval(function(){if(addBtn()||++n>60)clearInterval(t)},300)}
  new MutationObserver(function(){if(!document.getElementById("pcBtn"))addBtn()}).observe(document.documentElement,{childList:true,subtree:true})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();

/* ---------------- action markers in AI replies ---------------- */
function sysNote(){
  return "PC CONTROL IS ON ("+(pcMode==="free"?"no limit":"asks the user before each action")+"). The user's computer runs "+pcInfo.platform+", home folder "+pcInfo.home+". "+
  "When the user asks you to do something on their computer, perform it by writing action markers, each on its own line, exactly in this form with the JSON on ONE line: [[PC:{\"action\":\"run\",\"command\":\"...\"}]]. "+
  "Actions: run {command} runs a terminal command; mkdir {path}; write {path,content}; read {path}; list {path}; open {target} opens an app name, file, folder or URL. "+
  "Use real paths (~ is the home folder). Only emit markers when the user asked for a computer action. The results come back in the next message starting with [PC result]; continue from them, and never say an action worked until the result confirms it. If an action was denied, say so.";}
var ex=0;
function runMarkers(text){
  var re=/\[\[PC:([\s\S]*?)\]\]/g,m,acts=[];
  while((m=re.exec(text))&&acts.length<6){try{acts.push(JSON.parse(m[1]))}catch(e){acts.push({action:"bad",raw:m[1]})}}
  if(!acts.length)return;
  var out=[];
  acts.reduce(function(p,a){return p.then(function(){return D.pc.exec(a).then(function(r){out.push({action:a.action,target:a.command||a.path||a.target||"",ok:!!(r&&r.ok),result:r&&(r.ok?r.output:r.error)})}).catch(function(e){out.push({action:a.action,ok:false,result:String(e&&e.message||e)})})})},Promise.resolve()).then(function(){
    var msg="[PC result]\n"+out.map(function(o,i){return(i+1)+". "+o.action+(o.target?" "+o.target:"")+" -> "+(o.ok?"OK":"FAILED")+(o.result?"\n"+String(o.result).slice(0,3500):"")}).join("\n");
    sendWhenFree(msg)})}
function sendWhenFree(msg,n){
  n=n||0;var sb=document.getElementById("sendBtn"),ta=document.getElementById("msg");
  if(!sb||!ta)return;
  if(sb.classList.contains("is-busy")&&n<80){setTimeout(function(){sendWhenFree(msg,n+1)},250);return}
  if(ta.value.trim()){if(n<80){setTimeout(function(){sendWhenFree(msg,n+1)},400);return}}
  if(++ex>12)return;
  var setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,"value").set;setter.call(ta,msg);ta.dispatchEvent(new Event("input",{bubbles:true}));
  setTimeout(function(){sb.click()},120)}
setInterval(function(){ex=Math.max(0,ex-1)},20000);

/* hide raw markers inside the chat */
var obsT=0;
function clean(){var box=document.getElementById("msgs");if(!box)return;
  var w=document.createTreeWalker(box,NodeFilter.SHOW_TEXT,null),n,list=[];
  while((n=w.nextNode()))if(n.nodeValue.indexOf("[[PC:")>=0)list.push(n);
  list.forEach(function(n){n.nodeValue=n.nodeValue.replace(/\[\[PC:([\s\S]*?)(\]\]|$)/g,function(_,j){var a={};try{a=JSON.parse(j)}catch(e){}return"\u2699 PC action: "+(a.action||"working")+" "+(a.command||a.path||a.target||"")})})}
new MutationObserver(function(){clearTimeout(obsT);obsT=setTimeout(clean,60)}).observe(document.documentElement,{childList:true,subtree:true,characterData:true});

/* ---------------- fetch bridge: local model + PC control ---------------- */
var _f=window.fetch.bind(window),ready=null;
function localOn(){return get("xmm.local.on")==="1"&&!!get("xmm.local.model")}
function ensureLocal(){if(!ready)ready=D.local.ensure().then(function(r){if(!r||!r.ok)ready=null;return r}).catch(function(){ready=null});return ready}
function tap(r){
  if(!r||!r.body||!r.ok)return r;
  var rd=r.body.getReader(),dec=new TextDecoder(),all="";
  var s=new ReadableStream({pull:function(c){return rd.read().then(function(x){
      if(x.done){c.close();var txt="";all.split("\n").forEach(function(l){if(l.indexOf("data:")!==0)return;var d=l.slice(5).trim();if(d==="[DONE]")return;try{var j=JSON.parse(d),t=j.choices[0].delta.content;if(t)txt+=t}catch(e){}});
        if(txt.indexOf("[[PC:")>=0)setTimeout(function(){runMarkers(txt)},400);return}
      all+=dec.decode(x.value,{stream:true});c.enqueue(x.value)})},cancel:function(){return rd.cancel()}});
  return new Response(s,{status:r.status,statusText:r.statusText,headers:r.headers})}
window.fetch=function(input,init){
  try{
    var url=typeof input==="string"?input:(input&&input.url)||"";
    if(init&&typeof init.body==="string"&&/^post$/i.test(init.method||"")&&init.body.charAt(0)==="{"&&/^https?:/.test(url)&&url.indexOf("/__ollama/")<0){
      var b=JSON.parse(init.body);
      if(b&&Array.isArray(b.messages)&&b.model){
        var pc=pcMode!=="off"&&b.stream===true,loc=localOn();
        if(pc){b.messages=b.messages.slice();b.messages.unshift({role:"system",content:sysNote()})}
        if(loc){url="/__ollama/v1/chat/completions";b.model=get("xmm.local.model");delete b.reasoning_effort}
        var ni=Object.assign({},init,{body:JSON.stringify(b)});
        var go=function(){return _f(url,ni)};
        var p=loc?ensureLocal().then(go):go();
        return pc?p.then(tap):p}}
  }catch(e){}
  return _f(input,init)};

/* ---------------- local model manager ---------------- */
var MODELS=[["qwen2.5:1.5b","Qwen 2.5 1.5B","About 1 GB. Fast, works on small computers."],["llama3.2:3b","Llama 3.2 3B","About 2 GB. Good balance."],["qwen2.5:7b","Qwen 2.5 7B","About 4.7 GB. Smarter, needs 8 GB RAM or more."],["qwen2.5-coder:7b","Qwen 2.5 Coder 7B","About 4.7 GB. Best for code."]];
var prog={};
D.local.onProgress(function(p){
  if(p.stage==="pull"&&p.name){prog[p.name]=p}
  var box=document.getElementById("xdLocal");if(!box)return;
  var st=box.querySelector(".xd-st");
  if(p.stage==="install"&&st)st.textContent=p.text||"Installing the local AI engine\u2026";
  if(p.stage==="pull"){var row=box.querySelector('[data-n="'+p.name+'"]');if(row){var bar=row.querySelector(".xd-bar i");if(bar)bar.style.width=(p.pct||0)+"%";var sm=row.querySelector("small");if(sm)sm.textContent=p.status||""}}
  if(p.stage==="done"){delete prog[p.name];render()}
  if(p.stage==="error"){delete prog[p.name];if(st)st.textContent="Error: "+p.text;render(p.text)}});
var info={models:[],installed:false,running:false};
function render(err){
  var box=document.getElementById("xdLocal");if(!box)return;
  var cur=get("xmm.local.model"),on=localOn();
  var have=info.models||[];
  var ids=MODELS.map(function(m){return m[0]});
  var extra=have.filter(function(h){return ids.indexOf(h)<0}).map(function(h){return[h,h,"Installed model."]});
  var rows=MODELS.concat(extra).map(function(m){
    var has=have.indexOf(m[0])>=0,busy=!!prog[m[0]];
    var btn=busy?'<button class="xd-b g" disabled>Downloading</button>':has?(on&&cur===m[0]?'<button class="xd-b g" data-do="off">In use</button>':'<button class="xd-b" data-do="use" data-n="'+esc(m[0])+'">Use</button>')+' <button class="xd-b r" data-do="del" data-n="'+esc(m[0])+'">Delete</button>':'<button class="xd-b" data-do="get" data-n="'+esc(m[0])+'">Download</button>';
    return'<div class="xd-m" data-n="'+esc(m[0])+'"><div><b>'+esc(m[1])+'</b><small>'+esc(m[2])+'</small>'+(busy?'<div class="xd-bar"><i style="width:'+(prog[m[0]].pct||0)+'%"></i></div>':"")+'</div>'+btn+'</div>'}).join("");
  box.innerHTML='<div class="xd-box"><h3>Local model</h3><p>Download an AI that runs on this computer, private and without internet. Turn it off any time to go back to the online AI.</p><div class="xd-st">'+(err?"Error: "+esc(err):(info.running?"Local AI engine is running.":info.installed?"Local AI engine is installed.":"The local AI engine will be installed on your first download."))+'</div>'+rows+
   '<div class="xd-row"><span>'+(on?"Using the local model: "+esc(cur):"Using the online AI")+'</span><span>'+(on?'<button class="xd-b g" data-do="off">Use online AI</button> ':"")+'<button class="xd-b g" data-do="close">Close</button></span></div></div>'}
function openLocal(){
  var old=document.getElementById("xdLocal");if(old)old.remove();
  var bg=document.createElement("div");bg.id="xdLocal";bg.className="xd-bg";document.body.appendChild(bg);
  bg.addEventListener("mousedown",function(e){if(e.target===bg)bg.remove()});
  bg.addEventListener("click",function(e){var t=e.target.closest("[data-do]");if(!t)return;var a=t.dataset["do"],n=t.dataset.n;
    if(a==="close")bg.remove();
    else if(a==="off"){set("xmm.local.on","0");render();toast("Using the online AI")}
    else if(a==="use"){set("xmm.local.model",n);set("xmm.local.on","1");render();toast("Using local model "+n);ensureLocal()}
    else if(a==="get"){prog[n]={stage:"pull",name:n,pct:0,status:"Starting\u2026"};render();D.local.pull(n).then(function(r){if(r&&r.ok){set("xmm.local.model",n);set("xmm.local.on","1");toast("Local model ready and in use")}refresh()})}
    else if(a==="del"){D.local.remove(n).then(function(){if(get("xmm.local.model")===n){set("xmm.local.on","0");set("xmm.local.model","")}refresh()})}});
  render();refresh()}
function refresh(){D.local.status().then(function(s){info=s||info;render()})}
window.XMMD={openLocal:openLocal};
})();
