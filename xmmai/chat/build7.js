/* Build tab -> switches the AI to XMMGPT-7 Galaxy; back to the previous model when leaving Build */
(function(){
 var prev=null;
 function api(){return window.XMM_SUNAPI}
 function sync(){
  var a=api();if(!a||!a.S)return;
  var on=document.body.classList.contains("v-build")||document.body.classList.contains("code-on");
  if(on&&a.S.mode!=="x7g"){prev=a.S.mode;a.sunSetMode("x7g");try{a.toast("Build uses XMMGPT-7 Galaxy")}catch(e){}}
  else if(!on&&prev){if(a.S.mode==="x7g")a.sunSetMode(prev);prev=null}
  /* keep the Ask/Build highlight of the new UI in sync */
  try{var h=document.getElementById("v3host"),sr=h&&h.shadowRoot,r=sr&&sr.querySelector("#v3");if(r){r.setAttribute("data-build",on?"1":"0");[].forEach.call(sr.querySelectorAll(".v3-seg button"),function(b){b.classList.toggle("on",(b.dataset.m==="code")===on)})}}catch(e){}
 }
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:["class"]});
 addEventListener("xmm-code-start",sync);
 addEventListener("load",sync);
})();
