/* XMM AI — start screen ("Create anything you can imagine") + no intro animation */
(function(){
 try{var c=document.getElementById("cine");if(c)c.remove()}catch(e){}
 var host=document.getElementById("mainChat")||document.body;
 if(!host||document.getElementById("zhero"))return;
 function fill(t){var m=document.getElementById("msg");if(!m)return;m.focus();m.value=t;m.dispatchEvent(new Event("input",{bubbles:true}));try{m.setSelectionRange(t.length,t.length)}catch(e){}}
 function click(s){var e=document.querySelector(s);if(e)e.click()}
 var B="#2f7bff",L="#34343c",M="#4a4a54";
 var CARDS=[
  ["Write",function(){fill("Write a short, friendly email to my landlord asking them to fix the heating")},
   '<svg viewBox="0 0 120 80"><rect x="30" y="10" width="60" height="64" rx="7" fill="#232329"/><rect x="40" y="22" width="40" height="4" rx="2" fill="'+M+'"/><rect x="40" y="32" width="32" height="4" rx="2" fill="'+L+'"/><rect x="40" y="42" width="40" height="4" rx="2" fill="'+L+'"/><path d="M62 62l18-18 5 5-18 18-7 2z" fill="'+B+'"/></svg>'],
  ["Analyze",function(){click("#attBtn")},
   '<svg viewBox="0 0 120 80"><rect x="20" y="14" width="80" height="52" rx="8" fill="#232329"/><path d="M28 56l16-16 12 10 18-24 18 14" fill="none" stroke="'+B+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="44" cy="40" r="3" fill="#fff"/><circle cx="74" cy="26" r="3" fill="#fff"/></svg>'],
  ["Image",function(){fill("Make image of a red sports car at sunset, cinematic")},
   '<svg viewBox="0 0 120 80"><defs><linearGradient id="zs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f7bff"/><stop offset="1" stop-color="#8f4bff"/></linearGradient></defs><rect x="20" y="12" width="80" height="56" rx="8" fill="url(#zs)"/><circle cx="82" cy="30" r="8" fill="#ffd27a"/><path d="M20 68l26-26 18 18 12-10 24 18z" fill="#14141a"/></svg>'],
  ["Code",function(){click("#sideCode")},
   '<svg viewBox="0 0 120 80"><rect x="16" y="12" width="88" height="56" rx="8" fill="#101014"/><circle cx="26" cy="22" r="2.5" fill="#ff5f57"/><circle cx="34" cy="22" r="2.5" fill="#febc2e"/><circle cx="42" cy="22" r="2.5" fill="#28c840"/><rect x="26" y="34" width="22" height="4" rx="2" fill="'+B+'"/><rect x="52" y="34" width="30" height="4" rx="2" fill="'+L+'"/><rect x="34" y="44" width="36" height="4" rx="2" fill="#8f7bff"/><rect x="26" y="54" width="26" height="4" rx="2" fill="'+L+'"/></svg>'],
  ["Translate",function(){fill("Translate to Spanish: Where is the train station?")},
   '<svg viewBox="0 0 120 80"><rect x="18" y="14" width="48" height="34" rx="10" fill="#232329"/><text x="42" y="37" text-anchor="middle" font-family="Georgia,serif" font-size="20" fill="#fff">Aa</text><rect x="54" y="34" width="48" height="34" rx="10" fill="'+B+'"/><text x="78" y="58" text-anchor="middle" font-family="sans-serif" font-size="19" fill="#fff">文</text></svg>'],
  ["Plan",function(){fill("Plan a 3-day trip to Rome with a simple daily schedule")},
   '<svg viewBox="0 0 120 80"><rect x="24" y="12" width="72" height="58" rx="8" fill="#232329"/><rect x="24" y="12" width="72" height="14" rx="8" fill="'+B+'"/><g fill="'+L+'"><rect x="32" y="34" width="10" height="8" rx="2"/><rect x="48" y="34" width="10" height="8" rx="2"/><rect x="64" y="34" width="10" height="8" rx="2"/><rect x="80" y="34" width="10" height="8" rx="2"/><rect x="32" y="48" width="10" height="8" rx="2"/><rect x="48" y="48" width="10" height="8" rx="2" fill="#fff"/><rect x="64" y="48" width="10" height="8" rx="2"/></g></svg>']
 ];
 var z=document.createElement("div");z.id="zhero";
 var h='<div class="zin"><div class="zh"><h1><span class="gm-hi"><img src="icon.svg" width="36" height="36" alt=""><b id="gmName">Hi</b></span><span class="gm-q">Where should we start?</span></h1></div><div class="zg">';
 CARDS.forEach(function(c,i){h+='<button type="button" class="zc" aria-label="'+c[0]+'" title="'+c[0]+'" data-i="'+i+'"><div class="zi">'+c[2]+'</div><span>'+c[0]+'</span></button>'});
 z.innerHTML=h+'</div></div>';
 z.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".zc");if(b)CARDS[+b.dataset.i][1]()});
 host.appendChild(z);
})();

/* sidebar toggle on PC (mobile keeps the push drawer) */
(function(){try{if(localStorage.getItem("xmm.sb"))document.body.classList.add("cl-sbhide")}catch(_){}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#clMenu");if(!b||innerWidth<900)return;e.stopImmediatePropagation();e.preventDefault();var on=document.body.classList.toggle("cl-sbhide");try{localStorage.setItem("xmm.sb",on?"1":"")}catch(_){}},true)})();
