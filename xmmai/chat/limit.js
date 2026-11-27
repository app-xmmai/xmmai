/* Per-user image cooldown: 1 image per 20 seconds, remembered in this browser. */
(()=>{
const GAP=20000,KEY="xmm_img_last";
const last=()=>{try{return +localStorage.getItem(KEY)||0}catch{return window.__xl||0}};
const left=()=>Math.max(0,GAP-(Date.now()-last()));
const s=document.createElement("style");
s.textContent=".xbusy{display:flex;align-items:center;justify-content:center;text-align:center;color:#e8e8ee}.xbusy[hidden]{display:none}.xbusy>div{display:flex;flex-direction:column;align-items:center;gap:6px;padding:16px}.xbusy b{font-size:16px;color:#fff}.xbusy span{font-size:14px;opacity:.75}#svBusy{position:absolute;inset:0}.xretry{margin-top:10px;border:0;border-radius:12px;padding:10px 20px;font-size:14px;font-weight:600;background:#fff;color:#000;cursor:pointer}";
document.head.appendChild(s);
window.XMM_LIMIT={ok:()=>left()===0,left,GAP,stamp(){try{localStorage.setItem(KEY,String(Date.now()))}catch{window.__xl=Date.now()}}};
})();
