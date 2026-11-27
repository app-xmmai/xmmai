/* XMM AI · MCP servers. A tiny MCP client that runs fully in the browser (Streamable HTTP, JSON-RPC).
   - Sidebar button "MCP server" opens a manager: add Claude / OpenAI / any MCP server by URL.
   - Built-in "Browser tools" server (time, calculator, fetch page, open link, copy, download file, notify).
   - The AI calls tools by writing a ```mcp-call block; app.js runs it and feeds the result back. */
(function(){"use strict";
var KEY="xmm.mcp",ID=0,MAX_OUT=6000;
var $=function(s,r){return(r||document).querySelector(s)};
function esc(t){return String(t==null?"":t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function load(){try{var a=JSON.parse(localStorage.getItem(KEY)||"null");if(Array.isArray(a))return a}catch(e){}return[{id:"builtin",name:"Browser",builtin:1,on:true}]}
var S=load();if(!S.some(function(s){return s.builtin}))S.unshift({id:"builtin",name:"Browser",builtin:1,on:true});
function save(){try{localStorage.setItem(KEY,JSON.stringify(S.map(function(s){var o={};for(var k in s)if(k!=="sid"&&k!=="ver"&&k!=="err"&&k!=="busy")o[k]=s[k];return o})))}catch(e){}}
function toast(t){try{window.XMM_API&&XMM_API.toast(t)}catch(e){}}

/* ---------------- built-in browser tools ---------------- */
var BI=[
 {name:"mcp_status",description:"Check live which MCP servers and plugins are connected right now, and list their tools. Call this when the user asks if you are connected to MCP, plugins or tools.",inputSchema:{type:"object",properties:{}},run:function(a,sg){return statusTool(sg)}},
 {name:"get_time",description:"Current date, time and time zone of the user.",inputSchema:{type:"object",properties:{}},run:function(){var d=new Date();return d.toString()+" ("+(Intl.DateTimeFormat().resolvedOptions().timeZone||"")+")"}},
 {name:"calculate",description:"Evaluate a math expression, e.g. (12+3)*4/5 or 2^10 or 15%7.",inputSchema:{type:"object",properties:{expression:{type:"string"}},required:["expression"]},run:function(a){var x=String(a.expression||"").replace(/\^/g,"**");if(!/^[\d\s+\-*\/().%,eE]*$/.test(x))throw new Error("Only numbers and + - * / % ^ ( ) are allowed");return String(Function('"use strict";return ('+x+')')())}},
 {name:"fetch_url",description:"Download a web page or text file and return its readable text.",inputSchema:{type:"object",properties:{url:{type:"string"}},required:["url"]},run:async function(a,sig){var u=String(a.url||"");if(!/^https?:\/\//i.test(u))throw new Error("URL must start with http:// or https://");var t;try{var r=await fetch(u,{signal:sig});t=await r.text()}catch(e){if(e&&e.name==="AbortError")throw e;var r2=await fetch("https://r.jina.ai/"+u,{signal:sig});t=await r2.text()}return t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}},
 {name:"open_url",description:"Open a link in a new browser tab.",inputSchema:{type:"object",properties:{url:{type:"string"}},required:["url"]},run:function(a){var u=String(a.url||"");if(!/^https?:\/\//i.test(u))throw new Error("URL must start with http:// or https://");var w=window.open(u,"_blank","noopener");return w?"Opened "+u:"The browser blocked the pop-up. Tell the user to allow pop-ups, or give them the link."}},
 {name:"copy_to_clipboard",description:"Copy text to the user's clipboard.",inputSchema:{type:"object",properties:{text:{type:"string"}},required:["text"]},run:async function(a){await navigator.clipboard.writeText(String(a.text||""));return "Copied to clipboard."}},
 {name:"download_file",description:"Create a file and download it on the user's device.",inputSchema:{type:"object",properties:{filename:{type:"string"},content:{type:"string"}},required:["filename","content"]},run:function(a){var n=String(a.filename||"file.txt").replace(/[\\\/:*?"<>|]/g,"_").slice(0,80);var b=new Blob([String(a.content||"")],{type:"text/plain"});var l=document.createElement("a");l.href=URL.createObjectURL(b);l.download=n;document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(l.href);l.remove()},1500);return "Downloaded "+n}},
 {name:"notify",description:"Show a short message to the user on screen.",inputSchema:{type:"object",properties:{message:{type:"string"}},required:["message"]},run:function(a){toast(String(a.message||"").slice(0,200));return "Shown."}}
];

/* ---------------- MCP over HTTP ---------------- */
async function rpc(s,method,params,note,sig){
 var body={jsonrpc:"2.0",method:method};if(params)body.params=params;if(!note)body.id=++ID;
 var h={"Content-Type":"application/json","Accept":"application/json, text/event-stream"};
 if(s.token)h.Authorization=/^bearer\s/i.test(s.token)?s.token:"Bearer "+s.token;
 if(s.sid)h["Mcp-Session-Id"]=s.sid;if(s.ver)h["MCP-Protocol-Version"]=s.ver;
 var r;try{r=await fetch(s.url,{method:"POST",headers:h,body:JSON.stringify(body),signal:sig})}
 catch(e){if(e&&e.name==="AbortError")throw e;throw new Error("Could not reach the server. It must be online, use https and allow browser (CORS) requests.")}
 try{var sid=r.headers.get("Mcp-Session-Id");if(sid)s.sid=sid}catch(e){}
 if(note)return null;
 if(r.status===401||r.status===403)throw new Error("The server refused access ("+r.status+"). Check the token.");
 if(!r.ok)throw new Error("Server answered HTTP "+r.status);
 var ct=r.headers.get("Content-Type")||"",txt=await r.text(),msg=null;
 if(/event-stream/i.test(ct)){txt.split(/\r?\n/).forEach(function(l){if(l.indexOf("data:")!==0)return;try{var j=JSON.parse(l.slice(5).trim());if(j&&j.id===body.id)msg=j}catch(e){}})}
 else{try{msg=JSON.parse(txt)}catch(e){throw new Error("The server did not answer with MCP JSON.")}if(Array.isArray(msg))msg=msg.filter(function(m){return m.id===body.id})[0]}
 if(!msg)throw new Error("No MCP answer received.");
 if(msg.error)throw new Error(msg.error.message||"MCP error");
 return msg.result}
async function connect(s,sig){
 s.sid=null;s.ver=null;
 var init=await rpc(s,"initialize",{protocolVersion:"2025-03-26",capabilities:{},clientInfo:{name:"XMM AI",version:"1.0"}},false,sig);
 s.ver=(init&&init.protocolVersion)||"2025-03-26";
 try{await rpc(s,"notifications/initialized",null,true,sig)}catch(e){}
 var tools=[],cur=null,n=0;
 do{var r=await rpc(s,"tools/list",cur?{cursor:cur}:{},false,sig);tools=tools.concat(r.tools||[]);cur=r.nextCursor;n++}while(cur&&n<4);
 s.tools=tools.map(function(t){return{name:t.name,description:t.description||"",inputSchema:t.inputSchema||{type:"object",properties:{}}}});
 s.err="";return s.tools}
async function refresh(s){s.busy=1;s.err="";draw();try{await connect(s)}catch(e){s.err=e.message||String(e);s.tools=s.tools||[]}s.busy=0;save();draw()}

/* ---------------- what the AI sees ---------------- */
function active(){return true}
function toolsOf(s){return s.builtin?BI:(s.tools||[])}
function findServer(n){n=String(n||"").toLowerCase();return S.filter(function(s){return s.on&&s.name.toLowerCase()===n})[0]||S.filter(function(s){return s.on&&toolsOf(s).some(function(t){return t.name===n})})[0]}
function sig(t){var p=(t.inputSchema&&t.inputSchema.properties)||{},req=(t.inputSchema&&t.inputSchema.required)||[];return Object.keys(p).slice(0,8).map(function(k){return k+(req.indexOf(k)<0?"?":"")+":"+(p[k].type||"any")}).join(", ")}
function statusLine(){var on=[],off=[];S.forEach(function(s){if(s.builtin)return;var d=s.name+(s.plugin?" (plugin":" (server")+", "+toolsOf(s).length+" tools"+(s.err?", ERROR: "+String(s.err).slice(0,60):"")+")";(s.on?on:off).push(d)});
 var b=S.filter(function(s){return s.builtin})[0];
 return "Built-in Browser tools: "+(b&&b.on?"on":"off")+". Connected MCP servers/plugins: "+(on.length?on.join("; "):"none")+"."+(off.length?" Turned off: "+off.join("; ")+".":"")}
function hint(){
 var L=[];S.forEach(function(s){if(!s.on)return;toolsOf(s).slice(0,40).forEach(function(t){L.push("- "+s.name+" › "+t.name+"("+sig(t)+")"+(t.description?": "+String(t.description).replace(/\s+/g," ").slice(0,110):""))})});
 return "\n\nMCP STATUS (as of the last check): "+statusLine()+"\nIf the user asks whether you are connected to MCP, plugins or tools, you MUST first call the mcp_status tool (it checks live), then answer using only its result.\n"+
 (L.length?"TOOLS (MCP): You can take real actions in the user's browser with these tools:\n"+L.slice(0,70).join("\n")+"\n":"")+
 "To use a tool, reply with ONLY one fenced block and nothing else:\n```mcp-call\n{\"server\":\"<server name>\",\"tool\":\"<tool name>\",\"args\":{...}}\n```\nThe result will be sent back to you; then answer the user. Use a tool only when it really helps; never invent tool results; never claim to have done something a tool did not confirm."}
function parse(t){t=String(t||"");var m=t.match(/```mcp-call\s*([\s\S]*?)```/)||t.match(/```mcp-call\s*([\s\S]*)$/);if(!m)return null;
 try{var j=JSON.parse(m[1].trim());if(j&&j.tool){var s=findServer(j.server||j.tool);return{server:(s&&s.name)||String(j.server||""),tool:String(j.tool),args:j.args&&typeof j.args==="object"?j.args:{},_s:s}}}catch(e){}return null}
function strip(t){return String(t||"").replace(/```mcp-call[\s\S]*?(```|$)/g,"").trim()}
function raw(c){return "```mcp-call\n"+JSON.stringify({server:c.server,tool:c.tool,args:c.args})+"\n```"}
async function run(c,sg){
 if(c.tool==="mcp_status")return await statusTool(sg);
 var s=c._s||findServer(c.server);if(!s)return "Error: no enabled server named \""+c.server+"\".";
 try{
  var out;
  if(s.plugin){var pt=(s.tools||[]).filter(function(x){return x.name===c.tool})[0];if(!pt)return "Error: unknown tool \""+c.tool+"\".";out=await runPlugin(pt,c.args,sg)}
  else if(s.builtin){var t=BI.filter(function(x){return x.name===c.tool})[0];if(!t)return "Error: unknown tool \""+c.tool+"\".";out=await t.run(c.args,sg)}
  else{
   var res;try{res=await rpc(s,"tools/call",{name:c.tool,arguments:c.args},false,sg)}catch(e){if(e&&e.name==="AbortError")throw e;await connect(s,sg);res=await rpc(s,"tools/call",{name:c.tool,arguments:c.args},false,sg)}
   var parts=(res&&res.content||[]).map(function(p){return p.type==="text"?p.text:(p.type==="resource"&&p.resource&&p.resource.text)||"["+p.type+"]"});
   out=parts.join("\n")||JSON.stringify(res&&res.structuredContent||res||{});
   if(res&&res.isError)out="Tool error: "+out}
  out=String(out);if(out.length>MAX_OUT)out=out.slice(0,MAX_OUT)+"\n…[cut]";return out
 }catch(e){if(e&&e.name==="AbortError")throw e;return "Error: "+(e.message||e)}}

/* ---------------- live status ---------------- */
function withTimeout(p,ms,sg){return new Promise(function(res,rej){var t=setTimeout(function(){rej(new Error("timed out"))},ms);p.then(function(v){clearTimeout(t);res(v)},function(e){clearTimeout(t);rej(e)})})}
async function statusTool(sg){
 var out=[];
 await Promise.all(S.map(async function(s){
  if(s.builtin){out.push("Browser (built-in): "+(s.on?"on":"off")+", "+BI.length+" tools: "+BI.map(function(t){return t.name}).join(", "));return}
  if(s.plugin){out.push(s.name+" (plugin from "+(s.source||"GitHub")+"): "+(s.on?"on":"off")+", "+(s.tools||[]).length+" tools: "+(s.tools||[]).map(function(t){return t.name}).join(", "));return}
  try{await withTimeout(connect(s,sg),8000);s.err="";out.push(s.name+" (MCP server): CONNECTED"+(s.on?"":" but turned off")+", "+s.tools.length+" tools: "+s.tools.map(function(t){return t.name}).slice(0,25).join(", "))}
  catch(e){s.err=e.message||String(e);out.push(s.name+" (MCP server): NOT CONNECTED — "+s.err)}}));
 save();draw();
 var n=S.filter(function(s){return !s.builtin}).length;
 return (n?"":"No external MCP servers or plugins have been added yet (only the built-in Browser tools).\n")+out.join("\n")}

/* ---------------- plugins (JS tools from GitHub) run in a sandboxed Worker: no page, no chats, no tokens ---------------- */
function runPlugin(t,args,sg){return new Promise(function(res,rej){
 var W;try{
  var src='self.onmessage=async function(e){try{var f=new Function("args",'+JSON.stringify("return (async()=>{"+String(t.code||"")+"\n})()")+');var r=await f(e.data);postMessage({ok:1,r:typeof r==="string"?r:JSON.stringify(r)})}catch(x){postMessage({ok:0,e:String(x&&x.message||x)})}}';
  W=new Worker(URL.createObjectURL(new Blob([src],{type:"text/javascript"})))}catch(e){return rej(new Error("This browser cannot run plugins here."))}
 var tm=setTimeout(function(){try{W.terminate()}catch(e){}rej(new Error("Plugin timed out after 15 s"))},15000);
 if(sg)sg.addEventListener("abort",function(){clearTimeout(tm);try{W.terminate()}catch(e){}rej(Object.assign(new Error("aborted"),{name:"AbortError"}))},{once:true});
 W.onmessage=function(m){clearTimeout(tm);try{W.terminate()}catch(e){}m.data.ok?res(m.data.r):rej(new Error(m.data.e))};
 W.onerror=function(m){clearTimeout(tm);try{W.terminate()}catch(e){}rej(new Error(m.message||"Plugin error"))};
 W.postMessage(args||{})})}

/* ---------------- GitHub import ---------------- */
var GH_FILES=["xmm-plugin.json","mcp.json",".mcp.json","server.json","mcp-servers.json",".cursor/mcp.json","claude_desktop_config.json"];
function ghParse(u){u=String(u||"").trim().replace(/\/+$/,"");var m;
 if(m=u.match(/^https?:\/\/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)$/))return{o:m[1],r:m[2],b:m[3],p:m[4],file:1};
 if(m=u.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)$/))return{o:m[1],r:m[2],b:m[3],p:m[4],file:1};
 if(m=u.match(/^https?:\/\/github\.com\/([^\/]+)\/([^\/#?]+?)(?:\.git)?(?:\/tree\/([^\/]+)(?:\/(.+))?)?(?:[?#].*)?$/))return{o:m[1],r:m[2],b:m[3]||"",p:m[4]||""};
 if(m=u.match(/^([\w.-]+)\/([\w.-]+)$/))return{o:m[1],r:m[2],b:"",p:""};
 return null}
async function ghText(url){var r=await fetch(url,{cache:"no-store"});if(!r.ok)return null;return await r.text()}
function cleanTok(v){v=String(v||"").replace(/^bearer\s+/i,"").trim();return(/[$<{]/.test(v)||!v)?"":v}
function ghNormalize(name,obj,src,out,skipped){
 if(!obj||typeof obj!=="object")return;
 if(Array.isArray(obj.plugins))obj.plugins.forEach(function(p){ghNormalize(name,p,src,out,skipped)});
 if(Array.isArray(obj.tools)&&obj.tools.some(function(t){return t&&t.code})){
  out.push({kind:"plugin",name:String(obj.name||name).slice(0,30),desc:obj.description||"",source:src,tools:obj.tools.filter(function(t){return t&&t.name&&t.code}).map(function(t){return{name:String(t.name),description:String(t.description||""),inputSchema:t.inputSchema||{type:"object",properties:{}},code:String(t.code)}})})}
 var M=obj.mcpServers||obj.servers;
 if(M&&typeof M==="object"&&!Array.isArray(M))Object.keys(M).forEach(function(k){var c=M[k]||{};
  if(c.url||c.serverUrl)out.push({kind:"remote",name:k.slice(0,30),url:c.url||c.serverUrl,token:cleanTok(c.headers&&(c.headers.Authorization||c.headers.authorization)),source:src});
  else skipped.push(k+(c.command?" (needs a local program: "+c.command+")":""))});
 if(Array.isArray(obj.remotes))obj.remotes.forEach(function(r){if(r&&r.url)out.push({kind:"remote",name:String(obj.name||name).split("/").pop().slice(0,30),url:r.url,token:"",source:src})})}
async function ghFind(input){
 var g=ghParse(input);if(!g)throw new Error("Paste a GitHub link like https://github.com/owner/repo or owner/repo");
 var branches=g.b?[g.b]:[];
 if(!g.b){try{var r=await fetch("https://api.github.com/repos/"+g.o+"/"+g.r);if(r.ok){var j=await r.json();if(j.default_branch)branches.push(j.default_branch)}}catch(e){}branches=branches.concat(["main","master"])}
 var out=[],skipped=[],src=g.o+"/"+g.r,hit=0;
 for(var bi=0;bi<branches.length&&!hit;bi++){var b=branches[bi];
  var files=g.file?[g.p]:GH_FILES.map(function(f){return(g.p?g.p.replace(/\/$/,"")+"/":"")+f});
  var texts=await Promise.all(files.map(function(f){return ghText("https://raw.githubusercontent.com/"+g.o+"/"+g.r+"/"+b+"/"+f).catch(function(){return null})}));
  texts.forEach(function(t,i){if(!t)return;try{var o=JSON.parse(t);hit=1;ghNormalize(files[i].split("/").pop().replace(/\.json$/,""),o,src,out,skipped)}catch(e){}})}
 if(!hit)throw new Error("No MCP config found in that repo. Looked for: "+GH_FILES.join(", ")+". You can also paste a link to the JSON file itself.");
 return{items:out,skipped:skipped}}

/* ---------------- UI ---------------- */
var CSS=".xmcp-w{font-size:12px;color:#ffcf6e;margin:4px 0}.xmcp-d summary{cursor:pointer;color:#9a9aa6;font-size:12px}.xmcp-d pre{max-height:140px;overflow:auto;background:#0c0c0e;padding:8px;border-radius:10px;font-size:11px;white-space:pre-wrap;word-break:break-all;margin:6px 0 0}.xmcp-m{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:16px}.xmcp-m[hidden]{display:none}"+
".xmcp-c{width:min(560px,100%);max-height:88vh;overflow:auto;background:#141416;color:#ececf0;border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:18px 18px 20px;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}"+
".xmcp-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}.xmcp-h h3{margin:0;font-size:18px}.xmcp-x{border:0;background:rgba(255,255,255,.08);color:#fff;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer}"+
".xmcp-p{color:#9a9aa6;margin:4px 0 12px;font-size:13px}.xmcp-r{display:flex;gap:10px;align-items:center;padding:10px 12px;border:1px solid rgba(255,255,255,.1);border-radius:14px;margin:8px 0;background:rgba(255,255,255,.03)}.xmcp-r .i{flex:1;min-width:0}.xmcp-r b{display:block;font-size:14px}.xmcp-r small{display:block;color:#9a9aa6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.xmcp-r small.e{color:#ff8a8a;white-space:normal}"+
".xmcp-b{border:0;border-radius:10px;padding:7px 11px;background:rgba(255,255,255,.1);color:#fff;font-size:13px;cursor:pointer}.xmcp-b.p{background:#fff;color:#000;font-weight:600}.xmcp-b.d{color:#ff8a8a}"+
".xmcp-t{position:relative;width:42px;height:24px;border-radius:99px;background:rgba(255,255,255,.18);border:0;cursor:pointer;flex:none}.xmcp-t:after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s}.xmcp-t.on{background:#34c759}.xmcp-t.on:after{transform:translateX(18px)}"+
".xmcp-f{display:grid;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,.1)}.xmcp-f input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:#0c0c0e;color:#fff;font-size:14px}.xmcp-chips{display:flex;gap:6px;flex-wrap:wrap}.xmcp-chips button{border:1px solid rgba(255,255,255,.16);background:transparent;color:#ddd;border-radius:99px;padding:4px 11px;font-size:12px;cursor:pointer}"+
".xmcp-btn{cursor:pointer}";
function ensureStyle(){if(document.getElementById("xmcpCss"))return;var s=document.createElement("style");s.id="xmcpCss";s.textContent=CSS;document.head.appendChild(s)}
var ICON='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0V8zM12 17v4"/></svg>';
function modal(){var m=document.getElementById("xmcpM");if(m)return m;ensureStyle();m=document.createElement("div");m.id="xmcpM";m.className="xmcp-m";m.hidden=true;
 m.innerHTML='<div class="xmcp-c" role="dialog" aria-modal="true" aria-label="MCP servers"><div class="xmcp-h"><h3>MCP servers</h3><button class="xmcp-x" type="button" data-x aria-label="Close">×</button></div>'+
 '<p class="xmcp-p">Connect MCP servers so the AI can use their tools. Everything runs in your browser, nothing goes through our servers. Servers must be online (https) and allow browser requests (CORS).</p><div id="xmcpL"></div>'+
 '<form class="xmcp-f" id="xmcpF" autocomplete="off"><div class="xmcp-chips"><span class="xmcp-p" style="margin:0;align-self:center">Quick name:</span><button type="button" data-n="Claude">Claude</button><button type="button" data-n="OpenAI">OpenAI</button></div>'+
 '<input id="xmcpN" placeholder="Name (e.g. Claude)" maxlength="30"><input id="xmcpU" placeholder="MCP server URL (https://…/mcp)" inputmode="url" autocapitalize="off" spellcheck="false"><input id="xmcpT" type="password" placeholder="Token / API key (optional)" autocomplete="off"><button class="xmcp-b p" type="submit" id="xmcpA">Add server</button><div class="xmcp-p" id="xmcpS" style="margin:0"></div></form>'+
 '<form class="xmcp-f" id="xmcpG" autocomplete="off"><b>Import from GitHub</b><div class="xmcp-p" style="margin:0">Paste a repo or file link. Finds <code>mcp.json</code>, <code>.mcp.json</code>, <code>server.json</code> and <code>xmm-plugin.json</code> (JS plugins).</div><input id="xmcpGU" placeholder="https://github.com/owner/repo" inputmode="url" autocapitalize="off" spellcheck="false"><button class="xmcp-b p" type="submit" id="xmcpGB">Find on GitHub</button><div id="xmcpGR"></div></form></div>';
 document.body.appendChild(m);
 m.addEventListener("click",function(e){var t=e.target;if(t===m||t.closest("[data-x]")){m.hidden=true;return}
  var c=t.closest("[data-n]");if(c){$("#xmcpN").value=c.dataset.n;$("#xmcpU").focus();return}
  var b=t.closest("[data-a]");if(!b)return;var s=S.filter(function(x){return x.id===b.dataset.i})[0];if(!s)return;
  if(b.dataset.a==="tog"){s.on=!s.on;save();draw()}else if(b.dataset.a==="del"){S=S.filter(function(x){return x!==s});save();draw()}else if(b.dataset.a==="ref")refresh(s)});
 $("#xmcpF").addEventListener("submit",async function(e){e.preventDefault();var n=$("#xmcpN").value.trim(),u=$("#xmcpU").value.trim(),t=$("#xmcpT").value.trim(),st=$("#xmcpS");
  if(!n||!/^https?:\/\//i.test(u)){st.textContent="Enter a name and a URL that starts with https://";return}
  if(S.some(function(x){return x.name.toLowerCase()===n.toLowerCase()})){st.textContent="A server with that name already exists.";return}
  var s={id:"s"+Date.now().toString(36),name:n,url:u,token:t,on:true,tools:[]};st.textContent="Connecting…";$("#xmcpA").disabled=true;
  try{await connect(s);S.push(s);save();$("#xmcpN").value=$("#xmcpU").value=$("#xmcpT").value="";st.textContent="Connected · "+s.tools.length+" tools";draw()}
  catch(er){st.textContent="Not added: "+(er.message||er)}
  $("#xmcpA").disabled=false});
 var GI=[];
 $("#xmcpG").addEventListener("submit",async function(e){e.preventDefault();var R=$("#xmcpGR"),btn=$("#xmcpGB");R.innerHTML='<div class="xmcp-p">Searching GitHub…</div>';btn.disabled=true;
  try{var f=await ghFind($("#xmcpGU").value);GI=f.items;
   if(!GI.length)R.innerHTML='<div class="xmcp-p">Nothing runnable found.'+(f.skipped.length?" Skipped (need a local program, not possible in a browser): "+esc(f.skipped.join(", ")):"")+"</div>";
   else R.innerHTML=GI.map(function(it,i){return'<div class="xmcp-r" data-gi="'+i+'" style="flex-wrap:wrap"><div class="i"><b>'+esc(it.name)+" · "+(it.kind==="plugin"?"plugin ("+it.tools.length+" tools)":"MCP server")+'</b><small>'+esc(it.kind==="plugin"?(it.desc||it.source):it.url)+'</small></div><button class="xmcp-b p" type="button" data-gimp="'+i+'">Import</button>'+
     (it.kind==="remote"?'<input style="flex-basis:100%" data-gtok="'+i+'" type="password" placeholder="Token / API key (optional)" value="'+esc(it.token)+'">':'<div style="flex-basis:100%"><div class="xmcp-w">Plugin code runs in an isolated worker (no access to your chats or keys), but it can use the internet. Import only code you trust.</div><details class="xmcp-d"><summary>View code</summary><pre>'+esc(it.tools.map(function(t){return"// "+t.name+"\n"+t.code}).join("\n\n"))+'</pre></details></div>')+'<div class="xmcp-p" data-gmsg="'+i+'" style="flex-basis:100%;margin:0"></div></div>'}).join("")+(f.skipped.length?'<div class="xmcp-p">Skipped (need a local program): '+esc(f.skipped.join(", "))+"</div>":"")}
  catch(er){R.innerHTML='<div class="xmcp-p" style="color:#ff8a8a">'+esc(er.message||er)+"</div>"}
  btn.disabled=false});
 $("#xmcpGR").addEventListener("click",async function(e){var b=e.target.closest("[data-gimp]");if(!b)return;var i=+b.dataset.gimp,it=GI[i],msg=$('[data-gmsg="'+i+'"]');if(!it)return;
  var nm=it.name;if(S.some(function(x){return x.name.toLowerCase()===nm.toLowerCase()})){msg.textContent="A server named \""+nm+"\" already exists. Remove it first.";return}
  var s;
  if(it.kind==="plugin")s={id:"p"+Date.now().toString(36),name:nm,plugin:1,source:it.source,on:true,tools:it.tools};
  else{var tk=$('[data-gtok="'+i+'"]');s={id:"s"+Date.now().toString(36),name:nm,url:it.url,token:(tk&&tk.value.trim())||"",on:true,tools:[],source:it.source};
   msg.textContent="Connecting…";b.disabled=true;try{await connect(s)}catch(er){msg.textContent="Not added: "+(er.message||er);b.disabled=false;return}}
  S.push(s);save();draw();b.textContent="Added ✓";b.disabled=true;msg.textContent="";toast(nm+" added")});
 return m}
function draw(){var L=document.getElementById("xmcpL");if(!L)return;
 L.innerHTML=S.map(function(s){var n=toolsOf(s).length;
  return'<div class="xmcp-r"><div class="i"><b>'+esc(s.name)+(s.builtin?" · built in":"")+(s.plugin?" · plugin":"")+'</b>'+(s.err?'<small class="e">'+esc(s.err)+'</small>':'<small>'+(s.busy?"Connecting…":n+" tool"+(n===1?"":"s")+(s.plugin?" · plugin from "+esc(s.source||"GitHub"):(s.url?" · "+esc(s.url):" · runs in this browser")))+'</small>')+'</div>'+
  (s.builtin?"":(s.plugin?"":'<button class="xmcp-b" type="button" data-a="ref" data-i="'+s.id+'">Refresh</button>')+'<button class="xmcp-b d" type="button" data-a="del" data-i="'+s.id+'">Remove</button>')+
  '<button class="xmcp-t'+(s.on?" on":"")+'" type="button" data-a="tog" data-i="'+s.id+'" aria-label="Toggle"></button></div>'}).join("")}
function open(){var m=modal();draw();m.hidden=false;
 S.forEach(function(s){if(!s.builtin&&!s.plugin&&s.on&&(!s.tools||!s.tools.length)&&!s.busy)refresh(s)})}

/* ---------------- sidebar buttons (every sidebar layout) ---------------- */
function mk(tag,cls,inner){var b=document.createElement(tag);b.type="button";b.className=cls+" xmcp-btn";b.innerHTML=inner;b.setAttribute("data-xmcp","1");return b}
function inject(){
 var ds=$("#clDrawer #clDs");if(ds&&!$(".xmcp-btn",ds)){var b=mk("button","cl-nr",ICON+"<span>MCP server</span>");b.style.setProperty("--i","5");ds.insertBefore(b,ds.querySelector(".cl-rl")||ds.firstChild)}
 var xs=document.querySelectorAll("#sideChat .xs-r");if(xs.length&&!$("#sideChat .xmcp-btn")){var last=xs[xs.length-1],b2=mk("button","xs-r",ICON+"<span>MCP server</span>");last.parentNode.insertBefore(b2,last.nextSibling)}
 var nv=$("#sideChat .xnav");if(nv&&!$(".xmcp-btn",nv))nv.appendChild(mk("button","",ICON+"<span>MCP server</span>"));
 var s2=$("#sideChat .sidenav2");if(s2&&!$(".xmcp-btn",s2))s2.appendChild(mk("button","",ICON+"MCP server"))}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xmcp]");if(!b)return;e.preventDefault();e.stopPropagation();
 try{document.body.classList.remove("cl-drawer");var sc=$("#scrim");if($("#sideChat.open")&&sc)sc.click()}catch(x){}open()},true);
var T=0;function sched(){if(T)return;T=setTimeout(function(){T=0;try{inject()}catch(e){}},120)}
function boot(){ensureStyle();inject();new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});setInterval(inject,2500)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();

window.XMM_MCP={active:active,hint:hint,parse:parse,strip:strip,raw:raw,run:run,open:open};
})();
