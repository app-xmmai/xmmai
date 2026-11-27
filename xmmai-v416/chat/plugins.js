/* XMM AI v416 · Plugins manager: upload .html / .py / .js plugins or let the AI make one. */
(function(){"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function toast(t){try{XMM_API.toast(t)}catch(e){}}
function nm(t){return String(t||"plugin").toLowerCase().replace(/\.[a-z]+$/,"").replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"").slice(0,30)||"plugin"}
function build(name,desc,lang,code){var n=nm(name);
 if(lang==="js")code=code+"\nif(typeof main==='function')return await main(args);";
 return{id:"p"+Date.now().toString(36)+Math.floor(Math.random()*99),name:String(name).slice(0,30),plugin:1,local:1,source:"you",on:true,
  tools:[{name:n,description:String(desc||"Plugin "+name).slice(0,300),lang:lang,inputSchema:{type:"object",properties:{input:{type:"string",description:"Input for the plugin"}}},code:code}]}}
function add(o){if(!window.XMM_MCP||!XMM_MCP.addPlugin){toast("Plugins are still loading, try again");return false}XMM_MCP.addPlugin(o);return true}
function list(){return window.XMM_MCP&&XMM_MCP.plugins?XMM_MCP.plugins().filter(function(p){return p.local}):[]}
function css(){if($("#xpCss"))return;var s=document.createElement("style");s.id="xpCss";s.textContent=
".xp-m{position:fixed;inset:0;z-index:2147483200;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.5);opacity:0;transition:opacity .25s ease}.xp-m.in{opacity:1}"+
".xp-c{width:min(520px,100%);max-height:88dvh;overflow:auto;background:#1c1c1e;color:#f2f2f4;border-radius:22px 22px 0 0;padding:18px 18px calc(20px + env(safe-area-inset-bottom,0px));font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;transform:translateY(40px);transition:transform .35s cubic-bezier(.22,1,.36,1);-webkit-overflow-scrolling:touch}.xp-m.in .xp-c{transform:none}"+
"@media(min-width:700px){.xp-m{align-items:center}.xp-c{border-radius:22px}}"+
".xp-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}.xp-h h3{margin:0;font-size:19px}.xp-x{border:0;background:rgba(255,255,255,.1);color:#fff;width:34px;height:34px;border-radius:50%;font-size:20px;cursor:pointer}"+
".xp-p{color:#9a9aa6;margin:2px 0 12px;font-size:13px}.xp-acts{display:flex;gap:8px;margin:10px 0}.xp-b{flex:1;border:0;border-radius:12px;padding:11px 12px;background:rgba(255,255,255,.1);color:#fff;font-size:14px;cursor:pointer;transition:transform .15s,background .2s}.xp-b:active{transform:scale(.97)}.xp-b.p{background:#fff;color:#000;font-weight:600}.xp-b:disabled{opacity:.5}"+
".xp-r{display:flex;gap:10px;align-items:center;padding:10px 12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;margin:8px 0;background:rgba(255,255,255,.03);animation:xpIn .35s ease both}@keyframes xpIn{from{opacity:0;transform:translateY(8px)}}.xp-r .i{flex:1;min-width:0}.xp-r b{display:block}.xp-r small{color:#9a9aa6;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"+
".xp-t{position:relative;width:42px;height:24px;border-radius:99px;background:rgba(255,255,255,.2);border:0;cursor:pointer;flex:none;transition:background .2s}.xp-t:after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s}.xp-t.on{background:#34c759}.xp-t.on:after{transform:translateX(18px)}.xp-d{border:0;background:none;color:#ff8a8a;font-size:13px;cursor:pointer}"+
".xp-mk{display:none;gap:8px;margin-top:6px;flex-direction:column}.xp-mk.on{display:flex}.xp-mk textarea{width:100%;box-sizing:border-box;min-height:90px;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:#0c0c0e;color:#fff;font:14px system-ui;resize:vertical}"+
".xp-ov{position:fixed;inset:0;z-index:2147483300;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:14px;opacity:0;transition:opacity .25s}.xp-ov.in{opacity:1}.xp-fr{position:relative;width:min(760px,100%);height:min(80dvh,640px);background:#fff;border-radius:18px;overflow:hidden;transform:scale(.96);transition:transform .3s cubic-bezier(.22,1,.36,1)}.xp-ov.in .xp-fr{transform:none}.xp-fr iframe{width:100%;height:100%;border:0}.xp-fr .xp-x{position:absolute;top:8px;right:8px;z-index:2;background:rgba(0,0,0,.6)}";
document.head.appendChild(s)}
function draw(){var L=$("#xpL");if(!L)return;var a=list();
 L.innerHTML=a.length?a.map(function(p){var t=p.tools[0]||{};return'<div class="xp-r"><div class="i"><b>'+esc(p.name)+'</b><small>'+esc((t.lang||"js").toUpperCase())+' · '+esc(t.description||"")+'</small></div><button class="xp-d" type="button" data-d="'+p.id+'">Remove</button><button class="xp-t'+(p.on?" on":"")+'" type="button" data-t="'+p.id+'" aria-label="Toggle"></button></div>'}).join(""):'<div class="xp-p">No plugins yet. Upload a file or tap Make new.</div>'}
function open(){css();var m=$("#xpM");if(m){m.remove()}
 m=document.createElement("div");m.id="xpM";m.className="xp-m";
 m.innerHTML='<div class="xp-c" role="dialog" aria-modal="true" aria-label="Plugins"><div class="xp-h"><h3>Plugins</h3><button class="xp-x" type="button" data-x aria-label="Close">\u00d7</button></div>'+
 '<div class="xp-p">Plugins add features the AI can use. Upload an .html, .py or .js file, or tap Make new and just explain what you want.</div>'+
 '<div class="xp-acts"><button class="xp-b p" type="button" data-up>Upload file</button><button class="xp-b" type="button" data-new>Make new</button></div>'+
 '<input id="xpF" type="file" accept=".html,.htm,.py,.js" multiple hidden>'+
 '<div class="xp-mk" id="xpMk"><textarea id="xpTx" placeholder="Explain it, e.g. a plugin that converts euros to dollars"></textarea><button class="xp-b p" type="button" id="xpGo">Create plugin</button></div>'+
 '<div id="xpL"></div></div>';
 document.body.appendChild(m);draw();requestAnimationFrame(function(){m.classList.add("in")});
 function close(){m.classList.remove("in");setTimeout(function(){m.remove()},260)}
 m.addEventListener("click",function(e){
  if(e.target===m||e.target.closest("[data-x]"))return close();
  if(e.target.closest("[data-up]"))return $("#xpF").click();
  if(e.target.closest("[data-new]")){$("#xpMk").classList.toggle("on");return}
  var t=e.target.closest("[data-t]");if(t){XMM_MCP.togPlugin(t.dataset.t);draw();return}
  var d=e.target.closest("[data-d]");if(d){XMM_MCP.delPlugin(d.dataset.d);draw();return}});
 $("#xpF").onchange=function(e){var fs=[].slice.call(e.target.files||[]);fs.forEach(function(f){
  var ext=(f.name.split(".").pop()||"").toLowerCase(),lang=ext==="py"?"py":(ext==="js"?"js":(/^html?$/.test(ext)?"html":""));
  if(!lang){toast("Use .html, .py or .js files");return}
  if(f.size>400000){toast(f.name+" is too big (max 400 KB)");return}
  var r=new FileReader();r.onload=function(){var txt=String(r.result||""),c=/^\s*(?:#|\/\/|\/\*|<!--)\s*(.{3,160})/.exec(txt);
   if(add(build(f.name.replace(/\.[a-z]+$/i,""),c?c[1].replace(/(\*\/|-->)\s*$/,"").trim():"Uploaded "+f.name,lang,txt))){draw();toast(f.name+" added")}};r.readAsText(f)});e.target.value=""};
 $("#xpGo").onclick=async function(){var b=this,q=$("#xpTx").value.trim();if(!q)return;b.disabled=true;b.textContent="Making it…";
  try{var out=await XMM_API.groq([{role:"system",content:'You write browser plugins. Reply with ONLY JSON, no markdown: {"name":"short name","description":"one sentence what it does","lang":"js","code":"..."}. The code is the body of an async JavaScript function that receives an object named args (args.input is a string) and must return a string. It runs in a sandboxed Web Worker: no DOM, but fetch works. Keep it small and correct.'},{role:"user",content:q}],{maxTokens:1800,autoCont:false});
   var j=JSON.parse(String(out).replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/,"$1"));
   if(!j.code)throw new Error("empty");
   if(add(build(j.name||"plugin",j.description||q,"js",String(j.code)))){draw();$("#xpTx").value="";$("#xpMk").classList.remove("on");toast((j.name||"Plugin")+" created")}}
  catch(er){toast("Could not make it, try describing it again")}
  b.disabled=false;b.textContent="Create plugin"}}
window.XMM_PLUGINS={open:open};
})();
