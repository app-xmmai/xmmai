/* v420: the + button opens the device's own file selector (iOS, Android, PC). No in-app popup.
   Must load before every other script so older + button handlers never run. */
(function(){
 var SEL="#attBtn,#v3Add,#cvPlus,.composer .vplus",last=null;
 function openPicker(){
  if(last)last.remove();
  var i=last=document.createElement("input");
  /* app.js picks up files from any input with class "xmm-file" */
  i.type="file";i.multiple=true;i.className="xmm-file";
  i.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0";
  /* its own click must not reach page handlers that close menus or sheets */
  i.addEventListener("click",function(e){e.stopPropagation()});
  document.body.appendChild(i);
  i.click();
 }
 window.XMM_UPLOAD_OPEN=openPicker;
 /* touchend is never cancelled: that would stop the click, and the picker only opens from a real click */
 ["pointerdown","pointerup","mousedown","mouseup","touchstart","touchend","click"].forEach(function(type){
  window.addEventListener(type,function(e){
   /* composedPath: some + buttons live inside a shadow root, where e.target only shows the host */
   if(!e.composedPath().some(function(n){return n.matches&&n.matches(SEL)}))return;
   e.stopImmediatePropagation();
   if(type==="mousedown")e.preventDefault(); /* keeps focus in the message box */
   if(type==="click"){e.preventDefault();openPicker()}
  },{capture:true,passive:type.indexOf("touch")===0});
 });
 /* drag a file from the computer onto the page */
 function hasFiles(e){return e.dataTransfer&&[].indexOf.call(e.dataTransfer.types||[],"Files")>-1}
 window.addEventListener("dragover",function(e){if(hasFiles(e))e.preventDefault()});
 window.addEventListener("drop",function(e){
  if(e.defaultPrevented||!hasFiles(e))return;
  e.preventDefault();
  var i=document.createElement("input");i.type="file";i.multiple=true;i.className="xmm-file";i.hidden=true;
  i.files=e.dataTransfer.files;
  document.body.appendChild(i);
  i.dispatchEvent(new Event("change",{bubbles:true}));
  setTimeout(function(){i.remove()},2000);
 });
})();
