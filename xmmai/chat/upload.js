/* attach UI owned by morph.js (Camera / Photos / Files panel) */
(function(){
  /* keep change bridge for ephemeral inputs */
  document.addEventListener("change",function(e){
    var t=e.target;
    if(!t||t.type!=="file")return;
    if(!(t.id==="file"||(t.classList&&t.classList.contains("xmm-file"))))return;
    /* app.js also listens — no-op here if addFiles not global */
  },true);
})();
