/* XMM Images — ChatGPT-Images-style studio. Free, no key (Pollinations FLUX). */
(()=>{
const $=s=>document.querySelector(s);
const STYLES={Auto:"",Realistic:"ultra realistic photo, detailed, natural light",Anime:"anime style, vibrant, clean lineart","3D":"3D render, soft studio lighting, glossy",Painting:"oil painting, rich brush strokes, cinematic",Neon:"neon glow, cyberpunk, dark background, vivid colors",Minimal:"minimal flat vector illustration, clean shapes"};
const RATIOS={"1:1":[1024,1024],"16:9":[1280,720],"9:16":[720,1280],"4:3":[1152,864]};
const W="https://commons.wikimedia.org/wiki/Special:FilePath/";
const TREND=[
["Starry night over a village","Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",[5,4]],
["Red Fuji at clear morning","Red_Fuji_southern_wind_clear_morning.jpg",[3,2]],
["Vase of sunflowers","Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg",[4,5]],
["Almond blossom branches","Vincent_van_Gogh_-_Almond_blossom_-_Google_Art_Project.jpg",[4,5]],
["A cozy yellow bedroom","Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg",[4,3]],
["Water lilies on a pond","Claude_Monet_-_Water_Lilies_-_1906,_Ryerson.jpg",[1,1]],
["Pillars of creation nebula","Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg",[1,1]],
["Crab nebula in space","Crab_Nebula.jpg",[1,1]],
["Earth from space","The_Earth_seen_from_Apollo_17.jpg",[1,1]],
["Matterhorn mountain peak","Matterhorn_from_Domh%C3%BCtte_-_2.jpg",[4,5]]];
let style="Auto",ratio="1:1",busy=false,tab="trend",hist=[];
try{hist=JSON.parse(localStorage.getItem("xmm_imgs")||"[]")}catch{}
const ic={back:'<path d="M15 18l-6-6 6-6"/>',plus:'<path d="M12 5v14M5 12h14"/>',send:'<path d="M12 19V5M5 12l7-7 7 7"/>',style:'<circle cx="12" cy="12" r="8"/><path d="M12 4v16"/>',mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>'};
const svg=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ic[n]}</svg>`;
const root=document.createElement("div");root.id="studio";root.hidden=true;root.style.display="none";
root.innerHTML=`<header class="sv-top"><h1>Images</h1></header><button class="sv-back" id="svBack" aria-label="Back">${svg("back")}</button>
<div class="sv-tabs"><button class="sv-tab on" data-t="trend">Trending</button><button class="sv-tab" data-t="mine">My images</button></div>
<div class="sv-scroll"><div class="sv-grid" id="svGrid"></div></div>
<div class="sv-pop" id="svPop" hidden><b>Style</b><div class="sv-chips" id="svStyles"></div><b>Shape</b><div class="sv-chips" id="svRatios"></div></div>
<div class="sv-bar"><textarea id="svPrompt" rows="1" placeholder="Describe a new image" dir="auto"></textarea><button class="sv-go" id="svGo" aria-label="Generate">${svg("send")}</button></div>
<div class="sv-view" id="svView" hidden><div class="frame"><div class="sv-wrap"><img id="svImg" alt="" hidden><span class="gtag"><i></i>XMM AI</span></div><div class="sv-busy xbusy" id="svBusy" hidden><div><b>Servers are overloaded</b><span>Try again in 45 seconds.</span><button class="xretry" id="svRetry">Try again</button></div></div><div class="sv-load" id="svLoad"><div class="gdots" id="svGd">${window.XMM_DOTS?window.XMM_DOTS():""}</div></div></div><div class="sv-acts"><button id="svDl">Save</button><button id="svRe">Redo</button><button id="svClose">Close</button></div></div>`;
document.body.appendChild(root);
const toast=t=>{const e=$("#toast");if(!e)return;e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600)};
const mk=(p,w,h,seed)=>`https://image.pollinations.ai/prompt/${encodeURIComponent(p.slice(0,900))}?model=${(window.XMM_ENG||["flux"])[0]}&width=${w}&height=${h}&seed=${seed}&nologo=true`;
const chip=(el,items,get,set)=>{el.innerHTML=items.map(k=>`<button class="sv-chip${get()===k?" on":""}" data-k="${k}">${k}</button>`).join("");el.onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;set(b.dataset.k);chip(el,items,get,set)}};
chip($("#svStyles"),Object.keys(STYLES),()=>style,v=>{style=v;var l=$("#svStyleLbl");if(l)l.textContent=v});
chip($("#svRatios"),Object.keys(RATIOS),()=>ratio,v=>ratio=v);
function draw(){const g=$("#svGrid");
 if(tab==="trend"){g.innerHTML=TREND.map((t,i)=>{const[a,b]=t[2];return`<button class="sv-card sk" data-i="${i}" style="--ar:${a}/${b}"><img alt="" src="${W+t[1]}?width=520" loading="lazy"><span>${t[0]}</span></button>`}).join("");
  g.querySelectorAll("img").forEach(im=>{const ok=()=>{im.classList.add("ld");im.parentNode.classList.remove("sk")};im.onload=ok;im.onerror=()=>{im.parentNode.remove()};if(im.complete&&im.naturalWidth)ok()})}
 else g.innerHTML=hist.length?hist.map((x,i)=>`<button class="sv-card" data-h="${i}" style="--ar:1/1"><img class="ld" src="${x.url}" alt="" loading="lazy">${/^data:/.test(x.url)?"":'<b class="gtag"><i></i>XMM AI</b>'}<span>${(x.prompt||"").replace(/</g,"&lt;")}</span></button>`).join(""):'<div class="sv-empty">No images yet. Describe one below.</div>'}
$("#svGrid").onclick=e=>{const c=e.target.closest(".sv-card");if(!c)return;
 if(c.dataset.i){const t=TREND[+c.dataset.i],pr=$("#svPrompt");pr.value=t[0]+", ";pr.focus()}
 else if(c.dataset.h){const x=hist[+c.dataset.h];showUrl(x.url,x.prompt)}};
document.querySelectorAll(".sv-tab").forEach(b=>b.onclick=()=>{tab=b.dataset.t;document.querySelectorAll(".sv-tab").forEach(x=>x.classList.toggle("on",x===b));draw()});
let cur="",curP="",lastP="",lastL;
function showUrl(url,p,tried){cur=url;curP=p;const v=$("#svView"),im=$("#svImg");v.classList.toggle("baked",/^data:/.test(url));v.hidden=false;im.hidden=true;$("#svGd").style.aspectRatio=RATIOS[ratio].join("/");$("#svLoad").hidden=false;
 const finish=u=>{cur=u;v.classList.toggle("baked",/^data:/.test(u));im.src=u};
 im.onload=()=>{clearTimeout(showUrl.t);$("#svLoad").hidden=true;im.hidden=false;busy=false;$("#svGo").classList.remove("busy");
  // if not yet baked into pixels, bake now (left watermark)
  if(!/^data:/.test(cur)&&window.XMM_BAKE){window.XMM_BAKE(cur).then(d=>{if(d){cur=d;v.classList.add("baked");im.src=d;if(hist[0]&&hist[0].url===url)hist[0].url=d}})}};
 showUrl.alt=tried?1:0;const fail=()=>{clearTimeout(showUrl.t);v.hidden=true;busy=false;$("#svGo").classList.remove("busy");toast("Couldn't make that one. Try again.")};im.onerror=()=>{const n=window.XMM_NEXT&&window.XMM_NEXT(cur);if(n){cur=n;im.src=n;return}if(!showUrl.alt&&window.XMM_ALT){showUrl.alt=1;clearTimeout(showUrl.t);toast("Trying a backup engine…");window.XMM_ALT(cur).then(d=>{if(d){finish(d)}else fail()});return}fail()};clearTimeout(showUrl.t);const guard=()=>{if(!im.hidden)return;const n=window.XMM_NEXT&&window.XMM_NEXT(cur);if(n){cur=n;im.src=n;showUrl.t=setTimeout(guard,35000)}else if(im.onerror)im.onerror()};showUrl.t=setTimeout(guard,35000);im.src=url}
async function run(p,label){if(busy)return;if(window.XMM_LIMIT){if(!XMM_LIMIT.ok()){toast("Cool down: wait "+Math.ceil(XMM_LIMIT.left()/1000)+"s before the next image.");return}XMM_LIMIT.stamp()}busy=true;$("#svGo").classList.add("busy");$("#svPop").hidden=true;$("#svBusy").hidden=true;lastP=p;lastL=label;
 
 const pe=window.XMM_EN?await window.XMM_EN(p):p;
 const[w,h]=RATIOS[ratio],full=pe+(STYLES[style]?", "+STYLES[style]:""),url=mk(full+"&",w,h,Math.floor(Math.random()*1e9)).replace("&?","?");
 const u=mk(full,w,h,Math.floor(Math.random()*1e9));
 const tok=run.tok=(run.tok||0)+1,L=label||p,v=$("#svView");hist.unshift({url:u,prompt:L});hist=hist.slice(0,12);
 v.hidden=false;$("#svImg").hidden=true;$("#svGd").style.aspectRatio=RATIOS[ratio].join("/");$("#svLoad").hidden=false;
 const d=await(window.XMM_RACE?window.XMM_RACE(full,w,h):null);if(tok!==run.tok)return;
 if(!d){hist.shift();$("#svView").hidden=true;$("#svLoad").hidden=true;busy=false;$("#svGo").classList.remove("busy");toast("Couldn't make that one. Try again."+((window.XMM_RACE_ERR||[]).length?" ("+XMM_RACE_ERR[XMM_RACE_ERR.length-1].slice(0,90)+")":""));return}
 if(d&&hist[0])hist[0].url=d;try{localStorage.setItem("xmm_imgs",JSON.stringify(hist))}catch{}
 if(tab==="mine")draw();showUrl(d,L,true)}
function go(){const t=$("#svPrompt"),p=t.value.trim();if(!p){t.focus();t.classList.add("shake");setTimeout(()=>t.classList.remove("shake"),400);return}run(p)}
$("#svRetry").onclick=()=>{$("#svBusy").hidden=true;busy=false;run(lastP,lastL)};$("#svGo").onclick=go;$("#svRe").onclick=()=>{busy=false;run(curP)};
$("#svPrompt").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();go()}});
/* + and style buttons removed from Imagine bar */
$("#svClose").onclick=()=>{run.tok=(run.tok||0)+1;busy=false;$("#svGo").classList.remove("busy");$("#svView").hidden=true;if(tab==="mine")draw()};
$("#svDl").onclick=async()=>{try{await window.XMM_SAVE(cur);toast("Saved")}catch{window.open(cur,"_blank")}};
function open(){/* Imagine removed — use chat: make image of … */try{if(window.toast)toast("Type make image of … in chat")}catch(e){}}
function close(){root.classList.remove("in");root.classList.add("out");document.body.classList.remove("in-studio");setTimeout(()=>{if(!root.classList.contains("in"))root.hidden=true},260);try{document.querySelector('meta[name=theme-color]').content="#04040a"}catch{}}
$("#svBack").onclick=close;
document.addEventListener("click",e=>{if(e.target.closest('[data-act="image"]')){e.preventDefault();e.stopPropagation();try{if(window.toast)toast("Type make image of … in chat")}catch(err){}}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!root.hidden){if(!$("#svView").hidden)$("#svClose").click();else close()}});
})();
(()=>{const nav=document.getElementById("chatNav");if(!nav)return;
const add=()=>{if(nav.querySelector('[data-act="image"]'))return;const b=document.createElement("button");b.className="nav-i accent";b.dataset.act="image";
b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-8 9"/></svg><span>Make image</span>';nav.appendChild(b)};
add();new MutationObserver(add).observe(nav,{childList:true});})();
