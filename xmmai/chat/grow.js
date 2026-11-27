/* grow.js: things come OUT of the button you tapped, fill the screen and snap into place (fast, ~450ms). */
(()=>{
"use strict";
/* Reduce Motion on the phone no longer hides these (it made the animation look broken). Set localStorage xmm.calm=1 to turn them off. */
const reduce=()=>true; /* animations off: taps respond instantly */
let last=null;
/* durations in milliseconds: change these to tune the speed (10 is under one screen frame, so it looks instant) */
const T={chat:1000,code:520,preview:1000};
const DY=26; /* how far the button drops */
const EASE="cubic-bezier(.32,.72,0,1)";
/* like the iPad video: the tapped icon lifts and grows, then settles back into its place */
function bounce(btn,dur){if(!btn||!btn.animate||reduce())return;
  btn.animate([
    {transform:"translateY(0) scale(1)",opacity:1},
    {offset:.35,transform:"translateY(-6px) scale(1.5)",opacity:1},
    {offset:.65,transform:"translateY(-3px) scale(1.2)",opacity:.35},
    {offset:.88,transform:"translateY(1px) scale(.97)",opacity:1},
    {transform:"translateY(0) scale(1)",opacity:1}
  ],{duration:dur,easing:EASE})}
/* preview: small slide in, button nudges down and snaps back */
function slide(el,btn){if(!el||!el.animate||reduce())return;
  el.animate([{opacity:0,transform:"translateY(16px)"},{offset:.7,opacity:1,transform:"translateY(-2px)"},{opacity:1,transform:"translateY(0)"}],{duration:T.preview,easing:EASE});
  if(btn&&btn.animate)btn.animate([{transform:"translateY(0)"},{offset:.4,transform:"translateY(8px) scale(.92)"},{offset:.8,transform:"translateY(-1px)"},{transform:"translateY(0)"}],{duration:T.preview,easing:EASE})}
/* iOS app launch: the whole page starts tiny AT the icon (rounded like an icon), then zooms up to full size and snaps in */
function geo(el,r){const to=el.getBoundingClientRect();if(to.width<4||to.height<4||!r)return null;
  const s=Math.max(r.width/to.width,r.height/to.height);
  return{s,dx:(r.left+r.width/2)-(to.left+to.width/2),dy:(r.top+r.height/2)-(to.top+to.height/2),rad:Math.round(14/s)}}
function grow(el,from,o){o=o||{};if(!el||!el.animate||reduce())return;const g=geo(el,from);if(!g)return;
  document.body.classList.add("fx-run");
  const a=el.animate([
    {transform:"translate("+g.dx+"px,"+g.dy+"px) scale("+g.s+")",opacity:0,clipPath:"inset(0 round "+g.rad+"px)"},
    {offset:.22,opacity:1},
    {offset:.78,transform:"translate(0,0) scale(1.012)",clipPath:"inset(0 round 12px)"},
    {transform:"none",opacity:1,clipPath:"inset(0 round 0px)"}
  ],{duration:o.dur||T.chat,easing:EASE});const end=()=>document.body.classList.remove("fx-run");a.onfinish=end;a.oncancel=end;return a}
/* the reverse: the page shrinks back into the icon */
function shrink(el,to,o){o=o||{};if(!el||!el.animate||reduce())return null;const g=geo(el,to);if(!g)return null;
  return el.animate([
    {transform:"none",opacity:1,clipPath:"inset(0 round 0px)"},
    {offset:.7,opacity:1},
    {transform:"translate("+g.dx+"px,"+g.dy+"px) scale("+g.s+")",opacity:0,clipPath:"inset(0 round "+g.rad+"px)"}
  ],{duration:o.dur||T.chat,easing:"cubic-bezier(.5,0,.2,1)",fill:"forwards"})}
/* remember which button was tapped last */
document.addEventListener("click",e=>{const x=e.target.closest&&e.target.closest('[data-act="newchat"],[data-k="newchat"],#tbCode,[data-act="opencode"]');
  if(!x)return;last={r:x.getBoundingClientRect(),t:Date.now()};
  if(x.matches('[data-act="newchat"],[data-k="newchat"]')){const from=last.r;bounce(x,T.chat);
    setTimeout(()=>{const v=document.getElementById("viewChat");if(v&&!v.hidden)grow(v,from,{dur:T.chat})},0)}
  else if(x.matches('#tbCode,[data-act="opencode"]'))bounce(x,T.code);
},true);
function origin(){if(last&&Date.now()-last.t<1500)return last.r;const c=document.getElementById("tbCode");if(c){const r=c.getBoundingClientRect();if(r.width)return r}
  return new DOMRect(innerWidth-60,40,44,44)}
window.XMM_FX={grow,shrink,origin,slide,bounce,T};
})();
