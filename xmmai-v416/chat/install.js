/* Install page for app.xmm-ai.com/?install=1 — full-screen instructions. Never shown inside the desktop app or an installed app.
   Phones: add-to-home-screen steps. Computers: PWA install steps (no native files). Unsupported: iOS 14 and lower, Android 4.5 and lower. */
(function(){
"use strict";
var AUTH=/(^|\.)xmm-ai\.com$/.test(location.hostname)?"https://auth.xmm-ai.com/":"/login/";
function named(){try{return String(JSON.parse(localStorage.getItem("xmm.name")||'""')||"").trim()!==""}catch(e){return false}}
var deferred=null;
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e});
function detect(){
  var ua=navigator.userAgent||"",r={os:"other",ver:0,ok:true,name:"your device"},m;
  var ios=/iphone|ipad|ipod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  if(ios){r.os="ios";r.name=/ipad/i.test(ua)||navigator.platform==="MacIntel"?"iPad":"iPhone";
    m=/OS (\d+)[_.](\d+)/.exec(ua);r.ver=m?parseFloat(m[1]+"."+m[2]):0;
    if(!m){m=/Version\/(\d+)\.(\d+)/.exec(ua);r.ver=m?parseFloat(m[1]+"."+m[2]):99}
    r.ok=r.ver>=15}
  else if(/android/i.test(ua)){r.os="android";r.name="Android phone";
    m=/Android\s+(\d+)(?:\.(\d+))?/i.exec(ua);r.ver=m?parseFloat(m[1]+"."+(m[2]||0)):99;r.ok=r.ver>4.5}
  else if(/windows/i.test(ua))r.os="win";
  else if(/mac/i.test(ua))r.os="mac";
  else if(/linux|x11|cros/i.test(ua))r.os="linux";
  return r}
function page(){
  try{var u=new URL(location.href);if(u.searchParams.get("install")!=="1")return;
    u.searchParams.delete("install");history.replaceState(null,"",u.pathname+(u.search||"")+u.hash)}catch(e){return}
  if(window.xmmDesktop||/XMMAI-Desktop/.test(navigator.userAgent||""))return;
  if(navigator.standalone||matchMedia("(display-mode: standalone)").matches)return;
  var D=detect();
  var steps=D.os==="ios"?[["Open this page in <b>Safari</b>.","On iPhone and iPad, only Safari can add apps to the Home Screen."],["Tap the <b>Share</b> button.","The square with an arrow pointing up, at the bottom of the screen (top right on iPad)."],["Choose <b>Add to Home Screen</b>.","Scroll down in the share sheet if you don\u2019t see it."],["Tap <b>Add</b>.","XMM-AI now opens full screen from your Home Screen."]]
   :D.os==="android"?[["Open this page in <b>Chrome</b>.","Other browsers may call the same option something different."],["Tap the <b>menu</b> button.","The three dots at the top right."],["Tap <b>Install app</b> or <b>Add to Home screen</b>.","Confirm when Chrome asks."],["Open <b>XMM-AI</b> from your app list.","It now runs full screen, like any other app."]]:null;
  var st=document.createElement("style");
  st.textContent='#xi{position:fixed;inset:0;z-index:99999;overflow:auto;-webkit-overflow-scrolling:touch;background:#0b0b0e;color:#f4f4f6;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;animation:xiF .3s ease both}'+
  '#xi .w{max-width:520px;margin:0 auto;padding:calc(20px + env(safe-area-inset-top,0px)) 16px calc(28px + env(safe-area-inset-bottom,0px));min-height:100%;box-sizing:border-box;display:flex;flex-direction:column}'+
  '#xi .top{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}#xi .top img{width:32px;height:32px;border-radius:8px;background:#000}'+
  '#xi .x{border:0;background:rgba(255,255,255,.1);color:#f4f4f6;font:600 14px -apple-system,system-ui,sans-serif;padding:8px 14px;border-radius:999px;cursor:pointer}'+
  '#xi h1{margin:0 0 8px;font-size:clamp(24px,6vw,30px);line-height:1.15;letter-spacing:-.02em;font-weight:700}#xi .lead{margin:0 0 22px;color:#a2a2ab;font-size:15px}'+
  '#xi ol{list-style:none;margin:0 0 22px;padding:0;counter-reset:s}#xi li{counter-increment:s;position:relative;padding:14px 0 14px 42px;border-top:1px solid rgba(255,255,255,.1)}#xi li:last-child{border-bottom:1px solid rgba(255,255,255,.1)}'+
  '#xi li:before{content:counter(s);position:absolute;left:0;top:14px;width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(255,255,255,.35);display:grid;place-items:center;font-size:13px;font-weight:600;color:#d8d8de}'+
  '#xi li b{font-weight:600;font-size:15px}#xi li p{margin:3px 0 0;color:#a2a2ab;font-size:13.5px}'+
  '#xi .btn{display:block;width:100%;box-sizing:border-box;border:0;border-radius:12px;padding:14px 16px;margin-bottom:10px;text-align:center;text-decoration:none;font:600 15px -apple-system,system-ui,sans-serif;background:#f4f4f6;color:#0b0b0e;cursor:pointer}'+
  '#xi .btn.s{background:rgba(255,255,255,.1);color:#f4f4f6}#xi .btn small{display:block;font-weight:400;font-size:12px;opacity:.65;margin-top:2px}'+
  '#xi .sp{flex:1}#xi .foot{margin-top:14px;color:#6f6f78;font-size:12.5px;text-align:center}'+
  '@media(max-width:380px){#xi .w{padding-left:12px;padding-right:12px}#xi h1{font-size:22px}#xi li{padding-left:38px}}'+
  '@keyframes xiF{from{opacity:0}to{opacity:1}}';
  document.head.appendChild(st);
  var d=document.createElement("div");d.id="xi";
  var top='<div class="top"><img src="/chat/icon.svg" alt=""><button class="x" type="button">Skip</button></div>',body="";
  if(!D.ok){
    var need=D.os==="ios"?"iOS 15 or later":"Android 5.0 or later";
    body='<h1>This device is too old</h1><p class="lead">XMM-AI needs <b>'+need+'</b> to be installed. Your '+D.name+' runs '+(D.os==="ios"?"iOS ":"Android ")+D.ver+'.</p><button class="btn s web" type="button">Skip Install & Continue in Browser</button>'}
  else if(steps){
    body='<h1>Add XMM-AI to your '+(D.os==="ios"?"Home Screen":"phone")+'</h1><p class="lead">It takes about 20 seconds and needs no store.</p><ol>'+steps.map(function(s){return'<li><b>'+s[0]+'</b><p>'+s[1]+'</p></li>'}).join("")+'</ol>'+
      (deferred?'<button class="btn get" type="button">Install now</button>':"")+'<button class="btn s web" type="button">Skip Install & Continue in Browser</button><div class="sp"></div><div class="foot">Free \u00b7 No ads \u00b7 Under 2 MB</div>'}
  else{
    body='<h1>Install XMM-AI on your computer</h1><p class="lead">XMM-AI is a web app (PWA). Install it from your browser in a few seconds.</p><ol><li><b>Open this page in Chrome, Edge or Brave.</b><p>Works on Windows, macOS and Linux.</p></li><li><b>Click the install icon in the address bar.</b><p>Or open the browser menu and choose <b>Install XMM-AI</b>.</p></li></ol>'+
      (deferred?'<button class="btn get" type="button">Install now</button>':"")+
      '<button class="btn s web" type="button">Skip Install & Continue in Browser</button><div class="sp"></div><div class="foot">Free \u00b7 No ads</div>'}
  d.innerHTML='<div class="w">'+top+body+'</div>';
  document.body.appendChild(d);
  function close(){d.style.transition="opacity .25s";d.style.opacity="0";setTimeout(function(){d.remove();if(!named())location.href=AUTH},230)}
  [].forEach.call(d.querySelectorAll(".x,.web"),function(b){b.onclick=close});
  var get=d.querySelector(".get");
  if(get)get.onclick=function(){if(deferred){try{deferred.prompt();deferred.userChoice.then(function(){d.remove()})}catch(e){}}};
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",page);else page();
})();
