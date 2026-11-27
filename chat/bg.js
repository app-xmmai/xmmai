/* bg.js: full-screen interactive space background — rotating elliptical star rings + core, like the login galaxy.
   Hover = stars drift away from the cursor, press/drag = strong push + swirl, mouse/tilt = parallax.
   Drag stars on the empty background 3 times -> unlocks XMMGPT-7 Galaxy. */
(function(){"use strict";
var old=document.getElementById("xmmBg");if(old)old.remove();
var cv=document.createElement("canvas");cv.id="xmmBg";document.body.insertBefore(cv,document.body.firstChild);
var x=cv.getContext("2d"),W=0,H=0,D=1,PI2=Math.PI*2,rnd=Math.random,P=[],F=[],O=[],SH=[],T0=performance.now(),raf=0;
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var ptr={x:-999,y:-999,down:false,moved:0,counted:false,pushed:false,hover:false},par={x:0,y:0,tx:0,ty:0};
var KEY="xmm.gal.n";
function gal(){try{return +localStorage.getItem(KEY)||0}catch(e){return 0}}
function size(){D=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0);
 var area=W*H,n=Math.round(Math.max(1800,Math.min(3000,area/420)));
 P=[];
 /* rings: many concentric ellipses that fill the whole screen (like the reference), plus a dense core */
 var rings=20;
 for(var i=0;i<n;i++){
  var core=rnd()<.2,r,th;
  if(core){r=Math.pow(rnd(),2.2)*.22;th=rnd()*PI2}
  else{var k=Math.floor(Math.pow(rnd(),.85)*rings);r=.1+(k/rings)*.98+(rnd()-.5)*.006;th=rnd()*PI2;
   /* faint spiral twist so rings feel alive */ th+=r*1.3}
  P.push({r:r,th:th,w:(.05/(.12+r))*(rnd()<.5?1:1),dx:0,dy:0,vx:0,vy:0,s:.55+rnd()*1.15+(rnd()<.05?1.1:0),p:rnd()*PI2,v:.5+rnd()*2.2,c:rnd()<.2?"#bcd4ff":"#fff"})}
 F=[];for(var j=0;j<Math.round(area/2200);j++)F.push({hx:rnd()*W,hy:rnd()*H,dx:0,dy:0,vx:0,vy:0,s:.35+rnd()*1.1,p:rnd()*PI2,v:.4+rnd()*2.2,dr:(rnd()-.5)*.01,z:.2+rnd()*.8});
 O=[];for(var k2=0;k2<16;k2++)O.push({u:rnd(),v:.00006+rnd()*.00006,o:6+rnd()*14,s:.8+rnd()*1.4,p:rnd()*PI2})}
function bubble(){var l=document.querySelectorAll("#msgs .m-bot>.body");if(!l.length)return null;var b=l[l.length-1].getBoundingClientRect();
 if(b.width<20||b.bottom<0||b.top>H)return null;return b}
/* pointer force: gentle repel on hover, strong push + swirl while pressed */
function force(o){var ex=o.px-ptr.x,ey=o.py-ptr.y,d2=ex*ex+ey*ey;
 if(ptr.down){if(d2<32400&&d2>1){var d=Math.sqrt(d2),f=(1-d/180)*2.4;o.vx+=ex/d*f-ey/d*f*.6;o.vy+=ey/d*f+ex/d*f*.6;ptr.pushed=true}}
 else if(ptr.hover&&d2<19600&&d2>1){var d3=Math.sqrt(d2),g=(1-d3/140)*.55;o.vx+=ex/d3*g;o.vy+=ey/d3*g}}
function phys(o){o.dx+=o.vx;o.dy+=o.vy;o.vx*=.9;o.vy*=.9;o.vx-=o.dx*.012;o.vy-=o.dy*.012}
function frame(now){raf=requestAnimationFrame(frame);if(document.hidden)return;
 var t=(now-T0)/1000;x.clearRect(0,0,W,H);
 par.x+=(par.tx-par.x)*.05;par.y+=(par.ty-par.y)*.05;
 var cx=W/2+par.x*-18,cy=H*.48+par.y*-14,R=Math.max(W,H)*.5,tilt=.62,rot=-.32,cr=Math.cos(rot),sr=Math.sin(rot);
 /* core glow (pulses) */
 var gr=Math.min(W,H)*.5*(1+.03*Math.sin(t*1.2)),g=x.createRadialGradient(cx,cy,0,cx,cy,gr);
 g.addColorStop(0,"rgba(190,210,255,.26)");g.addColorStop(.45,"rgba(110,130,210,.09)");g.addColorStop(1,"rgba(0,0,0,0)");
 x.globalAlpha=1;x.fillStyle=g;x.fillRect(0,0,W,H);
 /* far stars (parallax, twinkle) */
 x.fillStyle="#fff";
 for(var i=0;i<F.length;i++){var f=F[i];f.hx+=f.dr;if(f.hx>W+5)f.hx=-5;if(f.hx<-5)f.hx=W+5;
  f.px=f.hx+f.dx+par.x*f.z*-10;f.py=f.hy+f.dy+par.y*f.z*-10;force(f);phys(f);
  x.globalAlpha=.25+.75*Math.abs(Math.sin(t*f.v+f.p));var fs=f.s*1.1;x.fillRect(f.px-fs/2,f.py-fs/2,fs,fs)}
 /* galaxy: elliptical rings rotating at different speeds */
 for(i=0;i<P.length;i++){var p=P[i],a=p.th+p.w*t*(reduce?0:1),X=Math.cos(a)*p.r*R,Z=Math.sin(a)*p.r*R*tilt;
  p.px=cx+X*cr-Z*sr+p.dx;p.py=cy+X*sr+Z*cr+p.dy;
  if(p.px<-30||p.px>W+30||p.py<-30||p.py>H+30){p.vx*=.9;p.vy*=.9;continue}
  force(p);phys(p);
  x.globalAlpha=Math.min(1,(.3+.7*Math.abs(Math.sin(t*p.v+p.p)))*(1.1-p.r*.35));x.fillStyle=p.c;var ps=p.s*(1.15-p.r*.3)*1.5;x.fillRect(p.px-ps/2,p.py-ps/2,ps,ps)}
 /* shooting stars */
 if(!reduce&&rnd()<.004){var dd=rnd()<.5?1:-1;SH.push({x:dd>0?rnd()*W*.5:W*.5+rnd()*W*.5,y:rnd()*H*.4,vx:dd*(7+rnd()*5),vy:2.5+rnd()*3,l:1})}
 for(i=SH.length-1;i>=0;i--){var s=SH[i];s.x+=s.vx;s.y+=s.vy;s.l-=.018;
  var gg=x.createLinearGradient(s.x,s.y,s.x-s.vx*10,s.y-s.vy*10);gg.addColorStop(0,"rgba(255,255,255,"+Math.max(0,s.l)+")");gg.addColorStop(1,"rgba(255,255,255,0)");
  x.globalAlpha=1;x.strokeStyle=gg;x.lineWidth=1.6;x.beginPath();x.moveTo(s.x,s.y);x.lineTo(s.x-s.vx*10,s.y-s.vy*10);x.stroke();if(s.l<=0)SH.splice(i,1)}
 x.globalAlpha=1}
/* interaction */
function empty(e){var t=e.target;if(!t||!t.closest)return false;
 if(t.closest("button,a,input,textarea,select,label,.composer,.dock,.topbar,#sideChat,#clDrawer,.sheet,.modal,.m-bot,.m-user,.m-uw,.sunpop,pre,[contenteditable]"))return false;
 return !!t.closest("#viewChat,#mainChat,.convo,.msgs,body")}
addEventListener("pointermove",function(e){par.tx=e.clientX/W*2-1;par.ty=e.clientY/H*2-1;
 if(ptr.down){ptr.moved+=Math.abs(e.clientX-ptr.x)+Math.abs(e.clientY-ptr.y);if(!ptr.counted&&ptr.moved>70&&ptr.pushed){ptr.counted=true;hit()}}
 ptr.x=e.clientX;ptr.y=e.clientY;ptr.hover=e.pointerType==="mouse"&&empty(e)},{passive:true});
addEventListener("pointerdown",function(e){if(!empty(e))return;ptr.down=true;ptr.x=e.clientX;ptr.y=e.clientY;ptr.moved=0;ptr.counted=false;ptr.pushed=false},{passive:true});
function up(){ptr.down=false;ptr.hover=false;ptr.x=ptr.y=-999}
addEventListener("pointerup",function(e){ptr.down=false;if(e.pointerType!=="mouse"){ptr.x=ptr.y=-999}},{passive:true});
addEventListener("pointercancel",up,{passive:true});document.addEventListener("pointerleave",up);
addEventListener("deviceorientation",function(e){if(e.gamma==null)return;par.tx=Math.max(-1,Math.min(1,e.gamma/30));par.ty=Math.max(-1,Math.min(1,(e.beta-45)/30))},{passive:true});
function hit(){var n=gal()+1;try{localStorage.setItem(KEY,String(n))}catch(e){}
 if(n>=3&&window.XMM_SUN&&!XMM_SUN.galOk())XMM_SUN.unlockGalaxy()}
addEventListener("resize",size);size();raf=requestAnimationFrame(frame);
})();
