/* liquid.js — liquid glass behaviour. Safari, Firefox and Chrome all get the same glass from liquid.css;
   this file adds (1) a soft real refraction in Chromium only, (2) the top bar bend animations:
   a big-then-small entrance, a springy stretch on every tap AND every slide, and a moving highlight,
   (3) keeps the last message clear of the floating chat input. No libraries, no network, no layout reads in hot paths. */
(function(){
"use strict";
var ua=navigator.userAgent||"";
var chromium=/(Chrome|Chromium)\//.test(ua)&&!/(CriOS|FxiOS|Firefox|Edge\/\d)/.test(ua);
var okCSS=window.CSS&&CSS.supports&&(CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"));
var lowEnd=navigator.deviceMemory&&navigator.deviceMemory<=2;
var noTrans=window.matchMedia&&matchMedia("(prefers-reduced-transparency: reduce)").matches;
var RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var BEND=chromium&&okCSS&&!lowEnd&&!noTrans;
var IND=!!(window.CSS&&CSS.supports&&CSS.supports("scale","1 1")&&CSS.supports("translate","1px 1px")); /* individual transform props */

/* ---- which elements ---- */
var BENDSEL=".vtop .vc,.vtop .vseg,.vtop .vgl button,#mainChat .composer .vrow-t,#mainChat .composer button,.vchips button,#code .cd-in,.vpop,.menu.pop,#settings .sheet,#studio .sv-bar button,#studio .sv-bar textarea,.bnav.glass,.bnav-wrap .circle,.searchbar.glass,.toast.glass,#code>header.topbar #cdBack,#code>header.topbar #cdTog,#code>header.topbar .seg";
var TOPSEL=".vtop .vc,.vtop .vseg,.vtop .vgl button,#code>header.topbar #cdBack,#code>header.topbar #cdTog,#code>header.topbar .seg";
var PRESS="#mainChat .composer button,.vtop .vc,.vtop .vgl button,.vtop .vseg button,#code>header.topbar #cdBack,#code>header.topbar #cdTog,#code>header.topbar .seg button";
var NS="http://www.w3.org/2000/svg",XL="http://www.w3.org/1999/xlink";

/* ================= 1. Chromium refraction (gentle) ================= */
var svg,cache=new Map(),MAX=40;
function ensureSvg(){
 if(svg&&svg.isConnected)return svg;
 svg=document.createElementNS(NS,"svg");svg.setAttribute("width","0");svg.setAttribute("height","0");svg.setAttribute("aria-hidden","true");
 svg.style.cssText="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
 svg.appendChild(document.createElementNS(NS,"defs"));document.body.appendChild(svg);return svg}
/* soft displacement map: only a narrow rim bends, corners bend a little more, nothing harsh */
/* physically based bend (Snell's law, convex squircle bezel — after kube.io's liquid-glass write-up):
   height f(x)=(1-(1-x)^4)^(1/4); slope -> incidence angle; glass n=1.5; displacement ~ f(x)*tan(a1-a2). */
var PROF=null;
function profile(){
 if(PROF)return PROF;var N=128,t=new Float32Array(N),mx=0,f=function(x){return Math.pow(1-Math.pow(1-x,4),.25)};
 for(var i=0;i<N;i++){var x=i/(N-1),e=.001,x2=Math.min(1,x+e),d=(f(x2)-f(Math.max(0,x2-e)))/e,a1=Math.atan(Math.abs(d)),a2=Math.asin(Math.sin(a1)/1.5);
  var v=f(x)*Math.tan(a1-a2);t[i]=v;if(v>mx)mx=v}
 for(var k=0;k<N;k++)t[k]/=(mx||1);PROF=t;return t}
function makeMap(w,h,r,bezel){
 var P=profile(),c=document.createElement("canvas");c.width=w;c.height=h;
 var x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,cx=w/2,cy=h/2,hx=w/2-r,hy=h/2-r;
 for(var j=0;j<h;j++)for(var i=0;i<w;i++){
  var px=i+.5-cx,py=j+.5-cy,qx=Math.abs(px)-hx,qy=Math.abs(py)-hy;
  var ox=Math.max(qx,0),oy=Math.max(qy,0),out=Math.sqrt(ox*ox+oy*oy);
  var depth=-(out+Math.min(Math.max(qx,qy),0)-r),nx=0,ny=0,vx=0,vy=0;
  if(qx>0||qy>0){nx=ox*(px<0?-1:1)/(out||1);ny=oy*(py<0?-1:1)/(out||1)}else if(qx>qy){nx=px<0?-1:1}else{ny=py<0?-1:1}
  if(depth>=0&&depth<bezel){var m=P[Math.min(127,Math.round(depth/bezel*127))];vx=-nx*m;vy=-ny*m}
  var k=(j*w+i)*4;d[k]=Math.round(127.5+vx*127);d[k+1]=Math.round(127.5+vy*127);d[k+2]=128;d[k+3]=255}
 x.putImageData(im,0,0);return c.toDataURL("image/png")}
function filterFor(w,h,r){
 var key=w+"x"+h+"r"+r,hit=cache.get(key);
 if(hit){cache.delete(key);cache.set(key,hit);return hit}
 var bezel=Math.max(6,Math.min(18,Math.min(w,h)*.32)),scale=Math.round(bezel*2.7);
 var id="lqf"+(Math.random()*1e9|0).toString(36),url=makeMap(w,h,r,bezel);
 var f=document.createElementNS(NS,"filter");
 f.setAttribute("id",id);f.setAttribute("filterUnits","userSpaceOnUse");f.setAttribute("primitiveUnits","userSpaceOnUse");
 f.setAttribute("x","0");f.setAttribute("y","0");f.setAttribute("width",w);f.setAttribute("height",h);f.setAttribute("color-interpolation-filters","sRGB");
 var b=document.createElementNS(NS,"feGaussianBlur");b.setAttribute("in","SourceGraphic");b.setAttribute("stdDeviation",".35");b.setAttribute("result","bl");
 var im=document.createElementNS(NS,"feImage");im.setAttribute("href",url);im.setAttributeNS(XL,"href",url);
 im.setAttribute("x","0");im.setAttribute("y","0");im.setAttribute("width",w);im.setAttribute("height",h);im.setAttribute("preserveAspectRatio","none");im.setAttribute("result","map");
 var dm=document.createElementNS(NS,"feDisplacementMap");
 dm.setAttribute("in","bl");dm.setAttribute("in2","map");dm.setAttribute("scale",scale);dm.setAttribute("xChannelSelector","R");dm.setAttribute("yChannelSelector","G");
 f.appendChild(b);f.appendChild(im);f.appendChild(dm);ensureSvg().firstChild.appendChild(f);
 var rec={id:id,node:f};cache.set(key,rec);
 while(cache.size>MAX){var o=cache.keys().next().value,ov=cache.get(o);cache.delete(o);ov.node.remove()}
 return rec}
function bend(el){
 if(!el.isConnected)return;
 var w=Math.round(el.offsetWidth/2)*2,h=Math.round(el.offsetHeight/2)*2;
 if(w<12||h<12||w>900||h>620)return;
 var r=parseFloat(getComputedStyle(el).borderTopLeftRadius)||h/2;r=Math.round(Math.min(r,w/2,h/2));
 var big=el.matches("#mainChat .composer .vrow-t,#code .cd-in,#settings .sheet,.vpop,.menu.pop");
 var v="url(#"+filterFor(w,h,r).id+") blur("+(big?1.6:.5)+"px) saturate(1.25) brightness(1.05)";
 el.style.setProperty("backdrop-filter",v,"important");el.style.setProperty("-webkit-backdrop-filter",v,"important")}
var ro=BEND&&window.ResizeObserver?new ResizeObserver(function(es){
 es.forEach(function(e){var t=e.target;clearTimeout(t._lqT);t._lqT=setTimeout(function(){bend(t)},t._lqF?0:100);t._lqF=0})}):null;

/* ================= 2. top bar animations ================= */
function spr(el,frames,opt){try{return el.animate(frames,opt)}catch(e){return null}}
function sc(x,y,o){var f=IND?{scale:x+" "+y}:{transform:"scale("+x+","+y+")"};if(o!=null)f.opacity=o;return f}
function glint(el){return;if(RM)return;el.classList.remove("lq-g");void el.offsetWidth;el.classList.add("lq-g")}
function hostOf(b){if(b.closest("#mainChat .composer button")||b.closest(".vtop .vgl button")||b.closest(".vtop .vc"))return b.closest("button");if(b.closest(".vtop .vseg"))return b.closest(".vseg");return b.closest("#mainChat .composer button")||b.closest(".vtop,#cdBack,#cdTog,.seg")||b}
function pillOf(b){var s=b.closest(".vseg");return s&&s.querySelector(".vseg-pill")}
/* big -> small -> settle */
function enter(el,i){
 if(RM)return;
 spr(el,[sc(1.55,1.55,0),sc(.9,.9,1),sc(1.05,1.05,1),sc(1,1,1)],{duration:780,delay:i*70,easing:"cubic-bezier(.25,.9,.3,1)",fill:"backwards"});
 setTimeout(function(){glint(el)},i*70+120)}
/* tap or slide release: stretch big, squeeze small, settle */
function jelly(el,k){return;
 if(RM||!el)return;if(!IND&&el.matches(".vseg-pill"))return;k=k||1;
 spr(el,[sc(1,1),sc(1+.16*k,1-.12*k),sc(1-.07*k,1+.08*k),sc(1+.03*k,1-.02*k),sc(1,1)],{duration:600,easing:"cubic-bezier(.3,.8,.4,1)"})}
var done=new WeakSet();
function animateIn(){
 var els=document.querySelectorAll(TOPSEL),n=0;
 for(var i=0;i<els.length;i++){var e=els[i];
  if(done.has(e)||!e.offsetParent&&e.getClientRects().length===0)continue;
  if(e.matches(".vseg-pill"))continue; /* the pill rides with the switch */
  done.add(e);enter(e,n++)}}
/* press / slide tracking */
var cur=null;
function tanh(v){var a=Math.exp(2*v);return(a-1)/(a+1)}
function drive(t,dx,dy){
 if(!IND&&t.pill)return;
 var w=Math.max(t.w,28),h=Math.max(t.h,28);
 var kx=tanh(Math.abs(dx)/(w*1.2)),ky=tanh(Math.abs(dy)/(h*1.5));
 var sx=1+.22*kx-.04*ky,sy=1+.22*ky-.04*kx;
 var tx=(dx<0?-1:1)*Math.min(Math.abs(dx)*.2,22),ty=(dy<0?-1:1)*Math.min(Math.abs(dy)*.2,22);
 if(IND){t.el.style.scale=sx.toFixed(3)+" "+sy.toFixed(3);t.el.style.translate=tx.toFixed(1)+"px "+ty.toFixed(1)+"px"}
 else t.el.style.transform="translate("+tx.toFixed(1)+"px,"+ty.toFixed(1)+"px) scale("+sx.toFixed(3)+","+sy.toFixed(3)+")";
 t.on=true}
function release(t){
 var el=t.el;
 if(t.on){
  var from=IND?{scale:el.style.scale,translate:el.style.translate}:{transform:el.style.transform};
  var to=IND?{scale:"1 1",translate:"0px 0px"}:{transform:"none"};
  if(IND){el.style.scale="";el.style.translate=""}else el.style.transform="";
  el.classList.remove("lq-drag");
  if(!RM)spr(el,[from,to],{duration:720,easing:"cubic-bezier(.3,1.7,.5,1)"})}
 else jelly(el,t.pill?1.5:1)}
document.addEventListener("pointerdown",function(e){
 if(!e.isPrimary)return;
 var b=e.target.closest&&e.target.closest(PRESS);if(!b)return;
 var p=pillOf(b),el=p||hostOf(b),r=el.getBoundingClientRect();
 cur={el:el,pill:!!p,b:b,x:e.clientX,y:e.clientY,w:r.width,h:r.height,on:false,id:e.pointerId};
 glint(hostOf(b));if(p)glint(p);
},true);
document.addEventListener("pointermove",function(e){
 if(!cur||e.pointerId!==cur.id)return;
 var dx=e.clientX-cur.x,dy=e.clientY-cur.y;
 if(!cur.on&&Math.hypot(dx,dy)<7)return;
 if(!cur.on)cur.el.classList.add("lq-drag");
 drive(cur,dx,dy)},{passive:true});
function up(e){if(!cur||(e&&e.pointerId!==cur.id))return;var t=cur;cur=null;release(t)}
document.addEventListener("pointerup",up,true);document.addEventListener("pointercancel",up,true);
/* keyboard "click" with no pointer still bends */
document.addEventListener("click",function(e){
 if(e.detail!==0)return;var b=e.target.closest&&e.target.closest(PRESS);if(!b)return;
 var p=pillOf(b);jelly(p||hostOf(b),p?1.5:1);glint(hostOf(b))},true);


/* ================= 4. settings on phones: the tabs become a list of rows; tap a row to open it, X goes back ================= */
function settingsList(){
 var root=document.getElementById("settings"),sh=root&&root.querySelector(".sheet"),nav=sh&&sh.querySelector(".stabs"),body=sh&&sh.querySelector(".sbody");
 if(!sh||!nav||!body||sh._lqS)return;sh._lqS=1;
 var list=document.createElement("div");list.className="lq-list";
 var h3=sh.querySelector(".sheet-h h3"),orig=h3?h3.textContent:"Settings";
 var ICONS={General:'<circle cx="12" cy="8" r="3.5"/><path d="M5 19.5c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8"/>',
  Personalization:'<path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7z"/>',
  Skills:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>',
  Data:'<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6"/>',
  About:'<circle cx="12" cy="12" r="8.5"/><path d="M12 10.5V16M12 7.5h.01"/>'};
 Array.prototype.forEach.call(nav.querySelectorAll("button"),function(tb){
  var row=document.createElement("button");row.type="button";row.className="lq-row";
  var name=tb.textContent.trim();
  var ic=ICONS[name]||'<circle cx="12" cy="12" r="3"/>';
  row.innerHTML="<i class=\"lq-ic\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\">"+ic+"</svg></i><span></span><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 6l6 6-6 6\"/></svg>";
  row.querySelector("span").textContent=name;
  row.onclick=function(){tb.click();sh.classList.add("lq-in");if(h3)h3.textContent=name;sh.scrollTop=0;body.scrollTop=0};
  list.appendChild(row)});
 body.parentNode.insertBefore(list,body);
 function back(){sh.classList.remove("lq-in");if(h3)h3.textContent=orig}
 document.addEventListener("click",function(e){
  var x=e.target.closest&&e.target.closest("#settings [data-act=closeSettings]");
  if(x&&sh.classList.contains("lq-in")&&window.matchMedia("(max-width:1100px)").matches){e.stopImmediatePropagation();e.preventDefault();back()}},true);
 new MutationObserver(function(){if(root.hidden)back()}).observe(root,{attributes:true,attributeFilter:["hidden"]})}


/* ================= 5. morph: a button literally expands into its panel ================= */
var EZ="cubic-bezier(.22,1,.3,1)";var CL=220,CE="cubic-bezier(.4,0,.2,1)"; /* CLOSE = the open morph played backwards, fast */var lastA=null,lastAT=0;
document.addEventListener("pointerdown",function(e){var t=e.target,b=t.closest&&t.closest("button,.user,[data-act]");if(!b)return;if(t.closest(".menu.pop,.vpop,#settings .sheet")){if(lastA)lastAT=Date.now();return}lastA=b;lastAT=Date.now()},true);
function okRect(a){if(!a||!a.isConnected)return false;var r=a.getBoundingClientRect();return r.width>4&&r.height>4&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth}
function fbIn(p){if(p.animate)p.animate([{opacity:0,transform:"translateY(16px) scale(.94)"},{opacity:1,transform:"none"}],{duration:380,easing:EZ})}
function fbOut(p,done){if(!p.animate){done();return}var an=p.animate([{opacity:1,transform:"none"},{opacity:0,transform:"translateY(16px) scale(.94)"}],{duration:180,easing:CE,fill:"forwards"});var ended=0,f2=function(){if(ended)return;ended=1;done();p.getAnimations().forEach(function(x){x.cancel()})};an.onfinish=f2;setTimeout(f2,300)}
function anchorNow(){return lastA&&lastA.isConnected&&Date.now()-lastAT<1500?lastA:null}

function clipFor(p,a){var pr=p.getBoundingClientRect(),ar=a.getBoundingClientRect();
 return"inset("+(ar.top-pr.top)+"px "+(pr.right-ar.right)+"px "+(pr.bottom-ar.bottom)+"px "+(ar.left-pr.left)+"px round "+Math.min(ar.width,ar.height)/2+"px)"}
function killX(p){if(p&&p._lqX){var x=p._lqX;p._lqX=null;x.style.opacity="0";x.style.transform="scale(.6) rotate(-90deg)";setTimeout(function(){x.remove()},250)}}
function addX(p,a,close){
 var r=a.getBoundingClientRect(),x=document.createElement("button");x.type="button";x.className="lq-x";x.setAttribute("aria-label","Close");
 x.innerHTML="<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.4' stroke-linecap='round'><path d='M6 6l12 12M18 6L6 18'/></svg>";
 var d=Math.round(Math.min(r.width,r.height)||40);x.style.cssText="left:"+(r.left+(r.width-d)/2)+"px;top:"+(r.top+(r.height-d)/2)+"px;width:"+d+"px;height:"+d+"px;min-width:"+d+"px;aspect-ratio:1/1;flex:none;border-radius:50%";
 x.onclick=function(e){e.stopPropagation();close()};document.body.appendChild(x);p._lqX=x;
 if(x.animate&&!RM)x.animate([{transform:"rotate(-90deg) scale(.6)",opacity:0},{transform:"none",opacity:1}],{duration:420,easing:EZ})}
function morphIn(p,a,close){
 if(!p||RM||!p.animate)return;if(!okRect(a)){fbIn(p);return}var pr=p.getBoundingClientRect();if(!pr.width)return;
 var R=parseFloat(getComputedStyle(p).borderTopLeftRadius)||24;
 p.getAnimations().forEach(function(x){x.cancel()});
 p._lqA=a;a.style.transition="opacity .12s";a.style.opacity="0";addX(p,a,close||function(){p.remove()});
 p.animate([{clipPath:clipFor(p,a)},{clipPath:"inset(0px 0px 0px 0px round "+R+"px)"}],{duration:560,easing:EZ});
 Array.prototype.forEach.call(p.children,function(c,i){if(c.animate)c.animate([{opacity:0,transform:"translateY(8px) scale(.98)"},{opacity:1,transform:"none"}],{duration:340,delay:170+i*28,easing:EZ,fill:"backwards"})})}
function morphOut(p,a,done){killX(p);
 if(!p||RM||!p.animate){done();return}
 if(!okRect(a)){fbOut(p,done);return}
 var R=parseFloat(getComputedStyle(p).borderTopLeftRadius)||24;
 /* exact reverse of morphIn: the panel shrinks back into the button, content fades out first, fast */
 Array.prototype.forEach.call(p.children,function(c){if(c.animate)c.animate([{opacity:1},{opacity:0}],{duration:CL*.5,easing:"ease-in",fill:"forwards"})});
 var an=p.animate([{clipPath:"inset(0px 0px 0px 0px round "+R+"px)"},{clipPath:clipFor(p,a)}],{duration:CL,easing:CE,fill:"forwards"});
 var ended=0,fin=function(){if(ended)return;ended=1;a.style.opacity="";done();p.getAnimations().forEach(function(x){x.cancel()})};
 an.onfinish=fin;setTimeout(fin,CL+150)}
/* popovers from the 3 dots, + and the model button */
new MutationObserver(function(ms){
 ms.forEach(function(m){
  Array.prototype.forEach.call(m.addedNodes,function(n){
   if(n.nodeType!==1||!n.matches||!n.matches(".vpop,.menu.pop"))return;var a=anchorNow();if(n._lqG)return;if(a)requestAnimationFrame(function(){n._lqR=n.getBoundingClientRect();n._lqA2=a;morphIn(n,a)})});
  Array.prototype.forEach.call(m.removedNodes,function(n){if(n._lqG)return;if(n._lqA){n._lqA.style.opacity="";killX(n)}
   if(!RM&&n._lqR&&n.matches&&n.matches(".vpop,.menu.pop")&&okRect(n._lqA2)){var r=n._lqR,g=n.cloneNode(true),a2=n._lqA2;g._lqG=1;g.removeAttribute("id");g.style.cssText+=";position:fixed;left:"+r.left+"px;top:"+r.top+"px;width:"+r.width+"px;height:"+r.height+"px;right:auto;bottom:auto;margin:0;transform:none;pointer-events:none;z-index:100001;animation:none;transition:none";g.querySelectorAll("*").forEach(function(e){e.style.animation="none";e.style.transition="none"});document.body.appendChild(g);
    var an=g.animate([{clipPath:"inset(0px round 18px)",opacity:1},{clipPath:clipFor(g,a2),opacity:.2}],{duration:CL,easing:CE,fill:"forwards"});an.onfinish=function(){g.remove()};setTimeout(function(){g.remove()},400)}})})
}).observe(document.body,{childList:true});

/* settings: small popup that grows out of its button, shrinks back on close */
function settingsPopup(){
 var root=document.getElementById("settings"),sh=root&&root.querySelector(".sheet");if(!root||!sh||root._lqP)return;root._lqP=1;
 var anchor=null;
 new MutationObserver(function(){
  if(!root.hidden){var a=anchorNow();if(!okRect(a))a=[document.querySelector("[data-act=settings]"),document.querySelector("#sideChat .user"),document.querySelector("[data-act=topdots]")].filter(okRect)[0]||null;anchor=a;
   if(!RM)root.animate([{opacity:0},{opacity:1}],{duration:260,easing:"ease-out"});
   requestAnimationFrame(function(){morphIn(sh,a,closeIt)})}
 }).observe(root,{attributes:true,attributeFilter:["hidden"]});
 var closing=false;
 function closeIt(){if(closing||root.hidden)return;closing=true;
  if(!RM)root.animate([{opacity:1},{opacity:0}],{duration:CL,easing:"ease-out",fill:"forwards"});
  morphOut(sh,anchor,function(){root.hidden=true;closing=false;root.getAnimations().forEach(function(x){x.cancel()});if(anchor)anchor.style.opacity=""})}
 document.addEventListener("click",function(e){
  var x=e.target.closest&&e.target.closest("#settings [data-act=closeSettings]"),bg=e.target===root;
  if(!x&&!bg)return;
  if(x&&sh.classList.contains("lq-in")&&window.matchMedia("(max-width:1100px)").matches)return; /* sub-page X handled by the list code */
  e.stopImmediatePropagation();e.preventDefault();closeIt()},true);
 document.addEventListener("keydown",function(e){if(e.key==="Escape"){if(!root.hidden)closeIt();var p=document.querySelector(".vpop,.menu.pop");if(p){var b=document.body;p.remove()}}})}

/* ================= 6. more personalisation (saved on this device, used by the AI) ================= */
function prefs(){try{return Object.assign({style:"balanced",tone:"friendly",fs:16,glass:100,rm:0},JSON.parse(localStorage.getItem("xmm.pref")||"{}"))}catch(e){return{style:"balanced",tone:"friendly",fs:16,glass:100,rm:0}}}
function savePrefs(p){try{localStorage.setItem("xmm.pref",JSON.stringify(p))}catch(e){}}
function applyPrefs(){var p=prefs(),r=document.documentElement;r.style.setProperty("--lq-fs",p.fs+"px");r.style.setProperty("--lq-g",(p.glass/100).toFixed(2));r.classList.toggle("lq-rm",!!p.rm);if(p.rm)RM=true}
var oldHint=window.XMM_LANG_HINT;
window.XMM_LANG_HINT=function(){var p=prefs(),s=(oldHint?oldHint():"")||"";
 s+=" "+({short:"Keep answers short and to the point.",detailed:"Give detailed, thorough answers.",balanced:""}[p.style]||"");
 s+=" "+({casual:"Use a casual, relaxed tone.",formal:"Use a formal, professional tone.",friendly:"Be warm and friendly."}[p.tone]||"");return s};
function prefsUI(){
 var mem=document.getElementById("setMem"),pane=mem&&mem.closest(".pane");if(!pane||pane._lqU)return;pane._lqU=1;
 var p=prefs(),box=document.createElement("div");
 function seg(label,key,opts){var d=document.createElement("div");d.className="lq-pf";d.innerHTML="<label></label><div class='lq-seg'></div>";d.firstChild.textContent=label;var s=d.lastChild;
  opts.forEach(function(o){var b=document.createElement("button");b.type="button";b.textContent=o[1];if(p[key]===o[0])b.className="on";b.onclick=function(){p[key]=o[0];savePrefs(p);Array.prototype.forEach.call(s.children,function(x){x.classList.toggle("on",x===b)})};s.appendChild(b)});return d}
 function range(label,key,min,max,step){var d=document.createElement("div");d.className="lq-pf";d.innerHTML="<label></label><input type='range'>";d.firstChild.textContent=label;var r=d.lastChild;r.min=min;r.max=max;r.step=step;r.value=p[key];
  r.addEventListener("input",function(){p[key]=+r.value;savePrefs(p);applyPrefs()});setTimeout(function(){fillRange(r)},0);return d}
 var sw=document.createElement("div");sw.className="lq-pf lq-row2";sw.innerHTML="<span>Reduce animations</span>";var b=document.createElement("button");b.type="button";b.className="sw"+(p.rm?" on":"");b.setAttribute("aria-label","Reduce animations");
 b.onclick=function(){p.rm=p.rm?0:1;b.classList.toggle("on",!!p.rm);savePrefs(p);applyPrefs();if(!p.rm)RM=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches};sw.appendChild(b);
 box.appendChild(seg("Answer length","style",[["short","Short"],["balanced","Balanced"],["detailed","Detailed"]]));
 box.appendChild(seg("Tone","tone",[["casual","Casual"],["friendly","Friendly"],["formal","Formal"]]));
 box.appendChild(range("Text size","fs",14,20,1));box.appendChild(range("Glass strength","glass",40,220,10));box.appendChild(sw);
 pane.appendChild(box)}
function chipTitles(){var bs=document.querySelectorAll(".vchips button");for(var i=0;i<bs.length;i++){var s=bs[i].querySelector("span");if(s&&!bs[i].title){bs[i].title=s.textContent;bs[i].setAttribute("aria-label",s.textContent)}}}
applyPrefs();

/* ================= 3. wiring ================= */
function modalFx(){["installGuide","welcome"].forEach(function(id){var m=document.getElementById(id);if(!m||m._lqM)return;m._lqM=1;var was=m.hidden;
 new MutationObserver(function(){if(m.hidden===was)return;was=m.hidden;if(RM||!m.animate)return;var sh=m.querySelector(".sheet");
  if(!m.hidden){m.animate([{opacity:0},{opacity:1}],{duration:240});if(sh)sh.animate([{opacity:0,transform:"translateY(18px) scale(.94)"},{opacity:1,transform:"none"}],{duration:440,easing:EZ})}
  else{var g=m.cloneNode(true);g.removeAttribute("id");g.querySelectorAll("[id]").forEach(function(e){e.removeAttribute("id")});g.hidden=false;g.style.pointerEvents="none";g.style.animation="none";g.querySelectorAll("*").forEach(function(e){e.style.animation="none";e.style.transition="none"});document.body.appendChild(g);
   g.animate([{opacity:1},{opacity:0}],{duration:CL,easing:"ease-out",fill:"forwards"});var gs=g.querySelector(".sheet");if(gs){gs.style.animation="none";gs.animate([{opacity:1,transform:"none"},{opacity:0,transform:"translateY(18px) scale(.94)"}],{duration:CL,easing:CE,fill:"forwards"})}setTimeout(function(){g.remove()},300)}
 }).observe(m,{attributes:true,attributeFilter:["hidden"]})})}
function dockSync(){
 var d=document.querySelector("#mainChat .dock");if(!d||d._lq)return;d._lq=1;
 var set=function(){document.documentElement.style.setProperty("--lq-dock",d.offsetHeight+"px")};set();
 if(window.ResizeObserver)new ResizeObserver(set).observe(d)}
var HI=["Hi bro, let's start","Yo bro, let's cook","No cap, what we building?","Say less, I'm locked in","Wsg bro, what's the vibe?","Bet, let's get it","Spill it, I'm all ears","Hey fam, let's go","Let's lock in, bro","Big brain time, what's up?"];
var wasEmpty=null;
function greet(){
 var g=document.querySelector(".greeting");if(!g)return;
 var emp=document.body.classList.contains("v-empty"),h=g.querySelector(".lq-hi");
 if(!h){h=document.createElement("div");h.className="lq-hi";g.appendChild(h);h.textContent=HI[0]}
 var bm=document.body.classList.contains("v-build"),BT="Hey bro, tell me what to make";
 if(bm){if(h.textContent!==BT)h.textContent=BT;h._bm=1}else if(h._bm){h._bm=0;h.textContent=HI[0]}
 if(!bm&&emp&&wasEmpty!==true){h.textContent=Math.random()<.4?HI[0]:HI[Math.random()*HI.length|0];h.style.animation="none";void h.offsetWidth;h.style.animation=""}
 wasEmpty=emp}
function fillRange(r){var mn=+r.min||0,mx=r.max===""?100:+r.max||100;r.style.setProperty("--p",((+r.value-mn)/((mx-mn)||1)*100)+"%")}
document.addEventListener("input",function(e){var t=e.target;if(t&&t.type==="range")fillRange(t)},true);
function buildText(){var m=document.getElementById("msg");if(!m)return;var want=document.body.classList.contains("v-build")?"Hey bro, tell me what to make":"Ask Anything";if(m.placeholder!==want)m.placeholder=want}
function scan(){
 buildText();watchMsg();
 var mb=document.getElementById("modeBtn");if(mb&&!mb.getAttribute("aria-label")){mb.setAttribute("aria-label","Model");mb.title="Model"}
 try{settingsList();settingsPopup();prefsUI();chipTitles();modalFx()}catch(e){}greet();var rs=document.querySelectorAll("input[type=range]");for(var k=0;k<rs.length;k++)fillRange(rs[k]);
 if(BEND&&ro){var els=document.querySelectorAll(BENDSEL);
  for(var i=0;i<els.length;i++){var e=els[i];if(e._lqSeen)continue;e._lqSeen=1;e._lqF=1;ro.observe(e);bend(e)}}
 animateIn();dockSync()}
var _m=null;function watchMsg(){var m=document.getElementById("msg");if(m&&m!==_m){_m=m;new MutationObserver(buildText).observe(m,{attributes:true,attributeFilter:["placeholder"]})}}
var queued=false;
function run(){if(queued)return;queued=true;Promise.resolve().then(function(){queued=false;scan()})}
function boot(){
 scan();
 new MutationObserver(function(ms){
  for(var i=0;i<ms.length;i++){var m=ms[i],t=m.target;
   if(t.closest&&t.closest("#msgs,.msgs,#cdLog,#chatList"))continue;
   if(m.type==="attributes"||m.addedNodes.length){run();return}}
 }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["class","hidden"]});
}
if(document.body)boot();else document.addEventListener("DOMContentLoaded",boot);
window.XMM_LIQUID={bend:BEND};
})();
