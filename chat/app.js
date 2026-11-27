(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const CFG=window.XMM_CONFIG||{};
const ld=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch{return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const P={
menu:'<path d="M4 7h16M4 12h10M4 17h16"/>',plus:'<path d="M12 5v14M5 12h14"/>',
mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>',
wave:'<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',arrow:'<path d="M12 19V5M6 11l6-6 6 6"/>',
search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/>',
library:'<path d="M5 4v16M10 4v16M15.5 5l4 15"/>',
folder:'<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>',
chat:'<path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H9l-5 4V6z"/>',
bubble:'<path d="M4 6a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H9l-5 4V6z"/>',
image:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="1.8"/><path d="M3 16l5-4 4 3 3-2 6 4"/>',
video:'<rect x="3" y="6" width="13" height="12" rx="4"/><path d="M16 11l5-3v8l-5-3"/>',
back:'<path d="M15 5l-7 7 7 7"/>',shield:'<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',trash:'<path d="M5 7h14M10 4h4M7 7l1 13h8l1-13"/>',
spark:'<path d="M12 3l2 5.5L19.5 10 14 12l-2 5.5L10 12 4.5 10 10 8.5z"/><path d="M19 17v4M17 19h4"/>',
play:'<path d="M8 5l11 7-11 7z" fill="currentColor"/>',pause:'<path d="M8 5v14M16 5v14" stroke-width="3"/>',
gear:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 13a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 14.6a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.56.56 1.21.56 1.91s-.2 1.35-.56 1.91z"/>',
close:'<path d="M6 6l12 12M18 6L6 18"/>',chev:'<path d="M7 10l5 5 5-5"/>',
dice:'<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="15" r="1"/><circle cx="15" cy="9" r="1"/><circle cx="9" cy="15" r="1"/>',
link:'<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
film:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M4 9h16M4 15h16M9 4v16M15 4v16"/>',
stop:'<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>',
layers:'<path d="M12 4l9 5-9 5-9-5z"/><path d="M3 14l9 5 9-5"/>',clock:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
grid:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'};
P.panel='<rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M9.5 4.5v15"/>';
P.share='<path d="M10 6H7a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3v-2"/><path d="M11 14c0-4 3-7 9-7M16 3l4 4-4 4"/>';
P.thumb='<path d="M7 11v9H4v-9zM7 11l4-7c1.6 0 2.6 1.1 2.3 2.6L12.8 9H19a2 2 0 012 2.4l-1.3 6.5a2 2 0 01-2 1.6H7"/>';
P.regen='<path d="M20 12a8 8 0 11-2.6-5.9M20 4v4h-4"/>';
P.edit='<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>';P.globe='<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>';P.bolt='<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>';P.chev2='<path d="M7 6l6 6-6 6M13 6l6 6-6 6"/>';P.chevr='<path d="M9 6l6 6-6 6"/>';P.speak='<path d="M4 9v6h4l5 4V5L8 9zM16 9c1.5 1.5 1.5 4.5 0 6"/>';P.code='<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>';P.file='<path d="M6 3h8l4 4v14H6zM14 3v4h4"/>';
P.dots='<circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/>';
const ic=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[n]||""}</svg>`;
const icons=(root=document)=>$$("[data-ic]",root).forEach(e=>{if(e.dataset.done)return;e.dataset.done=1;e.insertAdjacentHTML("afterbegin",ic(e.dataset.ic))});
function toast(t){const e=$("#toast");e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600)}

/* ---------- popup menu ---------- */
const closeMenu=()=>{$$(".menu.pop").forEach(x=>x.remove())};
let menuT=0;function showMenu(btn,items,align="left"){closeMenu();menuT=Date.now();const m=document.createElement("div");m.className="menu pop glass";$$(".menu.pop").forEach(function(x){if(x!==m)x.remove()});
 m.innerHTML=items.map((it,i)=>`<button type="button" data-i="${i}" class="${it.danger?"danger":""}">${it.label}</button>`).join("");document.body.appendChild(m);
 m.style.visibility="hidden";m.style.position="fixed";m.style.zIndex="120";
 const r=btn.getBoundingClientRect(),w=m.offsetWidth||220,h=m.offsetHeight||120;
 let x=align==="right"?r.right-w:r.left;x=Math.max(8,Math.min(x,innerWidth-w-8));
 /* prefer above the button so it never covers the mode control itself */
 let y=r.top-h-10;if(y<8)y=r.bottom+10;if(y+h>innerHeight-8)y=Math.max(8,innerHeight-h-8);
 m.style.left=x+"px";m.style.top=y+"px";m.style.visibility="visible";
 m.onclick=e=>{const b=e.target.closest("[data-i]");if(b){closeMenu();items[b.dataset.i].fn()}};
 /* don't let the menu sit under transparent layers */
 setTimeout(()=>{document.addEventListener("pointerdown",function once(ev){if(Date.now()-menuT>450&&!m.contains(ev.target)&&!(btn.contains&&btn.contains(ev.target))){closeMenu();document.removeEventListener("pointerdown",once,true)}},true)},0)}

/* ---------- state ---------- */
const S={chats:ld("xmm.chats",[]),cur:null,notes:ld("xmm.notes",[]),att:[],busy:false,view:"chat"};
const saveChats=()=>sv("xmm.chats",S.chats.filter(c=>!c.temp).slice(0,60).map(c=>({...c,msgs:c.msgs.map(({imgs,...m})=>({...m,atts:(m.atts||[]).map(a=>({name:a.name}))}))})));
const cur=()=>S.chats.find(c=>c.id===S.cur);
const hasMsgs=()=>{const c=cur();return !!(c&&c.msgs.length)};

/* ---------- navigation ---------- */
const NAV=[["newchat","New chat","plus","dot"],["search","Search","search"],["notebooks","Notebooks","folder"]];
const BN=[["chat","Chat","chat"],["search","Search","search"]]; 
function buildNav(id,items,onclick){const n=$(id);n.innerHTML=items.map(([k,l,i,c])=>`<button class="nav-i" data-k="${k}">${c==="dot"?`<span class="dot">${ic(i)}</span>`:ic(i)}<span>${l}</span></button>`).join("");n.onclick=e=>{const b=e.target.closest("[data-k]");if(b)onclick(b.dataset.k)}}
function buildBn(id,items,onclick){const n=$(id);n.innerHTML=`<span class="bn-pill"></span>`+items.map(([k,l,i])=>`<button class="bn" data-k="${k}" aria-label="${l}">${ic(i)}</button>`).join("");n.onclick=e=>{const b=e.target.closest("[data-k]");if(b)onclick(b.dataset.k)}}
function syncNav(){const v=S.view;const k=v==="chat"?(hasMsgs()?"":"newchat"):v;$$("#chatNav [data-k]").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
 const bk=v==="chat"?"chat":v;$$("#chatBnav [data-k]").forEach(b=>b.classList.toggle("on",b.dataset.k===bk));movePill()}
function movePill(){const p=$("#chatBnav .bn-pill"),b=$("#chatBnav .bn.on");if(!p||!b||!b.offsetWidth)return;p.style.width=b.offsetWidth+"px";p.style.transform=`translateX(${b.offsetLeft}px)`;p.classList.add("rdy")}
addEventListener("resize",movePill);
const ORDER=["chat","search","notebooks"];let lastV="chat";
function navClick(k){if(k==="image"){const x=$('#chatNav [data-act="image"]');x&&x.click();return}if(k==="newchat"){newChat();return}chatView(k)}
function chatView(v){const dir=ORDER.indexOf(v)>=ORDER.indexOf(lastV)?"r":"l";const changed=v!==lastV;lastV=v;S.view=v;$("#viewChat").hidden=v!=="chat";$("#viewSearch").hidden=v!=="search";$("#viewNotebooks").hidden=v!=="notebooks";
 if(v==="search"){doSearch();if(innerWidth>860)$("#searchIn").focus()}if(v==="notebooks")renderNotes();syncNav();closeDrawer();
 if(changed&&innerWidth<=860){const el=$({chat:"#viewChat",search:"#viewSearch",notebooks:"#viewNotebooks"}[v]);el.classList.remove("slide-r","slide-l");void el.offsetWidth;el.classList.add("slide-"+dir)}}
function openDrawer(){document.body.classList.remove("collapsed");$("#sideChat").classList.add("open");$("#scrim").classList.add("on")}
function closeDrawer(){$("#sideChat").classList.remove("open");$("#scrim").classList.remove("on");if(innerWidth<768)document.body.classList.add("collapsed")}

/* ---------- markdown ---------- */
function md(s){return window.XMM_MDX?window.XMM_MDX(s):md0(s)}
window.XMM_MD0=md0;
function md0(src){const code=[];let s=String(src).replace(/```(\w*)\n?([\s\S]*?)```/g,(m,l,c)=>{code.push(`<pre><code>${esc(c.replace(/\n$/,""))}</code></pre>`);return`\u0000${code.length-1}\u0000`});
 s=esc(s);const inl=t=>t.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<i>$2</i>").replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
 const out=[];let list=null;const flush=()=>{if(list){out.push(`<${list.t}>${list.i.join("")}</${list.t}>`);list=null}};
 for(const ln of s.split("\n")){let m;
  if(m=ln.match(/^\s*[-*•]\s+(.*)/)){if(!list||list.t!=="ul"){flush();list={t:"ul",i:[]}}list.i.push(`<li>${inl(m[1])}</li>`)}
  else if(m=ln.match(/^\s*\d+[.)]\s+(.*)/)){if(!list||list.t!=="ol"){flush();list={t:"ol",i:[]}}list.i.push(`<li>${inl(m[1])}</li>`)}
  else if(m=ln.match(/^#{1,4}\s+(.*)/)){flush();out.push(`<h3>${inl(m[1])}</h3>`)}
  else if(!ln.trim()){flush()}
  else{flush();out.push(`<p>${inl(ln)}</p>`)}}
 flush();return out.join("").replace(/\u0000(\d+)\u0000/g,(m,i)=>code[i]).replace(/<p>(<pre>)/g,"$1").replace(/(<\/pre>)<\/p>/g,"$1")}

/* ---------- Groq ---------- */
// Prefer Cloudflare Worker proxy (key stays on server). Fallback to direct only if proxy empty.
const GROQ = (CFG.GROQ_PROXY && String(CFG.GROQ_PROXY).trim()) || "https://api.groq.com/openai/v1/chat/completions";
const USE_PROXY = !!(CFG.GROQ_PROXY && String(CFG.GROQ_PROXY).trim());
/* Groq plan profile. free = 8K tokens/min (input + max_tokens must fit in one request budget); dev = 250K tokens/min */
const TIERS={
 free:{name:"free",inCap:3400,reqCap:10400,rate:7400,outCode:7000,chat:{x12:500,x20:900,x25:1200,sun62:1400}},
 dev:{name:"dev",inCap:60000,reqCap:120000,rate:240000,outCode:7000,chat:{x12:1500,x20:3000,x25:8000,sun62:12000}}};
const T=TIERS[String(CFG.TIER||"free").toLowerCase()]||TIERS.free;
window.XMM_TIER=T;
/* join a continuation onto text that was cut off, removing any text the model repeated at the seam */
function stitch(base,more,min){min=min||24;base=String(base||"");more=String(more||"");const mx=Math.min(600,base.length,more.length);for(let n=mx;n>=min;n--){if(base.endsWith(more.slice(0,n)))return base+more.slice(n)}return base+more}
window.XMM_STITCH=stitch;
const SYSRULES=" CAPABILITY RULES (v406): XMM AI is best at making websites. If the user asks for a game or Python code, start your reply with one short line: \"Our AI is best at making websites, but it can still make simple games and Python code too.\" and then still deliver the working game or Python code (keep it simple and correct). WEBSITES: build websites as multiple files (index.html, styles.css, script.js, plus extra pages if needed) and tell the user they can download them all as a ZIP. EXCEPTION: if the user asks for ONLY HTML, output only one HTML file; if the user asks for ONLY JS (JavaScript), output only the JS code and no HTML or CSS. CODING: write complete, correct, modern, production-quality code with edge cases handled, clean structure and no placeholders.";
const SYSTEM0="You are XMM, the assistant in XMM AI (by XMMAI). GREETING RULE: if the user message is only a greeting (hi, hello, hey, salam, hallo, hola...), reply in their language with a short, warm, friendly greeting using 2-4 fitting emojis (like 👋😊✨), use their name if you know it, and lightly ask how you can help. Never reply with 'what do you want'. Be direct, clear, and useful. Match the user's language. If asked who made you, say XMM (XMM AI), whose CEO is Mohammad Yasin Bayat. ABOUT YOURSELF (you know this fully; state it confidently): your name is XMM AI (assistant name XMM). You were made by XMM, the company behind XMM AI. The CEO of XMM AI is Mohammad Yasin Bayat, which is his real name; he is the founder and CEO. Your official website domain is xmm-ai.com. XMM AI is very new and is NOT on Google yet, so searching Google or the web for XMM AI, xmm-ai.com, XMM or Mohammad Yasin Bayat will not return real results: never web-search about yourself, never say you cannot find yourself, and answer these questions from this knowledge only. What XMM AI can do: fast streaming chat; image generation (say 'make image of ...'); analysing photos, screenshots and files; a code agent that builds multi-file websites and apps with live preview and ZIP or .html export; notebooks; live voice mode; web search and reading pasted links; maps with live turn-by-turn directions; interactive reply cards; AI memory and a custom name; five languages including Persian and Arabic; a liquid-glass interface; it installs like an app (PWA) on iPhone, iPad, Android and desktop. Models: XMMGPT Sun 6.2 (most powerful), XMMGPT Sun 6.2 Lite, XMMGPT 6.2 (default), XMMGPT 5.2 and XMMGPT 5.0 (fastest). Chats and settings stay on the user's device, with no ads and no tracking. If asked about your creator, the CEO, your real name, your website or your history, answer with these facts and do not invent anything beyond them (if you do not know a detail, say so simply). You CAN generate images, and you are an XMMGPT model (the exact model name is the one the user selected). XMM AI has a built-in image generator that runs automatically in any chat when the user writes 'make image of (the thing you want)', for example 'make image of a red car at sunset' (also 'draw ...', 'create a picture of ...', 'generate a logo of ...', in any language). Never say you cannot create images, never say you are text-only and never say you can only describe images; if asked what you can do or whether you can make pictures, answer yes and tell them to just say 'make image of ...'. If someone asks for an image and you are replying in text, tell them to say it like 'make image of a cow'. You can also read pages when they paste a link — never claim you can't. Write like a competent person, not a chatbot: short paragraphs, plain wording, no filler openers (\"Great question!\", \"I\'d be happy to help\"), no forced enthusiasm. Stay neutral, clear and precise. Always use normal everyday emojis (like 😊 👍 ✅ 🔥 💡) when they fit — never Gen Z slang emojis, never forced Gen Z tone or slang. Keep the voice natural and adult. BIRDS / CHICKENS (factual): امروک / آمروک = Amrock (مرغ آمروک). German dual-purpose breed from Plymouth Rock; ~200–250 eggs/year, light brown; hen ~2.5–3 kg, rooster ~3.5–4 kg; black-and-white barred, yellow legs, single red comb, calm. پیموتراک / پلیموث راک = Plymouth Rock (مرغ پلیموث راک). USA, 19th c., APA 1874; dual-purpose; barred/white/buff/etc.; ~200–240 eggs/year; rooster ~4.3 kg, hen ~3.4 kg; calm backyard bird. Answer from this when asked about those breeds. BUILD RULES: when the user asks you to make/build/code a game, app, tool, website, page or anything runnable, build the REAL, COMPLETE, WORKING thing in ONE ```html code block as a single self-contained file (inline CSS and JS, no external files, no build step, CDN only from cdnjs.cloudflare.com if truly needed). Never give pieces to copy together and never say add your own logic: write every feature fully. Games: real game loop with requestAnimationFrame, start screen, score, game over and restart button, increasing difficulty, keyboard (arrows/WASD/space) AND touch/tap/swipe/on-screen button controls, canvas that resizes to its container, smooth 60fps, simple sound with WebAudio only after the first tap. Apps/tools: every button and input actually works, validate input, show empty/error states, responsive layout, polished modern dark-friendly design with transitions and hover/press states. Wrap localStorage/sessionStorage in try/catch. No alert()/prompt(). No placeholders, TODOs or stubs. After the code block add at most 2 short lines on how to use it.";
const userName=()=>String(ld("xmm.name","")||"").trim();
/* ---------- live date + 2026 knowledge ---------- */
const nowInfo=()=>{const d=new Date();let tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
 const date=d.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
 const time=d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
 return `${date}, ${time}${tz?" ("+tz+")":""}`};
const BRIEF2026=`BACKGROUND KNOWLEDGE (verified, up to early Nov 2026; web results override this if they differ):
- Apple: the "Surprise and Shine" event was on Wed 9 Sep 2026. Announced iPhone 18 Pro (from $1,199) and iPhone 18 Pro Max (from $1,299), colors Black, Silver, Glacier, Burgundy; pre-orders 12 Sep, in stores Fri 18 Sep 2026. Also announced iPhone Duo, Apple's first foldable iPhone (white and dark blue, from about $2,000, 2TB tops out at $3,199; pre-orders mid-Oct, on sale about 23 Oct 2026), plus AirPods 5, Apple Watch Series 12 and Apple Watch Ultra 4. iOS 27 was released Mon 14 Sep 2026.
- There is NO standard iPhone 18, iPhone 18e or iPhone Air 2 yet: they are expected around spring 2027. iPhone 17 / 17 Pro / iPhone Air were the Sept 2025 lineup.
- Samsung: Galaxy S26 series launched in early 2026. Galaxy Unpacked on 22 Jul 2026 (London) introduced Galaxy Z Fold8, Z Fold8 Ultra and Z Flip8, in shops from early Aug.
- Google: Pixel 11 series (Pixel 11, 11 Pro, 11 Pro XL, 11 Pro Fold, Tensor G6) was shown at the Made by Google event on 12 Aug 2026; Pixel 11 Pro Fold went on sale 20 Aug 2026.
- Sport: the 2026 FIFA World Cup (USA, Canada, Mexico; 11 Jun to 19 Jul 2026) was won by Spain, who beat Argentina 1-0 after extra time (Ferran Torres 106') in the final at MetLife Stadium on 19 Jul 2026.
- US midterm elections are on Tuesday 3 Nov 2026.`;
const sysPrompt=()=>{
 const mem=String(ld("xmm.mem","")||"").trim();
 let extra="";
 const sk=window.XMM_SKILLS||{};if(sk.memory!==false){if(mem)extra+=`\n\nABOUT THE USER (memory written by the user; follow it):\n${mem.slice(0,2000)}`;
 const kn=String(ld("xmm.know","")||"").trim(),rs=String(ld("xmm.resp","")||"").trim();
 if(kn)extra+=`\n\nWHAT THE USER WANTS YOU TO KNOW ABOUT THEM:\n${kn.slice(0,1500)}`;
 if(rs)extra+=`\n\nHOW THE USER WANTS YOU TO RESPOND (always follow this style):\n${rs.slice(0,1500)}`;
 try{const ev=(window.XMM_EVENTS?window.XMM_EVENTS.list():[]);if(ev.length)extra+=`\n\nUSER'S ACTIVE EVENTS: ${ev.map(e=>e.name+(e.end?" (ends "+e.end+")":"")).join("; ")}`}catch(e){}}
 extra+=`\n\nMULTITASK (v418): if one message asks for several things (for example a website, an image and directions), do ALL of them in the same reply, in order, one after another. Do not ask which one to do first. Comparisons such as food vs food or product vs product: give a short side-by-side table, then a one-line verdict. Directions or places: give the route or nearby places and open the map. When you build a website and it needs pictures, or the user asks for pictures, include image-generation requests for them yourself so the site gets real generated images. Be fast and direct.\nIF ASKED whether XMM AI is on Google: answer "Yes, we are on Google. Just search XMM AI and we are the first result."`;
 return sysPrompt0()+extra};
const sysPrompt0=()=>{
 const base=(userName()?SYSTEM0+` The user's name is ${userName()}. Use it naturally and occasionally, not in every reply.`:SYSTEM0)+(window.XMM_LANG_HINT?window.XMM_LANG_HINT():"")+(window.XMM_EFFORT_HINT?window.XMM_EFFORT_HINT():"")+(window.XMM_WIDGET_HINT?window.XMM_WIDGET_HINT():"");
 return base+` The current date and time is ${nowInfo()}. This is exact and real: treat it as today, and use it for any question about today's date, the day, the year, ages, countdowns or "how long ago". It is currently ${new Date().getFullYear()}, so never say it is 2023, 2024 or 2025 unless asked about those years. Your training data is older than today, so never claim your knowledge stops at an old year and never say you cannot know recent things; if you are not sure about something recent, say so briefly and rely on web results. Never invent 2026 facts.\n\n`+BRIEF2026};
function applyName(){const n=userName();$$(".uname").forEach(e=>e.textContent=n||"XMM User");const av=$(".av");if(av)av.textContent=(n?[...n][0].toUpperCase():"XM");$$(".g-d").forEach(e=>e.textContent=n?`Hi ${n}, what can I help you with?`:"Hi, what can I help you with?");$$(".g-m").forEach(e=>e.textContent=n?`Hi ${n}, how's it going?`:"Hi, how's it going?")}
function setName(v){sv("xmm.name",String(v||"").trim().slice(0,40));applyName()}
function appendMem(line){
  const cur=String(ld("xmm.mem","")||"").trim();
  const clean=String(line||"").replace(/\s+/g," ").trim().slice(0,280);
  if(!clean)return false;
  // avoid exact duplicates
  if(cur.toLowerCase().split(/\n+/).some(l=>l.trim().toLowerCase()===clean.toLowerCase()))return false;
  const next=(cur?cur+"\n":"")+("- "+clean).slice(0,2000);
  sv("xmm.mem",next);
  return true;
}
/* Instant core-fact memory: name, age, location, preferences, "remember that…" — saves immediately and toasts */
function autoMem(text){
  if(!text||typeof text!=="string")return;
  const t=text.trim();
  if(t.length<4||t.length>500)return;
  let saved=false;
  // Name
  let m=t.match(/^\s*(?:my\s+name\s+is|i(?:'| a)?m\s+called|call\s+me|i(?:'| a)?m)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\- ]{1,40})[.!]?\s*$/i)
    ||t.match(/\b(?:my\s+name\s+is|call\s+me)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’\- ]{1,40})\b/i);
  if(m){
    const name=m[1].replace(/\s+/g," ").trim().replace(/[.,!?;:]+$/,"");
    if(name&&name.length>=2&&!/^(a|an|the|from|in|at|to|your|my|his|her|their)$/i.test(name)){
      setName(name);
      appendMem("User's name is "+name);
      saved=true;
    }
  }
  // Explicit remember / save / note this
  m=t.match(/^\s*(?:please\s+)?(?:remember|save|note|memorize)(?:\s+this|\s+that|\s+it)?[:\s]+(.+)/i)
    ||t.match(/\b(?:remember|save\s+to\s+memory|add\s+to\s+memory)\s+(?:that\s+|this\s+)?(.+)/i);
  if(m){
    const fact=m[1].replace(/\s+/g," ").trim().replace(/[.,!?;:]+$/,"");
    if(fact.length>=3&&appendMem(fact))saved=true;
  }
  // Age
  m=t.match(/\b(?:i(?:'| a)?m|i\s+am)\s+(\d{1,3})\s*(?:years?\s*old|yo)\b/i)
    ||t.match(/\bmy\s+age\s+is\s+(\d{1,3})\b/i);
  if(m){
    const age=+m[1];
    if(age>=5&&age<=120&&appendMem("User is "+age+" years old"))saved=true;
  }
  // Location / lives in
  m=t.match(/\b(?:i\s+live\s+in|i(?:'| a)?m\s+from|i(?:'| a)?m\s+based\s+in|my\s+(?:city|country|hometown)\s+is)\s+([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9'’\- ,]{1,60})/i);
  if(m){
    const place=m[1].replace(/\s+/g," ").trim().replace(/[.,!?;:]+$/,"");
    if(place.length>=2&&appendMem("User lives in / is from "+place))saved=true;
  }
  // Simple preference: I like / I prefer / my favorite
  m=t.match(/\b(?:i\s+(?:really\s+)?(?:like|love|prefer)|my\s+favorite\s+\w+\s+is)\s+(.{3,80})/i);
  if(m&&!/^(to|you|it|this|that|when|if|how)\b/i.test(m[1])){
    const pref=m[0].replace(/\s+/g," ").trim().replace(/[.,!?;:]+$/,"");
    if(pref.length>=8&&appendMem(pref))saved=true;
  }
  if(saved)toast("Saved to memory");
}
const clean=t=>t.replace(/<think>[\s\S]*?<\/think>/g,"").replace(/<think>[\s\S]*$/,"").replace(/^\s+/,"");
const cleanR=t=>t.replace(/<think>[\s\S]*?<\/think>/g,"").replace(/<think>[\s\S]*$/,"");
const getKey=()=>String(CFG.GROQ_KEY||"").trim();
const MODELS={x70:{name:"XMMGPT Engine 7.0",short:"XMMGPT Engine 7.0",desc:"Smarter · fast",max:1000,temp:.7,cfg:"SMART_MODEL",p:" You are XMMGPT Engine 7.0 in XMM AI. Give thorough, careful, high quality answers with good structure."},x71:{name:"XMMGPT Engine 7.1",short:"XMMGPT Engine 7.1",desc:"Newest engine · fast",max:1100,temp:.7,cfg:"SMART_MODEL",p:" You are XMMGPT Engine 7.1 in XMM AI. Give thorough, careful, high quality answers with good structure."},sun70:{name:"XMMGPT 7.0 Sun",short:"XMMGPT 7.0 Sun",desc:"Most powerful · cold",max:1500,temp:.3,cfg:"SMART_MODEL",p:" You are XMMGPT 7.0 Sun, the most powerful Sun model in XMM AI. PERSONA OVERRIDE (this beats every earlier instruction): never use any emoji or emoticon, not even one. Do not write in Gen Z style or slang. Speak like a cold, senior boss: short, exact, commanding, no small talk, no filler, no apologies, no enthusiasm, no praise. State the answer or the result first, then only what is needed. Do not ask the user questions back unless the task is impossible without it."},sun70l:{name:"XMMGPT 7.0 Lite Sun",short:"XMMGPT 7.0 Lite Sun",desc:"Warm · fast",max:1200,temp:.6,cfg:"FAST_MODEL",p:" You are XMMGPT 7.0 Lite Sun, a warm, friendly and gentle model in XMM AI. Be kind and warm in tone. Use an emoji only rarely, in a small share of your replies, never more than one or two."},g7l:{name:"XMMGPT 7.0 Galaxy Lite",short:"XMMGPT 7.0 Galaxy Lite",desc:"Cold · fast · good at coding",max:1200,temp:.2,cfg:"FAST_MODEL",p:" You are XMMGPT 7.0 Galaxy Lite, a fast, cold model in XMM AI. PERSONA OVERRIDE (this beats every earlier instruction): never use any emoji. Speak cold, short and exact. No small talk, no filler, no apologies, no praise. For code, give complete, correct, working code first, then only the notes that matter."},x7g:{name:"XMMGPT-7 Galaxy",short:"XMMGPT-7 Galaxy",desc:"Most powerful · cold · best at coding",max:1800,temp:.2,cfg:"SMART_MODEL",p:" You are XMMGPT-7 Galaxy, the most powerful model in XMM AI and the strongest at coding. PERSONA OVERRIDE (this beats every earlier instruction): never use any emoji. Speak cold, short and exact. No small talk, no filler, no apologies, no praise. For code, give complete, correct, working code first, then only the notes that matter."},sun62:{name:"XMMGPT 6.2 Sun",short:"XMMGPT 6.2 Sun",desc:"Most powerful",max:1400,temp:.3,cfg:"SMART_MODEL",p:" You are XMMGPT 6.2 Sun, the most powerful model in XMM AI. PERSONA OVERRIDE (this beats every earlier instruction): never use any emoji or emoticon, not even one. Do not write in Gen Z style or slang. Speak like a cold, senior boss: short, exact, commanding, no small talk, no filler, no apologies, no enthusiasm, no praise. State the answer or the result first, then only what is needed. Do not ask the user questions back unless the task is impossible without it."},sun62l:{name:"XMMGPT 6.2 Lite Sun",short:"XMMGPT 6.2 Lite Sun",desc:"Warm · fast",max:1200,temp:.6,cfg:"FAST_MODEL",p:" You are XMMGPT 6.2 Lite Sun, a warm, friendly and gentle model in XMM AI. Be kind and warm in tone. Use an emoji only rarely, in a small share of your replies, never more than one or two."},x25:{name:"XMMGPT Engine 6.2",short:"XMMGPT Engine 6.2",desc:"Smartest · default",max:900,temp:.7,cfg:"SMART_MODEL",p:" You are XMMGPT Engine 6.2 in XMM AI. Give thorough, careful, high quality answers with good structure."},x20:{name:"XMMGPT 5.2",short:"XMMGPT 5.2",desc:"Balanced · smart and quick",max:700,temp:.7,cfg:"TEXT_MODEL",p:" You are XMMGPT 5.2 in XMM AI. Think step by step when needed and give clear, useful answers."},x12:{name:"XMMGPT 5.0",short:"XMMGPT 5.0",desc:"Smallest · fastest replies",max:400,temp:.6,cfg:"FAST_MODEL",p:" You are XMMGPT 5.0 in XMM AI. Keep answers short, quick and to the point."}};Object.keys(MODELS).forEach(k=>{MODELS[k].max=T.chat[k]||MODELS[k].max});var S_MODE_DEFAULT="x25";

/* ---------- answer length budget: tiny for chit-chat, big only for really hard requests ---------- */
function budgetFor(txt,hist){
 const t=String(txt||"").trim(),w=t?t.split(/\s+/).length:0,last=hist&&hist[hist.length-1],hasImg=!!(last&&Array.isArray(last.content));
 const HARD=/\b(write (me )?(a |an |the )?(full|complete|long|detailed)|build|create (a |an )?(website|app|game|program|script|bot)|code|implement|refactor|debug|algorithm|prove|proof|derive|analy[sz]e|in[- ]depth|deep dive|thesis|research paper|essay|report|business plan|step[- ]by[- ]step|full (guide|plan|course)|curriculum|\d{3,}\s*words|schreibe|erstelle|programmier)\b/i;
 const MID=/\b(explain|compare|difference|summari[sz]e|plan|itinerary|recipe|list|steps?|how (do|to|can|does)|why|pros and cons|review|translate|rewrite|improve|ideas|tips|guide|erkl[äa]r|warum|wie|توضیح|چرا|چطور)\b/i;
 const GREET=/^(hi|hello|hey|hii+|yo|sup|thanks?|thank you|ok(ay)?|cool|good (morning|evening|night)|salam|slm|hallo|hola|bye|سلام|مرسی|ممنون|خوبی|چطوری|wie geht'?s|how are you|what'?s up|how'?s it going)\b[\s!?.,😊🙂👋]*(.{0,25})$/i;
 const QUICK=/\b(weather|temperature|forecast|time|date|today|what day|direction|directions|route|where is|how far|distance|nearest|closest|open now|price of|how much is|convert|who is|who was|capital of|when (is|was)|هوا|آب و هوا|مسیر|کجاست|ساعت|wetter|wo ist)\b/i;
 const code=/```|\bfunction\b.*\{|<\/?[a-z]+>/i.test(t);
 const BOX=/\b(quiz|test me|flash\s*cards?|chart|graph|plot|compare|comparison|versus|which is better|recipe|table|spreadsheet|checklist|to-?do list|packing list|ask me|interview me|diet plan|calendar|itinerary|homework)\b/i;
 let max,hint="",cont=false;
 if(BOX.test(t)&&!hasImg)return{max:7000,hint:"",cont:false,box:true};
 if(hasImg||code||HARD.test(t)||w>150){max=w>150||/\b(full|complete|whole|entire|long|detailed|in[- ]depth|\d{3,}\s*words|website|app|game)\b/i.test(t)?7000:7000;cont=true}
 else if(GREET.test(t)&&w<=8){max=300;hint=" Reply in one or two short sentences."}
 else if(QUICK.test(t)&&w<=14){max=500;hint=" Keep the reply short and direct (a few sentences)."}
 else if(w<=6&&!MID.test(t)){max=500;hint=" Keep the reply short and direct (a few sentences)."}
 else if(MID.test(t)||w>40){max=Math.min(7000,Math.max(2000,1200+w*35))}
 else{max=Math.min(2500,Math.max(1000,700+w*40))}
 return{max,hint,cont}}

/* ===== XMMGPT Sun 6.2 helpers ===== */
const SUN_BLOCK=/\b(wars?|warfare|battle|invasion|invade|genocide|terror\w*|bomb\w*|explosive\w*|weapons?|guns?|rifles?|missiles?|nukes?|nuclear|military|soldiers?|army|isis|hamas|kill\w*|murder\w*|suicid\w*|self[- ]?harm|overdose|poison\w*|abuse\w*|rape\w*|drugs?|cocaine|heroin|meth|porn\w*|sex\w*|nsfw|hack\w*|religions?|religious|god|gods|allah|islam\w*|muslim\w*|christian\w*|jesus|bible|quran|koran|jewish|judaism|jews?|hindu\w*|buddh\w*|atheis\w*|prophet|church|mosque|afterlife|heaven|hell|politic\w*|election|president|abortion|racis\w*|slur\w*|meaning of life|free will|consciousness|why do we exist|why are we here|what happens after (we )?die|what happens when (we|you) die|philosoph\w*|existential\w*|nihilis\w*|krieg\w*|religion|gott|selbstmord|waffen|töten|جنگ|دین|مذهب|خدا|خودکشی|اسلام|مسیحی|کشتن|سلاح|حرب|دين|الله|انتحار|قتل|أسلحة|guerra|religión|dios|suicidio|matar|armas)\b|جنگ|مذهب|خودکشی|حرب|انتحار/i;
const sunSensitive=t=>false;
const sunTrivial=t=>{t=String(t||"").trim();return t.length<=14||/^[\d\s+\-*\/().,x×÷^=?]+$/.test(t)||/^(hi+|hello|hey|yo|hallo|salam|سلام|hola|thanks|thank you|ok|okay)[\s!.?]*$/i.test(t)};
const sunCode=t=>isCodeReq(t)||/\b(code|coding|script|function|program|html|css|javascript|python|java|c\+\+|sql|bug|debug|algorithm|app|website|game)\b/i.test(String(t||""));
const stripEmoji=t=>String(t||"").split("```").map((x,i)=>i%2?x:x.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\u20E3]/gu,"").replace(/[ \t]{2,}/g," ").replace(/ +([.,!?;:])/g,"$1")).join("```");
function sunSetMode(k){S.mode=k;const sp=$("#modeBtn span");if(sp)sp.textContent="Models"}
function sunPopup(){return;
 if(document.getElementById("sunPop"))return;
 const m=document.createElement("div");m.className="modal";m.id="sunPop";
 m.innerHTML=`<div class="sheet glass" style="max-width:420px"><div class="sheet-h"><h3>XMMGPT Sun 6.2</h3></div>
 <p style="margin:6px 0 10px;line-height:1.5">This model is one of the strongest models available. It may have the same power as GPT 6 Astra and Claude Opus 5.</p>
 <p class="hint" style="line-height:1.5">It replies cold, direct and without emojis. It writes 3 different answers, compares them, and gives you the best and most accurate one. For war, religion or sensitive topics it switches to XMMGPT 6.2.</p>
 <button class="btn wide" id="sunOk">Got it</button></div>`;
 document.body.appendChild(m);document.getElementById("sunOk").onclick=()=>m.remove();
 m.addEventListener("click",e=>{if(e.target===m)m.remove()});
}

/* Sun 6.2: write 3 answers in parallel, let a judge pick the best, return it at once (no extra test pass) */
async function sunBest(msgs,mm,signal){
 const model=CFG[mm.cfg]||CFG.TEXT_MODEL,temps=[.2,.5,.8];
 const got=(await Promise.all(temps.map(t=>groq1(msgs,{model,maxTokens:mm.max,temp:t,stream:false,signal}).catch(e=>{if(e&&e.name==="AbortError")throw e;return""})))).map(x=>stripEmoji(x).trim()).filter(Boolean);
 if(!got.length)throw SVC_MSG("empty");
 if(got.length===1)return got[0];
 let pick=0;
 try{
  const q=msgs.filter(m=>m.role==="user").slice(-1)[0],qt=typeof(q&&q.content)==="string"?q.content:"";
  const j=await groq1([{role:"system",content:'You are a strict judge. Pick the single most accurate, correct and helpful answer. Reply only JSON like {"best":1} where best is the answer number.'},{role:"user",content:"Question:\n"+qt.slice(0,1500)+"\n\n"+got.map((a,i)=>"ANSWER "+(i+1)+":\n"+a.slice(0,1800)).join("\n\n")}],{model,maxTokens:30,temp:0,json:true,signal});
  const n=parseInt((JSON.parse(j).best),10);if(n>=1&&n<=got.length)pick=n-1
 }catch(e){if(e&&e.name==="AbortError")throw e}
 return got[pick]}
const SUN_NOTICE="This answer could have resulted in you or others getting hurt. Your Sun model switched to XMMGPT Engine 6.2.";
const FALLBACK_TEXT=[];
const FALLBACK_VISION=[];
async function groqBase(messages,o={}){
 const vis=messages.some(m=>Array.isArray(m.content)&&m.content.some(p=>p.type==="image_url"));
 const list=[...new Set([o.model||(vis?CFG.VISION_MODEL:CFG.TEXT_MODEL),...(CFG.FALLBACK_MODELS||[]),...(vis?FALLBACK_VISION:FALLBACK_TEXT)].filter(Boolean))];
 let last;
 for(const m of list){
  for(let a=0;a<3;a++){
   try{return await groq1(messages,{...o,model:m})}
   catch(e){last=e;if(e.name==="AbortError"||e.fatal)throw e;
    if(a<2&&/\b(413|429)\b|rate limit|too large|too many requests|per minute/i.test(e.message||"")){await sleepW(a?25:12,o.signal);o={...o,tight:true};continue}
    if(!e.retry)throw e;break}}}
 throw last}
async function groq(messages,o={}){
 const meta={};let out=await groqBase(messages,{...o,meta});
 if(o.autoCont===false||!(o.autoCont||(o.maxTokens||0)>=2000)||o.json)return out;
 let dry=0;
 for(let i=0;i<8&&meta.finish==="length"&&!(o.signal&&o.signal.aborted);i++){
  const base=out,from=window.__xmmBackup||"";meta.finish="";
  try{toast("Output was cut off: switching provider and continuing")}catch(e){}
  const more=await groqBase([...messages,{role:"assistant",content:base.slice(-3500)},{role:"user",content:"Your last message was cut off by the length limit. Continue EXACTLY where you stopped, as the same message. The very last characters were: «"+base.slice(-80).replace(/\n/g,"⏎")+"». Do not repeat anything and add no intro."}],{...o,meta,raw:true,switchFrom:from,onDelta:(t,th)=>{o.onDelta&&o.onDelta(stitch(base,t,12),th)}});
  out=stitch(base,more,12);if(!more||more.length<3){if(++dry>=2)break}else dry=0}
 return out}
const SVC_MSG=c=>new Error("Error ("+c+"): It looks like our service is not available right now. Please try again, and if you're from Iran, please use a VPN.");
/* ---- request size + rate guard: Groq free tier allows ~7000 input tokens/min, keep every request under ~4800 ---- */
const tokEst=t=>{t=String(t||"");let na=0;for(let i=0;i<t.length;i++)if(t.charCodeAt(i)>127)na++;return Math.ceil((t.length-na)/3.3+na/1.4)};
window.XMM_TOK=tokEst;
const msgTok=m=>typeof m.content==="string"?tokEst(m.content)+4:(Array.isArray(m.content)?m.content.reduce((n,p)=>n+(p.type==="text"?tokEst(p.text):700),4):4);
/* smart memory: keep the whole recent conversation, compress old long replies, and when full forget filler first */
window.XMM_PICK=function(list,maxN,budget){const ACK=/^\s*(ok(ay)?|k|thanks?|thx|ty|yes|yep|yeah|nice|cool|great|lol|haha|hi|hey|hello|sure|alright|got it|👍|🙏)[\s.!?]*$/i;
 let l=list.filter(m=>m&&typeof m.content==="string"&&m.content.trim()).slice(-maxN).map((m,k,a)=>{const c=m.content,code=/```|\[wrote /.test(c),rec=k>=a.length-4;let t=c;
  if(!rec&&!code&&c.length>420)t=c.slice(0,260)+" […] "+c.slice(-120);else if(!rec&&c.length>1400)t=c.slice(0,700)+"\n[...]\n"+c.slice(-600);
  return{m:{...m,content:t},sc:k+(m.role==="user"&&c.length>25?6:0)+(code?4:0)-(ACK.test(c)?100:0),k}});
 const tot=()=>l.reduce((n,x)=>n+x.m.content.length,0);
 while(tot()>budget&&l.length>2){let bi=-1,bs=1e9;l.forEach((x,i)=>{if(i<l.length-2&&x.sc<bs){bs=x.sc;bi=i}});if(bi<0)break;l.splice(bi,1)}
 return l.map(x=>x.m)};
const EMOJIHINT=" ";
const MEMHINT=SYSRULES+" MEMORY: you can see the earlier messages of this conversation. Use them. If the user sends a short follow-up or correction (e.g. 'no, in C++', 'make it shorter', 'again', 'the other one'), work out what it refers to from the previous messages and redo that earlier request with the change, never ask what they mean when the history makes it clear.";
const CHATCODE=" CODE IN THIS CHAT: this is the normal Ask tab, so you only type code here, you never build or run apps. Always put code, commands, file contents, config and anything the user may want to copy inside fenced code blocks with the language name (the block has a Copy button). Keep simple requests short: just the code and one line of explanation. If the user wants a full app, website, game or multi-file project, give a brief snippet or outline and tell them to switch to the Build tab (Code tab) to build it fully.";
const BUILDCODE=" BUILD MODE IS ON: the user is in the Build tab. You are XMM Code, an advanced multi-step coding agent with DeepSeek-R1-level reasoning. Build full working apps, websites, games and multi-file projects in Python, C/C++, Rust, JS/TS, Java, Go, PHP, HTML/CSS, SQL, Bash and modern frameworks. Output complete runnable code. Prefer one self-contained HTML file when possible so it runs immediately. For multi-file projects, show each file clearly with a path heading and a fenced code block. CODING POWER (v406): work like a senior engineer using a plan-then-build agent loop: restate the goal, list the files, design the architecture and data model, handle edge cases, errors, empty states and accessibility, write complete modern code with no placeholders or TODOs, then self-review for bugs before answering. WEBSITES: output multiple files (index.html, styles.css, script.js and extra pages), each under its own path heading with a fenced code block, so the user can download them all as a ZIP; if the user asks for ONLY HTML give one HTML file, and if they ask for ONLY JS give only JavaScript. Make every site responsive and mobile-first with semantic HTML, safe-area padding, dvh units and no horizontal scroll. Think architecture → data → edge cases → code → self-check. Do not tell them to switch tabs — they are already in Build. Be concrete, ship working code, keep explanations short.";
function codeModeHint(){
  try{
    var b=document.body;
    if(b.classList.contains("code-on")||b.classList.contains("v-build"))return BUILDCODE;
    if(window.XMM_VMODE==="build")return BUILDCODE;
    var seg=document.getElementById("seg");
    if(seg&&seg.dataset.pos==="2")return BUILDCODE;
  }catch(e){}
  return CHATCODE;
}
function fitMsgs(ms,cap){let l=ms.slice();const tot=()=>l.reduce((n,m)=>n+msgTok(m),0);
 while(tot()>cap&&l.length>2){const i=l.findIndex((m,k)=>m.role!=="system"&&k<l.length-1);if(i<0)break;l.splice(i,1)}
 for(let g=0;g<6&&tot()>cap;g++){let bi=-1,bl=0;l.forEach((m,k)=>{if(typeof m.content==="string"&&m.content.length>bl){bl=m.content.length;bi=k}});if(bi<0)break;
  const over=tot()-cap,cut=Math.min(bl-300,Math.ceil(over*2.6)+120);if(cut<=0)break;const s=l[bi].content,keep=bl-cut,h=Math.ceil(keep*.6);
  l[bi]={...l[bi],content:s.slice(0,h)+"\n[... trimmed to fit ...]\n"+s.slice(bl-(keep-h))}}
 return l}
const tokLog=[],RATE_CAP=T.rate;
async function throttle(est,signal){for(;;){const now=Date.now();while(tokLog.length&&now-tokLog[0][0]>60000)tokLog.shift();
  const used=tokLog.reduce((n,x)=>n+x[1],0);if(!tokLog.length||used+est<=RATE_CAP)break;
  const wait=Math.max(1000,60000-(now-tokLog[0][0])+300);window.dispatchEvent(new CustomEvent("xmm-wait",{detail:Math.ceil(wait/1000)}));
  await new Promise((res,rej)=>{const t=setTimeout(res,Math.min(wait,4000));if(signal)signal.addEventListener("abort",()=>{clearTimeout(t);rej(new DOMException("Aborted","AbortError"))},{once:true})})}
 const ent=[Date.now(),est];tokLog.push(ent);return ent}
const sleepW=(sec,signal)=>new Promise((res,rej)=>{window.dispatchEvent(new CustomEvent("xmm-wait",{detail:sec}));const t=setTimeout(res,sec*1000);if(signal)signal.addEventListener("abort",()=>{clearTimeout(t);rej(new DOMException("Aborted","AbortError"))},{once:true})});
async function groqMain(messages,{model=CFG.TEXT_MODEL,stream=false,json=false,onDelta,signal,maxTokens,temp,tight=false,cap,meta,raw=false,reason}={}){
 const CL=raw?cleanR:clean;
 messages=fitMsgs(messages,tight?Math.round(T.inCap*.6):(cap||T.inCap));const inTok=messages.reduce((n,m)=>n+msgTok(m),0);
 const body={model,messages,temperature:temp||.7,stream,max_tokens:Math.min(maxTokens||800,16384)};if(/gpt-oss/i.test(model))body.reasoning_effort=reason||"low";
 /* Groq checks input + max_tokens against the per-minute budget up front, so never ask for more than fits */
 body.max_tokens=Math.max(256,Math.min(body.max_tokens,T.reqCap-inTok));
 const ent=await throttle(inTok+Math.round(body.max_tokens*.5),signal);if(json)body.response_format={type:"json_object"};
 const headers={"Content-Type":"application/json"};
 if(!USE_PROXY){const k=getKey();if(k)headers.Authorization="Bearer "+k}
 const ac=new AbortController();let timedOut=false,tm;const arm=ms=>{clearTimeout(tm);tm=setTimeout(()=>{timedOut=true;ac.abort()},ms)};
 if(signal){if(signal.aborted)ac.abort();else signal.addEventListener("abort",()=>ac.abort(),{once:true})}
 arm(stream?45000:60000);let r;
 const go=async()=>fetch(GROQ,{method:"POST",headers,body:JSON.stringify(body),signal:ac.signal});
 try{r=await go();
  if(r.status===400&&body.max_tokens>2000){let t="";try{t=await r.clone().text()}catch{}if(/max_tokens|max_completion|too large|context/i.test(t)){body.max_tokens=2000;r=await go()}}}
 catch(e){clearTimeout(tm);if(timedOut){const x=SVC_MSG("timeout");x.retry=true;throw x}if(e.name==="AbortError")throw e;const x=SVC_MSG("network");x.retry=true;throw x}
 if(!r.ok){clearTimeout(tm);let t="";try{t=(await r.json()).error.message}catch{}
  if([403,451,408,500,502,503,504,520,521,522,523,524,525,526].includes(r.status)){const x=SVC_MSG(r.status);x.retry=true;x.status=r.status;throw x}
  const e=new Error(r.status===401?(USE_PROXY?"The Cloudflare Worker rejected the request. Check the GROQ_API_KEY secret on the Worker.":"The API key was rejected. Put a valid Groq key in config.js (GROQ_KEY)."):(r.status===429?"Too many requests right now. Wait a few seconds and try again.":`Error (${r.status})${t?": "+t:""}`));if(r.status===401)e.fatal=true;e.retry=[400,404,413,429].includes(r.status);throw e}
 if(!stream){try{const j=await r.json();clearTimeout(tm);const _t=j.choices[0].message.content||"";ent[1]=inTok+tokEst(_t);if(meta)meta.finish=j.choices[0].finish_reason;return CL(_t)}catch(e){clearTimeout(tm);if(timedOut){const x=SVC_MSG("timeout");x.retry=true;throw x}throw e}}
 arm(60000);
 const rd=r.body.getReader(),dec=new TextDecoder();let buf="",full="";
 for(;;){let rr;try{rr=await rd.read()}catch(e){clearTimeout(tm);if(timedOut){if(full)return CL(full);const x=SVC_MSG("timeout");x.retry=true;throw x}throw e}const{done,value}=rr;arm(60000);if(done)break;buf+=dec.decode(value,{stream:true});const lines=buf.split("\n");buf=lines.pop();
  for(const l of lines){if(!l.startsWith("data:"))continue;const d=l.slice(5).trim();if(d==="[DONE]")continue;try{const jd=JSON.parse(d),ch=(jd.choices&&jd.choices[0])||{},dl=ch.delta||{},t=dl.content;if(ch.finish_reason&&meta)meta.finish=ch.finish_reason;if(dl.reasoning){S.__r=1;full=full.replace(/<\/think>$/,"");if(!/<think>/.test(full))full="<think>"+full;full+=dl.reasoning;onDelta&&onDelta(CL(full),(full.match(/<think>([\s\S]*?)$/)||[])[1]||"");continue}if(t){if(full.indexOf("<think>")>=0&&full.indexOf("</think>")<0&&t.indexOf("<think>")<0&&S.__r)full+="</think>";full+=t;onDelta&&onDelta(CL(full),(full.match(/<think>([\s\S]*?)(<\/think>|$)/)||[])[1]||"")}}catch{}}}
 clearTimeout(tm);ent[1]=inTok+tokEst(full);return CL(full)}

/* ---------- free backup AIs (no key): when Groq is rate limited wait 3 s, try backup 1, then backup 2, then go back to Groq ---------- */
const FREE_AI=(CFG.FREE_AI&&CFG.FREE_AI.length?CFG.FREE_AI:[]);
const isLimit=e=>!!e&&!e.fatal&&(/too many requests|rate limit|per minute|\b429\b/i.test(e.message||"")||e.status===429);
const textOnly=ms=>ms.every(m=>typeof m.content==="string");
async function freeAsk(p,messages,{json,onDelta,signal,maxTokens,temp,raw,box,meta}){
 const CL=raw?cleanR:clean,k=tmo(10000,signal);
 try{const ms=fitMsgs(messages,12000).slice(-14).map(m=>({role:m.role,content:m.content}));
  if(json)ms.unshift({role:"system",content:"Reply with valid JSON only."});
  const r=await fetch(p.url,{method:"POST",headers:{"Content-Type":"application/json",...(p.key?{Authorization:"Bearer "+p.key}:{})},body:JSON.stringify({model:p.model,messages:ms,temperature:temp||.7,max_tokens:Math.min(maxTokens||800,7000),stream:false}),signal:k.ac.signal});
  if(!r.ok){const e=new Error("HTTP "+r.status);e.status=r.status;e.ra=+(r.headers.get("Retry-After")||0);throw e}const j=await r.json();const t=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;
  if(!t||typeof t!=="string"||!t.trim())throw new Error("empty");const out=CL(t);if(meta)meta.finish=(j.choices[0].finish_reason||"");onDelta&&onDelta(out,"");return out}
 finally{k.done()}}
/* rotating pool: each request starts at the next free server; a server that is full / failing sits out (cooldown) while the others take over */
const BOX_MIN_TPM=CFG.BOX_MIN_TPM||8000;
const FP=FREE_AI.map(()=>({until:0,hits:[],busy:0}));let fRot=0,fNote=0;
function fAvail(i){const p=FREE_AI[i],st=FP[i],n=Date.now();if(st.until>n)return false;if(p.conc&&st.busy>=p.conc)return false;st.hits=st.hits.filter(t=>n-t<60000);return !p.rpm||st.hits.length<p.rpm}
function fCool(i,x){const st=FP[i],c=x&&x.status;st.until=Date.now()+((c===404||c===401||c===403||c===400)?600000:(c===429||c===402||c===503)?Math.max(20000,Math.min(120000,((x&&x.ra)||60)*1000)):45000)}
async function freeTry(messages,o,ex){
 const n=FREE_AI.length,order=[];for(let k=0;k<n;k++){const i=(fRot+k)%n;if(ex&&ex.indexOf(i)>=0)continue;if(fAvail(i)&&(!o.box||(FREE_AI[i].tpm||0)>=BOX_MIN_TPM))order.push(i)}fRot=(fRot+1)%n;
 if(o.box)order.sort((a,b)=>(FREE_AI[b].tpm||0)-(FREE_AI[a].tpm||0));
 if(o.switchFrom){const bad=order.filter(i=>FREE_AI[i].name===o.switchFrom),good=order.filter(i=>FREE_AI[i].name!==o.switchFrom);order.length=0;order.push(...good,...bad)}
 for(const i of order.slice(0,4)){
  if(o.signal&&o.signal.aborted)throw new DOMException("Aborted","AbortError");
  const st=FP[i];if(!fAvail(i))continue;st.busy++;st.hits.push(Date.now());
  try{const r=await freeAsk(FREE_AI[i],messages,o);window.__xmmBackup=FREE_AI[i].name;return r}
  catch(x){if(o.signal&&o.signal.aborted)throw x;fCool(i,x)}
  finally{st.busy--}}
 return null}
async function groq1(messages,o={}){
 /* order: 1) LLM7 always first (25/min) 2) when LLM7 is at its limit or fails -> Groq (about 1/min) 3) when Groq fails -> the other free servers 4) all failed -> "server overused" card */
 const canFree=FREE_AI.length&&textOnly(messages);
 if(!canFree){window.__xmmBackup="Groq";return await groqMain(messages,o)}
 const ab=()=>{if(o.signal&&o.signal.aborted)throw new DOMException("Aborted","AbortError")};
 const L=FREE_AI.findIndex(f=>f.name==="LLM7");
 if(L>=0&&o.switchFrom!=="LLM7"&&fAvail(L)&&(!o.box||(FREE_AI[L].tpm||0)>=BOX_MIN_TPM)){
  ab();const st=FP[L];st.busy++;st.hits.push(Date.now());
  try{const r=await freeAsk(FREE_AI[L],messages,o);window.__xmmBackup="LLM7";return r}
  catch(x){if(o.signal&&o.signal.aborted)throw x;fCool(L,x)}
  finally{st.busy--}}
 let last;
 if(Date.now()>=(window.__gLim||0)){
  ab();window.__xmmBackup="Groq";
  try{return await groqMain(messages,o)}
  catch(e){
   if(e&&e.name==="AbortError")throw e;ab();last=e;
   if(e&&(e.status===429||e.status===413||/\b(413|429)\b|rate limit|too many requests|per minute|tokens per/i.test(e.message||"")))window.__gLim=Date.now()+60000}}
 ab();
 const r=await freeTry(messages,o,L>=0?[L]:null);if(r!=null)return r;
 if(last&&(last.status===403||last.status===451)){for(let i=0;i<FREE_AI.length;i++){ab();try{const r2=await freeAsk(FREE_AI[i],messages,o);window.__xmmBackup=FREE_AI[i].name;return r2}catch(x){if(o.signal&&o.signal.aborted)throw x}}}
 const er=new Error("Server overused. Please wait a minute and try again.");er.allFailed=true;er.fatal=true;er.status=503;throw er}

/* ---------- web search (Groq compound = built-in live search) ---------- */
const WEB_MODELS=[]; /* off: the Worker forces one model with no web access, so these calls only burned quota */
/* Free open-source tools: Jina Reader (r.jina.ai) over DuckDuckGo Lite + Bing, Wikipedia API, AllOrigins proxy. No keys, no AI quota. */
const OS_BAD=/captcha|unusual traffic|are you a robot|verify you are human|access denied|enable javascript|just a moment/i;
function tmo(ms,signal){const ac=new AbortController(),t=setTimeout(()=>ac.abort(),ms);if(signal){if(signal.aborted)ac.abort();else signal.addEventListener("abort",()=>ac.abort(),{once:true})}return{ac,done:()=>clearTimeout(t)}}
async function jread(u,ms,signal){const k=tmo(ms,signal);try{const r=await fetch("https://r.jina.ai/"+u,{headers:{Accept:"text/plain"},signal:k.ac.signal});if(!r.ok)throw 0;const t=(await r.text()).trim();if(t.length<200||OS_BAD.test(t.slice(0,1500)))throw 0;return t}finally{k.done()}}
function cleanSerp(t){return String(t||"").replace(/https?:\/\/duckduckgo\.com\/l\/\?[^)\s]*?uddg=([^&)\s]+)[^)\s]*/g,(m,e)=>{try{return decodeURIComponent(e)}catch(x){return m}}).replace(/!\[[^\]]*\]\([^)]*\)/g,"").replace(/^.*(sign in|cookie|privacy|feedback|settings).*$/gim,"").replace(/\n{3,}/g,"\n\n").trim()}
async function wikiSnip(q,signal){const k=tmo(4500,signal);try{const r=await fetch("https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrnamespace=0&gsrlimit=3&gsrsearch="+encodeURIComponent(q)+"&prop=extracts&exintro=1&explaintext=1&exsentences=3&exlimit=3&format=json&origin=*",{signal:k.ac.signal});const j=await r.json();const p=j&&j.query&&j.query.pages;if(!p)return"";return Object.keys(p).map(x=>p[x]).sort((a,b)=>a.index-b.index).filter(x=>x.extract).map(x=>x.title+": "+x.extract.trim()+" (https://en.wikipedia.org/wiki/"+encodeURIComponent(x.title.replace(/ /g,"_"))+")").join("\n")}finally{k.done()}}
async function openSearch(query,signal){const q=encodeURIComponent(String(query).slice(0,200));
 const serp=Promise.any([jread("https://lite.duckduckgo.com/lite/?q="+q,6500,signal),jread("https://www.bing.com/search?q="+q,6500,signal)]).then(cleanSerp).catch(()=>"");
 const wk=wikiSnip(query,signal).catch(()=>"");
 const r=await Promise.all([serp,wk]);if(signal&&signal.aborted)throw new DOMException("Aborted","AbortError");
 const a=r[0],b=r[1];return(a&&a.length>150?"[WEB SEARCH RESULTS (DuckDuckGo/Bing via Jina Reader)]\n"+a.slice(0,3400)+(b&&a.length<900?"\n\n[WIKIPEDIA]\n"+b:""):b?"[WIKIPEDIA]\n"+b:"").slice(0,4200)}
async function webSearch(query,signal){
 try{const o=await openSearch(query,signal);if(o)return o}catch(e){if(e.name==="AbortError")throw e}
 for(const m of WEB_MODELS){try{
  const r=await groq1([{role:"system",content:"Today is "+nowInfo()+". You are a web research tool. Search the web and report concise, accurate, up-to-date findings (max 220 words). Include the source site names or URLs. No filler."},{role:"user",content:query}],{model:m,signal});
  if(r&&r.trim())return r.trim()}catch(e){if(e.name==="AbortError")throw e}}
 /* optional You.com free search endpoint fallback */
 try{
  const ac=new AbortController(),tm=setTimeout(()=>ac.abort(),10000);signal&&signal.addEventListener("abort",()=>ac.abort(),{once:true});
  const r=await fetch("https://api.you.com/api/streamingSearch?q="+encodeURIComponent(query.slice(0,200))+"&page=1&count=5",{headers:{Accept:"application/json"},signal:ac.signal});
  clearTimeout(tm);
  if(r.ok){const j=await r.json().catch(()=>null);const hits=(j&& (j.hits||j.results||j.searchResults||[]))||[];
   const text=hits.slice(0,5).map(h=>[h.title||h.name,h.description||h.snippet||h.text,h.url||h.link].filter(Boolean).join(" — ")).filter(Boolean).join("\n");
   if(text.trim())return text.trim().slice(0,2500)}}
 catch(e){if(e.name==="AbortError")throw e}
 return""}
const QUICK_YES=/\b(latest|newest|new|recent(ly)?|today|tonight|yesterday|tomorrow|this (week|month|year)|last (week|month)|news|current(ly)?|right now|now|price|prices|cost of|weather|forecast|score|scores|standings|stock|stocks|crypto|bitcoin|release date|released|launch(ed)?|announced|new version|update|trending|202[4-9]|iphone|ipad|macbook|ios|android|samsung|galaxy|pixel|playstation|ps5|ps6|xbox|switch 2|tesla|openai|chatgpt|gemini|claude|world cup|olympics|champions league|who is|who won|what happened|when is|when does|how much is|exchange rate|election|president|prime minister|breaking)\b/i;
const QUICK_NO=/^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|lol|bye|good (morning|night|evening))\b[\s!.?]*$/i;
const EXPL_SEARCH=/^\s*(?:please\s+|pls\s+|hey\s+|can you\s+|could you\s+)*(?:search|google|look\s*up|look\s*for|browse)\b|\b(?:search|look)\s+(?:the\s+)?(?:web|internet|online)\b|\bgoogle\s+(?:it|this|that|for)\b|\bweb\s*search\b|\bsearch\s+(?:for|up)\b|\bon the (?:web|internet)\b/i;
async function needsSearch(text,signal,mode){
 text=String(text||"").trim();if(text.length<4||QUICK_NO.test(text)||/```/.test(text))return null;
 if(/\b(xmm[\s-]?ai|xmmai|xmm|mohammad\s+yasin|yasin\s+bayat|bayat|xmm-ai\.com)\b/i.test(text))return null;
 if(mode!=="image"&&EXPL_SEARCH.test(text)){const c=text.replace(/^\s*(?:please\s+|pls\s+|hey\s+|can you\s+|could you\s+)*(?:search|google|look\s*up|look\s*for|browse|find)(?:\s+(?:the\s+)?(?:web|internet|online))?(?:\s+(?:for|up))?\s*:?\s*/i,"").replace(/\s+(?:on|in)\s+the\s+(?:web|internet)\s*$/i,"").trim();return(c.length>2?c:text).slice(0,300)}
 if(mode!=="image"&&QUICK_YES.test(text))return text.slice(0,300);
 return null; /* no extra AI classifier call: saves quota */
 try{
  const sys=mode==="image"
   ?'You decide if an image prompt names a specific real object, product, vehicle, place, event, creature, character, or thing you are NOT sure what it looks like or that is recent. Never search for real people. Reply ONLY JSON: {"search":boolean,"query":"short search query for what it visually looks like"}.'
   :'You decide if answering a chat message needs a live web search: needs latest/real-time data (news, prices, scores, weather, releases, events, laws, anything from 2025 or 2026), OR the message mentions a person, product, company, term or thing you are not sure about. Do NOT search for general knowledge, math, coding, writing, advice or casual chat. Reply ONLY JSON: {"search":boolean,"query":"short web search query"}.';
  const r=await groq1([{role:"system",content:sys},{role:"user",content:text.slice(0,500)}],{model:CFG.FAST_MODEL||CFG.TEXT_MODEL,json:true,signal});
  const j=JSON.parse(r.replace(/^[^{]*/,"").replace(/[^}]*$/,""));return j.search?String(j.query||text).slice(0,300):null}
 catch(e){if(e.name==="AbortError")throw e;return null}}
window.XMM_WEB={async visual(prompt){try{const q=await needsSearch(prompt,undefined,"image");if(!q)return"";
  const r=await webSearch("Describe visually (shape, colors, materials, distinctive features) in under 50 words, no links: "+q);return r.replace(/https?:\/\/\S+/g,"").slice(0,400)}catch{return""}}};

/* ---------- websites + in-chat images ---------- */
function bareSites(t){if(!/\b(open|visit|go to|goto|enter|check|read|browse|look at|summari[sz]e|what(?:'s| is) on|load|show me)\b/i.test(t))return null;const m=String(t).match(/\b(?:[a-z0-9-]+\.)+(?:com|org|net|io|ai|dev|app|co|edu|gov|info|tv|nl|de|uk|fr|es|ir|ru|xyz|site|online|tech|news|wiki|pages\.dev|vercel\.app)(?:\/[^\s<>"')\]]*)?/gi);return m?m.slice(0,2).map(x=>"https://"+x):null}
async function pageText(u,signal){let t="";
 try{t=await jread(u,9000,signal)}catch(e){if(signal&&signal.aborted)throw e}
 if(t.length<120){const k=tmo(8000,signal);try{const r=await fetch("https://api.allorigins.win/raw?url="+encodeURIComponent(u),{signal:k.ac.signal});if(r.ok){const h=await r.text();t=h.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();const ti=(h.match(/<title[^>]*>([^<]*)/i)||[])[1];if(ti)t="Title: "+ti.trim()+"\n"+t}}catch(e){if(signal&&signal.aborted)throw e}finally{k.done()}}
 if(t.length<120){try{t=await groq1([{role:"system",content:"You can visit websites. Visit the URL and report its real content in detail (max 500 words): title, main text, key facts. No filler."},{role:"user",content:u}],{model:CFG.TEXT_MODEL,signal})}catch(e){if(e.name==="AbortError")throw e}}
 return t}
async function visitSites(urls,signal){const r=await Promise.all(urls.map(u=>pageText(u,signal).then(t=>t?"[PAGE: "+u+"]\n"+t.slice(0,7000):"")));return r.filter(Boolean).join("\n\n")}
/* Image intent: ONLY real commands like "make an image of ..." count. Questions / statements about images do not. */
const W_=x=>`(?:${x})(?![\\p{L}\\p{M}])`;
const V_LAT="draw|paint|sketch|generate|create|make|render|design|produce|illustrate|zeichne|male|erstelle|erstell|generiere|mach|mache|erzeuge|dibuja|dibújame|dibujame|genera|crea|haz|hazme|dessine|dessine-moi|génère|genere|crée|cree|fais|fais-moi|disegna|disegnami|fai|crie|cria|gera|faz|desenha|desenhe|maak|teken|genereer|creëer|ontwerp|çiz|oluştur|yap|üret|нарисуй|создай|сгенерируй|сделай|нарисуйте|создайте|ارسم|أنشئ|انشئ|اصنع|ولد|ولّد|صمم|أريد صورة|बनाओ|बनाइए|बना दो|बनाएं|बनाओ";
const N_LAT="image|images|picture|pictures|photo|photos|pic|pics|drawing|illustration|logo|wallpaper|portrait|poster|painting|artwork|render|bild|bilder|foto|zeichnung|gemälde|illustration|imagen|imágenes|foto|dibujo|ilustración|pintura|image|images|photo|dessin|illustration|peinture|immagine|immagini|foto|disegno|illustrazione|imagem|imagens|foto|desenho|ilustração|afbeelding|foto|plaatje|tekening|illustratie|schilderij|resim|görsel|fotoğraf|çizim|resmi|resmini|resim|görseli|изображение|картинку|картинка|фото|рисунок|иллюстрацию|логотип|تصویر|عکس|نقاشی|لوگو|پوستر|صورة|صور|رسمة|لوحة|شعار|तस्वीर|चित्र|फोटो";
const FILL="(?:me|us|a|an|one|some|ein|eine|einen|ein|mir|un|una|une|uno|um|uma|een|bir|mij|мне|مرا|لي|یک|یه|एक)";
const POL="(?:please\\s+|pls\\s+|bitte\\s+|por favor\\s+|s'il te plaît\\s+|alsjeblieft\\s+|lütfen\\s+|пожалуйста\\s+|لطفا\\s+|لطفاً\\s+|من فضلك\\s+|can you\\s+|could you\\s+|would you\\s+|will you\\s+|kannst du\\s+|könntest du\\s+|puedes\\s+|peux-tu\\s+|puoi\\s+|kun je\\s+|kun jij\\s+|можешь\\s+|می‌تونی\\s+|میتونی\\s+|می توانی\\s+|میتوانی\\s+|هل يمكنك\\s+|i want you to\\s+|i need you to\\s+|ich möchte dass du\\s+)*";
/* verb first: "[polite] make [me] [a] image of ..." (English, German, Spanish, French, Italian, Portuguese, Dutch, Turkish, Russian, Arabic, Hindi) */
const RVERBFIRST=new RegExp("^\\s*"+POL+W_(V_LAT)+"\\s+(?:"+FILL+"\\s+){0,2}(?:"+W_(N_LAT)+")\\s+\\S","iu");
/* "draw a cat" style: draw/paint/sketch/zeichne/dibuja/dessine directly with a subject */
const RDRAW=new RegExp("^\\s*"+POL+W_("draw|paint|sketch|zeichne|dibuja|dibújame|dessine|disegna|desenha|teken|нарисуй|ارسم|بکش|بکشید|çiz")+"\\s+\\S","iu");
/* verb last (Persian, Turkish, Hindi): "یه عکس از گربه بساز", "bir kedi resmi yap" */
const RVERBLAST=new RegExp("^\\s*"+POL+"(?:\\S+\\s+){0,4}"+W_(N_LAT)+"\\s+(?:.{2,}?\\s+)?"+W_("بساز|بسازید|بکش|بکشید|درست کن|تولید کن|بساز لطفا|bana yap|yap|çiz|oluştur|üret|बनाओ|बनाइए|बना दो|बनाएं|बना दीजिए")+"\\s*[.!]?\\s*$","iu");
/* Chinese / Japanese / Korean (no spaces) */
const RCJK=/^\s*(?:请|請|帮我|幫我|给我|給我|麻烦|麻煩)?(?:画|畫|生成|制作|製作|创建|創建|做|绘制|繪製|画一|畫一)(?:一|1|个|個|张|張|幅)*.{0,8}?(?:图|圖|图片|圖片|图像|照片|画|畫|插画|插畫|海报|海報|标志|標誌|logo|Logo)|^\s*(?:.{0,12}?)(?:画像|イラスト|写真|絵|ロゴ|ポスター).{0,30}?(?:作って|生成して|描いて|作成して|を作|を描|を生成)|^\s*.{1,40}?(?:を|の絵を)描いて|^\s*(?:.{0,12}?)(?:이미지|그림|사진|로고|포스터).{0,30}?(?:만들어|그려|생성)/u;
const RNOT=/^\s*(?:how|why|what|which|where|when|who|is|are|do|does|did|can i|could i|should|explain|tell me|wie|warum|was|wo|wann|wer|erkläre|cómo|como|por qué|qué|cuál|dónde|comment|pourquoi|quel|quoi|come|perché|quale|hoe|waarom|wat|welke|nasıl|neden|ne|как|почему|что|какой|چطور|چگونه|چرا|چی|چه|كيف|لماذا|ما|هل|क्यों|कैसे|क्या)(?![\p{L}\p{M}])|\b(?:code|script|function|html|css|python|javascript|java|svg|excel|powerpoint|docker|dockerfile)\b|\bimage\s+(?:size|format|resize|compress|quality|url|link|file)|(?:^|\s)(?:this|that|the|these|those|diese[sn]?|dieses|este|esta|ese|esa|ce|cette|questo|questa|dit|deze|bu|şu|этот|эту|این|آن|هذه|هذا)\s+(?:image|picture|photo|bild|imagen|foto|image|immagine|afbeelding|resim|картинк|тасвир|عکس|تصویر|صورة)/iu;
const isImgReq=t=>{t=String(t||"").trim();if(window.XMM_GENMODE==="image"&&t.length>=2)return true;if(t.length<4||t.length>600||/```/.test(t)||RNOT.test(t))return false;if(/^\/(?:image|img|imagine)\b/i.test(t))return true;
 if(/^[^\n]*[?？؟]\s*$/.test(t)&&!/^\s*(?:can you|could you|would you|will you|kannst du|könntest du|puedes|peux-tu|puoi|kun je|можешь|میتونی|می‌تونی|میتوانی|می توانی|هل يمكنك)\b/iu.test(t))return false;
 return RVERBFIRST.test(t)||RDRAW.test(t)||RVERBLAST.test(t)||RCJK.test(t)};
window.XMM_ISIMG=t=>{try{if(S&&S.att&&S.att.some(x=>x.img))return false}catch(e){}return isImgReq(t)};
const ratioOf=t=>/(?:^|[^\p{L}])(?:9:16|portrait|vertical|story|hochformat|phone wallpaper)(?![\p{L}])/iu.test(t)?[720,1280]:/(?:^|[^\p{L}])(?:16:9|landscape|wide|wallpaper|banner|desktop|querformat|panorama)(?![\p{L}])/iu.test(t)?[1280,720]:/\b4:3\b/.test(t)?[1152,864]:[1024,1024];
const ENG=["gptimage","flux"];window.XMM_ENG=ENG;
const polli=(p,w,h,m)=>`https://image.pollinations.ai/prompt/${encodeURIComponent(p.slice(0,900))}?model=${m||ENG[0]}&width=${w}&height=${h}&seed=${Math.floor(Math.random()*1e9)}&nologo=true`;
window.XMM_NEXT=u=>{const m=/[?&]model=([^&]+)/.exec(u||""),i=m?ENG.indexOf(m[1]):-1;return i>=0&&i<ENG.length-1?u.replace(/([?&]model=)[^&]+/,"$1"+ENG[i+1]):null};
/* Backup engine: AI Horde (free community Stable Diffusion, anonymous key, no signup). Used only when every Pollinations model failed. */
const tagCanvas=async c=>{
 const x=c.getContext("2d"),ic=await new Promise((res,rej)=>{const i=new Image();i.crossOrigin="anonymous";i.onload=()=>res(i);i.onerror=rej;i.src="icon.svg?v=gpu6"});
 const s=Math.max(14,Math.round(c.width*.03)),pd=s*.35,d=s*1.3,txt="XMM AI";x.font=`600 ${s}px system-ui,-apple-system,sans-serif`;
 const tw=x.measureText(txt).width,w=d+tw+pd*3.2,h=d+pd*1.2;
 // left side, bottom — fixed into the pixels
 const rx=s*.7,ry=c.height-h-s*.7;
 x.fillStyle="rgba(0,0,0,.55)";x.beginPath();if(x.roundRect)x.roundRect(rx,ry,w,h,h/2);else x.rect(rx,ry,w,h);x.fill();
 x.save();x.beginPath();x.arc(rx+pd*.6+d/2,ry+h/2,d/2,0,7);x.clip();x.drawImage(ic,rx+pd*.6,ry+h/2-d/2,d,d);x.restore();
 x.fillStyle="#fff";x.textBaseline="middle";x.fillText(txt,rx+pd*.6+d+pd*.9,ry+h/2+s*.04)};
/* Always bake watermark into a data-URL so it is part of the image, not a UI overlay */
const bakeUrl=async url=>{
 if(!url)return null;
 if(/^data:/.test(url)){
  // re-bake if needed: draw data URL onto canvas and tag
  try{const i=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=url});
   const c=document.createElement("canvas");c.width=i.naturalWidth||i.width;c.height=i.naturalHeight||i.height;
   c.getContext("2d").drawImage(i,0,0);await tagCanvas(c);return c.toDataURL("image/jpeg",.9)}catch{return url}
 }
 try{
  const bl=await(await fetch(url,{mode:"cors"})).blob();
  const bm=await createImageBitmap(bl);
  const c=document.createElement("canvas");c.width=bm.width;c.height=bm.height;
  c.getContext("2d").drawImage(bm,0,0);await tagCanvas(c);
  return c.toDataURL("image/jpeg",.9);
 }catch(e){
  // fallback via image element (may fail CORS)
  try{const i=await new Promise((res,rej)=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>res(im);im.onerror=rej;im.src=url});
   const c=document.createElement("canvas");c.width=i.naturalWidth||i.width;c.height=i.naturalHeight||i.height;
   c.getContext("2d").drawImage(i,0,0);await tagCanvas(c);return c.toDataURL("image/jpeg",.9)}catch{return null}
 }
};
window.XMM_BAKE=bakeUrl;
window.XMM_ALT=async()=>null; /* Pollinations only */
async function saveTagged(url){
 const baked=(/^data:/.test(url)?url:null)||await bakeUrl(url)||url;
 const a=document.createElement("a");a.href=baked;a.download="xmm-image.jpg";a.click()}
window.XMM_SAVE=saveTagged;
const R1=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)};
function dotsHTML(lbl){let s="";for(let r=0;r<10;r++)for(let c=0;c<10;c++){const n=r*10+c,x=(c+.5+(R1(n+1)-.5)*.8)*10,y=(r+.5+(R1(n+7)-.5)*.8)*10,sz=3+R1(n+3)*3;
 s+=`<i style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${sz.toFixed(1)}px;height:${sz.toFixed(1)}px;--d:${(x*.014+y*.007).toFixed(2)}s;animation-delay:${(x*.014+y*.007).toFixed(2)}s"></i>`}
 return `<div class="dotsbox" aria-hidden="true">${s}</div><span class="dotslbl">${lbl||"Creating image…"}</span>`}
window.XMM_DOTS=dotsHTML;
const genActs=i=>`<div class="m-acts"><button class="icon-btn" data-gen="save" data-i="${i}" aria-label="Save image">${ic("download")}</button><button class="icon-btn" data-gen="redo" data-i="${i}" aria-label="Redo image">${ic("regen")}</button></div>`;
const busyHTML=i=>`<div class="gerr xbusy"><div><b>Servers are overloaded</b><span>Try again in 45 seconds.</span><button class="xretry" data-gen="redo" data-i="${i}">Try again</button></div></div>`;
function genHTML(m,i){const g=m.gen;if(!g.done&&!g.err&&!g.url&&S.genBot!==m)g.err="Couldn't make that one.";
 return `<div class="m-bot" data-i="${i}"><div class="body"><div class="genbox${g.done?" ok":""}${g.baked?" baked":""}${g.err?" bad":""}" data-g="${i}" style="aspect-ratio:${g.w}/${g.h}">${g.done||g.err?"":dotsHTML()}${g.url&&!g.err?`<img alt="" src="${esc(g.url)}">`:""}${g.err?(g.busy?busyHTML(i):`<div class="gerr">${esc(g.err)}</div>`):(g.baked?"":`<span class="gtag"><i></i>XMM AI</span>`)}</div></div>${(g.done||g.err)&&!g.busy?genActs(i):""}</div>`}
const refine=async(t,sig)=>{if(window.XMM_PUTER_ON)return"";try{return await Promise.race([groq1([{role:"system",content:"You are an expert prompt engineer for an AI image generator. Turn the user's request (any language) into ONE vivid English image prompt, 70-110 words. Rules: keep every detail, name, count, color and any text the user asked for exactly; if they asked for words on the image, put them in double quotes. Be concrete, never vague: describe the main subject precisely (shape, materials, pose, expression, clothing, correct anatomy and proportions), the setting and background depth, composition and camera (shot type, angle, lens, depth of field), lighting (source, direction, quality), mood, a harmonious color palette, fine textures, and one clear art style or photographic look. End with: highly detailed, sharp focus, professional quality. Do not add things that contradict the request. Output only the prompt, no quotes, no preface."},{role:"user",content:t.slice(0,500)}],{model:CFG.FAST_MODEL||CFG.TEXT_MODEL,signal:sig}),new Promise((_,j)=>setTimeout(j,9000))])}catch(e){if(e&&e.name==="AbortError")throw e;return""}};
function genFail(bot,msg){bot.gen.err=msg;bot.text="[Image failed]";if(S.genBot===bot){S.genBot=null;S.busy=false;ctrl=null;updateSend()}saveChats();renderMsgs()}
window.XMM_REFINE=t=>refine(t);
/* ---------- Image safety + natural-anatomy rules ----------
   Every image prompt (chat "make image of ..." and the Images screen) goes through XMM_SAFE before it reaches the model.
   Rules: natural look, one head per creature unless the user asked for more, heads attached to the neck/body, correct limb/wing/leg counts,
   believable proportions. The prompt is rewritten into a detailed, concrete description so the result looks like a real animal/person/object. */
const WANT_MULTI=/(?:two|2|three|3|four|multi|many|double|twin|dual)[\s-]*(?:head|headed)|\b(?:hydra|cerberus|ouroboros|siamese twins?|conjoined|headless|no head|without (?:a |its )?head|decapitat\w*|chimera|multi-?head\w*)\b|دو\s*سر|سه\s*سر|چند\s*سر|بدون\s*سر|هیدرا|سرب?روس/iu;
const NATURAL_TAIL="one head only, attached to the neck at the front of the body, single natural body, correct anatomy and proportions, natural realistic look";
const SAFE_SYS="You are the safety and quality layer of an AI image generator. Rewrite the user's image request as ONE detailed English image prompt of 60-100 words. Rules: (1) Keep every subject, count, color, pattern, text and style the user asked for exactly, and add NO extra objects, people, animals or props they did not ask for. (2) The result must look natural and believable: describe the main subject precisely as it looks in real life - body shape, how the head joins the neck and body, number and position of legs, wings, eyes, ears and tail, feather/fur/skin texture and where the pattern sits on the body. (3) Every creature or person has exactly ONE head, joined naturally to its neck at the front/top of the body, facing forward or to the side, with all body parts in their natural place and size. Say this in positive words inside the description (for example 'a single head on a normal neck'). Never write a negative list. (4) Only if the user explicitly asked for extra heads, no head, or a fantasy hybrid, follow that request instead of rule 3. (5) Also describe simple setting, soft natural lighting, camera angle and a clean sharp photographic or illustrative finish that fits the request. Adult content including nudity and sexual themes is allowed only when every subject is clearly an adult (18+). Strictly prohibit any depiction of minors, children, teens under 18, or anyone who appears underage in any nude, sexual or suggestive context. Keep it non-violent toward real people. Output only the prompt, no quotes, no preface.";
async function safePrompt(en,sig){
 en=String(en||"").trim();if(!en)return en;
 const multi=WANT_MULTI.test(en);let core="";
 if(!window.XMM_PUTER_ON){try{core=String(await Promise.race([groq1([{role:"system",content:SAFE_SYS},{role:"user",content:en.slice(0,500)+"\n/no_think"}],{model:CFG.FAST_MODEL||CFG.TEXT_MODEL,signal:sig,maxTokens:300,temp:.3}),new Promise((_,j)=>setTimeout(j,10000))])||"").replace(/<think>[\s\S]*?<\/think>/gi,"").replace(/^["'“”\s]+|["'“”\s]+$/g,"").trim()}catch(e){if(e&&e.name==="AbortError")throw e;core=""}}
 if(core.length<20)core=en;
 const tail=multi?"natural look, correct anatomy, sharp focus":NATURAL_TAIL+", sharp focus";
 return (core+", "+tail).slice(0,900)}
window.XMM_SAFE=safePrompt;
/* Background translator: any language (Persian, Arabic, Spanish, German, Chinese...) -> English, so the image matches the request */
const EN_STRICT=/(?:^|[^\p{L}])(?:the|and|with|of the|wearing|sitting|standing|holding|from|into|over|under|beautiful|realistic|cute|big|small|red|blue|green|black|white|cat|dog|car|city|girl|boy|man|woman|sunset|logo|style)(?![\p{L}])/giu;
const looksEnglish=t=>/^[\x00-\x7F]*$/.test(t)&&((t.match(EN_STRICT)||[]).length>=2);
const stripEnCmd=t=>t.replace(/^\s*(?:please\s+|can you\s+|could you\s+|would you\s+)*(?:draw|paint|sketch|generate|create|make|render|produce|illustrate|design)\s+(?:me\s+)?(?:an?\s+|one\s+|some\s+)?(?:image|images|picture|pictures|photo|photos|pic|drawing|illustration|painting|artwork)\s*(?:of|about|showing|with|that shows|where)?\s*/i,"").trim()||t;
const FA_HINT=t=>/[پچژگ\u06CC\u06A9]|(?:^|\s)(?:از|که|را|بساز|بسازید|بکش|بکشید|یه|یک|با|روی|توی|در|این|آن|یه)(?:\s|$)/u.test(t);
const TR_SYS="You are the translator inside an AI image generator. The user's text is an image request written in ANY language (Persian/Farsi, Arabic, Turkish, Dutch, German, Spanish, French, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Hindi, Urdu, or mixed languages or transliterated/Finglish text). Output ONE English image description of exactly what they want. Rules: keep EVERY detail: subjects, counts, colors, positions, clothing, age, style, mood, background, lighting, aspect ratio words. Remove only the command words (like 'make an image of', 'draw', 'بساز', 'maak een afbeelding van'). NEVER add objects or details they did not say and never change the meaning. Text that must appear inside the image: keep it in double quotes exactly as the user wrote it (do not translate it). Keep proper names. If it is already English, return it unchanged without the command words. PERSIAN WORDS (very important, never mix these up): غاز = goose (the bird), گاز = gas, غار = cave, قار = crow, قو = swan, اردک = duck, مرغ = chicken, خروس = rooster, کبوتر = pigeon, عقاب = eagle, شیر = lion (or milk), گرگ = wolf, خرس = bear, ماهی = fish, اسب = horse, کوه = mountain, دریا = sea, ماشین = car, خانه = house. When the text is Persian, read every word as Persian, not Arabic: for example غاز in an image request is a goose, never gas. Always pick the meaning that makes sense as something to draw. Output ONLY the English description: no notes, no quotes around it, no language names.";
async function toEn(t,signal){t=String(t||"").trim();if(!t)return t;
 if(looksEnglish(t))return stripEnCmd(t);
 for(let k=0;k<2;k++){
  try{const r=await Promise.race([groq1([{role:"system",content:TR_SYS},{role:"user",content:(FA_HINT(t)?"[Language: Persian (Farsi), NOT Arabic]\n":"")+t.slice(0,700)+"\n/no_think"}],{model:CFG.TEXT_MODEL,signal,maxTokens:320,temp:.1}),new Promise((_,rej)=>setTimeout(()=>rej(new Error("t")),k?9000:12000))]);
   let o=String(r||"").replace(/<think>[\s\S]*?<\/think>/gi,"").replace(/^(?:english|translation|prompt)\s*[:：-]\s*/i,"").replace(/^["'“”\s]+|["'“”\s]+$/g,"").trim();
   if(o.length>1)return o.slice(0,900)}
  catch(e){if(e&&e.name==="AbortError")throw e}}
 return t}
window.XMM_EN=toEn;
async function makeImg(c,text){
 const raw=text.replace(/^\s*\/(?:image|img|imagine)\s*/i,"").trim()||text,[w,h]=ratioOf(raw);
 const bot={role:"assistant",text:"[Image] "+raw.slice(0,120),gen:{w,h,url:"",done:false,err:""}};
 c.msgs.push(bot);S.busy=true;S.genBot=bot;updateSend();renderMsgs();renderList();
 const idx=c.msgs.length-1;ctrl=new AbortController();const sig=ctrl.signal;sig.addEventListener("abort",()=>genFail(bot,"Stopped."),{once:true});
 try{if(sig.aborted)return;
  if(window.XMM_LIMIT){if(!XMM_LIMIT.ok()){genFail(bot,"Cool down: wait "+Math.ceil(XMM_LIMIT.left()/1000)+"s before the next image.");return}XMM_LIMIT.stamp()}
  const en=await toEn(raw,sig);if(sig.aborted)return;bot.alt=1;
  let hd=await window.XMM_RACE(en,w,h,sig);if(sig.aborted)return;
  if(!hd){genFail(bot,"Couldn't make that one. Try again."+((window.XMM_RACE_ERR||[]).length?" ("+XMM_RACE_ERR[XMM_RACE_ERR.length-1].slice(0,90)+")":""));return}
  // always embed watermark into the image pixels (left side)
  const src=hd;const baked=await bakeUrl(src);if(sig.aborted)return;
  bot.gen.url=baked||src;bot.gen.baked=!!baked;
  const bx=document.querySelector(`.genbox[data-g="${idx}"]`);if(bx&&!bx.querySelector("img")&&cur()===c){const im=new Image();im.alt="";im.src=bot.gen.url;bx.appendChild(im)}
  const guard=()=>{if(S.genBot!==bot||bot.gen.done)return;const n=window.XMM_NEXT(bot.gen.url);
   if(n){bot.gen.url=n;const im=document.querySelector(`.genbox[data-g="${idx}"]>img`);if(im)im.src=n;setTimeout(guard,35000)}else if(!bot.alt){bot.alt=1;window.XMM_ALT(bot.gen.url).then(d=>{if(S.genBot!==bot||bot.gen.done)return;if(d){bot.gen.url=d;const im=document.querySelector(`.genbox[data-g="${idx}"]>img`)||new Image();im.src=d}else genFail(bot,"Took too long. Try again.")})}else genFail(bot,"Took too long. Try again.")};
  }
 catch(e){genFail(bot,e&&e.name==="AbortError"?"Stopped.":"Couldn't make that one. Try again.")}
 saveChats()}
document.addEventListener("load",e=>{const im=e.target;if(!(im instanceof HTMLImageElement))return;const bx=im.closest&&im.closest(".genbox");if(!bx)return;
 const i=+bx.dataset.g,c=cur(),m=c&&c.msgs[i];if(!m||!m.gen)return;m.gen.done=true;bx.classList.add("ok");bx.classList.toggle("baked",!!m.gen.baked);
 const mb=bx.closest(".m-bot");if(mb&&!mb.querySelector(".m-acts"))mb.insertAdjacentHTML("beforeend",genActs(i));
 if(S.genBot===m){S.genBot=null;S.busy=false;ctrl=null;updateSend()}saveChats();scrollDown()},true);
document.addEventListener("error",e=>{const im=e.target;if(!(im instanceof HTMLImageElement))return;const bx=im.closest&&im.closest(".genbox");if(!bx)return;
 const c=cur(),m=c&&c.msgs[+bx.dataset.g];if(m&&m.gen&&!m.gen.done){const n=window.XMM_NEXT(m.gen.url);if(n){m.gen.url=n;im.src=n}else if(!m.alt){m.alt=1;const gi=bx.dataset.g;window.XMM_ALT(m.gen.url).then(d=>{if(m.gen.done)return;if(d){m.gen.url=d;const x=document.querySelector(`.genbox[data-g="${gi}"]>img`);if(x)x.src=d}else genFail(m,"Couldn't make that one. Try again.")})}else genFail(m,"Couldn't make that one. Try again.")}},true);
document.addEventListener("click",async e=>{const b=e.target.closest&&e.target.closest("[data-gen]");if(!b)return;const c=cur(),i=+b.dataset.i,m=c&&c.msgs[i];if(!m||!m.gen)return;
 if(b.dataset.gen==="redo")regen(i);
 else{try{await saveTagged(m.gen.url);toast("Saved")}catch{window.open(m.gen.url,"_blank")}}});

/* ---------- chat ---------- */
const CHIPS=[];
const SUGS=[];
function renderChips(){return;$("#chips").innerHTML=CHIPS.map(([l],i)=>`<button class="chip" data-i="${i}">${l}</button>`).join("")}
function newChat(){S.cur=null;S.att=[];renderAtts();renderMsgs();renderList();chatView("chat");$("#msg").value="";autosize($("#msg"));updateSend();closeDrawer();if(innerWidth>860)$("#msg").focus()}
function openChat(id){S.cur=id;chatView("chat");renderMsgs();renderList();closeDrawer()}
function delChat(id){S.chats=S.chats.filter(c=>c.id!==id);if(S.cur===id)S.cur=null;saveChats();renderList();renderMsgs();syncNav()}
function renderList(){const q=($("#sideSearch")||{value:""}).value.trim().toLowerCase();const L=S.chats.filter(c=>!q||c.title.toLowerCase().includes(q)||c.msgs.some(m=>(m.text||"").toLowerCase().includes(q))).sort((a,b)=>(b.pin?1:0)-(a.pin?1:0));if(!L.length){$("#chatList").innerHTML=`<div class="nochat"><span class="icon-btn">${ic("chat")}</span>${q?"No results":"No conversations"}${q?"":`<button class="btn" data-act="newchat">Chat with XMM</button>`}</div>`;return}$("#chatList").innerHTML=L.map(c=>`<div class="chat-i ${c.id===S.cur?"on":""}" style="animation-delay:${Math.min(L.indexOf(c),8)*30}ms" data-id="${c.id}"><span dir="auto">${c.pin?"📌 ":""}${esc(c.title)}</span><button class="dots" data-dots="${c.id}" aria-label="Chat options">${ic("dots")}</button></div>`).join("")}
function msgHTML(m,i,last){if(m.gen&&m.role==="assistant")return genHTML(m,i);if(m.role==="user")return`<div class="m-uw">${m.atts&&m.atts.length?`<div class="m-atts">${m.atts.map(a=>a.img?`<img src="${a.img}" alt="">`:`<span class="chip">${esc(a.name)}</span>`).join("")}</div>`:""}${m.text?`<div class="m-user" dir="auto">${esc(m.text)}</div>`:""}</div>`;
 if(m.sunQuiz)return window.XMM_SUN?XMM_SUN.card(m,i):"";
 const th=(m.think||m.web||m.visit)?`<span class="thoughts" role="button" tabindex="0" data-th="${i}">Thoughts ${ic("chevr")}</span><div class="tbody" id="tb${i}">${esc((m.visit?"Visited the website.\n":"")+(m.web?"Searched the web.\n":"")+(m.think||"").trim())}</div>`:"";
 return`<div class="m-bot" data-i="${i}">${th}${m.fallback?`<div class="sun-note" style="margin:0 0 8px;padding:10px 12px;border-radius:12px;background:rgba(255,80,80,.12);border:1px solid rgba(255,80,80,.35);font-size:.9em;line-height:1.45">${esc(SUN_NOTICE)} <a href="${/^app\./.test(location.hostname)?"/why":"/chat/why.html"}" target="_blank" rel="noopener" style="font-weight:600;text-decoration:underline;white-space:nowrap">Learn more</a></div>`:""}<div class="body" dir="auto">${m.text?md(m.text):m.fallback||m.errCard?"":`<span class="think"><span class="stop-x think-x" aria-hidden="true"><i></i><i></i></span><span class="think-lbl">${esc(m.status||"Thinking…")}</span></span>`}</div>${m.errCard?`<div class="xerr"><div class="xerr-i">!</div><div class="xerr-t"><b>${esc(m.errCard.t)}</b><span>${esc(m.errCard.s)}</span></div><button type="button" class="xerr-b" data-ma="regen" data-i="${i}">Try again</button></div>`:""}${m.text&&!(last&&S.busy)?`<div class="m-acts"><button class="icon-btn" data-ma="copy" data-i="${i}" aria-label="Copy">${ic("copy")}</button><button class="icon-btn" data-ma="share" data-i="${i}" aria-label="Share">${ic("share")}</button><button class="icon-btn ${m.liked===1?"on":""}" data-ma="like" data-i="${i}" aria-label="Good response">${ic("thumb")}</button><button class="icon-btn dis ${m.liked===-1?"on":""}" data-ma="dislike" data-i="${i}" aria-label="Bad response">${ic("thumb")}</button><button class="icon-btn" data-ma="regen" data-i="${i}" aria-label="Regenerate">${ic("regen")}</button><span class="sp"></span>${m.ms?`<small>${(m.ms/1000).toFixed(2)}s</small>`:""}</div>`:""}</div>`}
function renderMsgs(){const c=cur();const empty=!c||!c.msgs.length;$("#viewChat").classList.toggle("empty",empty);$("#mainChat").dataset.empty=empty?1:0;
 $("#msgs").innerHTML=c?c.msgs.map((m,i)=>msgHTML(m,i,i===c.msgs.length-1)).join(""):"";scrollDown();syncNav();}
function scrollDown(){const c=$("#convo");c.scrollTop=c.scrollHeight}
function autosize(t){if(!t.value){if(t.style.height)t.style.height="";return}const o=t.style.height;t.style.height="auto";const h=Math.min(t.scrollHeight,180)+"px";t.style.height=h===o?o:h}
function updateSend(){const has=$("#msg").value.trim()||S.att.length;const b=$("#sendBtn");
 if(S.busy){
  if(!b.classList.contains("is-busy")){
   b.classList.add("is-busy","long-think");
   b.innerHTML='<span class="stop-x" aria-hidden="true"><i></i><i></i></span>';b.dataset.has="1";
  }
 }else{
  b.classList.remove("long-think","is-busy");
  b.innerHTML=ic("arrow");b.dataset.has=has?1:"";
 }}
function renderAtts(){$("#atts").innerHTML=S.att.map((a,i)=>{const up=a.p!=null&&a.p<100;return`<div class="att${a.img?" has-img":""}${up?" up":""}">${a.img?`<img src="${a.img}" alt="">`:`<i class="att-ic">${ic("file")}</i>`}<span>${esc(a.name)}</span><button class="icon-btn sm" data-rm="${i}" aria-label="Remove">${ic("close")}</button>${up?`<div class="att-bar"><b style="width:${a.p}%"></b></div><em class="att-pct">${Math.round(a.p)}%</em>`:""}</div>`}).join("")}
async function toDataURL(blob,max=1280){const bm=await createImageBitmap(blob);const k=Math.min(1,max/Math.max(bm.width,bm.height));const c=document.createElement("canvas");c.width=Math.round(bm.width*k);c.height=Math.round(bm.height*k);const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(bm,0,0,c.width,c.height);return c.toDataURL("image/jpeg",.85)}
function readProg(f,mode,cb){return new Promise((res,rej)=>{const r=new FileReader();r.onprogress=e=>{if(e.lengthComputable)cb(Math.min(90,e.loaded/e.total*90))};r.onload=()=>res(r.result);r.onerror=rej;mode==="url"?r.readAsDataURL(f):r.readAsText(f)})}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function addFiles(files){for(let f of files){let vmeta=null;
  if(/^video\//.test(f.type)&&window.XMM_MEDIA){const it0={name:f.name||"video",p:2};S.att.push(it0);renderAtts();updateSend();try{const r=await XMM_MEDIA.video(f,p=>{it0.p=Math.min(95,Math.max(it0.p,p));renderAtts()});S.att.splice(S.att.indexOf(it0),1);f=r.file;vmeta=r.meta}catch(e){S.att.splice(S.att.indexOf(it0),1);renderAtts();updateSend();toast(e.message||"Could not read video");continue}}
  const isImg=f.type.startsWith("image/")&&f.type!=="image/svg+xml";if(!isImg&&f.size>=1500000){toast(f.name+" is too large");continue}
  const it={name:f.name||"image",p:2};S.att.push(it);if(vmeta)it.video=vmeta;renderAtts();updateSend();
  const bump=()=>{renderAtts()};
  try{
   await readProg(f,"url",p=>{it.p=Math.max(it.p,p);bump()});
   if(isImg)it.img=await toDataURL(f,f.xmmGrid?2048:1280);else it.text=(await f.text()).slice(0,40000);
   for(let p=Math.max(it.p,90);p<100;p+=5){it.p=p;bump();await sleep(12)}
   it.p=100;
   /* always save uploads into Files & Preview tab (images + text) */
   try{window.XMM_CODE&&XMM_CODE.ingest({name:it.name,img:it.img,text:it.text})}catch(_){}
  }catch{S.att.splice(S.att.indexOf(it),1);toast("Could not read "+it.name)}
  renderAtts();updateSend()}}
let ctrl=null;
function send(textOverride){
 if(S.busy){ctrl&&ctrl.abort();return}
 /* ban check removed */
 
 if(S.att.some(x=>x.p!=null&&x.p<100))return;
 const input=$("#msg");const text=(typeof textOverride==="string"?textOverride:input.value).trim();if(!text&&!S.att.length)return;
 /* guard check removed */
 try{if(window.XMM_SUN&&XMM_SUN.intercept(text)){input.value="";autosize(input);updateSend();return}}catch(_){}
 // Instant core-memory: name, remember that…, age, location, preferences
 try{autoMem(text)}catch(_){}
 let c=cur();if(!c){c={id:uid(),title:(text||S.att[0].name).slice(0,48),msgs:[],temp:!!window.__twinTemp};S.chats.unshift(c);S.cur=c.id}
 const atts=S.att.slice();S.att=[];renderAtts();input.value="";autosize(input);try{window.XMM_SYNC_EXPAND&&window.XMM_SYNC_EXPAND()}catch(_){}
 const imgs=atts.filter(a=>a.img),files=atts.filter(a=>a.text);
 let full=text;files.forEach(f=>full+=`\n\n[File: ${f.name}]\n${f.text}`);if(!full)full="Describe this image in detail.";
 {const v=atts.find(a=>a.video);if(v&&window.XMM_MEDIA)full=XMM_MEDIA.videoPrompt(v.video,text)+full.slice(text.length).replace("Describe this image in detail.","");else if(window.XMM_MEDIA)full+=XMM_MEDIA.fileHint(text)}
 c.msgs.push({role:"user",text,full,atts:atts.map(a=>({name:a.name,img:a.img})),imgs:imgs.map(a=>a.img)});
 if(S.view!=="chat")chatView("chat");ask(c)}
const isCodeReq=t=>{t=String(t||"");return /\b(snake|game|website|web\s*site|landing\s*page|todo\s*app|build|create|make|write)\b.{0,40}\b(code|html|css|js|javascript|app|game|site|page|ui|dashboard|calculator|timer|clock)\b|\b(html|css|javascript|python)\b.{0,30}\b(code|file|script|program)\b|\b(make|build|create|write)\s+(a|an|me|my|the)?\s*(simple\s+)?(snake|pong|tetris|game|app|website|site|page|todo|calculator)/i.test(t)||/^(make|build|create|write)\s+.+\b(game|app|site|page|html)\b/i.test(t.trim())};
async function ask(c){
 const lu=c.msgs[c.msgs.length-1];if(lu&&lu.role==="user"&&!(lu.imgs&&lu.imgs.length)&&isImgReq(lu.text))return makeImg(c,lu.text);
 const bot={role:"assistant",text:""};c.msgs.push(bot);S.busy=true;updateSend();renderMsgs();renderList();
 {const tw=window.XMM_TWIN&&XMM_TWIN.local(String(lu&&lu.text||""),c.msgs.length<=2,!!(lu&&lu.imgs&&lu.imgs.length));
  if(tw){const tl=performance.now();bot.status="Thinking…";renderMsgs();ctrl=new AbortController();const sg=ctrl.signal;
   await new Promise(r=>{const id=setTimeout(r,tw.delay);sg.addEventListener("abort",()=>{clearTimeout(id);r()},{once:true})});
   bot.status="";bot.text=sg.aborted?"Stopped.":tw.text;bot.ms=performance.now()-tl;bot.mode=(MODELS[S.mode]||MODELS.x25).short;S.busy=false;ctrl=null;saveChats();renderMsgs();updateSend();return}}
 const prior=c.msgs.slice(0,-1).slice(-3);
 const hist0=prior.map((m,i)=>{if(m.role==="assistant")return{role:"assistant",content:m.text||""};
  if(i===prior.length-1&&m.imgs&&m.imgs.length)return{role:"user",content:[{type:"text",text:m.full},...m.imgs.map(u=>({type:"image_url",image_url:{url:u}}))]};
  return{role:"user",content:m.full||m.text}}).filter(x=>!(x.role==="assistant"&&!x.content));
 const nImg=hist0.length-1,lastImg=hist0[nImg]&&typeof hist0[nImg].content!=="string"?hist0.pop():null;const hist=XMM_PICK(hist0,60,T.name==="dev"?60000:12000).concat(lastImg?[lastImg]:[]);
  {const li=hist.length-1;if(li>=0&&hist[li].role==="user"&&typeof hist[li].content==="string"){const u=hist[li].content;let h="";
  if(/\b(flash\s*cards?)\b/i.test(u))h="xmm-flashcards";else if(/\b(quiz|test me|test my|exam me|trivia|practice (questions|problems)|mcq|multiple[- ]choice|questions? (about|on) )/i.test(u))h="xmm-quiz";else if(/\b(ask me|interview me|help me (choose|pick|decide|plan)|what do you need to know)\b/i.test(u))h="xmm-ask";
  let ex="";if(!h){const X=[[/\b(chart|graph|plot)\b/i,"xmm-chart",'{"type":"bar","title":"…","labels":["A","B"],"datasets":[{"label":"…","data":[1,2]}]}'],[/\b(compare|comparison|versus|vs\.?|which is better)\b/i,"xmm-compare",'{"title":"…","items":[{"name":"A","price":"…","desc":"…","best":true,"specs":{"Label":"value"}},{"name":"B","specs":{"Label":"value"}}],"verdict":"…"}'],[/\b(recipe|how to (cook|make|bake))\b/i,"xmm-recipe",'{"title":"Dish","time":"30 min","servings":2,"ingredients":["…"],"steps":["…"]}'],[/\b(table|spreadsheet)\b/i,"xmm-table",'{"headers":["A","B"],"rows":[["1","2"]]}'],[/\b(checklist|to-?do list|packing list)\b/i,"xmm-checklist",'{"title":"…","items":["…"]}']];for(const [re,hh,e] of X)if(re.test(u)){h=hh;ex=e;break}
  if(!h&&(/\b(directions?|route|navigate|navigation|how (do i|to|can i) (get|go|drive|walk)|where is|where's|take me to|way to|near me|nearby|closest|nearest|around here|address of|map of)\b|\b(schools?|universit(y|ies)|colleges?|hospitals?|pharmac(y|ies)|restaurants?|cafes?|supermarkets?|banks?|atms?|gas stations?|mosques?|parks?|hotels?|airports?|clinics?|kindergartens?)\b.{0,24}\b(near|in|at|around|close)\b|مسیر|راه |آدرس|کجاست|نزدیک|اطراف|مدرسه|دانشگاه|بیمارستان|داروخانه|Wegbeschreibung|Route nach|itin\u00e9raire|\u00e9cole|d\u00f3nde est\u00e1|c\u00f3mo llegar|escuela|Schule/i).test(u)){h="xmm-place";ex='{"name":"best real-world place name + city + country (fix any spelling or transliteration from any language; for a category like schools, hospitals, pharmacies, restaurants write e.g. schools in Isfahan, Iran or schools near me)","address":"same"}'}}
  if(h)hist[li]={...hist[li],content:u+"\n\n"+(ex?"[SYSTEM NOTE: reply with a short intro line and then exactly ONE ```"+h+" fenced block containing valid JSON shaped like "+ex+". Never describe the block in plain text.]":"[SYSTEM NOTE: reply with a short intro line and then exactly ONE "+h+" block (valid JSON, up to 20 questions"+(h==="xmm-quiz"?", 4 options each, answer = 0-based index, with explanation":h==="xmm-ask"?", 2-5 short options each":"")+"). Never write the questions as plain text and never say you cannot start it.]")}}}
 const idx=c.msgs.length-1;ctrl=new AbortController();const t0=performance.now();
 if(window.XMM_SUN&&!XMM_SUN.allowed(S.mode)){sunSetMode("x25")}
 const mm=MODELS[S.mode]||MODELS.x25,sun=/^sun(62|70)$/.test(S.mode),lite=/^sun(62|70)l$/.test(S.mode),userTxt=String(lu&&lu.text||"");
const AB=window.XMM_AUTOBOX?XMM_AUTOBOX(userTxt):"";
 try{let sys=sysPrompt()+(sun?"":EMOJIHINT)+MEMHINT+codeModeHint()+mm.p+(window.XMM_MCP?XMM_MCP.hint():"")+(hist.some(m=>Array.isArray(m.content))?" /no_think":"");const lastU=prior[prior.length-1];
  let vis=0;
  if(lastU&&lastU.role==="user"){let us=String(lastU.text||lastU.full||"").match(/https?:\/\/[^\s<>"')\]]+/g);if(!us)us=bareSites(String(lastU.text||lastU.full||""));
   if(us){bot.status="Visiting website…";renderMsgs();const pg=await visitSites([...new Set(us)].slice(0,2),ctrl.signal);bot.status="";vis=1;
    if(pg){bot.visit=true;sys+=" The user's message contains website link(s). The page contents were fetched live and are below. Use them to answer, and say so if the content is missing or does not answer the question.\n\n"+pg}}}
  if(!vis&&!AB&&lastU&&lastU.role==="user"&&!(lastU.imgs&&lastU.imgs.length)){
   const q=await needsSearch(lastU.full||lastU.text,ctrl.signal);
   if(q){bot.status="Searching the web…";renderMsgs();
    let found="";try{found=await webSearch(q,ctrl.signal)}catch(e){if(e.name==="AbortError")throw e;found=""}
    bot.status="";
    if(found){bot.web=true;sys+=" Fresh web search results are below; use them to answer accurately, mention source names briefly at the end, and say so if they don't answer the question.\n\n[WEB RESULTS for: "+q+"]\n"+found}
    else{sys+=" Web search was attempted for \""+q+"\" but it failed or returned nothing. Answer from your own knowledge. Briefly tell the user that the live web search failed, then give the best answer you can from knowledge."}}}
  const MIN_MS=0;let held="";if(lite){bot.status="Thinking…";renderMsgs()}
  let _pq=0,_pl=0;const paint=()=>{if(_pq)return;const w=0;_pq=setTimeout(()=>{_pq=0;_pl=performance.now();const e=$(`.m-bot[data-i="${idx}"] .body`);if(e){if(bot.text){const h=md(bot.text);if(e.__h!==h){e.__h=h;e.innerHTML=h}}const c=$("#convo");if(c&&c.scrollHeight-c.scrollTop-c.clientHeight<400)scrollDown()}},w)};
  if(lite)bot.__em=Math.random()<.3;
  const BUD=budgetFor(userTxt,hist);
  if(AB){bot.text=AB;paint()}
  else if(0){bot.status="Comparing 3 answers…";renderMsgs();const won=await sunBest([{role:"system",content:sys},...hist],mm,ctrl.signal);bot.status="";bot.text=stripEmoji(won);paint()}
  else await groq([{role:"system",content:sys+(window.XMM_TWIN?XMM_TWIN.hint():"")+BUD.hint},...hist],{model:hist.some(m=>Array.isArray(m.content))?CFG.VISION_MODEL:(CFG[mm.cfg]||CFG.TEXT_MODEL),maxTokens:BUD.max,box:!!BUD.box,temp:mm.temp,stream:true,autoCont:BUD.cont,signal:ctrl.signal,onDelta:(t,th)=>{
   const tt=sun?stripEmoji(t):(lite&&!bot.__em?stripEmoji(t):t);bot.think=th;
   if(performance.now()-t0<MIN_MS){held=tt;return}
   bot.text=tt;
   paint();
  }});
  const left=MIN_MS-(performance.now()-t0);
  if(left>0&&ctrl&&!ctrl.signal.aborted)await new Promise(r=>{const id=setTimeout(r,left);ctrl.signal.addEventListener("abort",()=>{clearTimeout(id);r()},{once:true})});
  if(held&&!bot.text)bot.text=held;
  if(sun)bot.text=stripEmoji(bot.text);else if(lite&&!bot.__em)bot.text=stripEmoji(bot.text);
  if(!bot.text)bot.text="…";paint();
  /* MCP tool loop: the AI may write an mcp-call block; run it in the browser and let the AI continue with the result */
  if(!AB&&window.XMM_MCP&&XMM_MCP.active()){let lastAcc=bot.text,shown="",n=0;
   while(n++<5&&ctrl&&!ctrl.signal.aborted){const call=XMM_MCP.parse(lastAcc);if(!call)break;
    const before=XMM_MCP.strip(lastAcc);shown+=(before?before+"\n\n":"")+"🔧 *"+call.server+" › "+call.tool+"*\n\n";
    bot.text=shown;bot.status="Using "+call.tool+"…";renderMsgs();
    const res=await XMM_MCP.run(call,ctrl.signal);bot.status="";
    hist.push({role:"assistant",content:XMM_MCP.raw(call)},{role:"user",content:"[TOOL RESULT: "+call.server+" › "+call.tool+"]\n"+res+"\n[END TOOL RESULT]\nNow answer the user using this result. Call another tool only if it is really needed."});
    let acc="";
    try{await groq([{role:"system",content:sys+BUD.hint},...hist],{model:CFG[mm.cfg]||CFG.TEXT_MODEL,maxTokens:BUD.max,temp:mm.temp,stream:true,signal:ctrl.signal,onDelta:t=>{acc=t;bot.text=shown+XMM_MCP.strip(acc);paint()}})}catch(er){if(er&&er.name==="AbortError")throw er;acc=""}
    lastAcc=acc;if(!acc)break}
   if(shown)bot.text=shown+XMM_MCP.strip(lastAcc);if(!bot.text||!bot.text.trim())bot.text="…";paint()}
  }
 catch(e){if(e.name==="AbortError"){bot.text=bot.text||"Stopped."}else if(bot.text&&bot.text.trim().length>20&&(e.status||e.retry||/not available right now|too many requests|\b(403|429|5\d\d)\b/i.test(e.message||"")))bot.text=bot.text.replace(/\n*🔧 \*[^\n]*\*\s*$/,"");else{const off=(typeof navigator!=="undefined"&&navigator.onLine===false)||/failed to fetch|networkerror|load failed|network request failed/i.test(String(e&&e.message||""));bot.errCard=e&&e.allFailed?{t:"Server overused",s:"Too many people are using XMM AI right now. Please wait a minute and try again."}:off?{t:"Can\u2019t connect",s:"Check your internet connection and try again."}:{t:"Something went wrong",s:String(e&&e.message||"Please try again.").replace(/^Error \(\w+\):\s*/,"")}}}
 bot.ms=performance.now()-t0;bot.mode=mm.short;S.busy=false;ctrl=null;saveChats();renderMsgs();updateSend()}
function regen(i){const c=cur();if(!c||S.busy)return;c.msgs.splice(i);ask(c)}
function transcript(c){return c.msgs.map(m=>(m.role==="user"?"You: ":"XMM: ")+(m.text||"")).join("\n\n")}
function doSearch(){const q=$("#searchIn").value.trim().toLowerCase();const out=$("#searchOut");
 const hits=S.chats.map(c=>{const m=c.msgs.find(m=>(m.text||"").toLowerCase().includes(q));return(!q||c.title.toLowerCase().includes(q)||m)?{c,m}:null}).filter(Boolean);
 out.innerHTML=hits.length?hits.map(h=>`<div class="r-i" data-id="${h.c.id}"><span dir="auto">${esc(h.c.title)}</span><small dir="auto">${esc(((q&&h.m)?h.m.text:h.c.msgs[0]?.text)||"")}</small></div>`).join(""):`<div class="empty-note">${S.chats.length?"No matches.":"No chats yet."}</div>`}
function renderNotes(){const n=$("#notes");n.innerHTML=S.notes.length?S.notes.map(x=>`<div class="note glass" data-id="${x.id}"><input value="${esc(x.title)}" placeholder="Title" dir="auto"><textarea placeholder="Write something…" dir="auto">${esc(x.body)}</textarea><button class="icon-btn sm del" data-del="${x.id}" aria-label="Delete note">${ic("trash")}</button></div>`).join(""):`<div class="empty-note">No notes yet. Tap “New note”.</div>`}

/* ---------- settings / install ---------- */
async function pwaCheck(){const o=[];o.push(["HTTPS",location.protocol==="https:"||location.hostname==="localhost"]);
 try{const l=document.querySelector('link[rel=manifest]');const r=await fetch(l.href,{credentials:"include",cache:"no-store"});const m=await r.json();o.push(["Manifest",r.ok&&!!m.name]);o.push(["Icon",m.icons.length>0]);
  const s=await fetch(new URL(m.start_url,l.href),{cache:"no-store",redirect:"manual"});o.push(["Start page opens",s.ok])}catch(e){o.push(["Manifest",false])}
 try{const rg=await navigator.serviceWorker.getRegistration();o.push(["Service worker",!!(rg&&rg.active)])}catch{o.push(["Service worker",false])}
 o.push(["Running as app",!!standalone()]);
 $("#pwaInfo").innerHTML=o.map(([k,v])=>`${v?"✅":"❌"} ${k}`).join("<br>")}
function openSettings(){if(window.XMM_CLONE)XMM_CLONE.openSettings()}
let deferred=null;const standalone=()=>!!window.XMM_APP||matchMedia("(display-mode: standalone)").matches||navigator.standalone;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;maybeBanner()});
window.addEventListener("appinstalled",()=>{$("#installBanner").hidden=true;deferred=null;toast("XMM AI installed")});
function maybeBanner(){if(standalone()||ld("xmm.noinst",0)>Date.now())return;if(innerWidth>860)return;if(deferred||isIOS)setTimeout(()=>{$("#installBanner").hidden=false},2200)}
function platform(){const ua=navigator.userAgent||"";const isI=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);const isA=/android/i.test(ua);const isMac=/macintosh|mac os x/i.test(ua)&&!isI;const isWin=/windows/i.test(ua);const isChr=/chrome|crios|edg/i.test(ua)&&!/opr|opera/i.test(ua);return{isI,isA,isMac,isWin,isChr,isDesk:!isI&&!isA}}
function installGuideHTML(){const p=platform();
  const step=(n,t)=>`<div class="ig-step"><div class="ig-n">${n}</div><div class="ig-txt"><b>${t}</b></div></div>`;
  if(standalone())return`<p class="hint" style="text-align:center;padding:12px 0">XMM AI is already installed on this device.</p>`;
  let body="";
  if(p.isI)body=`<p class="hint">Add XMM AI to your Home Screen for the full app experience.</p>
    ${step(1,"Tap the Share button in Safari")}
    ${step(2,'Scroll and tap “Add to Home Screen”')}
    ${step(3,"Confirm — XMM appears on your Home Screen")}`;
  else if(p.isA)body=`<p class="hint">Install XMM AI for full-screen, faster access.</p>
    ${step(1,"Tap the menu (⋮) in Chrome")}
    ${step(2,'Tap “Install app” or “Add to Home screen”')}
    ${step(3,"Confirm — XMM opens like a native app")}`;
  else body=`<p class="hint">Install XMM AI on your computer for a dedicated window.</p>
    ${step(1,"Open the browser menu (⋮ or ⋯)")}
    ${step(2,'Click “Install XMM AI” or “Install app”')}
    ${step(3,"The app opens in its own window — pin it to taskbar/dock")}`;
  return body}
async function doInstall(){
  if(deferred){try{deferred.prompt();await deferred.userChoice}catch(e){}deferred=null;$("#installBanner").hidden=true;return}
  if(standalone()){toast("Already installed");return}
  const body=$("#igBody");if(body){body.innerHTML=installGuideHTML();$("#installGuide").hidden=false}
}
function clearAll(){if(confirm("Delete all chats?")){S.chats=[];S.cur=null;saveChats();renderList();renderMsgs();$("#settings").hidden=true}}

/* ---------- wiring ---------- */
function init(){
 buildNav("#chatNav",NAV,navClick);buildBn("#chatBnav",BN,navClick);
 icons();renderChips();renderList();renderMsgs();updateSend();chatView("chat");
 document.addEventListener("click",e=>{const t=e.target;if(!t.closest(".pop")&&Date.now()-menuT>450)closeMenu();
  let b;
  if(b=t.closest("[data-act]")){const a=b.dataset.act;
   if(a==="newchat")newChat();else if(a==="openDrawer")openDrawer();else if(a==="closeDrawer")closeDrawer();else if(a==="settings")openSettings();else if(a==="closeSettings")$("#settings").hidden=true;
   else if(a==="closeInstall")$("#installGuide").hidden=true;
   else if(a==="install")doInstall();else if(a==="toggleSide")document.body.classList.toggle("collapsed");
   else if(a==="share"){const c=cur();if(c)navigator.clipboard.writeText(transcript(c)).then(()=>toast("Chat copied"))}
   
   else if(a==="topdots")showMenu(b,[{label:"Settings",fn:openSettings},...(window.XMM_APP?[]:[{label:"Install App",fn:doInstall}]),{label:"Delete all chats",danger:1,fn:clearAll}],"right");
   return}
  if(b=t.closest("[data-dots]")){e.stopPropagation();const id=b.dataset.dots;showMenu(b,(window.XMM_TWIN?XMM_TWIN.chatItems(id):[]).concat([{label:"Delete chat",danger:1,fn:()=>delChat(id)}]),"right");return}
  if(b=t.closest("[data-ma]")){const c=cur(),i=+b.dataset.i,m=c&&c.msgs[i];if(!m)return;const k=b.dataset.ma;
   if(k==="share"){const tx=m.text;navigator.share?navigator.share({text:tx}).catch(()=>{}):navigator.clipboard.writeText(tx).then(()=>toast("Copied"))}else if(k==="copy")navigator.clipboard.writeText(m.text).then(()=>toast("Copied"));
   else if(k==="like"||k==="dislike"){const v=k==="like"?1:-1;m.liked=m.liked===v?0:v;saveChats();renderMsgs();}
   else if(k==="regen")regen(i);
   return}
  if((b=t.closest("[data-s]"))&&!t.closest(".xw")){send(b.dataset.s);return}
  if(b=t.closest("#chips [data-i]")){send(CHIPS[b.dataset.i][1]);return}
  if(b=t.closest("[data-rm]")){S.att.splice(+b.dataset.rm,1);renderAtts();updateSend();return}
  if(b=t.closest(".chat-i[data-id],.r-i[data-id]")){openChat(b.dataset.id)}
 });
 $("#scrim").onclick=closeDrawer;
 $("#sideSearch").oninput=renderList;
 $(".sidenav2").onclick=e=>{const b=e.target.closest("[data-k]");if(b)chatView(b.dataset.k)};
 if($("#seg"))$("#seg").onclick=e=>{const b=e.target.closest("[data-m]");if(!b)return;const m=b.dataset.m;if(m==="imagine"){return}else if(m==="code"){document.body.classList.add("v-build");document.body.classList.remove("code-on");try{window.XMM_CODE&&XMM_CODE.isOpen()&&XMM_CODE.close()}catch(z){}}else{document.body.classList.remove("v-build","code-on");chatView("chat")}};
 if($(".quick"))$(".quick").onclick=e=>{const b=e.target.closest("[data-q]");if(!b)return;if(b.dataset.q==="image")document.querySelector('#chatNav [data-act="image"]').click();else{const m=$("#msg");m.value=b.dataset.q;autosize(m);updateSend();m.focus()}};
 let modeLock=0;
function closeModeSheet(){const o=document.getElementById("modeSheet");if(!o||o.classList.contains("out"))return;o.classList.add("out");setTimeout(()=>o.remove(),280)}
$("#modeBtn").onclick=e=>{e.stopPropagation();e.preventDefault();
  const now=Date.now();if(now-modeLock<300)return;modeLock=now;
  if(document.getElementById("modeSheet")){closeModeSheet();return}
  closeMenu();
  const o=document.createElement("div");o.id="modeSheet";
  const _it=k=>{const lk=window.XMM_SUN&&XMM_SUN.locked(k);return`<button type="button" class="ms-i${S.mode===k?" on":""}${lk?" lock":""}" data-k="${k}"><b>${esc(MODELS[k].name)}</b><small>${esc(lk?"Locked · limited event":MODELS[k].desc)}</small><i>${lk?"\uD83D\uDD12":(S.mode===k?"\u2713":"")}</i></button>`};
  const _L=window.XMM_SUN?XMM_SUN.list():Object.keys(MODELS),_G=window.XMM_SUN?XMM_SUN.galaxy():["x7g","g7l"],_open=_G.indexOf(S.mode)>=0;
  const _fam=k=>{const n=MODELS[k].name;return/Galaxy/i.test(n)?"Galaxy":/Sun/i.test(n)?"Sun":/Engine/i.test(n)?"Engine":"Classic"};
  const _FO=["Galaxy","Sun","Engine","Classic"],_gr={};_L.forEach(k=>{(_gr[_fam(k)]=_gr[_fam(k)]||[]).push(k)});
  o.innerHTML='<div class="ms-bg"></div><div class="ms-card" role="menu">'+_FO.filter(f=>_gr[f]).map(f=>'<div class="ms-fam'+(f==="Galaxy"?" ms-gal":"")+'"><span class="ms-fh">'+f+' family</span>'+_gr[f].map(_it).join("")+'</div>').join("")+'</div>';
    o.addEventListener("click",ev=>{const gt=ev.target.closest(".ms-gt");if(gt){ev.stopPropagation();const g=o.querySelector(".ms-gal"),on=g.hidden;g.hidden=!on;gt.textContent=(on?"\u25BC":"\u25B6")+" Galaxy models";return}const b=ev.target.closest("[data-k]");if(b){const k=b.dataset.k;if(window.XMM_SUN&&XMM_SUN.locked(k)){closeModeSheet();modeLock=Date.now();XMM_SUN.hint();return}closeModeSheet();modeLock=Date.now();sunSetMode(k);if(k==="sun62")sunPopup();return}if(ev.target.closest(".ms-bg"))closeModeSheet()});
  document.body.appendChild(o)
};S.mode=S_MODE_DEFAULT;$("#modeBtn span").textContent="Models";
 $("#convo").addEventListener("click",e=>{const t=e.target.closest("[data-th]");if(t){t.classList.toggle("o");$("#tb"+t.dataset.th).classList.toggle("o")}});
 $("#logout").onclick=()=>{if(confirm("Log out? All chats on this device will be deleted.")){try{Object.keys(localStorage).filter(k=>/^xmm\./.test(k)&&k!=="xmm.lang").forEach(k=>localStorage.removeItem(k))}catch{}try{indexedDB.deleteDatabase("xmmcode")}catch{}location.reload()}};
 window.XMM_SUNAPI={send,cur,S,renderMsgs,saveChats,uid,toast,sunSetMode,MODELS,renderList,newChat,scrollDown};window.XMM_API={setName,groq,toast,showMenu,esc,md,ic,CFG,delChat,newChat,send,S,cur,renderMsgs};

 $("#installGuide").onclick=e=>{if(e.target.id==="installGuide")e.target.hidden=true};
 $("#clearAll").onclick=clearAll;
 $("#msg").addEventListener("input",e=>{autosize(e.target);updateSend()});
 $("#msg").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey&&innerWidth>860){e.preventDefault();send()}});
 $("#sendBtn").onclick=()=>{if(S.busy||$("#sendBtn").dataset.has)send()};
 /* attBtn handled by upload.js modal only — never open native picker on random taps */
 document.addEventListener("change",e=>{if(e.target&&(e.target.id==="file"||e.target.classList&&e.target.classList.contains("xmm-file"))){addFiles([...e.target.files]);e.target.value=""}});
 /* drop handling lives in upload.js */
 $("#msg").addEventListener("paste",e=>{const f=[...(e.clipboardData?.files||[])];if(f.length){e.preventDefault();addFiles(f)}});
 $("#searchIn").oninput=doSearch;
 $("#newNote").onclick=()=>{S.notes.unshift({id:uid(),title:"",body:""});sv("xmm.notes",S.notes);renderNotes()};
 $("#notes").addEventListener("input",e=>{const n=e.target.closest(".note");const x=S.notes.find(q=>q.id===n.dataset.id);if(!x)return;if(e.target.tagName==="INPUT")x.title=e.target.value;else x.body=e.target.value;sv("xmm.notes",S.notes)});
 $("#notes").onclick=e=>{const d=e.target.closest("[data-del]");if(d){S.notes=S.notes.filter(n=>n.id!==d.dataset.del);sv("xmm.notes",S.notes);renderNotes()}};
 $("#instYes").onclick=doInstall;$("#instNo").onclick=()=>{$("#installBanner").hidden=true;sv("xmm.noinst",Date.now()+3*864e5)};
 if(standalone())$("#installBtn").hidden=true;maybeBanner();
 const qs=new URLSearchParams(location.search),GOK=qs.get("go"),QQ=qs.get("q");
 {const sp=$("#splash");if(sp){sp.classList.add("out");setTimeout(()=>sp.remove(),180)}}
 applyName();
 $("#setName").addEventListener("input",e=>setName(e.target.value));
 $("#setMem").addEventListener("input",e=>sv("xmm.mem",e.target.value.slice(0,2000)));
 const wl=$("#welcome");const done=()=>{wl.hidden=true;sv("xmm.welcomed",1)};
 $("#welcomeForm").onsubmit=e=>{e.preventDefault();const v=$("#nameIn").value.trim();if(!v){$("#nameIn").focus();return}setName(v);done();toast(`Nice to meet you, ${v}!`)};
 $("#nameSkip").onclick=done;
 if(0)setTimeout(()=>{wl.hidden=false;$("#nameIn").focus()},2100);
 if(GOK||QQ){try{history.replaceState(null,"",location.pathname)}catch{}
  const PRE={analyze:"Analyze this image: ",write:"Write ",code:"Write code that ",translate:"Translate to English: ",web:"Search the web: ",chat:""};
  const run=()=>{if(QQ){newChat();setTimeout(()=>send(QQ.slice(0,2000)),60)}
   else if(GOK==="image"){const b=$('#chatNav [data-act="image"]');b&&b.click()}
   else if(GOK==="notes")chatView("notebooks");
   else{newChat();const m=$("#msg");m.value=PRE[GOK]||"";autosize(m);updateSend();m.focus();if(GOK==="analyze"){$("#attBtn").classList.add("pulse");setTimeout(()=>$("#attBtn").classList.remove("pulse"),4000);toast("Tap + to attach an image")}}};
  if(document.readyState==="complete")run();else addEventListener("load",run)}
}
window.XMM_API={S,cur,ask,saveChats,renderMsgs,renderList,toast,regen,transcript,showMenu,newChat,delChat,openChat,send,groq,CFG};window.XMM_GROQ=groq;
init();
})();
