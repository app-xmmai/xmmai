(function(){"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
var I={up:'<path d="M12 16V5M7.5 9.5L12 5l4.5 4.5M5 19h14"/>',fo:'<path d="M3.5 7A1.5 1.5 0 015 5.5h4l2 2.2h8A1.5 1.5 0 0120.5 9v8.5A1.5 1.5 0 0119 19H5a1.5 1.5 0 01-1.5-1.5z"/>',sk:'<path d="M4 6v12M9 6v12M14 6v12M19 7l-3 11"/>',pl:'<path d="M12 5v14M5 12h14"/>',fi:'<path d="M14 3.5H8A2.5 2.5 0 005.5 6v12A2.5 2.5 0 008 20.5h8a2.5 2.5 0 002.5-2.5V8z"/><path d="M14 3.5V8h4.5"/>',pe:'<path d="M4 20l4-1 11-11-3-3L5 16z"/>',gl:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',co:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>'};
function sv(p){return'<svg viewBox="0 0 24 24">'+p+'</svg>'}
function toast(t){var A=window.XMM_API;if(A&&A.toast)A.toast(t)}
function click(s){var e=$(s);if(e)e.click()}
/* ---- + menu (desktop and mobile) ---- */
var M=document.createElement("div");M.id="xplus";M.hidden=true;
M.innerHTML='<button data-a="up">'+sv(I.up)+'Upload a file</button><hr><button data-a="skill">'+sv(I.sk)+'Skills</button><button data-a="conn">'+sv(I.pl)+'Add connector</button><button data-a="files">'+sv(I.fi)+'Files</button>';
document.body.appendChild(M);
function open(b){var r=b.getBoundingClientRect();M.hidden=false;var h=M.offsetHeight,top=r.top-h-8;if(top<8)top=r.bottom+8;M.style.top=top+"px";M.style.left=Math.max(8,Math.min(r.left,innerWidth-M.offsetWidth-8))+"px"}
M.onclick=function(e){var b=e.target.closest("button");if(!b)return;M.hidden=true;var a=b.dataset.a;
 if(a==="up")click("#file");else if(a==="files")click('.sidenav2 [data-k="notebooks"]');else toast("Coming soon")};
var PL='#attBtn,.composer .vplus,.composer [aria-label="Attach"],.composer [aria-label="Add"]';
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(PL);
 if(b){e.stopImmediatePropagation();e.preventDefault();if(M.hidden)open(b);else M.hidden=true;return}
 if(!M.hidden&&!e.target.closest("#xplus"))M.hidden=true},true);
/* ---- desktop suggestions ---- */
function sug(){var c=$(".composer");if(!c||$(".xsug"))return;var d=document.createElement("div");d.className="xsug";
 [["pe","Write or edit","Help me write or edit: "],["gl","Search the web","Search the web for "],["co","Make a website","Make a website for "]].forEach(function(x){var b=document.createElement("button");b.type="button";b.innerHTML=sv(I[x[0]])+x[1];b.onclick=function(){var t=$("#msg");if(t){t.value=x[2];t.focus();t.dispatchEvent(new Event("input",{bubbles:true}))}};d.appendChild(b)});
 c.parentNode.insertBefore(d,c.nextSibling)}
sug();setTimeout(sug,500);
/* ---- greeting + placeholder ---- */
function g(){try{var n=String(JSON.parse(localStorage.getItem("xmm.name")||'""')||"").trim(),e=$(".greeting");if(e){var x=document.getElementById("xg");if(!x){x=document.createElement("span");x.id="xg";e.appendChild(x)}x.textContent="What\u2019s on the agenda today?"}var t=$("#msg");if(t&&innerWidth>820)t.placeholder="Ask, imagine, build anything\u2026"}catch(z){}}
g();setTimeout(g,300);setTimeout(g,1200);addEventListener("load",g);
/* ---- smarter image prompt: AI works out what the user means, then writes the finished prompt ---- */
var old=window.XMM_EN;
function note(t){var l=document.getElementById("svLoad");if(!l)return;var n=l.querySelector(".xnote");if(!n){n=document.createElement("div");n.className="xnote";l.appendChild(n)}n.textContent=t}
window.XMM_EN=async function(p){var base=p;try{if(old)base=await old(p)}catch(e){}note("");
 try{var A=window.XMM_API;if(!A||!A.groq)return base;
  var r=await A.groq([{role:"system",content:'You turn a rough image idea into a finished prompt for an image model. First work out what the user really means (subject, setting, mood, style, lighting, composition). Reply ONLY with JSON: {"meaning":"one short sentence, in the user\'s language, saying what you understood","prompt":"the finished English image prompt, 40-80 words, vivid and concrete"}'},{role:"user",content:base}],{max_tokens:300});
  var t=typeof r==="string"?r:(r&&(r.text||r.content||(r.choices&&r.choices[0]&&r.choices[0].message&&r.choices[0].message.content)))||"";
  var m=t.match(/\{[\s\S]*\}/),j=m&&JSON.parse(m[0]);if(j&&j.prompt){note(j.meaning||"");return j.prompt}}catch(e){}
 return base};

/* ---- sidebar rebuilt to match the reference ---- */
var S2={panel:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M9.5 4.5v15"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/>',img:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5"/>',lib:'<path d="M5 5v14M9 5v14M13 5v14M18 6l-3 13"/>',code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><path d="M16.7 13.5v6.5M13.5 16.7H20"/>',bot:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10.5" r="1"/>',priv:'<circle cx="12" cy="12" r="8.5" stroke-dasharray="3 3"/>',pn:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M14.5 4.5v15"/>'};
function E(t,c,h){var e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function side(){var s=$("#sideChat"),list=$("#chatList");if(!s||!list||s._x)return;s._x=1;
 var cd=function(){var sc=$("#scrim");if(s.classList.contains("open")&&sc)sc.click()};
 var row=function(ic,t,f,cl){var b=E("button","xs-r "+(cl||""),(ic?sv(ic):"")+"<span>"+t+"</span>");b.type="button";b.onclick=function(){f();cd()};return b};
 var top=E("div","xs-top");var b1=E("button","xs-i",sv(S2.panel));b1.type="button";b1.onclick=function(){if(innerWidth>820)click('.topbar [data-act="toggleSide"]');else cd()};
 var b2=E("button","xs-i",sv(S2.search));b2.type="button";b2.onclick=function(){s.classList.toggle("xs-s");var i=$("#sideSearch");if(s.classList.contains("xs-s")&&i)i.focus()};top.appendChild(b1);top.appendChild(b2);
 var nw=E("button","xs-new",'<i>+</i><span>New chat</span>');nw.type="button";nw.onclick=function(){click('.sbar [data-act="newchat"]');cd()};
 var L=function(t){return E("div","xs-lab",t)};
 var els=[top,nw,row(S2.lib,"Library",function(){click('.sidenav2 [data-k="notebooks"]')}),row(S2.code,"Code",function(){click("#sideCode")}),
  L("XMM Bot"),row(I.pl,"Create a bot",function(){toast("Coming soon")}),L("Chats")];
 els.forEach(function(e){s.insertBefore(e,list)});
 list.classList.add("xs-less");var mo=E("button","xs-more","Show more");mo.type="button";mo.onclick=function(){var on=list.classList.toggle("xs-less");mo.textContent=on?"Show more":"Show less"};s.insertBefore(mo,list.nextSibling);
 var u=$(".user",s);if(u){var g=E("button","xs-gear",sv(S2.grid));g.type="button";g.setAttribute("aria-label","Settings");g.onclick=function(e){e.stopPropagation();click('.sbar [data-act="settings"]');cd()};u.appendChild(g)}}
function tb(){var t=$(".topbar"),p=$("#tbPreview");if(!t||!p||t._x)return;t._x=1;
 var a=E("button","xt",sv(S2.bot)+"XMM Bot"),b=E("button","xt",sv(S2.priv)+"Private");a.type=b.type="button";a.onclick=b.onclick=function(){toast("Coming soon")};
 t.insertBefore(a,p);t.insertBefore(b,p);p.innerHTML=sv(S2.pn)}
side();tb();setTimeout(function(){side();tb()},500);
/* ---- send button = voice mode when empty, arrow when you type ---- */
function upd(){var b=$("#sendBtn"),m=$("#msg");if(!b||!m)return;var has=m.value.trim()||document.querySelector("#atts>*"),busy=b.classList.contains("is-busy");b.classList.toggle("xvoice",!has&&!busy)}
setInterval(upd,250);document.addEventListener("input",upd,true);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#sendBtn");if(!b||!b.classList.contains("xvoice"))return;
 e.stopImmediatePropagation();e.preventDefault();var v=document.getElementById("speakBtn");if(!v){v=E("button");v.id="speakBtn";v.hidden=true;document.body.appendChild(v)}v.click()},true);
})();
