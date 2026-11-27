/* space.js: login background = real space. Scattered stars fall into a cluster, then open into a rotating spiral galaxy. */
(()=>{
"use strict";
const L=document.getElementById("login"),cv=document.getElementById("lgSpace");if(!L||!cv)return;
const x=cv.getContext("2d");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd=Math.random,PI2=Math.PI*2;
const gauss=()=>(rnd()+rnd()+rnd()+rnd()-2)/2;
const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const COL=["#ffffff","#ffffff","#c4f6ff","#7fe8ee","#9cc8ff","#aaffee","#d2b4ff"];
let W=0,H=0,D=1,cx=0,cy=0,R=0,P=[],B=[],SH=[],raf=0,T0=0;

function size(){
  D=Math.min(devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*D;cv.height=H*D;x.setTransform(D,0,0,D,0,0);
  cx=W/2;cy=H*.5;R=Math.min(W*.48,H*.46);
  const n=Math.round(clamp(W*H/500,1800,4000));P=[];
  for(let i=0;i<n;i++){
    let r,th;
    if(rnd()<.2){r=Math.pow(rnd(),1.6)*.24;th=rnd()*PI2}
    else{r=.06+Math.pow(rnd(),.75)*.94;th=(rnd()<.5?0:Math.PI)+r*5.2;th+=gauss()*(.1+.22*(1-r));r=clamp(r+gauss()*.025,.02,1.02)}
    const a=rnd()*PI2,rr=Math.sqrt(rnd())*.2*R,big=rnd()<.07;
    P.push({r,th,py:gauss()*.05*(1-r*.6),w:.075/(.1+r)+.04,
      sx:rnd(),sy:rnd(),ox:Math.cos(a)*rr,oy:Math.sin(a)*rr,
      s:big?2.4+rnd()*1.8:1.1+rnd()*1.1,c:COL[(rnd()*COL.length)|0],p:rnd()*PI2,v:.8+rnd()*2.2})}
  B=[];for(let i=0;i<Math.round(W*H/5000);i++)B.push({x:rnd()*W,y:rnd()*H,s:.4+rnd()*.7,p:rnd()*PI2,v:.4+rnd()*1.6})}

function frame(now){
  if(L.hidden||L.classList.contains("out")){raf=0;return}
  const t=(now-T0)/1000;
  const A=reduce?1:ease(clamp(t/2.6)),Bp=reduce?1:ease(clamp((t-2.4)/3.4));
  const phi=.45+.3*(1+Math.sin(t*.26-1)),cph=Math.cos(phi),sph=Math.sin(phi),rho=.55*Math.sin(t*.13)-.25,cr=Math.cos(rho),sr=Math.sin(rho);
  x.globalCompositeOperation="source-over";x.globalAlpha=1;x.clearRect(0,0,W,H);
  x.globalCompositeOperation="lighter";
  /* faint far stars */
  x.fillStyle="#cfeeff";
  for(const b of B){x.globalAlpha=.15+.35*Math.abs(Math.sin(t*b.v+b.p));x.fillRect(b.x,b.y,b.s,b.s)}
  /* disk haze + core glow */
  if(Bp>0){x.save();x.translate(cx,cy);x.rotate(rho);x.scale(1,.35+.65*cph);
    const hz=x.createRadialGradient(0,0,0,0,0,R*1.05);hz.addColorStop(0,"rgba(80,200,210,"+(.16*Bp)+")");hz.addColorStop(1,"rgba(0,0,0,0)");
    x.globalAlpha=1;x.fillStyle=hz;x.fillRect(-R*1.1,-R*1.1,R*2.2,R*2.2);x.restore()}
  const k=.25*A+.75*Bp,rad=R*(.1+.2*Bp)*(1+.04*Math.sin(t*1.4)),g=x.createRadialGradient(cx,cy,0,cx,cy,rad);
  g.addColorStop(0,"rgba(255,255,255,"+(.95*k)+")");g.addColorStop(.15,"rgba(220,250,255,"+(.55*k)+")");g.addColorStop(.45,"rgba(90,200,220,"+(.18*k)+")");g.addColorStop(1,"rgba(0,0,0,0)");
  x.globalAlpha=1;x.fillStyle=g;x.fillRect(cx-rad,cy-rad,rad*2,rad*2);
  /* galaxy particles */
  for(const p of P){
    const ang=p.th+p.w*t,X=p.r*Math.cos(ang)*R,Z=p.r*Math.sin(ang)*R,Y=p.py*R;
    const sy=Z*cph+Y*sph,dep=Z*sph-Y*cph,gx=cx+X*cr-sy*sr,gy=cy+X*sr+sy*cr;
    let px=p.sx*W,py=p.sy*H;
    px+=(cx+p.ox-px)*A;py+=(cy+p.oy-py)*A;
    px+=(gx-px)*Bp;py+=(gy-py)*Bp;
    const s=p.s*(1+dep/(R*4)),a=clamp((.5+.5*Math.sin(t*p.v+p.p))*(.55+.45*(1-p.r*.5)),.12,1);
    x.globalAlpha=a;x.fillStyle=p.c;
    if(s>1.6){x.beginPath();x.arc(px,py,s*.6,0,PI2);x.fill()}else x.fillRect(px-s/2,py-s/2,s,s)}
  /* shooting stars */
  if(!reduce&&t>5&&rnd()<.007){const d=rnd()<.5?1:-1;SH.push({x:d>0?rnd()*W*.5:W*.5+rnd()*W*.5,y:rnd()*H*.4,vx:d*(7+rnd()*5),vy:2.5+rnd()*3,l:1})}
  for(let i=SH.length-1;i>=0;i--){const s=SH[i];s.x+=s.vx;s.y+=s.vy;s.l-=.018;
    const gr=x.createLinearGradient(s.x,s.y,s.x-s.vx*10,s.y-s.vy*10);gr.addColorStop(0,"rgba(190,250,255,"+s.l+")");gr.addColorStop(1,"rgba(60,200,220,0)");
    x.globalAlpha=1;x.strokeStyle=gr;x.lineWidth=1.8;x.beginPath();x.moveTo(s.x,s.y);x.lineTo(s.x-s.vx*10,s.y-s.vy*10);x.stroke();
    if(s.l<=0)SH.splice(i,1)}
  raf=requestAnimationFrame(frame)}

function go(){if(!raf&&!L.hidden&&!L.classList.contains("out")){size();T0=performance.now();raf=requestAnimationFrame(frame)}}
addEventListener("resize",()=>{if(!L.hidden)size()});
new MutationObserver(go).observe(L,{attributes:true,attributeFilter:["hidden","class"]});
go();
})();
