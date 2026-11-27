/* XMM voice mode: full-screen live space, pill splits into orb + words pill + end button */
(function(){
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
var $=function(s,r){return(r||document).querySelector(s)};
var API=function(){return window.XMM_API||{}};
var denied=0,el,on=false,tok=0,rec=null,last=0,heard="",busyIv=0,tick=0,raf=0,ac=null,an=null,stream=null,fdata,bars=[],pulse=0,cur=0,speaking=false,sent=false;
var X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function lang(){var l=(document.documentElement.lang||"en").slice(0,2);return{de:"de-DE",en:"en-US",fa:"fa-IR",ar:"ar-SA",es:"es-ES"}[l]||"en-US"}
function build(){
 if(el)return;el=document.createElement("div");el.id="vo";
 
 el.innerHTML='<div class="bg"><i></i><i></i><i></i></div><button class="x" aria-label="Close">'+X+'</button><div class="log"></div><div class="face"><i class="fb"><b class="e l"><u></u></b><b class="e r"><u></u></b></i></div><div class="hint">Listening…</div>'+
 '<div class="bar">'+
 '<div class="pill"><div class="glow"><i class="g1"></i><i class="g2"></i><i class="g3"></i></div><div class="fill"></div><div class="txt"><span></span></div><div class="tm"></div></div>'+
 '</div>';
 document.body.appendChild(el);
 $(".x",el).onclick=close;
}
function cls(c,v){el.classList.toggle(c,!!v)}
function addMsg(t,k){var d=document.createElement("div");d.className="m "+k;d.textContent=t;var l=$(".log",el);l.appendChild(d);l.scrollTop=l.scrollHeight;return d}
function frame(){
 if(!on)return;var now=Date.now();
 if(pulse>0)pulse*=.94;
 var lv=.16+.08*Math.sin(now/600);
 if(speaking)lv=.45+.3*Math.sin(now/140)*Math.sin(now/370)+.15*Math.sin(now/57);
 else if(heard)lv=Math.max(lv,pulse);
 lv=Math.max(0,Math.min(1,lv));cur+=(lv-cur)*.2;
 el.style.setProperty("--lv",cur.toFixed(3));
 if(now>(window._eyeT||0)){window._eyeT=now+(speaking||heard?2400:900+Math.random()*1600);var d=(speaking||heard||el.classList.contains("think"))?[[0,1],[-.7,1],[.7,1],[0,.8]]:[[0,0],[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];var q=d[Math.floor(Math.random()*d.length)];el.style.setProperty("--ex",q[0]);el.style.setProperty("--ey",q[1])}
 raf=requestAnimationFrame(frame)}
function ensureMic(cb){
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){cb(true);return}
 navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(function(stream){
  try{stream.getTracks().forEach(function(tr){tr.stop()})}catch(e){}
  cb(true)
 }).catch(function(err){
  var n=err&&(err.name||err.message)||"";
  if(/NotAllowed|Permission|denied/i.test(n))$(".hint",el).textContent="Mic blocked — enable in Settings";
  else if(/NotFound|DevicesNotFound/i.test(n))$(".hint",el).textContent="No microphone found";
  else $(".hint",el).textContent="Mic unavailable";
  cb(false)
 })
}
function listen(){
 if(!on)return;var my=tok;
 if(!SR){close();return}
 stopRec();var r=new SR();rec=r;r.lang=lang();r.interimResults=true;r.continuous=true;heard="";
 r.onresult=function(e){var t="";for(var i=0;i<e.results.length;i++)t+=e.results[i][0].transcript;t=t.trim();if(!t||my!==tok)return;
  heard=t;last=Date.now();pulse=1;$(".txt span",el).textContent=t;cls("split",1);cls("talk",1);cls("count",0)};
 r.onerror=function(e){if(e.error==="not-allowed"||e.error==="service-not-allowed"){if(++denied>2)$(".hint",el).textContent="Mic error: "+e.error+" (use Chrome/Safari, https)"}else if(e.error==="audio-capture"){$(".hint",el).textContent="No microphone found"}};
 r.onsoundstart=r.onspeechstart=function(){pulse=Math.max(pulse,.7)};
 r.onstart=function(){denied=0};
 r.onend=function(){if(rec===r&&on&&my===tok&&heard!==null)setTimeout(function(){if(on&&my===tok)listen()},120)};
 try{r.start()}catch(e){}
 clearInterval(tick);tick=setInterval(function(){
  if(!on||my!==tok||!heard)return;var d=Date.now()-last;
  if(d>250&&!el.classList.contains("count")){void el.offsetWidth;cls("count",1);$(".fill",el).style.animationDuration=".75s"}
  if(el.classList.contains("count")){$(".tm",el).textContent=(Math.max(0,1000-d)/1000).toFixed(1)}
  if(d>=1000)submit()},60)}
function stopRec(){if(rec){var r=rec;rec=null;r.onend=r.onerror=r.onresult=null;try{r.abort()}catch(e){}}}
function submit(){
 var text=heard.trim();clearInterval(tick);if(!text)return;heard="";
 cls("count",0);cls("split",0);cls("talk",0);
 setTimeout(function(){if(!heard)$(".txt span",el).textContent=""},450);
 addMsg(text,"u");$(".hint",el).textContent="";
 var c0=API().cur&&API().cur(),n=c0?c0.msgs.length:0;
 var my=tok,box=null,got="",calm=0,t0=Date.now();
 cls("think",1);speaking=false;
 clearInterval(busyIv);
 /* keep the mic open: you can talk again right away */
 listen();
 try{API().send(text)}catch(e){}
 setTimeout(function(){busyIv=setInterval(function(){
  if(!on||my!==tok){clearInterval(busyIv);return}
  var c=API().cur&&API().cur(),m=c&&c.msgs[n+1],t=m&&m.text?m.text:"";
  if(t&&t!==got){got=t;speaking=true;if(!box)box=addMsg("","a");box.textContent=t;var l=$(".log",el);l.scrollTop=l.scrollHeight}
  var busy=API().S&&API().S.busy;
  if(!busy){if(++calm>3){clearInterval(busyIv);cls("think",0);speaking=false;if(got)sayIt(got,my)}}else calm=0},100)},300)}

function clean(t){return String(t||"").replace(/```[\s\S]*?```/g," code block. ").replace(/<[^>]+>/g,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/[*_`#>~|]/g,"").replace(/\s+/g," ").replace(/^\s+|\s+$/g,"")}
function chunks(t){var out=[],parts=t.match(/[^.!?\u061F\u06D4\n]+[.!?\u061F\u06D4]*/g)||[t],cur="";
 for(var i=0;i<parts.length;i++){if((cur+parts[i]).length>170&&cur){out.push(cur);cur=parts[i]}else cur+=parts[i]}if(cur)out.push(cur);return out}
/* the AI answers out loud (speechSynthesis: iOS 7+, Android 4.4+). mic is paused while it talks so it doesn't hear itself */
function sayIt(text,my){
 var ss=window.speechSynthesis;text=clean(text);if(!ss||!text||!window.SpeechSynthesisUtterance)return;
 var q=chunks(text),i=0;stopRec();speaking=true;cls("speak",1);
 function end(){if(my!==tok||!on)return;speaking=false;cls("speak",0);listen()}
 function next(){if(my!==tok||!on)return;if(i>=q.length){end();return}
  var u=new SpeechSynthesisUtterance(q[i++]);u.lang=lang();u.onend=next;u.onerror=end;
  try{ss.speak(u)}catch(e){end()}}
 try{ss.cancel()}catch(e){}next()}
function unsup(){var t=document.getElementById("toast");if(!t){alert("Unsupported browser");return}t.textContent="Unsupported browser";t.hidden=false;clearTimeout(t._u);t._u=setTimeout(function(){t.hidden=true},2500)}
function doOpen(){
 if(!SR){unsup();return}
 build();if(on)return;
 ensureMic(function(ok){if(!ok)return;
  try{var u0=new SpeechSynthesisUtterance(" ");u0.volume=0;speechSynthesis.speak(u0)}catch(e){}
  on=true;tok++;heard="";speaking=false;
  $(".log",el).innerHTML="";el.className="";$(".hint",el).textContent="Listening…";
  void el.offsetWidth;el.classList.add("on");frame();listen()
 })}
function close(){
 if(!on)return;on=false;tok++;clearInterval(tick);clearInterval(busyIv);cancelAnimationFrame(raf);stopRec();
 try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}
 try{stream&&stream.getTracks().forEach(function(t){t.stop()});ac&&ac.close()}catch(e){}stream=an=ac=null;
 cls("split",0);cls("talk",0);cls("count",0);cls("speak",0);cls("think",0);el.classList.remove("on")}
/* blur + wave wipe grows out of the button (slow), then voice screen opens */
var wiping=false,RM=matchMedia("(prefers-reduced-motion: reduce)");
function wipe(btn,cb,cx,cy){
 var r=btn&&btn.getBoundingClientRect?btn.getBoundingClientRect():null;
 var x=r?r.left+r.width/2:(cx==null?innerWidth/2:cx),y=r?r.top+r.height/2:(cy==null?innerHeight-60:cy);
 if(btn)btn.classList.add("vo-morph");
 if(wiping){if(cb)cb();setTimeout(function(){btn&&btn.classList.remove("vo-morph")},700);return}
 wiping=true;
 var w=document.createElement("div");w.id="vowipe";w.style.setProperty("--x",x+"px");w.style.setProperty("--y",y+"px");
 w.innerHTML='<div class="vw-wave"><i class="a"></i><i class="b"></i><i class="c"></i></div>';
 document.body.appendChild(w);void w.offsetWidth;w.classList.add("go");
 if(cb)setTimeout(cb,450);
 setTimeout(function(){w.classList.add("out")},1050);
 setTimeout(function(){w.remove();wiping=false;if(btn)btn.classList.remove("vo-morph")},1700)
}
function open(btn){
 if(on||wiping)return;
 if(!SR){unsup();return}
 if(RM.matches){doOpen();return}
 wipe(btn,doOpen)
}
window.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#speakBtn");if(!b)return;
 e.stopPropagation();e.stopImmediatePropagation();e.preventDefault();open(b)},true);
/* same effect on every other button */
window.addEventListener("click",function(e){
 if(RM.matches||!e.target.closest)return;
 var b=e.target.closest('button,[role="button"],.icon-btn,.btn');
 if(!b||b.id==="speakBtn"||b.disabled||b.closest("#vo,#vowipe"))return;
 wipe(b)
},true);
addEventListener("keydown",function(e){if(e.key==="Escape")close()});
window.XMM_VOICE={open:function(){open(document.getElementById("speakBtn"))},close:close};
})();
