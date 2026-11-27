(function(){
var $=function(s,r){return (r||document).querySelector(s)};
var KEY="xmm_steps",store={};try{store=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}}
var pending=[];
function norm(t){return t.replace(/\s+/g," ").replace(/…|\.\.\.$/,"").trim()}
function keyFor(bot){
 var i=bot.dataset.i,prev=bot.previousElementSibling,u="";
 while(prev){var m=prev.querySelector&&prev.querySelector(".m-user");if(m){u=m.textContent;break}prev=prev.previousElementSibling}
 return u.slice(0,60)+"|"+i}
function defaults(bot){
 var s=["Reading your message"];
 var t=$(".body",bot);var txt=t?t.textContent:"";
 if(/https?:\/\//.test(txt)===false&&$("pre",bot))s.push("Writing code");
 s.push("Writing the answer");
 var sm=$(".m-acts small",bot);if(sm)s.push("Done · "+sm.textContent.trim());
 return s}
function steps(bot){
 var k=keyFor(bot),log=store[k]||[];
 var out=["Reading your message"];
 log.forEach(function(x){if(out.indexOf(x)<0)out.push(x)});
 var d=defaults(bot);d.slice(1).forEach(function(x){out.push(x)});
 return out}
// ---- panel
var wrap=document.createElement("div");wrap.className="xsum";
wrap.innerHTML='<div class="xsum-s"><div class="grab"></div><div class="h"><button data-c aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>Summary</div><div class="xsum-l"></div></div>';
document.body.appendChild(wrap);
function open(list){
 var l=$(".xsum-l",wrap);
 l.innerHTML=list.map(function(t,i){return '<div class="st" style="animation-delay:'+(i*45)+'ms"><span class="dt"></span><span class="tx"></span></div>'}).join("");
 var tx=l.querySelectorAll(".tx");list.forEach(function(t,i){tx[i].textContent=t});
 wrap.classList.add("on")}
function close(){wrap.classList.remove("on")}
wrap.onclick=function(e){if(e.target===wrap||e.target.closest("[data-c]"))close()};
addEventListener("keydown",function(e){if(e.key==="Escape")close()});
document.addEventListener("click",function(e){
 var b=e.target.closest&&e.target.closest(".xsum-btn");if(!b)return;
 e.stopPropagation();var bot=b.closest(".m-bot");if(bot)open(steps(bot))},true);
// ---- collect live statuses + inject buttons
var msgs=document.getElementById("msgs");
function scan(){
 if(!msgs)return;
 var th=msgs.querySelector(".think");
 if(th){var t=norm(th.textContent);if(t&&t!=="Thinking"&&pending.indexOf(t)<0)pending.push(t)}
 msgs.querySelectorAll(".m-bot").forEach(function(bot){
  var body=$(".body",bot);if(!body||$(".think",bot))return;
  if(pending.length){store[keyFor(bot)]=pending.slice();pending=[];save()}
  if($(".xsum-btn",bot))return;
  var b=document.createElement("button");b.type="button";b.className="xsum-btn";
  b.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg><span>Show steps</span><svg class="c" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
  bot.insertBefore(b,body)})}
if(msgs){new MutationObserver(function(){scan()}).observe(msgs,{childList:true,subtree:true,characterData:true});scan()}
})();
