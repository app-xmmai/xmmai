/* XMM AI: one layout for every screen. Wide = sidebar beside chat (PC UI). Narrow = same UI, sidebar slides over. Reacts to rotation live. */
(function(){
  "use strict";
  var b=document.body,mq=matchMedia("(max-width:767px)"),K="xmm.sidec",wide=false;
  try{wide=localStorage.getItem(K)==="1"}catch(e){}
  function scrim(){return document.getElementById("scrim")}
  function sync(){
    var narrow=mq.matches,c=b.classList.contains("collapsed"),s=scrim();
    if(s)s.classList.toggle("on",narrow&&!c);
    var side=document.getElementById("sideChat");if(side)side.classList.toggle("open",narrow&&!c);
  }
  function apply(){
    if(mq.matches){b.classList.add("collapsed")}
    else{b.classList.toggle("collapsed",wide)}
    sync();
  }
  apply();
  var ready=function(){apply()};
  if(document.readyState!=="complete")addEventListener("load",ready);
  (mq.addEventListener?mq.addEventListener("change",apply):mq.addListener(apply));
  addEventListener("orientationchange",function(){setTimeout(apply,120)});
  addEventListener("resize",function(){clearTimeout(apply.t);apply.t=setTimeout(function(){
    // keep layout valid after any rotation / split-screen resize
    if(mq.matches&&!b.classList.contains("collapsed")){/* drawer open on phone: leave as is */}
    sync();
  },120)},{passive:true});
  new MutationObserver(function(){
    if(!mq.matches){try{localStorage.setItem(K,b.classList.contains("collapsed")?"1":"0");wide=b.classList.contains("collapsed")}catch(e){}}
    sync();
  }).observe(b,{attributes:true,attributeFilter:["class"]});
})();
