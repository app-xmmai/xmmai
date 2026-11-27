/* Place picker: up to 5 results, ranked by closeness + fame; tap one to get the map + Directions. */
(function(){
var CACHE={},POS=null,POSP=null;
var CAT=/(schools?|universit|college|hospital|pharmac|restaurant|cafe|supermarket|bank\b|atm\b|gas station|petrol|mosque|church|park\b|hotel|airport|station|clinic|dentist|library|gym\b|bakery|mall\b|kindergarten|market)|مدرسه|دبستان|دبیرستان|دانشگاه|بیمارستان|داروخانه|رستوران|بانک|مسجد|پارک|هتل|Schule|\u00e9cole|escuela/i;
var NEAR=/near me|nearby|closest|nearest|around me|close to me|around here|\u0646\u0632\u062f\u06cc\u06a9|\u0627\u0637\u0631\u0627\u0641/i;
var CASP=/caspian\s*mall|caspian\s*complex|کاسپین\s*مال|مجتمع\s*(تجاری\s*)?کاسپین|کاسپین\s*انزلی/i;
var ANZ=[49.30,37.58,49.66,37.34]; /* Bandar Anzali box: left,top,right,bottom */
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function getPos(){if(POS)return Promise.resolve(POS);if(POSP)return POSP;
 POSP=new Promise(function(res){if(!navigator.geolocation)return res(null);var done=0,f=function(p){if(done)return;done=1;res(p)};setTimeout(function(){f(null)},3000);
  try{navigator.geolocation.getCurrentPosition(function(p){POS=[p.coords.latitude,p.coords.longitude];f(POS)},function(){f(null)},{maximumAge:900000,timeout:2900})}catch(e){f(null)}});return POSP}
function hav(a,b){var r=Math.PI/180,dl=(b[0]-a[0])*r,dg=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dg/2)*Math.sin(dg/2);return 12742*Math.asin(Math.sqrt(x))}
function url(q,n,pos,box,bnd){var u="https://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&addressdetails=1&extratags=1&limit="+n+"&q="+encodeURIComponent(q);
 if(box)u+="&viewbox="+box.join(",")+"&bounded=1";else if(pos){var d=bnd?.18:.6;u+="&viewbox="+[pos[1]-d,pos[0]+d,pos[1]+d,pos[0]-d].join(",")+"&bounded="+(bnd?1:0)}return u}
function fetchJ(u){return fetch(u).then(function(r){return r.json()}).catch(function(){return[]})}
function search(q,pos,bnd){var key=q+"|"+(bnd?"b":"")+"|"+(pos?pos.map(function(v){return v.toFixed(1)}):"");if(CACHE[key])return CACHE[key];
 var jobs=[];
 if(CASP.test(q)){jobs.push(fetchJ(url("Caspian Mall",8,null,ANZ)),fetchJ(url("مجتمع تجاری کاسپین",8,null,ANZ)),fetchJ(url("Caspian Mall Bandar Anzali",5)))}
 jobs.push(fetchJ(url(q.replace(/\banzali\b/i,"Bandar Anzali"),10,pos,null,bnd)));
 return CACHE[key]=Promise.all(jobs).then(function(a){var seen={},out=[];[].concat.apply([],a).forEach(function(o){if(!o||!o.lat)return;var k=(o.display_name||"").split(",").slice(0,2).join("|")+Math.round(o.lat*200)+Math.round(o.lon*200);if(seen[k])return;seen[k]=1;
   var ll=[+o.lat,+o.lon],km=pos?hav(pos,ll):null,imp=+o.importance||0,boost=CASP.test(q)&&CASP.test(o.display_name||"")?1:0;
   var sc=boost*2+imp*.65+(km==null?0:.35/(1+km/15));out.push({o:o,ll:ll,km:km,sc:sc})});
  out.sort(function(x,y){return y.sc-x.sc});return out.slice(0,CAT.test(q)?8:5)})}
function fmtKm(k){return k==null?"":(k<1?Math.round(k*1000)+" m":k<100?k.toFixed(1)+" km":Math.round(k)+" km")}
function nameOf(o){return o.name||(o.display_name||"").split(",")[0]}
function pretty(t){t=String(t||"").replace(/_/g," ").trim();return t?t[0].toUpperCase()+t.slice(1):""}
function kindOf(o){var t=o.type;if(!t||t==="yes"||t==="unclassified")t=o.addresstype||o.category||"";return pretty(t)}
function placeLine(o){var a=o.address||{};return a.suburb||a.neighbourhood||a.city||a.town||a.village||a.county||a.state||""}
function baseDesc(o){var k=kindOf(o),w=placeLine(o);return[k,w].filter(Boolean).join(" · ")||(o.display_name||"").split(",").slice(1,3).join(",").trim()}
function short(t){t=String(t||"").replace(/\s+/g," ").trim();if(!t)return"";var i=t.search(/[.!?۔]\s/);if(i>=40&&i<130)t=t.slice(0,i+1);return t.length>125?t.slice(0,122).trim()+"…":t}
function words(t){return String(t||"").toLowerCase().split(/[^a-z0-9\u0600-\u06FF]+/).filter(function(w){return w.length>2})}
function overlap(a,b){var A=words(a),B=words(b);return A.some(function(w){return B.indexOf(w)>=0})}
var EC={};
function wiki(lang,params){return fetchJ("https://"+lang+".wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages%7Cextracts&piprop=thumbnail&pithumbsize=260&exintro=1&explaintext=1&exsentences=2&"+params).then(function(j){var pg=j&&j.query&&j.query.pages;if(!pg)return[];return Object.keys(pg).map(function(k){return pg[k]}).sort(function(a,b){return(a.index||0)-(b.index||0)})})}
function enrich(r){var o=r.o,k=(o.osm_type||"")+(o.osm_id||"")+nameOf(o);if(EC[k])return EC[k];var x=o.extratags||{},nm=nameOf(o),out={img:"",desc:""},im=x.image||"";
 if(/^https?:/i.test(im))out.img=im;else if(/^File:/i.test(x.wikimedia_commons||""))out.img="https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(x.wikimedia_commons.slice(5))+"?width=260";
 var p,wp=x.wikipedia||"",lg=/[\u0600-\u06FF]/.test(nm)?"fa":"en";
 if(/^[a-z-]+:/i.test(wp)){var l2=wp.split(":")[0],ti=wp.slice(l2.length+1).replace(/ /g,"_");p=fetchJ("https://"+l2+".wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(ti)).then(function(j){if(j&&j.extract)out.desc=short(j.extract);if(j&&j.thumbnail&&!out.img)out.img=j.thumbnail.source})}
 else p=wiki(lg,"generator=search&gsrlimit=2&gsrsearch="+encodeURIComponent(nm+" "+placeLine(o))).then(function(a){var h=a.filter(function(g){return overlap(g.title,nm)})[0];if(h){out.desc=short(h.extract);if(h.thumbnail&&!out.img)out.img=h.thumbnail.source}})
  .then(function(){if(out.img&&out.desc)return;return wiki("en","generator=geosearch&ggscoord="+r.ll[0]+"%7C"+r.ll[1]+"&ggsradius=300&ggslimit=4").then(function(a){var h=a.filter(function(g){return overlap(g.title,nm)})[0];if(h){if(!out.desc)out.desc=short(h.extract);if(h.thumbnail&&!out.img)out.img=h.thumbnail.source}})});
 return EC[k]=p.catch(function(){}).then(function(){return out})}
var PIN='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" opacity=".55"><path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5c0 4.7 6.5 12.5 6.5 12.5s6.5-7.8 6.5-12.5A6.5 6.5 0 0 0 12 2.5zm0 8.8a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6z"/></svg>';
function rowHTML(r,i,n,plain){var o=r.o,nm=nameOf(o),full=o.display_name||nm,ll=r.ll[0]+","+r.ll[1],big=n===1;
 return'<div class="xp-row'+(big?' big':'')+'" data-i="'+i+'" role="button" tabindex="0"><div class="xp-img">'+PIN+'</div><div class="xp-n"><div class="xp-t"><b dir="auto">'+esc(nm)+'</b>'+(i===0&&n>1?'<em>Best</em>':'')+'<button type="button" class="xp-start" data-i="'+i+'"'+(plain?'':' data-xe="nav" data-q="'+esc(full)+'" data-ll="'+esc(ll)+'"')+'>Start</button></div><small class="xp-ds" dir="auto">'+esc(baseDesc(o))+'</small>'+(r.km!=null?'<span class="xp-d">'+esc(fmtKm(r.km))+' away</span>':'')+'</div></div>'}
function fill(box,res){[].forEach.call(box.querySelectorAll(".xp-row"),function(row){var r=res[+row.dataset.i];if(!r)return;enrich(r).then(function(e){if(!row.isConnected)return;if(e.img){var im=row.querySelector(".xp-img"),t=new Image();t.onload=function(){im.style.backgroundImage='url("'+e.img.replace(/"/g,"%22")+'")';im.classList.add("has")};t.src=e.img}if(e.desc){var d=row.querySelector(".xp-ds");if(d)d.textContent=e.desc}})})}
function listHTML(res,plain){return'<div class="xp-list">'+res.map(function(r,i){return rowHTML(r,i,res.length,plain)}).join("")+'</div>'}
function render(box,res){var q=box.getAttribute("data-q");
 if(!res.length){box.innerHTML='<div class="xp-empty">No places found for \u201c'+esc(q)+'\u201d.</div>';return}
 box.innerHTML=(res.length>1?'<div class="xp-h">Pick a place</div>':'')+listHTML(res,false);box._res=res;fill(box,res)}
function pick(box,i){var r=box._res&&box._res[i];if(!r)return;var o=r.o,nm=nameOf(o),full=o.display_name||nm,sub=baseDesc(o);
 var CAR='<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11h.5A1.5 1.5 0 0 1 21 12.5V17a1 1 0 0 1-1 1h-1.2a1.8 1.8 0 0 1-3.6 0H8.8a1.8 1.8 0 0 1-3.6 0H4a1 1 0 0 1-1-1v-4.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-2.8a.5.5 0 0 0-.5-.3H8.6a.5.5 0 0 0-.5.3L7.1 11z"/></svg>';
 var ll=r.ll[0]+","+r.ll[1],g="https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(ll)+"&travelmode=driving";
 box.innerHTML='<div class="xe-mini" data-q="'+esc(full)+'" data-n="'+esc(nm)+'" data-ll="'+esc(ll)+'"></div><div class="xp-b"><div class="xp-t"><b dir="auto">'+esc(nm)+'</b><small>'+esc(sub)+'</small></div></div><div class="xp-a"><button class="xp-go" data-xe="nav" data-q="'+esc(full)+'" data-ll="'+esc(ll)+'">'+CAR+'Directions</button><a class="xp-gm" href="'+esc(g)+'" target="_blank" rel="noopener">Google Maps</a></div>'+(box._res.length>1?'<button type="button" class="xp-back">\u2039 Other results</button>':'');
 box.classList.add("sel")}
function hydrate(){var n=document.querySelectorAll(".xp-pick:not([data-done])");if(!n.length)return;
 [].forEach.call(n,function(b){b.dataset.done=1;b.innerHTML='<div class="xp-empty">Finding places…</div>';var q=b.getAttribute("data-q");
  getPos().then(function(pos){var near=NEAR.test(q)&&pos;var qq=near?(q.replace(/near me|nearby|around me|close to me|around here/ig,"").trim()||q):q;return search(qq,pos,near)}).then(function(r){render(b,r)}).catch(function(){b.innerHTML='<div class="xp-empty">Could not search places.</div>'})})}
document.addEventListener("click",function(e){var t=e.target,row=t.closest&&t.closest(".xp-row");
 if(t.closest&&t.closest(".xp-start")&&t.closest(".xp-pick"))return;
 if(row){var b=row.closest(".xp-pick");if(b){e.preventDefault();pick(b,+row.dataset.i)}return}
 var back=t.closest&&t.closest(".xp-back");if(back){var b2=back.closest(".xp-pick");if(b2&&b2._res){b2.classList.remove("sel");render(b2,b2._res)}}});
var _t=0;new MutationObserver(function(){if(_t)return;_t=setTimeout(function(){_t=0;hydrate()},50)}).observe(document.body,{childList:true,subtree:true});
hydrate();
window.XMM_PLACES={search:search,pos:getPos,enrich:enrich,list:listHTML,fill:fill,nameOf:nameOf,baseDesc:baseDesc,alias:function(q){return CASP.test(q)&&!/anzali|انزلی|enzeli/i.test(q)?q+" Bandar Anzali":q}};
})();
