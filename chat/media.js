/* XMM media: video -> frame sheet (3 fps, max 15 s), AI prompt for video, and Office file export (xlsx / docx / pptx / csv) */
(function(){
var MAXS=15,FPS=3;
function wait(el,ev,ms){return new Promise(function(res,rej){var t=setTimeout(function(){rej(new Error("Video timed out"))},ms||8000);el.addEventListener(ev,function h(){clearTimeout(t);el.removeEventListener(ev,h);res()})})}
/* ---------- VIDEO: extract frames, tile into ONE png ---------- */
async function video(f,cb){
 var url=URL.createObjectURL(f),v=document.createElement("video");
 v.muted=true;v.playsInline=true;v.preload="auto";v.src=url;
 try{
  await wait(v,"loadedmetadata",10000);
  var dur=v.duration;
  if(!isFinite(dur)||dur<=0)throw new Error("Could not read this video");
  if(dur>MAXS+0.25)throw new Error("Video too long: max "+MAXS+" seconds");
  var n=Math.max(1,Math.min(MAXS*FPS,Math.round(dur*FPS)));
  var vw=v.videoWidth||640,vh=v.videoHeight||360;
  var cols=Math.max(1,Math.min(n,Math.ceil(Math.sqrt(n*1.6))));
  var rows=Math.ceil(n/cols);
  var cw=Math.floor(Math.min(2048/cols,vw)),ch=Math.round(cw*vh/vw);
  while(rows*ch>2048&&cw>64){cw=Math.floor(cw*.9);ch=Math.round(cw*vh/vw)}
  var cv=document.createElement("canvas");cv.width=cols*cw;cv.height=rows*ch;
  var x=cv.getContext("2d");x.fillStyle="#000";x.fillRect(0,0,cv.width,cv.height);
  x.font="bold "+Math.max(10,Math.round(cw/16))+"px sans-serif";x.textBaseline="top";
  for(var i=0;i<n;i++){
   var t=Math.min(Math.max(0,dur-0.05),i/FPS);
   v.currentTime=t;await wait(v,"seeked",5000).catch(function(){});
   var cx=(i%cols)*cw,cy=Math.floor(i/cols)*ch;
   x.drawImage(v,cx,cy,cw,ch);
   var lb=t.toFixed(1)+"s",tw=x.measureText(lb).width+8;
   x.fillStyle="rgba(0,0,0,.65)";x.fillRect(cx,cy,tw,Math.round(cw/16)+6);
   x.fillStyle="#fff";x.fillText(lb,cx+4,cy+3);
   if(cb)cb(5+i/n*88)}
  var blob=await new Promise(function(r){cv.toBlob(r,"image/png")});
  var file=new File([blob],(f.name||"video").replace(/\.[^.]+$/,"")+"-frames.png",{type:"image/png"});
  file.xmmGrid=true;
  return{file:file,meta:{frames:n,dur:+dur.toFixed(1),cols:cols,rows:rows,fps:FPS}}
 }finally{URL.revokeObjectURL(url)}
}
/* the prompt the AI receives together with the frames */
function videoPrompt(m,text){
 return"[SYSTEM NOTE: The attached image is NOT a photo. It is a VIDEO, given to you as one picture made of "+m.frames+" frames sampled at "+m.fps+" frames per second from a "+m.dur+" second video. The frames are in time order, left to right then top to bottom ("+m.cols+" columns, "+m.rows+" rows), and each frame has its timestamp in seconds in the corner. Analyze it as a video: describe what happens over time, the motion, actions and changes between frames, and answer the user's request about it. Do not call it a collage or a grid of photos.]\n\nUser request about the video: "+(text||"Describe what happens in this video.")
}
/* ---------- OFFICE: tell the AI how to answer so the app can build real files ---------- */
var OFF=/\b(excel|xlsx?|spreadsheets?|csv|docx?|ms word|microsoft word|word (file|doc|document)|power ?point|pptx?|ppt|slides?|slideshow|office)\b/i;
function fileHint(text){
 if(!OFF.test(String(text||"")))return"";
 return"\n\n[SYSTEM NOTE: The user wants an Office file. Read any attached image carefully and transcribe ALL its data exactly. Reply with one short intro line and then exactly ONE fenced block ```xmm-office followed by valid JSON and ```. JSON shape: {\"type\":\"xlsx|csv|docx|pptx\",\"name\":\"file-name-without-extension\",\"sheets\":[{\"name\":\"Sheet1\",\"headers\":[\"A\",\"B\"],\"rows\":[[\"1\",\"2\"]]}]} for xlsx/csv; {\"type\":\"docx\",\"name\":\"...\",\"title\":\"...\",\"blocks\":[{\"h\":\"Heading\"},{\"p\":\"Paragraph\"},{\"ul\":[\"item\"]},{\"table\":{\"headers\":[],\"rows\":[[]]}}]} for Word; {\"type\":\"pptx\",\"name\":\"...\",\"slides\":[{\"title\":\"...\",\"bullets\":[\"...\"]}]} for PowerPoint. Never describe the block in plain text.]"
}
function lib(src,ok){
 if(ok())return Promise.resolve();
 return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=function(){rej(new Error("Could not load Office library (check internet)"))};document.head.appendChild(s)})
}
function dl(blob,name){var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500)}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function tbl(t){t=t||{};var h=t.headers||[],r=t.rows||[];return"<table border='1' cellspacing='0' cellpadding='4' style='border-collapse:collapse'>"+(h.length?"<tr>"+h.map(function(x){return"<th style='background:#eee'>"+esc(x)+"</th>"}).join("")+"</tr>":"")+r.map(function(row){return"<tr>"+row.map(function(c){return"<td>"+esc(c)+"</td>"}).join("")+"</tr>"}).join("")+"</table>"}
function sheets(c){return(c.sheets&&c.sheets.length?c.sheets:[{name:"Sheet1",headers:c.headers,rows:c.rows}])}
function num(v){if(typeof v==="string"&&/^-?\d+(\.\d+)?$/.test(v.trim()))return+v;return v}
async function build(c){
 var type=String(c.type||"xlsx").toLowerCase().replace(/^\./,""),base=String(c.name||"xmm-file").replace(/[\\\/:*?"<>|]+/g,"-").replace(/\.(xlsx?|csv|docx?|pptx?)$/i,"");
 if(type==="xls")type="xlsx";if(type==="doc")type="docx";if(type==="ppt")type="pptx";
 var S=sheets(c);
 if(type==="csv"){
  var s=S[0],rows=(s.headers&&s.headers.length?[s.headers]:[]).concat(s.rows||[]);
  var out=rows.map(function(r){return r.map(function(v){v=String(v==null?"":v);return/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(",")}).join("\r\n");
  return{blob:new Blob(["\ufeff"+out],{type:"text/csv"}),name:base+".csv"}}
 if(type==="docx"){
  var b=c.blocks||[];if(!b.length&&c.paragraphs)b=c.paragraphs.map(function(p){return{p:p}});
  if(!b.length)b=[].concat.apply([],S.map(function(s){return[{h:s.name},{table:s}]}));
  var html="<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>"+esc(c.title||base)+"</title></head><body style='font-family:Calibri,Arial,sans-serif'>"+(c.title?"<h1>"+esc(c.title)+"</h1>":"")+b.map(function(k){
   if(k.h)return"<h2>"+esc(k.h)+"</h2>";if(k.ul)return"<ul>"+k.ul.map(function(i){return"<li>"+esc(i)+"</li>"}).join("")+"</ul>";if(k.table)return tbl(k.table);return"<p>"+esc(k.p||k.text||"")+"</p>"}).join("")+"</body></html>";
  return{blob:new Blob(["\ufeff",html],{type:"application/msword"}),name:base+".doc"}}
 if(type==="pptx"){
  await lib("https://cdnjs.cloudflare.com/ajax/libs/pptxgenjs/3.12.0/pptxgen.bundle.js",function(){return window.PptxGenJS});
  var p=new PptxGenJS(),sl=c.slides||[];if(!sl.length)sl=[{title:c.title||base,bullets:[]}];
  sl.forEach(function(s){var d=p.addSlide();d.addText(String(s.title||""),{x:.5,y:.3,w:9,h:.9,fontSize:30,bold:true,color:"1F2937"});
   if(s.bullets&&s.bullets.length)d.addText(s.bullets.map(function(t){return{text:String(t),options:{bullet:true,breakLine:true}}}),{x:.7,y:1.4,w:8.6,h:4,fontSize:20,color:"374151",valign:"top"});
   else if(s.text)d.addText(String(s.text),{x:.7,y:1.4,w:8.6,h:4,fontSize:20,color:"374151",valign:"top"});
   if(s.table){var th=(s.table.headers||[]).map(function(h){return{text:String(h),options:{bold:true,fill:{color:"E5E7EB"}}}}),tr=(s.table.rows||[]).map(function(r){return r.map(function(v){return{text:String(v)}})});d.addTable((th.length?[th]:[]).concat(tr),{x:.5,y:1.4,w:9,fontSize:14})}});
  var pb=await p.write({outputType:"blob"});
  return{blob:pb,name:base+".pptx"}}
 await lib("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",function(){return window.XLSX});
 var wb=XLSX.utils.book_new(),used={};
 S.forEach(function(s,i){var nm=String(s.name||"Sheet"+(i+1)).replace(/[\\\/?*\[\]:]/g,"").slice(0,28)||"Sheet"+(i+1);while(used[nm])nm=nm.slice(0,25)+"-"+(i+1);used[nm]=1;
  var aoa=(s.headers&&s.headers.length?[s.headers]:[]).concat((s.rows||[]).map(function(r){return r.map(num)}));
  var ws=XLSX.utils.aoa_to_sheet(aoa);ws["!cols"]=(aoa[0]||[]).map(function(_,ci){var w=8;aoa.forEach(function(r){var l=String(r[ci]==null?"":r[ci]).length;if(l>w)w=l});return{wch:Math.min(w+2,60)}});
  XLSX.utils.book_append_sheet(wb,ws,nm)});
 var arr=XLSX.write(wb,{bookType:"xlsx",type:"array"});
 return{blob:new Blob([arr],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),name:base+".xlsx"}
}
document.addEventListener("click",function(e){
 var b=e.target.closest&&e.target.closest("[data-xw=odl]");if(!b)return;
 e.preventDefault();e.stopPropagation();
 var w=b.closest(".xw"),c={};try{c=JSON.parse(w.dataset.cfg||"{}")}catch(_){}
 var old=b.textContent;b.textContent="Building…";b.disabled=true;
 build(c).then(function(r){dl(r.blob,r.name);b.textContent="Downloaded ✓"}).catch(function(err){b.textContent="Failed";try{XMM_API.toast(err.message||"Could not build file")}catch(_){}}).then(function(){setTimeout(function(){b.textContent=old;b.disabled=false},2200)})
},true);
window.XMM_MEDIA={video:video,videoPrompt:videoPrompt,fileHint:fileHint,build:build};
})();
