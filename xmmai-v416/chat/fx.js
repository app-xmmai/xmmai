/* v43: selection pill. Tap any button and a pill glides to it and rings it. */
(()=>{
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest('[data-act="openDrawer"],[data-act="toggleSide"],[data-act="closeDrawer"],#sendBtn');if(!b)return;
 const k=b.id==="sendBtn"?"slid-y":"slid";b.classList.remove(k);void b.offsetWidth;b.classList.add(k);setTimeout(()=>b.classList.remove(k),520)});
})();
