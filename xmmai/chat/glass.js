/* Liquid glass engine.
   - Chromium (Chrome, Edge, Brave, Opera, Android Chrome): real refraction. A displacement map is
     drawn for each glass element's exact size and fed to an SVG filter used as backdrop-filter, so
     whatever is behind the glass is truly bent at the rim.
   - Safari / Firefox / iOS: SVG backdrop filters are not supported there, so they get the same shape,
     blur, saturation, specular rim and a faked lens falloff from pure CSS. */
(function(){
"use strict";
var ua=navigator.userAgent||"";
var chromium=/(Chrome|Chromium)\//.test(ua)&&!/(CriOS|FxiOS|Firefox|Edge\/\d)/.test(ua);
var okCSS=window.CSS&&CSS.supports&&(CSS.supports("backdrop-filter","blur(1px)")||CSS.supports("-webkit-backdrop-filter","blur(1px)"));
var lowEnd=navigator.deviceMemory&&navigator.deviceMemory<=2;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-transparency: reduce)").matches;
var BEND=chromium&&okCSS&&!lowEnd&&!reduce;
document.documentElement.classList.add(BEND?"lg-bend":"lg-css");

var GLASS="",BENDSEL=""; /* glass now lives in liquid.css / liquid.js */
var NS="http://www.w3.org/2000/svg",XL="http://www.w3.org/1999/xlink";
var svg,cache=new Map(),MAX=48;

function ensureSvg(){
 if(svg&&svg.isConnected)return svg;
 svg=document.createElementNS(NS,"svg");
 svg.setAttribute("width","0");svg.setAttribute("height","0");
 svg.setAttribute("aria-hidden","true");
 svg.style.cssText="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
 svg.appendChild(document.createElementNS(NS,"defs"));
 document.body.appendChild(svg);return svg;
}

/* Displacement map for a rounded rect: pixels near the rim point inward, strength rising to the edge. */
function makeMap(w,h,r,bezel){
 var c=document.createElement("canvas");c.width=w;c.height=h;
 var x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data;
 var cx=w/2,cy=h/2,hx=w/2-r,hy=h/2-r;
 for(var j=0;j<h;j++)for(var i=0;i<w;i++){
  var px=i+.5-cx,py=j+.5-cy,qx=Math.abs(px)-hx,qy=Math.abs(py)-hy;
  var ox=Math.max(qx,0),oy=Math.max(qy,0),out=Math.sqrt(ox*ox+oy*oy);
  var sd=out+Math.min(Math.max(qx,qy),0)-r;          /* <0 inside */
  var depth=-sd,nx=0,ny=0;
  if(qx>0||qy>0){nx=ox*(px<0?-1:1)/(out||1);ny=oy*(py<0?-1:1)/(out||1)}
  else if(qx>qy){nx=px<0?-1:1}else{ny=py<0?-1:1}
  var vx=0,vy=0;
  if(depth>=0&&depth<bezel){
   var t=1-depth/bezel,m=t*t*(3-2*t);                 /* smoothstep: 0 inside, 1 at the rim */
   m=Math.pow(m,1.35);
   vx=-nx*m;vy=-ny*m;                                 /* sample from further inside */
  }
  var k=(j*w+i)*4;
  d[k]=Math.round(127.5+vx*127);d[k+1]=Math.round(127.5+vy*127);d[k+2]=128;d[k+3]=255;
 }
 x.putImageData(im,0,0);return c.toDataURL("image/png");
}

function filterFor(w,h,r){
 var key=w+"x"+h+"r"+r,hit=cache.get(key);
 if(hit){cache.delete(key);cache.set(key,hit);return hit}
 var bezel=Math.max(6,Math.min(18,Math.min(w,h)*.5)),scale=Math.round(bezel*2.2);
 var id="lgf"+(Math.random()*1e9|0).toString(36),url=makeMap(w,h,r,bezel);
 var f=document.createElementNS(NS,"filter");
 f.setAttribute("id",id);f.setAttribute("filterUnits","userSpaceOnUse");f.setAttribute("primitiveUnits","userSpaceOnUse");
 f.setAttribute("x","0");f.setAttribute("y","0");f.setAttribute("width",w);f.setAttribute("height",h);
 f.setAttribute("color-interpolation-filters","sRGB");
 var b=document.createElementNS(NS,"feGaussianBlur");b.setAttribute("in","SourceGraphic");b.setAttribute("stdDeviation","1.6");b.setAttribute("result","bl");
 var im=document.createElementNS(NS,"feImage");im.setAttribute("href",url);im.setAttributeNS(XL,"href",url);
 ["x","y"].forEach(function(a){im.setAttribute(a,"0")});im.setAttribute("width",w);im.setAttribute("height",h);
 im.setAttribute("preserveAspectRatio","none");im.setAttribute("result","map");
 var dm=document.createElementNS(NS,"feDisplacementMap");
 dm.setAttribute("in","bl");dm.setAttribute("in2","map");dm.setAttribute("scale",scale);
 dm.setAttribute("xChannelSelector","R");dm.setAttribute("yChannelSelector","G");
 f.appendChild(b);f.appendChild(im);f.appendChild(dm);
 ensureSvg().firstChild.appendChild(f);
 var rec={id:id,node:f};cache.set(key,rec);
 while(cache.size>MAX){var o=cache.keys().next().value,ov=cache.get(o);cache.delete(o);ov.node.remove()}
 return rec;
}

function bend(el){
 if(!el.isConnected)return;
 var w=Math.round(el.offsetWidth/2)*2,h=Math.round(el.offsetHeight/2)*2;
 if(w<8||h<8)return;
 var r=parseFloat(getComputedStyle(el).borderTopLeftRadius)||h/2;r=Math.round(Math.min(r,w/2,h/2));
 var v="url(#"+filterFor(w,h,r).id+") saturate(1.7) brightness(1.1)";
 el.style.setProperty("backdrop-filter",v,"important");el.style.setProperty("-webkit-backdrop-filter",v,"important");el.dataset.bent="1";
}

var ro=BEND&&window.ResizeObserver?new ResizeObserver(function(es){
 es.forEach(function(e){var t=e.target;clearTimeout(t._lgT);t._lgT=setTimeout(function(){bend(t)},t._lgFirst?0:90);t._lgFirst=0});
}):null;

function scan(root){
 if(GLASS)root.querySelectorAll(GLASS).forEach(function(el){el.classList.add("lg")});
 var seg=root.querySelector("#code .seg");
 if(seg&&!seg.querySelector(".lg-thumb")){var t=document.createElement("i");t.className="lg-thumb";seg.insertBefore(t,seg.firstChild)}
 if(!BEND||!BENDSEL)return;
 root.querySelectorAll(BENDSEL).forEach(function(el){
  if(el._lgSeen)return;el._lgSeen=1;el._lgFirst=1;ro.observe(el);
 });
}

/* keep the scroll area clear of the floating composer, whatever height it grows to */
function dock(root){
 var d=root.querySelector(".cd-dock"),l=root.querySelector(".cd-l");
 if(!d||!l||d._lgD||!window.ResizeObserver)return;d._lgD=1;
 new ResizeObserver(function(){l.style.setProperty("--dock-h",d.offsetHeight+"px")}).observe(d);
}

var timer=0;
function run(){if(timer)return;timer=setTimeout(function(){timer=0;scan(document);var c=document.getElementById("code");if(c)dock(c)},120)}
function boot(){
 run();
 new MutationObserver(function(ms){
  for(var i=0;i<ms.length;i++){var t=ms[i].target;
   if(t.closest&&t.closest("#cdLog,.msgs,#chatList"))continue;run();return}
 }).observe(document.body,{childList:true,subtree:true});
}
if(document.body)boot();else document.addEventListener("DOMContentLoaded",boot);
window.XMM_GLASS={bend:BEND};
})();
