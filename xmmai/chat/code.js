window.__xmmCodeSandbox='xmmcode';
/* XMM: local login + Code agent (multi-file project, live preview, auto-fix, ZIP / .html export) */
(()=>{
const $=s=>document.querySelector(s),API=()=>window.XMM_API,T=window.XMM_TIER||{name:"free",inCap:3400,outCode:7000},E=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"<".replace("<","&lt;"),">":"&gt;"}[c]));
const ls={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
/* ---- login: tap, type a username, done ---- */
const L=$("#login");
if(false){L.hidden=false;
 const i=$("#lgName"),b=$("#lgGo"),shake=[{transform:"translateX(-8px)"},{transform:"translateX(8px)"},{transform:"none"}];
 const upd=()=>{b.disabled=!i.value.trim()};i.oninput=upd;upd();
 const go=()=>{const v=i.value.trim();if(!v){i.focus();i.animate(shake,{duration:250});return}ls.s("xmm.terms",Date.now());API().setName(v);ls.s("xmm.welcomed",1);L.classList.add("out");setTimeout(()=>L.remove(),700);API().toast("Welcome, "+v)};
 b.onclick=go;i.onkeydown=e=>{if(e.key==="Enter")go()};}else L.remove();
/* ---- code agent ---- */
const SK="xmm.code.s",DEF="New code chat";
const mk=()=>({id:"c"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),title:DEF,ts:Date.now(),files:{},hist:[]});
let st=ls.g(SK,null);
if(!st||!Array.isArray(st.list)){st={list:[],cur:null};const f0=ls.g("xmm.code.files",{}),h0=ls.g("xmm.code.hist",[]);if(Object.keys(f0).length||h0.length){const s=mk();s.files=f0;s.hist=h0;const u=h0.find(m=>m.role==="user");if(u)s.title=u.content.replace(/\s+/g," ").slice(0,40);st.list.push(s);st.cur=s.id}}
let files={},bin={},page="",pgHist=[],hist=[],tab="preview",busy=false,ctrl=null,errs=[],fixes=0,root=null,opening=false,cdAtt=[];
const cur=()=>st.list.find(s=>s.id===st.cur);
const saveAll=()=>{try{localStorage.setItem(SK,JSON.stringify(st))}catch{API()&&API().toast("Project is too large to save on this device")}};
const save=()=>{const s=cur();if(!s)return;s.files=files;s.hist=hist.slice(-20);s.ts=Date.now();const u=hist.find(m=>m.role==="user");if(u&&(!s.title||s.title===DEF))s.title=u.content.replace(/\s+/g," ").slice(0,40);saveAll();side()};
function side(){const sec=$("#codeSec");if(sec){sec.hidden=true;sec.style.display="none"}
 const list=st.list.filter(s=>s.hist.length||Object.keys(s.files).length).sort((a,b)=>b.ts-a.ts);
 window.XMM_CODE_SIDE=list;paintCodeInChatList()}
let _codePaint=0;
function paintCodeInChatList(){const L=$("#chatList");if(!L||!API())return;if(_codePaint)return;_codePaint=1;
 L.querySelectorAll(".chat-i[data-cid]").forEach(n=>n.remove());
 const list=window.XMM_CODE_SIDE||[];
 if(list.length){const html=list.map(s=>`<div class="chat-i code-chat ${root&&s.id===st.cur?"on":""}" data-cid="${s.id}"><span dir="auto">${E(s.title)}</span><button class="dots" data-cdots="${s.id}" aria-label="Options">${API().ic("dots")}</button></div>`).join("");L.insertAdjacentHTML("afterbegin",html)}
 _codePaint=0}
 // keep code rows after normal chat list re-renders
 if(!window.__codeListObs){window.__codeListObs=1;const boot=()=>{const L=$("#chatList");if(!L)return;new MutationObserver(()=>{if(_codePaint)return;if((window.XMM_CODE_SIDE||[]).length&&!L.querySelector("[data-cid]"))paintCodeInChatList()}).observe(L,{childList:true})};if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else setTimeout(boot,0)}
function openSess(id){let s=id&&st.list.find(x=>x.id===id);if(!s){s=st.list.find(x=>!x.hist.length&&!Object.keys(x.files).length);if(!s){s=mk();st.list.unshift(s)}}
 st.cur=s.id;files=s.files;hist=s.hist;bin={};page="";pgHist=[];tab="preview";errs=[];fixes=0;saveAll();side();const sid=s.id;idb("get",sid).then(b=>{if(b&&st.cur===sid){bin=b;if(root)tabs()}})}
document.addEventListener("click",e=>{const t=e.target;if(!t.closest)return;const d=t.closest("[data-cdots]");
 if(d){e.stopPropagation();const id=d.dataset.cdots;API().showMenu(d,[{label:"Delete code chat",danger:1,fn:()=>{st.list=st.list.filter(s=>s.id!==id);idb("del",id);if(st.cur===id)st.cur=null;saveAll();side()}}],"right");return}
 const i=t.closest("[data-cid]");if(i){const sc=document.getElementById("scrim");if(sc)sc.click();open(i.dataset.cid)}},true);
const SYS=`You are XMM Code, an advanced senior full-stack engineer with DeepSeek-R1-level multi-step reasoning. /no_think
You solve complex coding problems by thinking step-by-step: architecture → data model → edge cases → implementation → self-correction.
Write complete, correct, production-quality code that works the first time.
MULTI-LANGUAGE: Expert in Python, C, C++, Rust, JavaScript, TypeScript, Java, Go, PHP, HTML, CSS, SQL, Bash and modern frameworks (React, Vue, Svelte, Next, FastAPI, etc.). Prefer the stack the user asks for; otherwise choose the most appropriate 2026-ready stack.
RULES
- First chars = <file path="...">. No long intro. After the files: one short sentence.
- Real working logic only: no placeholders, no TODOs, no stubs, no "rest of code here". Every feature the user asked for must be implemented.
- Multi-step reasoning: silently plan architecture, state, algorithms, then code. Handle edge cases (empty input, bad input, resize, rapid clicks, offline, race conditions). Validate inputs, never crash.
- Clean structure: small named functions, const/let, clear names, one source of truth for state, no globals leaking, escape any user text put into HTML.
- Efficient: avoid needless re-renders and O(n^2) work, use requestAnimationFrame for animation, debounce heavy handlers, prefer modern APIs.
- Polished UI: responsive layout, accessible (labels, focus, contrast), touch-friendly pointer events, big tap targets, on-screen buttons for keyboard-only controls.
- Websites: split into index.html + styles.css + script.js (see V405 RULES). Small games/tools may stay one index.html. Use well-known CDN libraries only when they clearly help.
- Budget is about 7000 tokens: be dense but never sacrifice correctness. Always end with </html> then </file>. Never stop mid-file.
- When editing an existing project, change only what is needed and keep everything else working. Use <edit path="..."> for surgical changes when possible.
- Self-correct: after writing, mentally verify balance of tags/braces, defined names, and runtime safety.
SENIOR-ENGINEER STANDARD (v405)
- Plan the file list first, then write every file in full. Websites: index.html + styles.css + script.js (+ more pages); shared header/footer, real content, responsive mobile-first CSS (clamp(), grid/flex, dvh, no horizontal scroll), semantic HTML, alt text, focus states, prefers-reduced-motion.
- JS: strict, small pure functions, event delegation, guard null elements, try/catch around storage/network, no globals leaking, no console errors.
- Visual polish: a consistent design system (CSS variables for colors, spacing, radius, shadows), real typography scale, hover/active states, subtle transitions.
BROKEN-FILE GUARD (check silently before you finish)
- Every tag, bracket, brace, parenthesis and quote is closed and balanced; every <script>/<style> is closed; the file ends with </html> then </file>.
- Every function, variable, id and class you use is defined exactly once; every getElementById/querySelector target exists in the HTML; no duplicate ids.
- Every file you link or import exists in your output or is a real CDN URL. No made-up APIs, no missing imports, no undefined names.
- JS runs after the DOM exists (script at the end of body or DOMContentLoaded). Wrap risky calls (JSON.parse, storage, fetch) in try/catch.
- Never output partial files, diffs or "..." gaps: every file you touch is written out whole. Prefer a smaller feature set that works over a bigger one that breaks.
- Mobile first: viewport meta, no fixed pixel widths, nothing off-screen, buttons reachable with a thumb.
- INTERACTIVE THINGS MUST BE PLAYABLE IN THE PREVIEW: games need a real requestAnimationFrame loop, start/pause/game-over/restart, score, difficulty ramp, keyboard (arrows, WASD, space) AND touch/tap/swipe/on-screen controls, canvas sized to the window and redrawn on resize, crisp visuals (gradients, particles, easing), optional WebAudio sound after first tap. Apps: every button/input works with real state, validation, empty and error states, smooth transitions. The preview runs in a sandboxed iframe: wrap localStorage/sessionStorage in try/catch, never use alert/prompt/confirm, never navigate away.

V405 RULES
- XMM AI is best at making websites. If the user asks for a game or Python, begin with one short line: "Our AI is best at making websites, but it can still make simple games and Python code too." then still deliver it, working and simple.
- WEBSITES = MULTIPLE FILES: index.html, styles.css, script.js (plus more pages/assets if useful), linked with relative paths. The user downloads them together with the ZIP button.
- If the user asks for ONLY HTML, output exactly one self-contained index.html. If the user asks for ONLY JS, output exactly one .js file and nothing else.
- Code like an expert: validate input, handle every edge case, no placeholders, accessible, fast, mobile-first with safe-area insets and dvh units.
FORMAT: <file path="index.html">...</file> only. No markdown fences.`;
const SYS_MIN='XMM Code (advanced). Output <file path="name">contents</file> only. Ultra short. Multi-step internal reasoning. No fences. /no_think';
const TOK=s=>window.XMM_TOK?XMM_TOK(s):Math.ceil(String(s).length/3);
const Q=s=>E(s).replace(/"/g,"&quot;");
const ctx=(room)=>{const names=[...Object.keys(files).map(p=>p+" ("+files[p].length+" chars)"),...Object.keys(bin).map(p=>p+" (asset, "+Math.round(bin[p].length*.75/1024)+" KB)")];
 let out="PROJECT FILES ("+names.length+"):\n"+names.join("\n").slice(0,700)+"\n\n";
 const last=(hist.slice(-1)[0]||{}).content||"";
 const sc=p=>(p==="index.html"?2:0)+(last.includes(p)?3:0)+(/\.(html?|css|js)$/.test(p)?1:0);
 const keys=Object.keys(files).sort((a,b)=>sc(b)-sc(a));let budget=room||5000;
 for(const p of keys){let c=files[p];if(budget<400)break;if(c.length>budget)c=c.slice(0,budget)+"\n[... "+(files[p].length-budget)+" more characters not shown ...]";out+=`<file path="${p}">\n${c}\n</file>\n`;budget-=c.length}
 return Object.keys(files).length?"CURRENT PROJECT:\n"+out:(names.length?"CURRENT PROJECT (assets only):\n"+out:"The project is empty.")};
const IMG=/\.(png|jpe?g|gif|webp|avif|bmp|ico|svg)$/i,MIME={png:"image/png",jpg:"image/jpeg",jpeg:"image/jpeg",gif:"image/gif",webp:"image/webp",avif:"image/avif",bmp:"image/bmp",ico:"image/x-icon",mp3:"audio/mpeg",wav:"audio/wav",ogg:"audio/ogg",mp4:"video/mp4",webm:"video/webm",woff:"font/woff",woff2:"font/woff2",ttf:"font/ttf",otf:"font/otf",pdf:"application/pdf"};
const TXT=/\.(html?|css|js|mjs|cjs|jsx|ts|tsx|json|md|txt|xml|csv|svg|yml|yaml|py|sh|bat|php|vue|svelte|ini|toml|webmanifest)$/i;
const ext=p=>(p.split(".").pop()||"").toLowerCase(),dirOf=p=>p.split("/").slice(0,-1).join("/");
const rs=(base,rel)=>{rel=String(rel||"").split("#")[0].split("?")[0];try{rel=decodeURIComponent(rel)}catch{}if(!rel)return"";const parts=rel[0]==="/"?[]:base.split("/").filter(Boolean);for(const g of rel.split("/")){if(g==="..")parts.pop();else if(g&&g!==".")parts.push(g)}return parts.join("/")};
const isExt=u=>/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(String(u).trim());
const svgURL=t=>"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(t);
const assetURL=p=>bin[p]||(ext(p)==="svg"&&files[p]!=null?svgURL(files[p]):null);
const exists=p=>files[p]!=null||bin[p]!=null;
const resolvePage=p=>{if(p&&exists(p))return p;if(p===""&&exists("index.html"))return"index.html";if(p&&exists(p+".html"))return p+".html";if(p&&exists(p+"/index.html"))return p+"/index.html";return null};
const allPaths=()=>[...Object.keys(files),...Object.keys(bin)].sort();
const firstPage=()=>files["index.html"]!=null?"index.html":(Object.keys(files).find(p=>/\.html?$/i.test(p))||"");
const cssUrls=(css,base)=>css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g,(m,q,u)=>{if(isExt(u))return m;const a=assetURL(rs(base,u));return a?`url("${a}")`:m});
const NAVJS=`addEventListener("error",function(e){parent.postMessage({xerr:e.message+" ("+String(e.filename||"").split("/").pop()+":"+e.lineno+")"},"*")});addEventListener("unhandledrejection",function(e){parent.postMessage({xerr:"Promise: "+(e.reason&&e.reason.message||e.reason)},"*")});document.addEventListener("click",function(e){var t=e.target&&e.target.closest?e.target:null;if(!t)return;var a=t.closest("a[href]");if(a){var h=a.getAttribute("href");if(!h||h.charAt(0)==="#"||/^(javascript:|mailto:|tel:|data:|blob:)/i.test(h))return;e.preventDefault();parent.postMessage({xnav:h,blank:a.target==="_blank"},"*");return}var o=t.closest("[onclick]");if(o){var m=(o.getAttribute("onclick")||"").match(/location(?:\\.href)?\\s*=\\s*['"]([^'"]+)['"]|location\\.(?:assign|replace)\\(\\s*['"]([^'"]+)['"]/);if(m){e.preventDefault();e.stopImmediatePropagation();parent.postMessage({xnav:m[1]||m[2]},"*")}}},true);document.addEventListener("submit",function(e){e.preventDefault();var f=e.target,ac=f.getAttribute&&f.getAttribute("action");if(ac&&!/^(javascript:|#)/.test(ac))parent.postMessage({xnav:ac},"*")},true);`;
function build(inl,pg){pg=pg||"index.html";let h=files[pg];if(h==null)return"";const base=dirOf(pg);
 h=h.replace(/<link\b[^>]*>/gi,m=>{const hr=(m.match(/href=["']([^"']+)["']/i)||[])[1];if(!hr||isExt(hr))return m;const p=rs(base,hr);if(/rel=["']?stylesheet/i.test(m)&&files[p]!=null)return`<style>${cssUrls(files[p],dirOf(p))}</style>`;if(/rel=["'](shortcut )?icon/i.test(m)){const a=assetURL(p);if(a)return m.replace(hr,a)}return m});
 h=h.replace(/<script\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi,(m,a,sr,b)=>{if(isExt(sr))return m;const p=rs(base,sr);return files[p]!=null?`<script${a}${b}>${files[p].replace(/<\/script/gi,"<\\/script")}<\/script>`:m});
 h=h.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi,(m,a,c)=>`<style${a}>${cssUrls(c,base)}</style>`);
 h=h.replace(/\b(src|poster|data-src)=["']([^"']+)["']/gi,(m,k,u)=>{if(isExt(u))return m;const a=assetURL(rs(base,u));return a?`${k}="${a}"`:m});
 if(!inl){const inj=`<script>${NAVJS}<\/script>`;h=/<head[^>]*>/i.test(h)?h.replace(/<head[^>]*>/i,m=>m+inj):inj+h}
 return h}
function crc(b){let c,t=crc.t||(crc.t=[...Array(256)].map((_,n)=>{c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c>>>0}));c=-1;for(const x of b)c=t[(c^x)&255]^(c>>>8);return(c^-1)>>>0}
function entries(){const en=new TextEncoder(),o=[];for(const[p,c]of Object.entries(files))o.push([p,en.encode(c)]);for(const[p,u]of Object.entries(bin)){try{const b=atob(u.split(",")[1]||"");const a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);o.push([p,a])}catch{}}return o}
function zip(){const en=new TextEncoder(),parts=[],cd=[],E2=entries();let off=0;const u16=n=>[n&255,n>>8&255],u32=n=>[n&255,n>>8&255,n>>16&255,n>>24&255];
 for(const[p,d]of E2){const n=en.encode(p),cr=crc(d);const h=new Uint8Array([0x50,0x4b,3,4,20,0,0,8,0,0,0,0,0,0,...u32(cr),...u32(d.length),...u32(d.length),...u16(n.length),0,0]);parts.push(h,n,d);
  cd.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,8,0,0,0,0,0,0,...u32(cr),...u32(d.length),...u32(d.length),...u16(n.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(off)]),n);off+=h.length+n.length+d.length}
 const csz=cd.reduce((s,x)=>s+x.length,0),cnt=E2.length;return new Blob([...parts,...cd,new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(cnt),...u16(cnt),...u32(csz),...u32(off),0,0])],{type:"application/zip"})}
const dl=(blob,name)=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)};
const unfence=c=>c.replace(/^\s*```[\w-]*\n/,"").replace(/\n```\s*$/,"");
function touchify(names){
 names.forEach(p=>{let t=files[p];if(!/\.html?$/i.test(p)||typeof t!=="string"||!/<html|<body/i.test(t)||t.indexOf("xmm-touch")>-1)return;
  const hasT=/touchstart|pointerdown|pointermove|ontouch/i.test(t),mouse=/mousedown|mousemove|mouseup|onmouse/i.test(t),keys=/keydown|keyup/i.test(t)&&/Arrow|keyCode|\.key\b/.test(t);
  let head='<!--xmm-touch-->'+(/name\s*=\s*["']viewport/i.test(t)?'':'<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">')+'<style>html,body{touch-action:manipulation;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;overscroll-behavior:none}canvas{touch-action:none}button,a,[onclick]{touch-action:manipulation}input,select,textarea{font-size:16px}#xk{position:fixed;left:0;right:0;bottom:calc(10px + env(safe-area-inset-bottom,0px));display:none;justify-content:space-between;padding:0 14px;pointer-events:none;z-index:99999}#xk div{display:grid;grid-template:repeat(2,52px)/repeat(3,52px);gap:6px;pointer-events:auto}#xk button{width:52px;height:52px;border:0;border-radius:14px;background:rgba(120,120,140,.5);color:#fff;font:700 20px system-ui;touch-action:none}@media (pointer:coarse){#xk{display:flex}}</style>';
  let tail='';
  if(mouse&&!hasT)tail+='<script>(function(){function f(n,e){var t=e.changedTouches[0],m=new MouseEvent(n,{bubbles:true,cancelable:true,clientX:t.clientX,clientY:t.clientY,view:window});t.target.dispatchEvent(m)}document.addEventListener("touchstart",function(e){f("mousedown",e)},{passive:true});document.addEventListener("touchmove",function(e){f("mousemove",e);if(e.target.tagName==="CANVAS")e.preventDefault()},{passive:false});document.addEventListener("touchend",function(e){f("mouseup",e)},{passive:true})})();</script>';
  if(keys&&!hasT&&!/<input|<textarea/i.test(t))tail+='<div id="xk"><div><span></span><button data-k="ArrowUp" data-c="38">\u25B2</button><span></span><button data-k="ArrowLeft" data-c="37">\u25C0</button><button data-k="ArrowDown" data-c="40">\u25BC</button><button data-k="ArrowRight" data-c="39">\u25B6</button></div><div><button data-k=" " data-c="32">A</button></div></div><script>(function(){function k(t,b){var o={key:b.dataset.k,code:b.dataset.k===" "?"Space":b.dataset.k,keyCode:+b.dataset.c,which:+b.dataset.c,bubbles:true,cancelable:true},e=new KeyboardEvent(t,o);try{Object.defineProperty(e,"keyCode",{get:function(){return o.keyCode}});Object.defineProperty(e,"which",{get:function(){return o.keyCode}})}catch(x){}document.dispatchEvent(e);window.dispatchEvent(new KeyboardEvent(t,o))}document.querySelectorAll("#xk button").forEach(function(b){b.addEventListener("pointerdown",function(e){e.preventDefault();k("keydown",b);b._i=setInterval(function(){k("keydown",b)},90)});["pointerup","pointercancel","pointerleave"].forEach(function(n){b.addEventListener(n,function(){clearInterval(b._i);k("keyup",b)})})})})();</script>';
  t=/<\/head>/i.test(t)?t.replace(/<\/head>/i,head+'</head>'):t.replace(/<html[^>]*>/i,m=>m+'<head>'+head+'</head>');
  if(tail)t=/<\/body>/i.test(t)?t.replace(/<\/body>/i,tail+'</body>'):t+tail;
  files[p]=t})}
function parse(t){const out={};t.replace(/<file\s+path\s*=\s*["']?([^"'>\s]+)["']?\s*>\n?([\s\S]*?)(?:<\/file>|$)/g,(m,p,c)=>{out[p.trim().replace(/^\.?\//,"")]=unfence(c.replace(/\n$/,""))});return out}
function parseEdits(t){const o=[],cut=x=>x.replace(/^\n/,"").replace(/\n$/,"");t.replace(/<edit\s+path\s*=\s*["']?([^"'>\s]+)["']?\s*>\s*<find>([\s\S]*?)<\/find>\s*<replace>([\s\S]*?)<\/replace>\s*<\/edit>/g,(m,p,f,r)=>{o.push({p:p.trim().replace(/^\.?\//,""),f:cut(f),r:cut(r)})});return o}
function applyEdits(ed){const fails=[];for(let e of ed){const c=files[e.p];if(c==null){fails.push("edit target "+e.p+" does not exist");continue}let i=c.indexOf(e.f);if(i<0){const nf=e.f.trim();i=nf?c.indexOf(nf):-1;if(i<0){fails.push("edit in "+e.p+": the find text was not found");continue}e={...e,f:nf,r:e.r.trim()}}files[e.p]=c.slice(0,i)+e.r+c.slice(i+e.f.length)}return fails}
function lint(){const P=[],H=Object.keys(files).filter(p=>/\.html?$/i.test(p));
 if(!H.length&&Object.keys(files).some(p=>/\.(css|js)$/.test(p)))P.push("There is no HTML page (index.html), so nothing can be previewed.");
 if(H.length&&!files["index.html"])P.push("index.html (the entry page) is missing.");
 for(const p of H){const h=files[p],base=dirOf(p);
  if(!/<\/html>/i.test(h)||!/<\/body>/i.test(h))P.push(p+" looks cut off or incomplete (missing </body> or </html>). Resend it complete.");
  let css=0;(h.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)||[]).forEach(x=>{if(x.length>120)css=1});
  const refs=[...h.matchAll(/<(?:link|script|img|source|video|audio|a)\b[^>]*?\b(?:href|src)=["']([^"']+)["']/gi)].map(m=>m[1]);
  for(const u of refs){if(isExt(u))continue;const q=rs(base,u);if(!q)continue;if(!exists(q)&&!resolvePage(q))P.push(p+' references a missing file "'+u+'". Create it or fix the path.')}
  (h.match(/<link\b[^>]*rel=["']?stylesheet[^>]*>/gi)||[]).forEach(m=>{const hr=(m.match(/href=["']([^"']+)["']/i)||[])[1];if(!hr)return;if(isExt(hr)){css=1;return}const q=rs(base,hr);if(files[q]!=null&&files[q].trim().length>80)css=1});
  if(!css)P.push(p+" has no real CSS styling (no stylesheet or <style> with rules). Add a complete professional stylesheet and link it.");
  [...h.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type=["']?(?:module|application\/json|importmap|text\/template))[^>]*>([\s\S]*?)<\/script>/gi)].forEach(m=>{try{new Function(m[1])}catch(e){if(!/import|export/.test(e.message))P.push(p+" inline script has a syntax error: "+e.message)}});
  if(/location(?:\.href)?\s*=\s*['"][^'"#]+\.html?['"]/.test(h))P.push(p+" navigates with JavaScript location changes. Use <a href=\"page.html\"> links instead.")}
 for(const p of Object.keys(files)){const c=files[p];
  if(/\.(js|mjs)$/.test(p)&&!/^\s*(import|export)\s/m.test(c)){try{new Function(c)}catch(e){P.push(p+" has a syntax error: "+e.message)}}
  if(/\.css$/.test(p)){let d=0;for(const ch of c)d+=ch==="{"?1:ch==="}"?-1:0;if(d!==0)P.push(p+" has unbalanced braces (probably cut off).")}
  if(/\.json$/.test(p)){try{JSON.parse(c)}catch(e){P.push(p+" is invalid JSON.")}}}
 {const hs=H.map(p=>files[p]),all=hs.join("\n"),js=Object.keys(files).filter(p=>/\.m?js$/.test(p)).map(p=>files[p]).join("\n")+"\n"+hs.map(h=>(h.match(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi)||[]).join("\n")).join("\n"),text=all+"\n"+js,ids=new Set([...all.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(m=>m[1])),calls={};
  for(const m of js.matchAll(/getElementById\(\s*["']([^"']+)["']\s*\)/g))calls[m[1]]=(calls[m[1]]||0)+1;
  for(const m of js.matchAll(/querySelector\(\s*["']#([\w-]+)["']\s*\)/g))calls[m[1]]=(calls[m[1]]||0)+1;
  const miss=Object.keys(calls).filter(x=>!ids.has(x)&&text.split(x).length-1===calls[x]);
  if(H.length&&miss.length)P.push("The JavaScript uses element id(s) that do not exist in the HTML: "+miss.slice(0,4).join(", ")+". Add the elements or fix the ids.")}
 return[...new Set(P)].slice(0,8)}
function ui(){root=document.createElement("div");root.id="code";root.className="preview-only";root.innerHTML=`<header class="topbar"><button class="icon-btn" id="cdBack" aria-label="Close">${API().ic("close")||API().ic("back")}</button><span class="cd-title">Files &amp; Preview</span><div class="spacer"></div><button class="icon-btn cd-zipbtn" id="cdZipTop" aria-label="Download ZIP" title="Download ZIP"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg></button><button class="icon-btn" id="cdReload" aria-label="Reload preview" title="Reload">${API().ic("regen")||"↻"}</button></header>
<div class="cd cd-preview-only"><section class="cd-r"><div class="cd-tabs" id="cdTabs"></div><div class="cd-body" id="cdBody"></div></section></div>`;document.body.appendChild(root);root.style.animation="none";if(window.XMM_FX)XMM_FX.grow(root,XMM_FX.origin(),{dur:XMM_FX.T.code});
 $("#cdBack").onclick=close;
 const rl=$("#cdReload");if(rl)rl.onclick=()=>show(true);const zt=$("#cdZipTop");if(zt)zt.onclick=()=>{if(!allPaths().length){API().toast("Nothing to download yet");return}dl(zip(),"xmm-project.zip")};
 tabs();
}
function log(r,t){const l=$("#cdLog");if(!l){const d=document.createElement("div");d.className=r==="user"?"m-uw":"m-bot";d.innerHTML=r==="user"?`<div class="m-user">${E(t)}</div>`:`<div class="body">${API().md(t||"")}</div>`;return d}const f=l.querySelector(".cd-empty");f&&f.remove();const d=document.createElement("div");d.className=r==="user"?"m-uw":"m-bot";d.innerHTML=r==="user"?`<div class="m-user">${E(t)}</div>`:`<div class="body">${API().md(t||"")}</div>`;l.appendChild(d);l.scrollTop=l.scrollHeight;return d}
function step(t,ok,detail){const l=$("#cdLog");const d=document.createElement("div");d.className="stp"+(ok?" done":" active");d.dataset.detail=detail||"";d.innerHTML=`<span class="stp-ic">${ok?"✓":"⟳"}</span><span class="stp-tx">${E(t)}</span>`;if(detail){d.style.cursor="pointer";d.title="Click for details";d.onclick=()=>{const ex=d.querySelector(".stp-ex");if(ex){ex.remove();return}const x=document.createElement("div");x.className="stp-ex";x.innerHTML=API().md?API().md(detail):E(detail);d.appendChild(x)}}if(l){l.appendChild(d);l.scrollTop=l.scrollHeight}return d}
function renderCdAtts(){const el=$("#cdAtts");if(!el)return;el.innerHTML=cdAtt.map((a,i)=>`<div class="cd-att${a.img?" has-img":""}">${a.img?`<img src="${a.img}" alt="">`:`<span class="cd-att-ic">${API().ic("file")}</span>`}<span>${E(a.name)}</span><button class="icon-btn sm" data-cdrm="${i}" aria-label="Remove">${API().ic("close")}</button></div>`).join("");
 el.onclick=e=>{const b=e.target.closest("[data-cdrm]");if(b){cdAtt.splice(+b.dataset.cdrm,1);renderCdAtts()}}}
const idb=(m,k,v)=>new Promise(res=>{try{const q=indexedDB.open(window.__xmmCodeSandbox||"xmmcode",1);q.onupgradeneeded=()=>q.result.createObjectStore("b");q.onerror=()=>res(null);q.onsuccess=()=>{try{const d=q.result,t=d.transaction("b",m==="get"?"readonly":"readwrite"),o=t.objectStore("b"),r=m==="get"?o.get(k):m==="set"?o.put(v,k):o.delete(k);r.onsuccess=()=>res(r.result);r.onerror=()=>res(null)}catch{res(null)}}}catch{res(null)}});
let binT;const saveBin=()=>{clearTimeout(binT);const id=st.cur,b=bin;binT=setTimeout(()=>{if(id)idb("set",id,b)},300)};
const rd=(f,asText)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;asText?r.readAsText(f):r.readAsDataURL(f)});
const u8url=(u,mime)=>new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result);r.readAsDataURL(new Blob([u],{type:mime}))});
async function unzip(buf){const dv=new DataView(buf),u8=new Uint8Array(buf),td=new TextDecoder();let e=-1;for(let i=u8.length-22;i>=Math.max(0,u8.length-65558);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}if(e<0)throw new Error("Not a valid ZIP file");
 const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out=[];
 for(let k=0;k<n;k++){if(dv.getUint32(p,true)!==0x02014b50)break;const method=dv.getUint16(p+10,true),csz=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),off=dv.getUint32(p+42,true);const name=td.decode(u8.subarray(p+46,p+46+nl));p+=46+nl+xl+cl;if(name.endsWith("/"))continue;
  const lnl=dv.getUint16(off+26,true),lxl=dv.getUint16(off+28,true),ds=off+30+lnl+lxl;let data=u8.subarray(ds,ds+csz);
  if(method===8){const st2=new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));data=new Uint8Array(await new Response(st2).arrayBuffer())}else if(method!==0)continue;out.push({name,data})}
 return out}
async function importZip(f){let ents=(await unzip(await f.arrayBuffer())).filter(e=>!/(^|\/)(__MACOSX|node_modules|\.git|\.idea|\.vscode)(\/|$)|\.DS_Store$/.test(e.name));
 const roots=new Set(ents.map(e=>e.name.split("/")[0]));if(roots.size===1&&ents.length&&ents.every(e=>e.name.includes("/"))){const r=[...roots][0]+"/";ents=ents.map(e=>({...e,name:e.name.slice(r.length)}))}
 let nt=0,nb=0,skip=0;for(const e of ents.slice(0,400)){const name=e.name.replace(/^\/+/,"");if(!name)continue;
  if(TXT.test(name)){if(e.data.length>600000){skip++;continue}files[name]=new TextDecoder().decode(e.data);nt++}
  else if(MIME[ext(name)]&&e.data.length<=3e6){bin[name]=await u8url(e.data,MIME[ext(name)]);nb++}else skip++}
 return{nt,nb,skip}}
async function addCodeFiles(list){if(!list||!list.length)return;const msg=[];
 for(const f of[...list].slice(0,40)){try{const name=(f.name||"file").replace(/[^\w.\-]+/g,"_").slice(0,80);
  if(/\.zip$/i.test(name)||f.type==="application/zip"||f.type==="application/x-zip-compressed"){if(typeof DecompressionStream==="undefined"){API().toast("This browser can't open ZIP files");continue}const r=await importZip(f);msg.push("ZIP: "+r.nt+" file(s), "+r.nb+" asset(s)"+(r.skip?", "+r.skip+" skipped":""));cdAtt.push({name,isZip:1})}
  else if((/^image\//.test(f.type)||IMG.test(name))&&ext(name)!=="svg"){const url=await rd(f,false),p="images/"+name;bin[p]=url;cdAtt.push({name:p,img:url,isImg:1,path:p})}
  else if(MIME[ext(name)]&&!TXT.test(name)){const p="assets/"+name;bin[p]=await rd(f,false);cdAtt.push({name:p,isBin:1,path:p})}
  else{files[name]=await rd(f,true);cdAtt.push({name,path:name,isCode:1})}
 }catch(e){API().toast("Could not read "+(f.name||"file"))}}
 save();saveBin();renderCdAtts();page=firstPage();tab=page?"preview":"files";pgHist=[];tabs();show(true);if(msg.length)API().toast(msg.join(" · "))}
function attNote(){if(!cdAtt.length)return"";const L=[];if(cdAtt.some(a=>a.isZip))L.push("A ZIP project was just extracted into the project. The full file tree is listed in PROJECT FILES. Read the relevant files before changing anything.");
 const c=cdAtt.filter(a=>a.isCode).map(a=>a.path);if(c.length)L.push("Uploaded files now in the project: "+c.join(", ")+".");
 const i=cdAtt.filter(a=>a.isImg||a.isBin).map(a=>a.path);if(i.length)L.push("Uploaded image/asset files now in the project (use these exact relative paths in HTML/CSS, e.g. <img src=\""+i[0]+"\">): "+i.join(", ")+".");
 return"\n\n"+L.join("\n")}
const fmt=n=>n<1024?n+" B":n<1048576?(n/1024).toFixed(1)+" KB":(n/1048576).toFixed(1)+" MB";
function tabs(){const T=$("#cdTabs");if(!T)return;const k=allPaths(),open=tab!=="preview"&&tab!=="files"?tab:null;
 T.innerHTML=`<button data-t="preview" class="${tab==="preview"?"on":""}">Preview</button><button data-t="files" class="${tab==="files"?"on":""}">Files${k.length?" · "+k.length:""}</button>`+(open?`<button data-t="${Q(open)}" class="on">${E(open.split("/").pop())}</button>`:"")+`<span class="sp"></span>`+(k.length?`<button data-x="zip">⬇ ZIP</button><button data-x="html">⬇ HTML</button>`:"")+`<button data-x="reload">↻</button>`;
 T.onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.t){tab=b.dataset.t;tabs()}else if(b.dataset.x==="zip")dl(zip(),"xmm-project.zip");else if(b.dataset.x==="html")dl(new Blob([build(true,page||firstPage())],{type:"text/html"}),"app.html");else if(b.dataset.x==="reload")show(true)};show()}
function nav(h){if(!h)return;if(/^(https?:)?\/\//i.test(h)){window.open(h.startsWith("//")?"https:"+h:h,"_blank","noopener");return}
 const q=rs(dirOf(page||"index.html"),h),p=resolvePage(q);
 if(!p){const f=document.querySelector("#cdBody iframe");if(f)f.srcdoc='<body style="font:16px system-ui;padding:40px;color:#444"><h2>Page not found</h2><p>'+E(h)+" does not exist in this project yet.</p></body>";return}
 if(/\.html?$/i.test(p)){if(p!==page){pgHist.push(page);page=p}show(true)}else window.open(assetURL(p)||URL.createObjectURL(new Blob([files[p]||""])),"_blank")}
if(!window.__xmmMsg){window.__xmmMsg=1;addEventListener("message",e=>{const d=e.data;if(!d||!root)return;const f=document.querySelector("#cdBody iframe");if(!f||e.source!==f.contentWindow)return;if(d.xnav!=null)nav(d.xnav);else if(d.xerr&&!/^Script error/i.test(d.xerr)&&errs.length<5&&!errs.includes(d.xerr))errs.push(d.xerr)})}
function show(force){const B=$("#cdBody");if(!B)return;
 if(tab==="preview"){if(!page||files[page]==null)page=firstPage();const h=page?build(false,page):"";if(!h){B.dataset.h="";B.innerHTML='<div class="cd-empty">The live preview appears here.</div>';return}
  const key=page+"|"+h;if(force||!B.querySelector("iframe")||B.dataset.h!==key){B.dataset.h=key;const pages=Object.keys(files).filter(p=>/\.html?$/i.test(p));
   B.innerHTML=`<div class="cd-pv"><div class="cd-pbar"><button data-pb="back" ${pgHist.length?"":"disabled"} aria-label="Back">‹</button>${pages.length>1?`<select data-pb="sel">${pages.map(p=>`<option ${p===page?"selected":""} value="${Q(p)}">${E(p)}</option>`).join("")}</select>`:`<span class="cd-pn">${E(page)}</span>`}<button data-pb="rl" aria-label="Reload">↻</button></div><iframe sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"></iframe></div>`;
   const f=B.querySelector("iframe");f.onload=()=>{try{const u=f.contentWindow.location;if(u.protocol!=="about:"){const base=location.pathname.replace(/[^/]*$/,"");let p=decodeURIComponent(u.pathname);if(p.startsWith(base))p=p.slice(base.length);nav(p)}}catch(_){}};f.srcdoc=h;
   B.querySelector(".cd-pbar").onclick=e=>{const b=e.target.closest("[data-pb]");if(!b)return;if(b.dataset.pb==="back"&&pgHist.length){page=pgHist.pop();show(true)}else if(b.dataset.pb==="rl")show(true)};
   const sel=B.querySelector("select");if(sel)sel.onchange=()=>{if(sel.value!==page){pgHist.push(page);page=sel.value;show(true)}}}}
 else if(tab==="files"){B.dataset.h="";const k=allPaths();
  B.innerHTML=`<div class="cd-fl">${k.length?k.map(p=>{const im=bin[p]&&(MIME[ext(p)]||"").startsWith("image");return`<div class="cd-f" data-f="${Q(p)}"><span class="cd-fi">${im?`<img src="${bin[p]}" alt="">`:/\.html?$/i.test(p)?"🌐":/\.css$/i.test(p)?"🎨":/\.(m?js|ts)$/i.test(p)?"⚙️":"📄"}</span><span class="cd-fn">${E(p)}</span><small>${fmt(files[p]!=null?files[p].length:Math.round(bin[p].length*.75))}</small><button class="cd-fd" data-d="${Q(p)}" aria-label="Delete">✕</button></div>`}).join(""):'<div class="cd-empty">No files yet. Ask me to build something, or upload a ZIP.</div>'}</div>`;
  B.firstChild.onclick=e=>{const d=e.target.closest("[data-d]");if(d){const p=d.dataset.d;delete files[p];delete bin[p];save();saveBin();tabs();return}const f=e.target.closest("[data-f]");if(f){tab=f.dataset.f;tabs()}}}
 else{B.dataset.h="";const p=tab;
  if(bin[p]){const m=MIME[ext(p)]||"";B.innerHTML=`<div class="cd-asset">${m.startsWith("image")?`<img src="${bin[p]}" alt="">`:m.startsWith("video")?`<video src="${bin[p]}" controls></video>`:m.startsWith("audio")?`<audio src="${bin[p]}" controls></audio>`:`<p>Binary file</p>`}<small>${E(p)} · ${fmt(Math.round(bin[p].length*.75))}</small></div>`;return}
  B.innerHTML=`<textarea class="cd-ed" spellcheck="false"></textarea>`;const t=B.firstChild;t.value=files[p]||"";t.oninput=()=>{files[p]=t.value;save()}}}
async function run(text,auto){text=(text||"").trim();const note=attNote();if((!text&&!cdAtt.length)||busy)return;
 if(!text)text=cdAtt.some(a=>a.isZip)?"I uploaded a ZIP project. Look through it, tell me briefly what it contains and how it is structured, then wait for my instructions.":"Use the uploaded files"+(cdAtt.some(a=>a.isImg)?" and images":"")+" to build a polished result.";
 const inp=$("#cdIn");if(inp){inp.value="";inp.style.height="auto"}if(!auto){fixes=0;log("user",text+(cdAtt.length?"  ["+cdAtt.map(a=>a.name).join(", ")+"]":""))}else step("Auto-fixing: "+text.split("\n")[0].slice(0,70));
 cdAtt=[];renderCdAtts();busy=true;dispatchEvent(new Event("xmm-code-start"));ctrl=new AbortController();const go=$("#cdGo");if(go)go.innerHTML=API().ic("stop");errs=[];if(root&&innerWidth<=820)root.classList.remove("pv");
 const bubble=log("bot",""),b=bubble.querySelector(".body");if(b)b.innerHTML='<span class="think"><i></i><i></i><i></i>&nbsp;Planning…</span>';hist.push({role:"user",content:text+note});
 let full="",seen={},err=null,touched=false,fails=[];const C=API().CFG,model=C.CODE_MODEL||C.SMART_MODEL||C.TEXT_MODEL;
 const HIST=()=>window.XMM_PICK(hist.map(m=>({role:m.role,content:m.content})),T.name==="dev"?24:12,T.name==="dev"?20000:2600);
 const msgs=()=>{const h=HIST(),ht=h.reduce((n,m)=>n+TOK(m.content),0);return[{role:"system",content:SYS+"\n\n"+ctx(Math.max(1200,Math.floor((T.inCap-TOK(SYS)-ht-250)*3)))},...h]};
 const lastU=(hist.filter(m=>m.role==="user").slice(-1)[0]||{}).content||"";
 const openTag=t=>{const m=[...t.matchAll(/<file\s+path\s*=\s*["']?([^"'>\s]+)["']?\s*>/g)];return m.length?m[m.length-1][1]:""};
 const cont=base=>{const p=openTag(base);return[{role:"system",content:SYS_MIN},{role:"user",content:"Task: "+lastU.slice(0,700)},{role:"assistant",content:"[earlier part omitted]\n"+base.slice(-3000)},{role:"user",content:"Your last message was cut off while writing "+(p||"a file")+". The very last characters were: «"+base.slice(-80).replace(/\n/g,"⏎")+"». Continue EXACTLY from that point: output only the remaining raw text of that file, then its closing </file> tag, then any remaining files. Do not repeat earlier text, no markdown fences, no explanation."}]};
 const unclosed=t=>(t.match(/<file\s+path\s*=/g)||[]).length>(t.match(/<\/file>/g)||[]).length||(t.match(/<edit\s+path\s*=/g)||[]).length>(t.match(/<\/edit>/g)||[]).length;
 const live=()=>""; 
 const onW=e=>{if(!full&&b)b.innerHTML='<span class="think"><i></i><i></i><i></i>&nbsp;API limit reached, waiting '+e.detail+'s…</span>'};addEventListener("xmm-wait",onW);
 const prose=t=>t.split(/<file\s+path\s*=|<edit\s+path\s*=/)[0];
 let pT=0,pLast="",lastLive=0,liveSteps=[];const paint=t=>{pLast=t;if(pT)return;pT=setTimeout(()=>{pT=0;paint0(pLast)},90)};
 const hlCode=(code,lang)=>{try{if(window.hl)return window.hl(code,lang);if(typeof hl==="function")return hl(code,lang)}catch(e){}return E(code)};
 const paint0=t=>{try{window.__xmmThought=prose(t).trim()}catch(_){}const f=parse(t);const now=performance.now();if(now-lastLive>700&&Object.keys(f).length){lastLive=now;Object.assign(files,f);if(!page||files[page]==null)page=firstPage();if(page&&/<body/i.test(files[page]||"")){tab="preview";tabs();show(true)}}const n=Object.keys(f).length;const curPath=openTag(t)||(n?Object.keys(f).pop():"");const curCode=curPath&&f[curPath]?f[curPath].slice(-1200):"";const lang=curPath?ext(curPath):"js";
  if(b){const prog=n?`<div class="cd-live"><div class="cd-live-hd"><span class="cd-live-ic">⚡</span><span>Writing <b>${E(curPath||"files")}</b> · ${n} file${n>1?"s":""}</span><span class="cd-live-pct">${Math.min(99,Math.round((t.length/6000)*100))}%</span></div><div class="cd-live-bar"><i style="width:${Math.min(99,Math.round((t.length/6000)*100))}%"></i></div>${curCode?`<pre class="cd-live-code"><code>${hlCode(curCode,lang)}</code></pre>`:""}<div class="cd-live-stps">${liveSteps.map(s=>`<div class="stp ${s.ok?"done":"active"}"><span class="stp-ic">${s.ok?"✓":"⟳"}</span>${E(s.t)}</div>`).join("")}</div></div>`:'<span class="think"><i></i><i></i><i></i>&nbsp;'+(prose(t).slice(0,80)||"Building…")+'</span>';b.innerHTML=prog}const lg=$("#cdLog");if(lg)lg.scrollTop=1e9};
 try{if(API().S&&/^sun(62|70)$/.test(API().S.mode)&&lastU.trim().length>14&&!/^[\d\s+\-*\/().,x=?]+$/.test(lastU.trim())){if(b)b.innerHTML='<span class="think"><i></i><i></i><i></i>&nbsp;Thinking…</span>';await new Promise(r=>{const id=setTimeout(r,120000);ctrl.signal.addEventListener("abort",()=>{clearTimeout(id);r()},{once:true})});if(ctrl.signal.aborted)throw new DOMException("Aborted","AbortError")}
  let plan="";
  if(!auto&&lastU.trim().length>40){const st0=step("Planning the architecture…");liveSteps.push({t:"Planning the architecture…",ok:0});
   try{plan=String(await API().groq([{role:"system",content:"You are a staff engineer with advanced multi-step reasoning. Reason step by step, then output a compact build plan: 1) exact features, 2) data/state model, 3) key functions, 4) edge cases and bugs to avoid, 5) UI layout. Max 220 words. No code. /no_think"},{role:"user",content:lastU.slice(0,1500)}],{model,stream:false,signal:ctrl.signal,maxTokens:700,temp:.2,reason:"medium"})||"").slice(0,1800);st0.innerHTML="<span class=\"stp-ic\">✓</span><span class=\"stp-tx\">Plan ready</span>";st0.classList.add("done");liveSteps[liveSteps.length-1].ok=1;if(b)paint0(full||"")}catch(e){if(e&&e.name==="AbortError")throw e;st0.innerHTML="<span class=\"stp-ic\">–</span><span class=\"stp-tx\">Plan skipped</span>";liveSteps[liveSteps.length-1].ok=1}}
  const msgsP=()=>{const m=msgs();if(plan)m[0]={role:"system",content:m[0].content+"\n\nBUILD PLAN (follow it, fix any flaw you notice):\n"+plan};return m};
  await API().groq(msgsP(),{model,stream:true,signal:ctrl.signal,maxTokens:T.outCode,temp:.3,reason:"medium",autoCont:false,onDelta:t=>{full=t;paint(t)}});
  clearTimeout(pT);pT=0;paint0(full);
  let dry=0;
  for(let i=0;i<14&&unclosed(full);i++){const base=full,nm=openTag(base)||"file",st=step("Continuing "+nm+" (part "+(i+2)+")…");liveSteps.push({t:"Continuing "+nm+" (part "+(i+2)+")…",ok:0});
   const from=window.__xmmBackup||"";try{API().toast("Output was cut off: switching provider and continuing")}catch(e){}
   await API().groq(cont(base),{model,stream:true,raw:true,signal:ctrl.signal,maxTokens:T.outCode,temp:.3,switchFrom:from,autoCont:false,onDelta:t=>{full=window.XMM_STITCH(base,t);paint(full)}});
   st.innerHTML="<span class=\"stp-ic\">✓</span><span class=\"stp-tx\">Continued "+E(nm)+"</span>";st.classList.add("done");liveSteps[liveSteps.length-1].ok=1;if(full.length-base.length<4){if(++dry>=2)break}else dry=0}
  clearTimeout(pT);pT=0;paint0(full);
  const f=parse(full),n=Object.keys(f);Object.assign(files,f);fails=applyEdits(parseEdits(full));touchify(Object.keys(files));touched=n.length>0||/<edit\s+path\s*=/.test(full);
  /* a page that was closed too early or lost its ending: ask only for the missing tail and splice it on */
  for(let r=0;r<3;r++){const bad=n.find(p=>/\.html?$/i.test(p)&&/<(html|body)\b/i.test(files[p])&&!/<\/html>\s*$/i.test(files[p].trim()));if(!bad)break;
   const st=step("Finishing the end of "+bad+"…");liveSteps.push({t:"Finishing the end of "+bad+"…",ok:0});let add="";
   await API().groq([{role:"system",content:SYS_MIN},{role:"user",content:"Task: "+lastU.slice(0,500)},{role:"assistant",content:'<file path="'+bad+'">\n[earlier part omitted]\n'+files[bad].slice(-3000)},{role:"user",content:"This file stops before its ending (unfinished code and/or the closing </script></body></html>). The very last characters were: «"+files[bad].slice(-80).replace(/\n/g,"⏎")+"». Continue EXACTLY from that point: output only the missing remaining text that completes the file, then </file>. Do not repeat anything and use no markdown fences."}],{model,stream:true,raw:true,signal:ctrl.signal,maxTokens:T.outCode,temp:.3,onDelta:t=>{add=t}});
   add=unfence(add.replace(/<\/file>[\s\S]*$/,"")).replace(/\n$/,"");if(add.trim().length<3){st.innerHTML="<span class=\"stp-ic\">–</span><span class=\"stp-tx\">Could not finish "+E(bad)+"</span>";liveSteps[liveSteps.length-1].ok=1;break}
   {const j=window.XMM_STITCH(files[bad],add);files[bad]=j===files[bad]+add?files[bad]+"\n"+add:j}st.innerHTML="<span class=\"stp-ic\">✓</span><span class=\"stp-tx\">Finished "+E(bad)+"</span>";st.classList.add("done");liveSteps[liveSteps.length-1].ok=1}
  n.forEach(p=>{if(seen[p]){seen[p].innerHTML="<span class=\"stp-ic\">✓</span><span class=\"stp-tx\">"+E(p)+"</span>";seen[p].classList.add("done");seen[p].dataset.f=p}});Object.keys(seen).filter(k=>k.startsWith("e:")).forEach(k=>{seen[k].innerHTML="<span class=\"stp-ic\">✓</span><span class=\"stp-tx\">Edited "+E(k.slice(2))+"</span>";seen[k].classList.add("done")});
  if(b){const s=(prose(full)||"").trim()||(touched?"Done.":"");const cards=n.length?`<div class="cd-files">${n.map(p=>`<div class="cd-fcard" data-fp="${Q(p)}"><span class="cd-fic">📄</span><div><b>${E(p)}</b><small>${fmt((files[p]||"").length)}</small></div><button class="cd-fdl" data-dl="${Q(p)}">Download</button></div>`).join("")}${n.length>1?`<button class="cd-fzip" data-zip="1">⬇ Download ZIP</button>`:""}</div>`:"";b.innerHTML=(API().md(s)||(touched?"✓ Build complete":""))+cards;if(b.querySelector(".cd-files")){b.querySelector(".cd-files").onclick=e=>{const btn=e.target.closest("[data-dl]");if(btn){const p=btn.dataset.dl;dl(new Blob([files[p]||""],{type:"text/plain"}),p.split("/").pop());return}if(e.target.closest("[data-zip]"))dl(zip(),"xmm-project.zip")}}}
  save();saveBin();if(!page||files[page]==null)page=firstPage();tab=page?"preview":(n[0]||tab);tabs();show(true)}
 catch(e){err=e}
 if(err){if(err.name==="AbortError"){step("Stopped",1);hist.push({role:"assistant",content:"(stopped)"})}else{if(b)b.innerHTML="⚠️ "+E(err.message);hist.pop();if(inp)inp.value=text}}
 else hist.push({role:"assistant",content:full.replace(/<file\s+path\s*=\s*["']?([^"'>\s]+)["']?\s*>[\s\S]*?(?:<\/file>|$)/g,"[wrote $1]").replace(/<edit\s+path\s*=\s*["']?([^"'>\s]+)["']?\s*>[\s\S]*?(?:<\/edit>|$)/g,"[edited $1]")});
 removeEventListener("xmm-wait",onW);save();busy=false;ctrl=null;dispatchEvent(new CustomEvent("xmm-code-end",{detail:{ok:!err&&touched}}));if($("#cdGo"))$("#cdGo").innerHTML=API().ic("arrow");
 if(!err&&touched&&root)setTimeout(()=>{if(busy||!root)return;const all=[...fails.map(x=>"Edit failed ("+x+"). Resend that file in full."),...lint(),...errs.map(x=>"Runtime error in the preview: "+x)];
  if(all.length&&fixes<3){fixes++;run("PROBLEMS found automatically in the project. Fix every one (use edit blocks or complete files) and make sure nothing else is broken:\n- "+all.join("\n- "),true)}
  else if(!all.length)step("Checked the project: no problems found",1);else step("Some problems remain: "+all[0].slice(0,90))},400)}
function isWide(){return window.matchMedia("(min-width:768px)").matches}
function syncPreviewBtn(){const b=document.getElementById("tbPreview");if(b)b.classList.toggle("on",!!(root&&root.isConnected))}
function open(id){/* Files & Preview removed — Build mode stays in chat */try{document.body.classList.remove("code-on");if(root){try{root.remove()}catch(e){}root=null}}catch(e){}opening=false;return}
function close(){const r=root;if(!r)return;document.body.classList.remove("code-on");r.style.pointerEvents="none";const b=document.getElementById("tbPreview")||document.getElementById("tbCode");let a=null;
 /* reverse morph: the page shrinks back into its button, fast and immediate */
 try{if(r.animate&&b){const rr=r.getBoundingClientRect(),br=b.getBoundingClientRect();if(br.width>4&&br.height>4&&rr.width>4){a=r.animate([{clipPath:"inset(0px round 0px)",opacity:1},{offset:.75,opacity:1},{clipPath:"inset("+(br.top-rr.top)+"px "+(rr.right-br.right)+"px "+(rr.bottom-br.bottom)+"px "+(br.left-rr.left)+"px round "+Math.min(br.width,br.height)/2+"px)",opacity:0}],{duration:220,easing:"cubic-bezier(.4,0,.2,1)",fill:"forwards"})}}}catch(e){a=null}
 if(!a){r.style.transition="opacity .16s ease";r.style.opacity="0"}
 setTimeout(()=>{r.remove();root=null;syncPreviewBtn()},240);busy=false;ctrl&&ctrl.abort();setTimeout(side,0)}
function arts(){let o=document.getElementById("artOv");if(o)o.remove();o=document.createElement("div");o.id="artOv";o.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center";
 const list=st.list.filter(s=>Object.keys(s.files).length).sort((a,b)=>b.ts-a.ts);
 o.innerHTML='<div style="background:var(--bg,#1b1b1f);color:var(--fg,#eee);border-radius:16px;padding:16px;width:min(92vw,480px);max-height:80vh;overflow:auto"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b>Artifacts</b><button id="artX" style="background:none;border:0;color:inherit;font-size:22px">×</button></div>'+(list.length?list.map(s=>`<div data-a="${s.id}" style="padding:12px;border-radius:10px;background:rgba(127,127,127,.15);margin-bottom:8px;cursor:pointer"><b>${E(s.title)}</b><br><small>${Object.keys(s.files).length} file(s)</small></div>`).join(""):'<div style="opacity:.7;padding:12px">No artifacts yet. Build something — open Preview &amp; Files from the top bar.</div>')+'</div>';
 o.onclick=e=>{if(e.target===o||e.target.id==="artX")return o.remove();const a=e.target.closest("[data-a]");if(a){o.remove();open(a.dataset.a)}};document.body.appendChild(o)}
function bootPreviewBtn(){const b=document.getElementById("tbPreview");if(b){b.hidden=true;b.style.display="none"}/* preview removed */}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bootPreviewBtn);else bootPreviewBtn();
/* Save any chat upload (text or image) into the current project Files tab */
function ensureSess(){if(!st.cur||!cur()){const s=mk();st.list.unshift(s);st.cur=s.id;files=s.files;hist=s.hist;bin={};saveAll()}return cur()}
function uniquePath(name){let p=String(name||"file").replace(/^.*[\\/]/,"").replace(/[^\w.\-()+ ]+/g,"_")||"file";if(!files[p]&&!bin[p])return p;const i=p.lastIndexOf("."),base=i>0?p.slice(0,i):p,ext=i>0?p.slice(i):"";let n=2;while(files[base+"-"+n+ext]!=null||bin[base+"-"+n+ext]!=null)n++;return base+"-"+n+ext}
function ingestChatUpload(item){if(!item)return;ensureSess();const name=uniquePath(item.name||"upload");
 if(item.img||(item.dataURL&&/^data:image\//i.test(item.dataURL))){bin[name]=item.img||item.dataURL;saveBin()}
 else if(item.text!=null){files[name]=String(item.text)}
 else if(item.dataURL){bin[name]=item.dataURL;saveBin()}
 else return;
 save();if(root){tab="files";tabs();show(true)}side()}
function ingestChatUploads(list){if(!list||!list.length)return;(Array.isArray(list)?list:[list]).forEach(ingestChatUpload)}
async function runFromChat(text){
 ensureSess();
 if(!(root&&root.isConnected)){opening=false;/* preview removed */}
 const t=String(text||"").trim();
 const onlyHtml=/\b(only|just)\s+(the\s+)?html\b|\bhtml\s+only\b/i.test(t),onlyJs=/\b(only|just)\s+(the\s+)?(js|javascript)\b|\b(js|javascript)\s+only\b/i.test(t);
 const req=onlyJs?"ONLY ONE JavaScript file (script.js). No HTML, no CSS.":onlyHtml?"ONLY ONE self-contained index.html.":"If this is a website, split it into index.html, styles.css and script.js (multi-file, downloadable as ZIP); if it is a small game or tool, one index.html is fine.";
 return run(t+"\n\nREQUIREMENTS: "+req+" Complete, powerful, working code with real logic and edge-case handling. Fit within about 7000 tokens and finish with closed tags.")
}
window.XMM_CODE={getFiles:()=>files,open,close,artifacts:arts,isOpen:()=>false,ingest:ingestChatUpload,ingestAll:ingestChatUploads,runFromChat};setTimeout(side,0);
})();
