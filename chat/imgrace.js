/* XMM image engine.
   1) Your Cloudflare image Worker (FLUX.1-schnell, free daily allowance).
   2) If that fails or the daily allowance is used up -> Pollinations (free, no key). */
(()=>{
const load=(url,sig)=>new Promise((res,rej)=>{const i=new Image();let done=0;const end=f=>v=>{if(done)return;done=1;f(v)};
 i.onload=end(()=>i.naturalWidth>48?res(url):rej(new Error("bad image")));i.onerror=end(()=>rej(new Error("image load")));
 if(sig)sig.addEventListener("abort",end(()=>{i.src="";rej(new Error("abort"))}),{once:true});i.src=url});

/* FLUX on Cloudflare returns a square image. Crop it to the shape the user asked for. */
const fit=(src,W,H)=>new Promise(res=>{
 if(Math.abs(W-H)<2)return res(src);
 const i=new Image();i.onload=()=>{try{
  const iw=i.naturalWidth,ih=i.naturalHeight,r=W/H;let cw=iw,ch=Math.round(iw/r);if(ch>ih){ch=ih;cw=Math.round(ih*r)}
  const c=document.createElement("canvas");c.width=cw;c.height=ch;
  c.getContext("2d").drawImage(i,(iw-cw)/2,(ih-ch)/2,cw,ch,0,0,cw,ch);res(c.toDataURL("image/jpeg",.92))}catch{res(src)}};
 i.onerror=()=>res(src);i.src=src});

async function cloudflare(p,W,H,sig){
 const cfg=window.XMM_CONFIG||{};
 const base=String(cfg.IMAGE_PROXY||cfg.GROQ_PROXY||"").replace(/\/+$/,"");
 if(!base)throw new Error("IMAGE_PROXY not set in config.js");
 const r=await fetch(base+"/image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:p,width:W,height:H}),signal:sig});
 let j={};try{j=await r.json()}catch{}
 if(r.status===429&&/cool/i.test(j.error||""))throw Object.assign(new Error(j.error),{stop:1});
 if(r.ok&&j.image)return fit(j.image,W,H);
 throw new Error(j.error||("HTTP "+r.status))}

async function pollinations(p,W,H,sig){
 const engines=window.XMM_ENG||["flux"];
 for(const m of engines){
  if(sig&&sig.aborted)return null;
  const ac=new AbortController(),t=setTimeout(()=>ac.abort(),45000),on=()=>ac.abort();
  if(sig)sig.addEventListener("abort",on,{once:true});
  try{
   const u=`https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?model=${m}&width=${W}&height=${H}&seed=${Math.floor(Math.random()*1e9)}&nologo=true`;
   return await load(u,ac.signal)}
  catch(e){XMM_RACE_ERR.push("Pollinations "+m+": "+String(e&&e.message||e))}
  finally{clearTimeout(t);if(sig)sig.removeEventListener("abort",on)}}
 return null}

window.XMM_RACE_ERR=[];
window.XMM_RACE=async(prompt,W,H,sig)=>{
 window.XMM_RACE_ERR=[];let p=String(prompt).slice(0,900);
 try{if(window.XMM_SAFE){p=await window.XMM_SAFE(p,sig)||p;window.XMM_LAST_PROMPT=p}}catch(e){if(e&&e.name==="AbortError")return null}
 try{return await cloudflare(p,W,H,sig)}
 catch(e){
  if(e&&e.name==="AbortError")return null;
  XMM_RACE_ERR.push("Cloudflare: "+String(e&&e.message||e));
  if(e&&e.stop)return null}            /* user cooldown: do not fall back */
 try{return await pollinations(p,W,H,sig)}catch(e){return null}};
})();
