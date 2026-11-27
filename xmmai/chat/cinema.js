/* XMM AI cinematic layer: pointer spotlight (desktop only). Tiny, rAF-throttled, transform-only. */
(function(){
  try{
    if(!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
    if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
    var s=document.querySelector(".cin-spot");if(!s)return;
    var x=innerWidth*.5,y=innerHeight*.35,raf=0;
    function paint(){raf=0;s.style.transform="translate3d("+x+"px,"+y+"px,0)"}
    paint();
    addEventListener("pointermove",function(e){
      x=e.clientX;y=e.clientY;s.style.opacity="1";
      if(!raf)raf=requestAnimationFrame(paint);
    },{passive:true});
    document.documentElement.addEventListener("mouseleave",function(){s.style.opacity="0"});
  }catch(e){}
})();
