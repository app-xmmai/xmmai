/* XMM verify screen: a short animated human check shown once per session */
(function(){
 try{if(sessionStorage.getItem("xmm.verified"))return}catch(e){}
 var css=document.createElement("style");
 css.textContent="#xv{position:fixed;inset:0;z-index:2147483600;background:#05060d;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;transition:opacity .5s ease,transform .5s ease}"+
 "#xv.out{opacity:0;transform:scale(1.04);pointer-events:none}#xv canvas{position:absolute;inset:0;width:100%;height:100%}"+
 "#xv .c{position:relative;display:flex;flex-direction:column;align-items:center;gap:22px;text-align:center;padding:24px}"+
 "#xv .o{position:relative;width:120px;height:120px}"+
 "#xv .o i{position:absolute;inset:0;border-radius:50%;border:2px solid transparent;border-top-color:#7aa7ff;animation:xvs 1.1s linear infinite}"+
 "#xv .o i:nth-child(2){inset:12px;border-top-color:#c58bff;animation-duration:1.6s;animation-direction:reverse}"+
 "#xv .o i:nth-child(3){inset:24px;border-top-color:#5ef2d0;animation-duration:2.2s}"+
 "#xv .o svg{position:absolute;inset:38px;width:44px;height:44px;stroke:#fff;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}"+
 "#xv .o svg path.k{stroke-dasharray:30;stroke-dashoffset:30;transition:stroke-dashoffset .5s .1s}"+
 "#xv.ok .o i{animation-play-state:paused;border-top-color:#5ef2d0;opacity:.35}#xv.ok .o svg path.k{stroke-dashoffset:0}"+
 "#xv h1{margin:0;font-size:20px;font-weight:600;letter-spacing:.2px}#xv p{margin:0;font-size:14px;color:rgba(255,255,255,.62);min-height:20px}"+
 "#xv .b{height:4px;width:200px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}#xv .b b{display:block;height:100%;width:0;background:linear-gradient(90deg,#7aa7ff,#c58bff,#5ef2d0);transition:width .45s ease}"+
 "#xv button{display:none;margin-top:4px;padding:10px 22px;border:0;border-radius:12px;background:#fff;color:#000;font:inherit;font-weight:600;cursor:pointer}"+
 "#xv.bad button{display:inline-block}#xv.bad .o i{border-top-color:#ff6b6b;animation-play-state:paused}"+
 "@keyframes xvs{to{transform:rotate(360deg)}}";
 document.head.appendChild(css);
 var o=document.createElement("div");o.id="xv";
 o.innerHTML='<canvas></canvas><div class="c"><div class="o"><i></i><i></i><i></i><svg viewBox="0 0 24 24"><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6z"/><path class="k" d="m8.8 12.2 2.3 2.3 4.2-4.6"/></svg></div><h1>Checking you’re human</h1><p id="xvS">Starting…</p><div class="b"><b id="xvB"></b></div><button type="button">Try again</button></div>';
 (document.body||document.documentElement).appendChild(o);
 /* starfield */
 var cv=o.querySelector("canvas"),x=cv.getContext("2d"),W,H,S=[];
 function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener("resize",rs);
 for(var i=0;i<110;i++)S.push({x:Math.random(),y:Math.random(),z:.2+Math.random()*.8});
 (function f(){if(!document.getElementById("xv"))return;x.clearRect(0,0,W,H);
  S.forEach(function(s){s.x-=s.z*.0006;if(s.x<0){s.x=1;s.y=Math.random()}x.fillStyle="rgba(255,255,255,"+(.25+s.z*.6)+")";x.fillRect(s.x*W,s.y*H,s.z*2,s.z*2)});
  requestAnimationFrame(f)})();
 var st=document.getElementById("xvS"),bar=document.getElementById("xvB");
 var steps=["Checking your browser…","Checking your connection…","Almost there…"];
 function bot(){try{return navigator.webdriver===true}catch(e){return false}}
 function run(){
  o.classList.remove("bad");var n=0;
  (function next(){
   if(n<steps.length){st.textContent=steps[n];bar.style.width=((n+1)/(steps.length+1)*100)+"%";n++;setTimeout(next,380)}
   else if(bot()){o.classList.add("bad");o.querySelector("h1").textContent="Verification failed";st.textContent="Automated browsers can’t continue."}
   else{o.querySelector("h1").textContent="You’re verified";st.textContent="Welcome to XMM AI";bar.style.width="100%";o.classList.add("ok");
    try{sessionStorage.setItem("xmm.verified","1")}catch(e){}
    setTimeout(function(){o.classList.add("out");setTimeout(function(){o.remove()},520)},550)}
  })();
 }
 o.querySelector("button").onclick=function(){o.querySelector("h1").textContent="Checking you’re human";run()};
 run();
})();
