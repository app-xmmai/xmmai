/* AI header images for boxes (quiz, recipe, compare, checklist...). Keyless community generators, rotating, queued. */
(function(){
var DEF=[
 {name:"FLUX Space",type:"gradio",base:"https://black-forest-labs-flux-1-schnell.hf.space",fn:"infer"},
 {name:"ZSky",type:"post",url:"https://api.zsky.ai/v1/generate"}],P=null,ST=[];
function getP(){if(P)return P;var C=(window.XMM_API&&window.XMM_API.CFG)||{};P=C.IMG_AI&&C.IMG_AI.length?C.IMG_AI:DEF;ST=P.map(function(){return{until:0}});return P}
var SKIP=/^(video|place|weather|timer|image|preview|img|carousel|images|gallery|chart|code|skel|fail|map|currency|calendar|confirm|suggest|sources|writing|form|expand)$/;
var rot=0,Q=[],run=0,lastStart=0,MEM={},KEY="xmm.boxImg";
try{MEM=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){MEM={}}
function save(){try{var k=Object.keys(MEM);if(k.length>60)k.slice(0,k.length-60).forEach(function(x){delete MEM[x]});localStorage.setItem(KEY,JSON.stringify(MEM))}catch(e){}}
function tmo(ms){var c=new AbortController(),t=setTimeout(function(){c.abort()},ms);return{s:c.signal,d:function(){clearTimeout(t)}}}
function pickUrl(j){if(!j)return"";var u=j.url||j.image_url||j.image||j.output||(j.data&&(j.data[0]&&(j.data[0].url||j.data[0].b64_json&&"data:image/png;base64,"+j.data[0].b64_json)))||(j.images&&j.images[0])||j.b64_json&&"data:image/png;base64,"+j.b64_json||"";if(u&&typeof u==="object")u=u.url||"";return String(u)}
async function viaGradio(p,prompt){var t=tmo(60000);try{
 var r=await fetch(p.base+"/gradio_api/call/"+p.fn,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:[prompt,0,true,768,384,4]}),signal:t.s});if(!r.ok)throw new Error("HTTP "+r.status);
 var id=(await r.json()).event_id;if(!id)throw new Error("no event");
 var tx=await (await fetch(p.base+"/gradio_api/call/"+p.fn+"/"+id,{signal:t.s})).text();var m=tx.match(/event: complete\s*\ndata: (.*)/);if(!m)throw new Error("no image");
 var d=JSON.parse(m[1]),o=d&&d[0],u=o&&(o.url||(o.path&&p.base+"/gradio_api/file="+o.path));if(!u)throw new Error("no url");return u}finally{t.d()}}
async function viaPost(p,prompt){var t=tmo(45000);try{
 var r=await fetch(p.url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:prompt,width:768,height:384}),signal:t.s});if(!r.ok){var e=new Error("HTTP "+r.status);e.status=r.status;throw e}
 var ct=r.headers.get("content-type")||"";if(/^image\//.test(ct))return URL.createObjectURL(await r.blob());var u=pickUrl(await r.json());if(!u)throw new Error("no url");return u}finally{t.d()}}
async function gen(prompt){var P=getP(),n=P.length;
 for(var k=0;k<n;k++){var i=(rot+k)%n;if(ST[i].until>Date.now())continue;rot=(i+1)%n;
  try{var u=P[i].type==="gradio"?await viaGradio(P[i],prompt):await viaPost(P[i],prompt);return u}
  catch(e){var c=e&&e.status;ST[i].until=Date.now()+((c===404||c===401||c===403)?600000:c===429?90000:60000)}}
 return""}
function pump(){if(run>=1||!Q.length)return;var wait=Math.max(0,lastStart+8000-Date.now());if(wait){setTimeout(pump,wait);return}
 var job=Q.shift();run++;lastStart=Date.now();
 gen(job.prompt).then(function(u){if(u){MEM[job.prompt]=u;save()}job.cb(u)}).catch(function(){job.cb("")}).then(function(){run--;pump()})}
function ask(prompt,cb){if(Q.some(function(j){return j.prompt===prompt}))return;if(Q.length>=4)Q.shift().cb("");Q.push({prompt:prompt,cb:cb});pump()}
function titleOf(b){var c={};try{c=JSON.parse(b.getAttribute("data-cfg")||"{}")}catch(e){}var t=c.title||c.name||c.topic||c.q||"";if(!t){var h=b.querySelector(".xw-h b");t=h?h.textContent:""}return String(t||"").replace(/\s+/g," ").trim().slice(0,80)}
function setImg(box,url,ban){if(!url){ban.remove();return}var im=new Image();im.onload=function(){ban.style.backgroundImage='url("'+url.replace(/"/g,"%22")+'")';ban.classList.add("ok")};im.onerror=function(){ban.remove();for(var k in MEM)if(MEM[k]===url){delete MEM[k];save()}};im.src=url}
function latest(box){var m=box.closest(".m-bot");if(!m)return false;var all=document.querySelectorAll("#msgs .m-bot");return all[all.length-1]===m}
function scan(){var bs=document.querySelectorAll(".xw[data-xw-t]:not([data-aib])");[].forEach.call(bs,function(b){var ty=b.getAttribute("data-xw-t");if(SKIP.test(ty)){b.setAttribute("data-aib","0");return}
 var t=titleOf(b);if(t.length<3){b.setAttribute("data-aib","0");return}
 var prompt=t+", "+ty+" theme, soft digital illustration, clean composition, no text, no letters, no watermark";
 var hit=MEM[prompt];if(!hit&&!latest(b))return;b.setAttribute("data-aib","1");
 var ban=document.createElement("div");ban.className="xw-ai";b.insertBefore(ban,b.firstChild);
 if(hit)setImg(b,hit,ban);else ask(prompt,function(u){if(ban.isConnected)setImg(b,u,ban);else if(u){MEM[prompt]=u}})})}
var tm=0;new MutationObserver(function(){if(tm)return;tm=setTimeout(function(){tm=0;scan()},250)}).observe(document.body,{childList:true,subtree:true});
setTimeout(scan,500);
window.XMM_BOXIMG={gen:gen,queue:ask,get providers(){return getP()}};
})();
