/* XMM live navigation v4 (Apple Maps style): Leaflet + OSM tiles, OSRM route with blue line, turn banner, "Recalculating…" */
(function(){
var L0="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet";
var el,map,me,dest,line,casing,wid=null,total=0,dur=0,coords=[],steps=[],q="",destLL=null,info=null,lastRoute=0,follow=true,started=false,driving=false,lastP=null,failed=0,routing=false,offCount=0,wxDone=false,ro=null,ro2=null,chev=null,vm=0,viewDeg=0,lastHead=null,roadB=null,remM=0,remT=0,lastSpd=0,lastTurn="",alts=[],roads=[],straight=false,rec=null,recOn=false,aiAbort=null,aiHist=[],lastChev=0,lastDeg=0,onRz=null,rl=[],cur=0,tick=null,lastFix=0,aiShow=false,aiTimer=null;
var GC={},GI={};
var tl=null,th="dark",m3=null,m3on=false,m3mk=null,m3dm=null,m3t=null,m3last=null,m3sig="",m3ready=false,RES=[];try{th=localStorage.getItem("xmm.nvth")||"dark"}catch(e){}
var IC={
 car:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M5 11l1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11h.5A1.5 1.5 0 0 1 21 12.5V17a1 1 0 0 1-1 1h-1.2a1.8 1.8 0 0 1-3.6 0H8.8a1.8 1.8 0 0 1-3.6 0H4a1 1 0 0 1-1-1v-4.5A1.5 1.5 0 0 1 4.5 11H5zm2.1 0h9.8l-1-2.8a.5.5 0 0 0-.5-.3H8.6a.5.5 0 0 0-.5.3L7.1 11z"/></svg>',
 call:'<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
 web:'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
 share:'<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M8 8l4-4 4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>',
 x:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 loc:'<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3.5 11.2 20 4l-7.2 16.5-1.9-7.4z"/></svg>',
 pin:'<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5c0 4.7 6.5 12.5 6.5 12.5s6.5-7.800 6.5-12.5A6.500 6.500 0 0 0 12 2.500zm0 8.800a2.300 2.300 0 1 1 0-4.600 2.300 2.300 0 0 1 0 4.600z"/></svg>',
 flag:'<svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><path d="M6 3v18M6 4h11l-2.500 4 2.500 4H6" stroke="#fff" stroke-width="2.200" stroke-linejoin="round" fill="#fff"/></svg>',
 arr:'<svg viewBox="0 0 24 24" width="38" height="38" fill="#fff"><path d="M12 3 5 12.500h4.500V21h5v-8.500H19z"/></svg>',
 cmp:'<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.7" opacity=".4"/><g class="cn" style="transform-origin:12px 12px"><path d="M12 3.800l3.200 8.200H8.800z" fill="#ff453a"/><path d="M12 20.200 8.800 12h6.400z" fill="currentColor" opacity=".6"/></g></svg>',
 ai:'<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9zM5 14l.7 2 2 .7-2 .7L5 19.5l-.7-2.1-2-.7 2-.7z"/></svg>',
 txt:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
 mic:'<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V6a3.500 3.500 0 0 0-7 0v5a3.500 3.500 0 0 0 3.500 3.500zM6 11a1 1 0 1 0-2 0 8 8 0 0 0 7 7.940V21H8.500a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2H13v-2.060A8 8 0 0 0 20 11a1 1 0 1 0-2 0 6 6 0 0 1-12 0z"/></svg>',
 lyr:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 8l9 5 9-5z"/><path d="M3 12.500l9 5 9-5M3 16.500l9 5 9-5"/></svg>',
 search:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.500-3.500"/></svg>'
};
function css(){if(document.getElementById("nv-css"))return;var s=document.createElement("style");s.id="nv-css";s.textContent=
"#nv{--bg:rgba(255,255,255,.82);--fg:#111;--mu:rgba(60,60,67,.62);--sep:rgba(60,60,67,.16);--chip:rgba(118,118,128,.14);--blue:#0a84ff;position:fixed;inset:0;z-index:100000;background:#e9e7e2;font-family:-apple-system,system-ui,'SF Pro Text','Segoe UI',Roboto,sans-serif;color:var(--fg);overflow:hidden;-webkit-font-smoothing:antialiased}"+
"@media(prefers-color-scheme:dark){#nv{--bg:rgba(34,34,38,.84);--fg:#fff;--mu:rgba(235,235,245,.6);--sep:rgba(235,235,245,.16);--chip:rgba(120,120,128,.32)}}"+
"#nv .map,#nv .leaflet-container{position:absolute;inset:0;background:#e9e7e2;font-family:inherit}"+
"#nv,#nv .map{touch-action:none;overscroll-behavior:none;-webkit-user-select:none;user-select:none}"+
".leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-tile-container,.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-layer{position:absolute;left:0;top:0}.leaflet-container{overflow:hidden}.leaflet-zoom-animated{transform-origin:0 0}.leaflet-tile{-webkit-user-drag:none;user-select:none}"+
"#nv img,.xe-mini img{max-width:none!important;max-height:none!important;min-width:0!important;border-radius:0!important;aspect-ratio:auto!important}#nv .leaflet-overlay-pane svg,#nv .leaflet-overlay-pane canvas,.xe-mini .leaflet-overlay-pane svg,.xe-mini .leaflet-overlay-pane canvas{max-width:none!important;max-height:none!important}"+
"#nv .leaflet-tile-pane img{width:256px;height:256px}"+
"#nv.pre.hr .turn{display:flex;padding:9px 14px;border-radius:18px}#nv.pre.hr .turn .ti{width:36px;height:36px}#nv.pre.hr .turn b{font-size:17px}"+
"#nv .fabs .aib{background:var(--blue);color:#fff}#nv .aip{position:absolute;z-index:1002;left:8px;right:8px;bottom:calc(var(--sh,200px) + 12px);border-radius:24px;padding:12px;display:none;flex-direction:column;gap:10px;max-height:56%}#nv .aip.on{display:flex}"+
"#nv .aih{display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:15px}#nv .aih button{width:30px;height:30px;border-radius:50%;border:0;background:var(--chip);display:grid;place-items:center}"+
"#nv .aio{overflow:auto;-webkit-overflow-scrolling:touch;font-size:16px;line-height:1.42;min-height:44px;max-height:32vh;white-space:pre-wrap;touch-action:pan-y;user-select:text;-webkit-user-select:text}#nv .aio .u{color:var(--mu);font-size:14px;margin-bottom:6px}#nv .aio .e{color:#ff453a}"+
"#nv .aic{display:flex;gap:6px;flex-wrap:wrap}#nv .aic button{border:0;border-radius:99px;background:var(--chip);padding:7px 12px;font-size:13px;font-weight:600;color:var(--blue)}"+
"#nv .air{display:flex;gap:8px;align-items:center}#nv .air input{flex:1;min-width:0;height:46px;border-radius:14px;border:0;background:var(--chip);padding:0 12px;font-size:16px;font-family:inherit;color:var(--fg);outline:0;-webkit-user-select:text;user-select:text}"+
"#nv .mic{width:48px;height:48px;border-radius:50%;border:0;background:var(--blue);color:#fff!important;display:grid;place-items:center;flex:none}#nv .mic.on{background:#ff453a;animation:nvm 1.1s infinite}@keyframes nvm{50%{box-shadow:0 0 0 10px rgba(255,69,58,.2)}}"+
"#nv .map{transform-origin:50% 50%}#nv.rot .map{inset:auto;left:-70%;top:-70%;width:240%;height:240%;transition:transform .4s ease-out;will-change:transform}#nv.rot .leaflet-control-attribution{display:none}"+
"#nv .fade{position:absolute;left:0;right:0;top:0;height:34%;z-index:500;pointer-events:none;background:linear-gradient(#e9e7e2 8%,rgba(233,231,226,0));opacity:0;transition:opacity .3s}#nv.tilt .fade{opacity:1}"+
"#nv .nv-attr{position:absolute;z-index:600;left:6px;bottom:calc(var(--sh,200px) + 4px);font-size:9px;background:rgba(255,255,255,.7);color:#333;padding:1px 4px;border-radius:4px;display:none}#nv.rot .nv-attr{display:block}"+
"#nv .nv-op{transform:rotate(var(--un,0deg)) scaleY(var(--sy,1));transform-origin:60px 53px}#nv .nv-me{transform:rotate(var(--un,0deg)) scaleY(var(--sy,1))}"+
"#nv .fabs .cmp .cn{transition:transform .4s ease-out}#nv .fabs .cmp svg{transition:transform .3s}#nv .fabs .cmp.m1{background:var(--chip)}#nv .fabs .cmp.m2{background:var(--blue);color:#fff}#nv .fabs .cmp.m2 svg{transform:perspective(60px) rotateX(48deg)}"+
".nv-ch{width:16px;height:16px;display:grid;place-items:center;pointer-events:none}.nv-ch svg{width:14px;height:14px;display:block}"+
"#nv .leaflet-control-attribution{font-size:9px;background:rgba(255,255,255,.7);margin:0 0 calc(var(--sh,0px) + 4px) 0}"+
"#nv .gl{background:var(--bg);-webkit-backdrop-filter:blur(26px) saturate(1.8);backdrop-filter:blur(26px) saturate(1.8);box-shadow:0 8px 32px rgba(0,0,0,.16),0 0 0 .5px rgba(255,255,255,.5) inset;border:.5px solid var(--sep)}"+
"#nv button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}"+
"#nv .top{position:absolute;z-index:1000;left:12px;right:12px;top:calc(env(safe-area-inset-top,0px) + 10px);display:flex;flex-direction:column;gap:8px;pointer-events:none}"+
"#nv .top>*{pointer-events:auto}"+
"#nv .wx{align-self:flex-start;display:none;align-items:center;gap:6px;border-radius:99px;padding:7px 13px 7px 10px;font-weight:600;font-size:15px}"+
"#nv .wx.on{display:flex}"+
"#nv .sbar{display:flex;align-items:center;gap:10px;border-radius:16px;padding:0 6px 0 14px;height:46px}"+
"#nv .sbar svg{flex:none;opacity:.55}"+
"#nv .sbar input{flex:1;min-width:0;border:0;background:none;outline:0;font:500 17px inherit;color:var(--fg);padding:0}"+
"#nv .sbar input::placeholder{color:var(--mu)}"+
"#nv .sbar .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#8ea0ff,#6c7be0);color:#fff;font:600 13px inherit;display:grid;place-items:center;border:0}"+
"#nv .turn{display:none;align-items:center;gap:14px;border-radius:22px;padding:12px 16px;background:linear-gradient(135deg,#0a84ff,#2563eb)!important;color:#fff;border:0}"+
"#nv:not(.pre) .turn{display:flex}#nv:not(.pre) .sbar{display:none}"+
"#nv .turn .ti{width:44px;height:44px;display:grid;place-items:center;flex:none}#nv .turn .ti svg{transition:transform .3s}"+
"#nv .turn .tt{min-width:0;flex:1}#nv .turn small{display:block;font-size:13px;opacity:.8;font-weight:600}#nv .turn b{display:block;font-size:21px;font-weight:700;line-height:1.15;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}"+
"#nv .rcl{align-self:center;display:none;align-items:center;gap:9px;border-radius:99px;padding:9px 16px;font-weight:700;font-size:15px}"+
"#nv .rcl.on{display:flex}#nv .rcl i{width:16px;height:16px;border-radius:50%;border:2.5px solid var(--sep);border-top-color:var(--blue);animation:nvs .8s linear infinite}"+
"@keyframes nvs{to{transform:rotate(360deg)}}"+
"#nv .fabs{position:absolute;z-index:1000;right:12px;bottom:calc(var(--sh,200px) + 18px);border-radius:16px;display:flex;flex-direction:column;overflow:hidden}"+
"#nv .fabs button{width:46px;height:46px;border:0;background:none;display:grid;place-items:center;font-size:24px;font-weight:300;color:var(--blue)}#nv .fabs button+button{border-top:.5px solid var(--sep)}#nv .fabs button:active{background:var(--chip)}"+
"#nv .sheet,#nv .drv{position:absolute;z-index:1000;left:8px;right:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);border-radius:30px;padding:8px 16px 16px}"+
"#nv .sheet::before{content:'';display:block;width:38px;height:5px;border-radius:3px;background:var(--sep);margin:0 auto 10px}"+
"#nv:not(.pre) .sheet{display:none}#nv.pre .drv{display:none}"+
"#nv .hd{display:flex;align-items:center;gap:10px}"+
"#nv .rb{width:34px;height:34px;border-radius:50%;border:0;background:var(--chip);display:grid;place-items:center;flex:none;color:var(--mu)}"+
"#nv .nm{flex:1;min-width:0;text-align:center}#nv .nm b{display:block;font-size:19px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#nv .nm small{display:block;font-size:13px;color:var(--mu);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}"+
"#nv .acts{display:flex;gap:8px;margin-top:14px}"+
"#nv .acts>*{flex:1;border:0;border-radius:14px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-weight:600;font-size:12px;text-decoration:none;background:var(--chip);color:var(--blue)}"+
"#nv .acts .st{background:var(--blue);color:#fff;flex:1.15}#nv .acts .st b{font-size:15px;font-weight:700;line-height:1}"+
"#nv .acts .off{opacity:.42;pointer-events:none}"+
"#nv .stats{display:flex;margin-top:14px;border-top:.5px solid var(--sep);padding-top:12px}"+
"#nv .stats>div{flex:1;text-align:center;min-width:0;padding:0 4px}#nv .stats>div+div{border-left:.5px solid var(--sep)}"+
"#nv .stats small{display:block;font-size:11px;color:var(--mu);font-weight:600;text-transform:none}#nv .stats b{display:block;font-size:16px;font-weight:700;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
"#nv .drv .row{display:flex;align-items:center;gap:6px}#nv .drv .row>div{flex:1;text-align:center}"+
"#nv .drv b{display:block;font-size:26px;font-weight:800;letter-spacing:-.4px;line-height:1.05;font-variant-numeric:tabular-nums}#nv .drv .tm{color:#22a95a}#nv .drv small{font-size:12px;color:var(--mu);font-weight:600}"+
"#nv .drv .ex{border:0;background:#ff453a;color:#fff;font-weight:700;font-size:16px;border-radius:16px;padding:0 20px;height:46px;flex:none}"+
"#nv .spd{position:absolute;z-index:1000;left:12px;bottom:calc(var(--sh,200px) + 18px);width:62px;height:62px;border-radius:50%;display:none;flex-direction:column;align-items:center;justify-content:center}"+
"#nv:not(.pre) .spd{display:flex}#nv .spd b{font-size:22px;line-height:1;font-weight:800}#nv .spd small{font-size:9px;color:var(--mu);font-weight:700}"+
".nv-me{position:relative;width:22px;height:22px}.nv-me i{position:absolute;inset:0;border-radius:50%;background:rgba(10,132,255,.28);animation:nvp 2s infinite}.nv-me u{position:absolute;inset:3px;border-radius:50%;background:#0a84ff;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)}"+
"@keyframes nvp{0%{transform:scale(.8);opacity:1}100%{transform:scale(2.4);opacity:0}}"+
".nv-op{position:relative;width:120px;height:74px;font-family:-apple-system,system-ui,'Segoe UI',sans-serif}.nv-op i{position:absolute;left:38px;top:0;width:44px;height:44px;border-radius:50%;background:linear-gradient(180deg,#ff9f0a,#ff7a00);border:3px solid #fff;display:grid;place-items:center;box-shadow:0 4px 12px rgba(0,0,0,.35)}.nv-op i::after{content:'';position:absolute;left:50%;bottom:-9px;margin-left:-6px;border:6px solid transparent;border-top:8px solid #fff;border-bottom:0}.nv-op i svg{width:22px;height:22px}.nv-op span{position:absolute;left:0;right:0;top:52px;text-align:center;font-size:12px;font-weight:700;color:#7a3b00;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff,0 0 3px #fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}"+
".xe-mini{width:100%;height:190px;border-radius:16px;margin:8px 0;overflow:hidden;background:#e9e7e2;position:relative;z-index:0}.xe-mini .leaflet-control-attribution{font-size:8px}";
s.textContent+="#nv .top{left:10px;right:10px;gap:10px}"+
"#nv .sbar{height:44px;border-radius:14px;box-shadow:0 2px 14px rgba(0,0,0,.18)}#nv .sbar .av{background:var(--chip);color:var(--mu);width:30px;height:30px;font-size:14px}"+
"#nv .turn{background:rgba(28,28,30,.94)!important;border-radius:20px;padding:14px 16px;box-shadow:0 6px 24px rgba(0,0,0,.35);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}#nv .turn b{font-size:24px;font-weight:700}#nv .turn small{font-size:15px;opacity:.7;font-weight:600}#nv .turn .ti{width:48px;height:48px}"+
"#nv .fabs{top:calc(env(safe-area-inset-top,0px) + 66px);bottom:auto;right:10px;border-radius:14px;box-shadow:0 2px 14px rgba(0,0,0,.2)}#nv:not(.pre) .fabs{top:calc(env(safe-area-inset-top,0px) + 124px)}#nv .fabs button{width:44px;height:44px;font-size:22px}#nv .fabs .d3 b{font-size:13px;font-weight:700}"+
"#nv .spd{left:10px;bottom:calc(var(--sh,200px) + 14px);box-shadow:0 2px 14px rgba(0,0,0,.2)}"+
"#nv .sheet,#nv .drv{left:0;right:0;bottom:0;border-radius:26px 26px 0 0;padding:8px 18px calc(env(safe-area-inset-bottom,0px) + 16px);box-shadow:0 -6px 30px rgba(0,0,0,.2)}"+
"#nv .hd{align-items:flex-start}#nv .nm{order:0;text-align:left}#nv .shr{order:1}#nv .cls{order:2}#nv .nm b{font-size:24px;font-weight:700;letter-spacing:-.3px;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}#nv .nm small{font-size:15px;margin-top:3px}#nv .rb{width:30px;height:30px;background:var(--chip)}"+
"#nv .acts{margin-top:14px;gap:10px}#nv .acts>*{height:56px;border-radius:16px}#nv .acts .st{flex:2;flex-direction:row;gap:8px;font-size:17px;border-radius:28px;height:56px}#nv .acts .st b{font-size:17px}#nv .acts .call,#nv .acts .web{flex:1}"+
"#nv .drv .row{flex-wrap:wrap;gap:0}#nv .drv .row>div{flex:1 1 0}#nv .drv b{font-size:28px}#nv .drv .tm{color:#30d158}"+
"#nv .drv .ex{order:5;flex:1 1 100%;margin-top:14px;height:54px;border-radius:27px;font-size:19px;background:#ff3b30;box-shadow:0 4px 14px rgba(255,59,48,.4)}#nv .drv .ex:active{opacity:.8}#nv .drv .ex::before{content:'';display:inline-block;width:12px;height:12px;border-radius:3px;background:#fff;margin-right:10px;vertical-align:-1px}"+
"#nv .drv::before{content:'';display:block;width:38px;height:5px;border-radius:3px;background:var(--sep);margin:0 auto 10px}"+
"#nv .res{border-radius:16px;overflow:hidden}";
s.textContent+="#nv{--bg:rgba(255,255,255,.42);--chip:rgba(120,120,128,.16)}"+
"@media(prefers-color-scheme:dark){#nv{--bg:rgba(30,30,34,.4);--chip:rgba(255,255,255,.14)}}#nv.dk{--bg:rgba(30,30,34,.4);--fg:#fff;--mu:rgba(235,235,245,.62);--sep:rgba(235,235,245,.16);--chip:rgba(255,255,255,.14)}#nv.lt{--bg:rgba(255,255,255,.42);--fg:#111;--mu:rgba(60,60,67,.62);--sep:rgba(60,60,67,.16);--chip:rgba(120,120,128,.16)}"+
"#nv .gl{-webkit-backdrop-filter:blur(32px) saturate(2) brightness(1.05);backdrop-filter:blur(32px) saturate(2) brightness(1.05);border:1px solid rgba(255,255,255,.28);box-shadow:0 10px 36px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(255,255,255,.08)}"+
"#nv .sbar{height:48px;border-radius:99px;padding:0 8px 0 16px}#nv .sbar .av{border-radius:50%}"+
"#nv .turn{background:rgba(28,28,32,.5)!important;border-radius:28px;padding:14px 18px;box-shadow:0 10px 36px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.25)}"+
"#nv .fabs{background:none!important;border:0!important;box-shadow:none!important;overflow:visible;gap:10px;-webkit-backdrop-filter:none;backdrop-filter:none}#nv .fabs button{width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,.28)!important;background:var(--bg);-webkit-backdrop-filter:blur(32px) saturate(2);backdrop-filter:blur(32px) saturate(2);box-shadow:0 6px 20px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.4);color:var(--fg)}#nv .fabs button+button{border-top:1px solid rgba(255,255,255,.28)}#nv .fabs .d3{display:none}#nv .fabs .aib{background:rgba(10,132,255,.55);color:#fff}"+
"#nv .spd{box-shadow:0 6px 20px rgba(0,0,0,.14),inset 0 1px 0 rgba(255,255,255,.4)}"+
"#nv .sheet,#nv .drv{left:8px;right:8px;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);border-radius:34px;padding:8px 18px 18px}"+
"#nv .acts>*{border-radius:99px;background:var(--chip);color:var(--fg);border:1px solid rgba(255,255,255,.2)}#nv .acts .st{background:rgba(10,132,255,.82);color:#fff;border-color:rgba(255,255,255,.35);box-shadow:0 6px 18px rgba(10,132,255,.3)}"+
"#nv .drv .tm{color:var(--fg)}#nv .drv .ex{background:rgba(255,59,48,.82);border:1px solid rgba(255,255,255,.35);box-shadow:0 6px 18px rgba(255,59,48,.28);border-radius:99px}"+
"#nv .res{border-radius:24px}#nv .rb{border-radius:50%}";
s.textContent+=".nv-me .ar{position:absolute;left:-6px;top:-6px;width:34px;height:34px;display:block;transition:none;filter:drop-shadow(0 2px 5px rgba(0,0,0,.4))}#nv *,#nv .res *,.xp-pick *,.xw-place *{letter-spacing:normal!important;text-transform:none}#nv .drv b,#nv .stats b{font-variant-numeric:tabular-nums}";
s.textContent+="#nv .m3d{display:none!important}";
s.textContent+="#nv .lreq{position:absolute;z-index:1100;left:16px;right:16px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;padding:22px 18px 18px;border-radius:26px;text-align:center;background:rgba(28,28,32,.93)!important;color:#fff}#nv .lreq i{width:46px;height:46px;border-radius:50%;background:var(--blue);display:grid;place-items:center}#nv .lreq i svg{width:24px;height:24px}#nv .lreq b{font-size:19px}#nv .lreq small{font-size:14px;line-height:1.35;opacity:.75}#nv .lreq button{margin-top:6px;width:100%;height:48px;border:0;border-radius:99px;background:var(--blue);color:#fff;font-size:17px;font-weight:600}#nv .acts{min-width:0}#nv .acts>*{min-width:0;overflow:hidden;white-space:nowrap}#nv .acts .st{flex:1.3}#nv .acts .call,#nv .acts .web{flex:1;font-size:14px;gap:5px;padding:0 6px}#nv .acts svg{flex:none}#nv .sheet,#nv .drv{box-sizing:border-box;max-width:100%}";
s.textContent+="\@media(max-height:700px),(max-width:380px){\#nv .top{left:8px;right:8px;top:calc(env(safe-area-inset-top,0px) + 8px);gap:6px}\#nv .sbar{height:42px}#nv .sbar input{font-size:16px}\#nv .fabs,#nv:not(.pre) .fabs{top:calc(env(safe-area-inset-top,0px) + 58px);right:8px;gap:7px}\#nv:not(.pre) .fabs{top:calc(env(safe-area-inset-top,0px) + 100px)}\#nv .fabs button{width:40px;height:40px;font-size:20px}#nv .fabs button svg{width:20px;height:20px}\#nv .dial{width:56px;height:56px;left:8px;bottom:calc(var(--sh,200px) + 10px)}\#nv .spd{left:8px}\#nv .sheet,#nv .drv{left:0;right:0;bottom:0;border-radius:24px 24px 0 0;padding:6px 14px calc(env(safe-area-inset-bottom,0px) + 10px)}\#nv .sheet::before,#nv .drv::before{margin-bottom:6px}\#nv .nm b{font-size:19px;-webkit-line-clamp:1}#nv .nm small{font-size:13px;margin-top:1px}\#nv .acts{margin-top:8px;gap:8px}#nv .acts>*,#nv .acts .st{height:44px;font-size:15px}#nv .acts .st b{font-size:15px}\#nv .stats{margin-top:6px}#nv .stats b{font-size:17px}#nv .stats small{font-size:11px}\#nv .drv b{font-size:22px}#nv .drv .ex{margin-top:8px;height:44px;font-size:16px}\#nv .turn{padding:9px 12px;border-radius:20px}#nv .turn b{font-size:17px}#nv .turn .ti{width:34px;height:34px}\#nv .aip{left:6px;right:6px;padding:10px;gap:8px;max-height:60%}#nv .aio{max-height:22vh;font-size:15px}\#nv .air input{height:42px;font-size:16px}#nv .mic{width:44px;height:44px}\#nv .res{max-height:38vh;overflow:auto;-webkit-overflow-scrolling:touch}\}";
s.textContent+=".nv-me u{display:none}.nv-me .ar{position:absolute;left:-23px;top:-23px;width:68px;height:68px;transition:none;will-change:transform;pointer-events:none}.nv-me .ar::before,.nv-me .ar::after{content:'';position:absolute;clip-path:polygon(50% 0,92% 96%,50% 74%,8% 96%)}.nv-me .ar::after{inset:0;background:rgba(255,255,255,.5)}.nv-me .ar::before{inset:5px;z-index:1;background:linear-gradient(180deg,rgba(10,132,255,.5),rgba(10,132,255,.28));-webkit-backdrop-filter:blur(10px) saturate(1.8);backdrop-filter:blur(10px) saturate(1.8)}#nv .leaflet-container:not(.leaflet-zoom-anim) .nv-meic{transition:transform 1s linear}";
s.textContent+="#nv.rot .map{transition:transform .9s cubic-bezier(.22,.8,.3,1)}#nv.dg .map{transition:none}#nv .dial{position:absolute;z-index:1000;left:12px;bottom:calc(var(--sh,200px) + 86px);width:72px;height:72px;border-radius:50%;touch-action:none;display:grid;place-items:center}#nv .dial i{position:absolute;inset:6px;border-radius:50%;border:1.5px dashed var(--sep);display:block;transition:transform .2s}#nv .dial i b{position:absolute;left:50%;top:-9px;margin-left:-8px;width:16px;height:16px;border-radius:50%;background:#ff453a;color:#fff;font:700 10px/16px inherit;text-align:center}#nv .dial u{width:26px;height:26px;border-radius:50%;background:var(--chip);display:block}#nv:not(.pre) .dial{bottom:calc(var(--sh,200px) + 86px)}";
s.textContent+="#nv.dk:not(.sat) .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.88) contrast(.92) saturate(.65)}#nv.dk:not(.sat) .m3d canvas{filter:invert(1) hue-rotate(180deg) brightness(.88) contrast(.92) saturate(.65)}";
document.head.appendChild(s)}
var LQ=[],LS=0;function load(cb){if(window.L&&LS===2)return cb();LQ.push(cb);if(LS)return;LS=1;var n=2,fin=false,go=function(){if(fin)return;if(--n>0)return;fin=true;LS=2;var q=LQ.splice(0);q.forEach(function(f){try{f()}catch(e){}})};var l=document.createElement("link");l.rel="stylesheet";l.href=L0+".min.css";l.onload=go;l.onerror=go;document.head.appendChild(l);var s=document.createElement("script");s.src=L0+".min.js";s.onload=go;s.onerror=function(){LS=0;LQ=[];alert("Could not load the map");close()};document.head.appendChild(s);setTimeout(function(){if(!fin&&window.L){n=1;go()}},2500)}
function hav(a,b){var R=6371000,r=Math.PI/180,dl=(b[0]-a[0])*r,dg=(b[1]-a[1])*r,x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dg/2)*Math.sin(dg/2);return 2*R*Math.asin(Math.sqrt(x))}
function brg(a,b){var r=Math.PI/180,y=Math.sin((b[1]-a[1])*r)*Math.cos(b[0]*r),x=Math.cos(a[0]*r)*Math.sin(b[0]*r)-Math.sin(a[0]*r)*Math.cos(b[0]*r)*Math.cos((b[1]-a[1])*r);return(Math.atan2(y,x)/r+360)%360}
function ahead(p,i,m){var d=0,k=i;while(k<coords.length-1&&d<m){d+=hav(coords[k],coords[k+1]);k++}return coords[Math.min(k,coords.length-1)]}
function smooth(d){var diff=((d-lastDeg)%360+540)%360-180;lastDeg+=diff;return lastDeg}
function drawChev(pts){if(!map||!window.L)return;if(chev){map.removeLayer(chev);chev=null}if(!pts||pts.length<2)return;chev=L.layerGroup();var tot=0,i;for(i=0;i<pts.length-1;i++)tot+=hav(pts[i],pts[i+1]);var step=Math.max(120,tot/30),acc=step*.6,cnt=0;
 for(i=0;i<pts.length-1&&cnt<40;i++){var seg=hav(pts[i],pts[i+1]);acc+=seg;if(acc>=step){acc=0;var j=Math.min(pts.length-1,i+1),k=j,d=0;while(k<pts.length-1&&d<25){d+=hav(pts[k],pts[k+1]);k++}var a=brg(pts[i],pts[k>i?k:i+1]);cnt++;
  L.marker(pts[i],{interactive:false,keyboard:false,zIndexOffset:100,icon:L.divIcon({className:"",iconSize:[16,16],iconAnchor:[8,8],html:'<div class="nv-ch"><svg viewBox="0 0 24 24" style="transform:rotate('+Math.round(a)+'deg)" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16l7-9 7 9"/></svg></div>'})}).addTo(chev)}}
 chev.addTo(map)}
function fmtT(s){s=Math.max(0,Math.round(s/60));if(s>=60){var h=Math.floor(s/60),m=s%60;return h+" h "+(m?m+" min":"")}return(s<1?"<1":s)+" min"}
function fmtD(m){return m>=1000?(m/1000).toFixed(m>=10000?0:1)+" km":Math.max(10,Math.round(m/10)*10)+" m"}
function $(s){return el&&el.querySelector(s)}
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function opIcon(name){return L.divIcon({className:"",html:'<div class="nv-op"><i>'+IC.pin+'</i><span>'+esc(name||"")+'</span></div>',iconSize:[120,74],iconAnchor:[60,53]})}
function geoFull(query,cb,err){if(GI[query])return cb(GI[query]);fetch("https://nominatim.openstreetmap.org/search?format=json&accept-language=en&limit=1&addressdetails=1&extratags=1&q="+encodeURIComponent(window.XMM_PLACES?XMM_PLACES.alias(query):query)).then(function(r){return r.json()}).then(function(j){if(!j[0]){err&&err();return}var o=j[0],x=o.extratags||{};GI[query]={ll:[+o.lat,+o.lon],full:o.display_name||"",phone:x.phone||x["contact:phone"]||"",web:x.website||x["contact:website"]||"",hours:x.opening_hours||""};GC[query]=GI[query].ll;cb(GI[query])}).catch(function(){err&&err()})}
function geo(query,cb,err){if(GC[query])return cb(GC[query]);geoFull(query,function(i){cb(i.ll)},err)}
function status(on,txt){var r=$(".rcl");if(!r)return;r.classList.toggle("on",!!on);if(txt)r.querySelector("span").textContent=txt}
function draw(pts){if(line){map.removeLayer(line);map.removeLayer(casing)}
 casing=L.polyline(pts,{color:"#fff",weight:12,opacity:1,lineCap:"round",lineJoin:"round",interactive:false}).addTo(map);
 line=L.polyline(pts,{color:"#0a84ff",weight:7.5,opacity:1,lineCap:"round",lineJoin:"round",interactive:false}).addTo(map);drawChev(pts)}
function near(pt){var bi=0,bd=1e12;for(var i=0;i<coords.length;i++){var d=hav(pt,coords[i]);if(d<bd){bd=d;bi=i}}return[bi,bd]}
function rankRoutes(rs){var l=(rs||[]).filter(function(r){return r&&r.geometry}).map(function(r){var n=((r.legs&&r.legs[0]&&r.legs[0].steps)||[]).length;return{r:r,sc:r.duration+n*7+r.distance/1000*3}});l.sort(function(a,b){return a.sc-b.sc});l=l.slice(0,3);var b=l[0]&&l[0].r;l.forEach(function(o,i){o.tag=i===0?"Best":(b&&o.r.distance<b.distance*.97?"Shorter":"Alternative")});return l}
function useRoute(i){var o=rl[i];if(!o)return;cur=i;var r=o.r;coords=r.geometry.coordinates.map(function(c){return[c[1],c[0]]});total=r.distance;dur=r.duration;straight=false;alts=rl.filter(function(_,k){return k!==i}).map(function(x){return{d:x.r.distance,t:x.r.duration}});
 steps=[];((r.legs&&r.legs[0]&&r.legs[0].steps)||[]).forEach(function(s){var m=s.maneuver||{};if(!m.location||m.type==="depart")return;steps.push({ll:[m.location[1],m.location[0]],type:m.type,mod:m.modifier||"",name:(/[\u0600-\u06FF\u0750-\u077F]/.test(s.name||"")?"":(s.name||"")),exit:m.exit,idx:near([m.location[1],m.location[0]])[0]})});
 roads=[];steps.forEach(function(x){if(x.name&&roads.indexOf(x.name)<0)roads.push(x.name)});draw(coords);renderRts()}
function renderRts(){var b=$(".rts");if(!b)return;if(rl.length<2){b.innerHTML="";b.style.display="none";return}b.style.display="flex";b.innerHTML=rl.map(function(o,i){return'<button type="button" data-i="'+i+'" class="'+(i===cur?"on":"")+'"><b>'+fmtT(o.r.duration)+'</b><small>'+o.tag+' · '+fmtD(o.r.distance)+'</small></button>'}).join("")}
function getRoute(from){lastRoute=Date.now();routing=true;var re=coords.length>0;status(true,re?"Recalculating…":"Calculating route…");if(re&&driving)setTurn("Recalculating…","Finding a new route",0,"arr");
 fetch("https://router.project-osrm.org/route/v1/driving/"+from[1]+","+from[0]+";"+destLL[1]+","+destLL[0]+"?overview=full&geometries=geojson&steps=true&alternatives=true").then(function(r){return r.json()}).then(function(j){rl=rankRoutes(j.routes);if(!rl.length)throw 0;failed=0;offCount=0;useRoute(0);routing=false;status(false);
  if(!started){started=true;fit()}else if(!driving)fit();upd(from)}).catch(function(){routing=false;status(false);if(++failed>2||!coords.length){coords=[from,destLL];steps=[];alts=[];roads=[];straight=true;total=hav(from,destLL);dur=total/13;draw(coords);if(line)line.setStyle({dashArray:"2 14"});if(!started){started=true;fit()}upd(from)}})}
function fit(){if(!line||driving||!map||vm>0)return;var h=($(".sheet")||{}).offsetHeight||200;var tp=($(".top")||{}).offsetHeight||130;map.invalidateSize();map.fitBounds(line.getBounds(),{paddingTopLeft:[36,tp+24],paddingBottomRight:[36,h+30],maxZoom:17,animate:false})}
function rot(mod,type){if(/roundabout|rotary/.test(type))return 0;return({"straight":0,"slight right":35,"right":90,"sharp right":135,"uturn":180,"sharp left":-135,"left":-90,"slight left":-35})[mod]||0}
function words(s){var m=s.mod,t=s.type,nm=s.name?(" onto "+s.name):"";
 if(t==="arrive")return"Arrive at destination";
 if(/roundabout|rotary/.test(t))return"Take the roundabout"+(s.exit?" · exit "+s.exit:"");
 if(t==="fork")return"Keep "+(/left/.test(m)?"left":"right")+nm;
 if(m==="uturn")return"Make a U-turn";
 if(m==="straight"||!m)return"Continue straight"+(s.name?" on "+s.name:"");
 return(/slight/.test(m)?"Bear ":/sharp/.test(m)?"Sharp ":"Turn ")+(m.replace(/slight |sharp /,""))+nm}
function setTurn(a,b,deg,ic){lastTurn=a+" "+b;if(aiShow)return;var t=$(".turn");if(!t)return;t.querySelector("small").textContent=a;t.querySelector("b").textContent=b;var i=t.querySelector(".ti");i.innerHTML=ic==="flag"?IC.flag:IC.arr;var s=i.firstChild;if(s&&ic!=="flag")s.style.transform="rotate("+smooth(deg)+"deg)"}
function upd(p){if(!coords.length||!el)return;var n=near(p),bi=n[0],bd=n[1];
 if(bd>80&&!routing&&Date.now()-lastRoute>6000){if(++offCount>=2||!driving){getRoute(p);return}}else if(bd<=80)offCount=0;
 var rem=bd;for(var j=bi;j<coords.length-1;j++)rem+=hav(coords[j],coords[j+1]);
 var t=total?dur*rem/total:0;remM=rem;remT=t;$(".km").textContent=fmtD(rem);$(".tm").textContent=fmtT(t);
 if(coords.length>1)roadB=brg(p,ahead(p,bi,90));if(!el.classList.contains("hr")){el.classList.add("hr");sh()}
 if(!driving&&!routing&&rem>=30){var tg=ahead(p,bi,90);setTurn("Route ready \u00b7 "+fmtD(rem),"Follow the arrow to "+title(),brg(p,tg),"arr")}
 var eta=new Date(Date.now()+t*1000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
 $(".eta").textContent=eta;var s1=$(".s-km"),s2=$(".s-eta"),s3=$(".st b");if(s1)s1.textContent=fmtD(rem);if(s2)s2.textContent=eta;if(s3)s3.textContent=fmtT(t);
 if(driving&&!routing){
  if(rem<30){setTurn("You have arrived",title(),0,"flag")}
  else{var nx=null;for(var k=0;k<steps.length;k++)if(steps[k].idx>bi){nx=steps[k];break}
   if(nx){var dd=hav(p,coords[Math.min(coords.length-1,bi+1)]);for(var m=bi+1;m<nx.idx;m++)dd+=hav(coords[m],coords[m+1]);setTurn("In "+fmtD(dd),words(nx),brg(p,ahead(p,bi,Math.min(120,Math.max(40,dd)))),nx.type==="arrive"?"flag":"arr")}
   else setTurn("Continue",fmtD(rem)+" to "+title(),brg(p,ahead(p,bi,90)),"arr")}
  var rest=[p].concat(coords.slice(bi+1));casing.setLatLngs(rest);line.setLatLngs(rest);if(Date.now()-lastChev>2500){lastChev=Date.now();drawChev(rest)}}}
function title(){return String(q).split(",")[0]}
function weather(p){if(wxDone||!p)return;wxDone=true;fetch("https://api.open-meteo.com/v1/forecast?latitude="+p[0]+"&longitude="+p[1]+"&current=temperature_2m,weather_code").then(function(r){return r.json()}).then(function(j){var c=j.current;if(!c||!el)return;var w=c.weather_code,e=w===0?"☀️":w<3?"⛅":w<50?"☁️":w<70?"🌧️":w<80?"🌨️":w<95?"🌦️":"⛈️";var x=$(".wx");x.textContent=e+" "+Math.round(c.temperature_2m)+"°";x.classList.add("on")}).catch(function(){})}
/* compass: arrow follows the way the phone points (N = north), instant, no smoothing */
var devHead=null,oriRaf=0,oriAsk=0;
function onOri(e){var h=null;if(typeof e.webkitCompassHeading==="number"&&!isNaN(e.webkitCompassHeading))h=e.webkitCompassHeading;else if(e.alpha!=null&&(e.absolute||e.type==="deviceorientationabsolute"))h=360-e.alpha;if(h==null)return;var sa=0;try{sa=(screen.orientation&&screen.orientation.angle)||window.orientation||0}catch(_){}h=((h+sa)%360+360)%360;devHead=h;if(!oriRaf){oriRaf=requestAnimationFrame(function(){oriRaf=0;if(el&&me&&devHead!=null)arrowTo(devHead)})}}
addEventListener("deviceorientationabsolute",onOri,true);addEventListener("deviceorientation",onOri,true);
function askOri(){if(oriAsk||!el)return;var D=window.DeviceOrientationEvent;if(D&&typeof D.requestPermission==="function"){oriAsk=1;D.requestPermission().then(function(r){if(r!=="granted")oriAsk=0}).catch(function(){oriAsk=0})}}
["touchend","pointerup","click"].forEach(function(t){document.addEventListener(t,askOri,true)});
function faceRoute(){if(!me)return;if(devHead!=null){arrowTo(devHead);return}var d=null;if(coords.length>1&&lastP){var nr=near(lastP),bi=nr[0],a,b;if(bi>=coords.length-1){a=coords[coords.length-2];b=coords[coords.length-1]}else{a=coords[bi];b=ahead(lastP,bi,25);if(b===a)b=coords[bi+1]}
 d=nr[1]>35?brg(lastP,ahead(lastP,bi,40)):brg(a,b)}else if(lastHead!=null)d=lastHead;arrowTo(d)}
setInterval(function(){if(el&&me)faceRoute()},1000);
var manDeg=0,arD=0,arSet=false;function paintArrow(){if(!me||!arSet)return;var e=me.getElement&&me.getElement();var a=e&&e.querySelector(".ar");if(a)a.style.transform="rotate("+(arD-(vm?viewDeg:0))+"deg)"}
function arrowTo(d){if(d==null||isNaN(d))return;var diff=((d-arD)%360+540)%360-180;arD=arSet?arD+diff:d;arSet=true;paintArrow()}
function onPos(pos){lastFix=Date.now();var p=[pos.coords.latitude,pos.coords.longitude];lastP=p;var hh=pos.coords.heading;if(typeof hh==="number"&&!isNaN(hh))lastHead=hh;weather(p);
 if(!me){me=L.marker(p,{icon:L.divIcon({className:"nv-meic",html:'<div class="nv-me"><i></i><b class="ar"></b></div>',iconSize:[22,22],iconAnchor:[11,11]}),zIndexOffset:900}).addTo(map)}else me.setLatLng(p);
 if(!coords.length){if(!routing&&Date.now()-lastRoute>3000&&destLL)getRoute(p);else if(!destLL&&!routing&&Date.now()-lastRoute>3000)geo(q,function(d){destLL=d;getRoute(p)});return}
 upd(p);faceRoute();lastSpd=Math.round((pos.coords.speed||0)*3.6);var s=$(".spv");if(s)s.textContent=lastSpd;
 if(vm>0&&follow&&vm!==3)map.setView(p,Math.max(map.getZoom(),16),{animate:true,duration:1,easeLinearity:1,noMoveStart:true});else if(driving&&follow&&vm!==3)map.setView(p,Math.max(map.getZoom(),17),{animate:true,duration:1,easeLinearity:1,noMoveStart:true});applyView()}
function nvSize(){if(!el)return;var vv=window.visualViewport,h=Math.round((vv&&vv.height)||window.innerHeight||document.documentElement.clientHeight||0);if(h<200)return;el.style.setProperty("--nvh",h+"px");el.style.height=h+"px";el.style.bottom="auto";el.style.top="0";sh()}
if(!window.__nvSizeOn){window.__nvSizeOn=1;var _nvr=function(){try{nvSize()}catch(e){}};window.addEventListener("resize",_nvr);window.addEventListener("orientationchange",function(){setTimeout(_nvr,150)});if(window.visualViewport)window.visualViewport.addEventListener("resize",_nvr)}
function sh(){if(!el)return;var b=$(".sheet"),d=$(".drv"),h=(el.classList.contains("pre")?b:d).offsetHeight+8;el.style.setProperty("--sh",h+"px")}
function setDest(d,inf){destLL=d;info=inf||info;if(!el||!map)return;if(dest)map.removeLayer(dest);dest=L.marker(d,{icon:opIcon(title()),zIndexOffset:500}).addTo(map);if(!lastP)map.setView(d,14);
 if(info){var sub=$(".nm small");if(sub){var rest=String(q).split(",").slice(1).join(",").trim()||String(info.full||"").split(",").slice(1,4).join(",").trim();sub.textContent=rest}
  var c=$(".acts .call"),w=$(".acts .web");if(c&&info.phone){c.href="tel:"+info.phone.split(/[;,]/)[0].replace(/\s/g,"");c.classList.remove("off")}
  if(w&&info.web){w.href=/^https?:/i.test(info.web)?info.web:"https://"+info.web;w.classList.remove("off")}
  if(info.hours){var hb=$(".s-hr");if(hb){hb.parentNode.style.display="";hb.textContent=info.hours.split(";")[0].slice(0,22)}}}}
function search(v,near){v=String(v||"").trim();if(!v)return;
 if(!window.XMM_PLACES){q=v;coords=[];steps=[];destLL=null;info=null;started=false;if(line){map.removeLayer(line);map.removeLayer(casing);line=null;casing=null}$(".nm b").textContent=title();$(".nm small").textContent="";status(true,"Searching\u2026");
  geoFull(v,function(i){status(false);setDest(i.ll,i);if(lastP)getRoute(lastP)},function(){status(true,"Place not found");setTimeout(function(){status(false)},2000)});return}
 status(true,"Searching\u2026");var my=v;search.k=v;
 XMM_PLACES.search(v,lastP,!!near).then(function(res){if(!el||search.k!==my)return;status(false);if(!res.length){status(true,"Place not found");setTimeout(function(){status(false)},2000);hideRes();return}showRes(res)}).catch(function(){status(true,"Search failed");setTimeout(function(){status(false)},2000)})}
function hideRes(){var r=$(".res");if(r){r.classList.remove("on");r.innerHTML=""}RES=[]}
function showRes(res){var r=$(".res");if(!r)return;RES=res;r.innerHTML=(res.length>1?'<div class="xp-h">Choose a place</div>':'')+XMM_PLACES.list(res,true)+'<button type="button" class="xp-x">Close</button>';r.classList.add("on");XMM_PLACES.fill(r,res);r.onclick=function(e){var x=e.target;if(x.closest&&x.closest(".xp-x")){hideRes();return}var row=x.closest&&x.closest(".xp-row");if(row){var it=RES[+row.dataset.i];if(it){var go=!!(x.closest&&x.closest(".xp-start"));choose(it);if(go)autoGo()}}}}
function autoGo(){var n=0,my=q,iv=setInterval(function(){if(!el||q!==my||++n>60){clearInterval(iv);return}if(coords.length&&!driving){clearInterval(iv);var b=$(".st");if(b)b.click()}},250)}
function choose(r){var o=r.o,v=o.display_name||XMM_PLACES.nameOf(o),x=o.extratags||{};hideRes();q=v;coords=[];steps=[];destLL=null;info=null;started=false;if(line){map.removeLayer(line);map.removeLayer(casing);line=null;casing=null}
 var i={ll:r.ll,full:v,phone:x.phone||x["contact:phone"]||"",web:x.website||x["contact:website"]||"",hours:x.opening_hours||""};GI[v]=i;GC[v]=i.ll;var inp=$(".sbar input");if(inp)inp.value=title();$(".nm b").textContent=title();$(".nm small").textContent="";
 if(m3sig)m3sig="";setDest(i.ll,i);if(lastP)getRoute(lastP)}
var CATS=[[XMI("gas"),"Gas","fuel"],[XMI("food"),"Food","restaurant"],[XMI("coffee"),"Coffee","cafe"],[XMI("parking"),"Parking","parking"],[XMI("pharmacy"),"Pharmacy","pharmacy"],[XMI("atm"),"ATM","atm"],[XMI("mall"),"Mall","shopping mall"]];
function showCats(){var r=$(".res");if(!r||r.classList.contains("on"))return;r.innerHTML='<div class="xp-cats">'+CATS.map(function(c,i){return'<button type="button" data-c="'+i+'"><i>'+c[0]+'</i>'+c[1]+'</button>'}).join("")+'</div>';r.classList.add("on","cats");r.onclick=function(e){var b=e.target.closest&&e.target.closest("[data-c]");if(!b)return;r.classList.remove("cats");r.classList.remove("on");search(CATS[+b.dataset.c][2],true)}}
/* ---- map styles + real 3D (MapLibre) ---- */
function mkTile(t){var o={maxZoom:19,keepBuffer:3,updateWhenIdle:false,updateWhenZooming:false,referrerPolicy:"origin"},ly,er=0;
 if(t==="sat"){o.attribution="Tiles \u00A9 Esri";return L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",o)}
 o.attribution="\u00A9 OpenStreetMap contributors";ly=L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",o);
 ly.on("tileerror",function(){if(++er===4){ly.options.subdomains="abc";ly.setUrl("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png")}});return ly}
function setTheme(t){th=t;try{localStorage.setItem("xmm.nvth",t)}catch(e){}if(!el)return;el.classList.toggle("dk",t==="dark");el.classList.toggle("lt",t!=="dark");el.classList.toggle("sat",t==="sat");if(map){if(tl)map.removeLayer(tl);tl=mkTile(t).addTo(map)}if(m3){m3ready=false;m3.setStyle(m3Style())}}
function cycleTheme(){var n={dark:"light",light:"sat",sat:"dark"}[th]||"dark";setTheme(n);status(true,{dark:"Dark map",light:"Light map",sat:"Satellite"}[n]);setTimeout(function(){status(false)},1100)}
function m3Style(){return "https://tiles.openfreemap.org/styles/liberty"}
var GLQ=[],GLS=0;function loadGL(cb){if(window.maplibregl)return cb(true);GLQ.push(cb);if(GLS)return;GLS=1;var l=document.createElement("link");l.rel="stylesheet";l.href="https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.css";document.head.appendChild(l);var sc=document.createElement("script");sc.src="https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js";sc.onload=function(){GLS=2;GLQ.splice(0).forEach(function(f){f(true)})};sc.onerror=function(){GLS=0;GLQ.splice(0).forEach(function(f){f(false)})};document.head.appendChild(sc)}
function m3Layers(){if(!m3)return;var st,sid,sym;try{st=m3.getStyle();sid=Object.keys(st.sources).filter(function(k){return st.sources[k].type==="vector"})[0];sym=(st.layers.filter(function(l){return l.type==="symbol"})[0]||{}).id}catch(e){}
 try{if(m3.getLayer("building-3d"))m3.removeLayer("building-3d")}catch(e){}
 try{if(!m3.getSource("xmm-route"))m3.addSource("xmm-route",{type:"geojson",data:{type:"FeatureCollection",features:[]}});
  if(!m3.getLayer("xmm-rc"))m3.addLayer({id:"xmm-rc",type:"line",source:"xmm-route",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#fff","line-width":11,"line-opacity":.95}});
  if(!m3.getLayer("xmm-rl"))m3.addLayer({id:"xmm-rl",type:"line",source:"xmm-route",layout:{"line-cap":"round","line-join":"round"},paint:{"line-color":"#0a84ff","line-width":6.5}})}catch(e){}
 try{if(sid&&!m3.getLayer("xmm-3d"))m3.addLayer({id:"xmm-3d",type:"fill-extrusion",source:sid,"source-layer":"building",minzoom:14,paint:{"fill-extrusion-color":"#d8d2c8","fill-extrusion-height":["coalesce",["get","render_height"],["get","height"],12],"fill-extrusion-base":["coalesce",["get","render_min_height"],["get","min_height"],0],"fill-extrusion-opacity":.9}},"xmm-rc")}catch(e){}
 m3ready=!!(m3.getLayer("xmm-rl"));m3sig="";m3last=null;m3Sync()}
function toggle3D(){return;if(!el||!map)return;if(m3on){m3on=false;el.classList.remove("d3on");clearInterval(m3t);m3t=null;if(m3){var c=m3.getCenter();map.setView([c.lat,c.lng],Math.min(19,Math.round(m3.getZoom()+1)),{animate:false})}return}
 status(true,"Loading 3D\u2026");loadGL(function(ok){status(false);if(!el||!map)return;if(!ok||!window.maplibregl){status(true,"3D is not available");setTimeout(function(){status(false)},1800);return}
  var c=map.getCenter();m3on=true;el.classList.add("d3on");
  if(!m3){m3=new maplibregl.Map({container:$(".m3d"),style:m3Style(),center:[c.lng,c.lat],zoom:Math.max(1,map.getZoom()-1),pitch:62,bearing:0,maxPitch:80,attributionControl:{compact:true}});m3.on("style.load",m3Layers);m3.on("dragstart",function(){follow=false});m3.on("error",function(){})}
  else{m3.jumpTo({center:[c.lng,c.lat],zoom:Math.max(1,map.getZoom()-1),pitch:62});m3.resize()}
  m3sig="";m3last=null;clearInterval(m3t);m3t=setInterval(m3Sync,300);var wd=m3;setTimeout(function(){if(m3on&&m3===wd&&!m3ready)toggle3D()},7000);status(true,"3D map");setTimeout(function(){status(false)},1100)})}
function m3Mark(cls){var d=document.createElement("div");d.className=cls;return d}
function m3Sync(){if(!m3||!m3on||!el)return;if(!m3ready||!m3.getLayer("xmm-rl")){try{if(m3.isStyleLoaded())m3Layers()}catch(e){}if(!m3ready)return}
 var sig=coords.length+"|"+(coords[0]||[]).join()+"|"+(coords[coords.length-1]||[]).join()+"|"+th;
 if(sig!==m3sig){m3sig=sig;var src=m3.getSource("xmm-route");if(src&&coords.length>1)src.setData({type:"Feature",geometry:{type:"LineString",coordinates:coords.map(function(c){return[c[1],c[0]]})}});
  if(coords.length>1&&!driving){var b=new maplibregl.LngLatBounds();coords.forEach(function(c){b.extend([c[1],c[0]])});if(lastP)b.extend([lastP[1],lastP[0]]);var sh0=($(".sheet")||{}).offsetHeight||220;m3.fitBounds(b,{padding:{top:170,bottom:sh0+40,left:40,right:70},pitch:58,duration:900,maxZoom:17})}}
 var dl=dest&&dest.getLatLng?dest.getLatLng():null;if(dl){if(!m3dm)m3dm=new maplibregl.Marker({element:m3Mark("m3-d")}).setLngLat([dl.lng,dl.lat]).addTo(m3);else m3dm.setLngLat([dl.lng,dl.lat])}
 if(lastP){if(!m3mk)m3mk=new maplibregl.Marker({element:m3Mark("m3-u"),pitchAlignment:"map",rotationAlignment:"map"}).setLngLat([lastP[1],lastP[0]]).addTo(m3);else m3mk.setLngLat([lastP[1],lastP[0]]);
  if(follow&&(driving||!coords.length)&&(!m3last||m3last[0]!==lastP[0]||m3last[1]!==lastP[1])){m3last=lastP;var br=driving?(lastHead!=null?lastHead:(roadB!=null?roadB:m3.getBearing())):m3.getBearing();m3.easeTo({center:[lastP[1],lastP[0]],bearing:br,pitch:driving?66:58,zoom:driving?17:Math.max(m3.getZoom(),15),duration:350,essential:true})}}}
function open(query,ll){close();q=query;destLL=ll||null;info=null;started=false;driving=false;follow=true;coords=[];steps=[];me=null;line=null;casing=null;failed=0;lastRoute=0;routing=false;offCount=0;wxDone=false;chev=null;lastChev=0;lastDeg=0;vm=0;viewDeg=0;lastHead=null;roadB=null;
 if(!navigator.geolocation){alert("Location is not supported");return}
 css();el=document.createElement("div");el.id="nv";el.className="pre "+(th==="dark"?"dk":"lt")+(th==="sat"?" sat":"");m3=null;m3on=false;m3mk=null;m3dm=null;m3last=null;m3sig="";RES=[];
 el.innerHTML='<div class="map"></div><div class="m3d"></div><div class="fade"></div><div class="nv-attr">© OpenStreetMap</div>'+
 '<div class="top"><div class="wx gl"></div><div class="sbar gl">'+IC.search+'<input type="text" placeholder="Search Maps" enterkeyhint="search"><button class="av" aria-label="Close">'+'✕'+'</button></div><div class="res gl"></div>'+
 '<div class="turn gl"><div class="ti">'+IC.arr+'</div><div class="tt"><small>Starting…</small><b>Calculating route…</b></div></div><div class="rcl gl"><i></i><span>Calculating route…</span></div></div>'+
 '<div class="spd gl"><b class="spv">0</b><small>KM/H</small></div>'+
 '<div class="dial gl" aria-label="Rotate view"><i><b>N</b></i><u></u></div><div class="fabs gl"><button class="cmp" aria-label="View angle">'+IC.cmp+'</button><button class="lyr" aria-label="Map style">'+IC.lyr+'</button><button class="aib" aria-label="Ask AI">'+IC.ai+'</button><button class="txb" aria-label="Type to AI">'+IC.txt+'</button><button class="rc" aria-label="My location">'+IC.loc+'</button><button class="zi" aria-label="Zoom in">+</button><button class="zo" aria-label="Zoom out">−</button></div>'+
 '<div class="sheet gl"><div class="hd"><button class="rb shr" aria-label="Share">'+IC.share+'</button><div class="nm"><b></b><small></small></div><button class="rb cls" aria-label="Close">'+IC.x+'</button></div>'+
 '<div class="acts"><button class="st">'+IC.car+'<b>--</b></button><a class="call off" role="button">'+IC.call+'Call</a><a class="web off" target="_blank" rel="noopener" role="button">'+IC.web+'Website</a></div>'+
 '<div class="rts"></div><div class="stats"><div><small>Distance</small><b class="s-km">--</b></div><div><small>Arrive</small><b class="s-eta">--</b></div><div style="display:none"><small>Hours</small><b class="s-hr"></b></div></div></div>'+
 '<div class="aip gl"><div class="aih"><span>Ask about the road</span><button class="aix" aria-label="Close AI">'+IC.x+'</button></div><div class="aio"></div><div class="aic"><button data-q="Is there another road I can take?">Other roads?</button><button data-q="How long until I arrive?">How long?</button><button data-q="What is my next turn?">Next turn?</button><button data-q="Is there a road to the destination?">Road available?</button></div><div class="air"><button class="mic" aria-label="Talk">'+IC.mic+'</button><input type="text" placeholder="Ask about the road…" enterkeyhint="send"></div></div>'+
 '<div class="drv gl"><div class="row"><div><b class="tm">--</b><small>time left</small></div><div><b class="km">--</b><small>distance</small></div><div><b class="eta">--</b><small>arrive</small></div><button class="ex">End</button></div></div>';
 document.body.appendChild(el);nvSize();manDeg=0;
 (function(){var dl=el.querySelector(".dial"),mp=el.querySelector(".map"),st=null,pn=null;
  function ang(e){var r=dl.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI}
  dl.addEventListener("pointerdown",function(e){e.preventDefault();try{dl.setPointerCapture(e.pointerId)}catch(_){}st={a:ang(e),m:vm===3?manDeg:(vm?viewDeg:0),moved:0,t:Date.now()};el.classList.add("dg")});
  dl.addEventListener("pointermove",function(e){if(!st)return;var da=ang(e)-st.a;da=((da+540)%360)-180;if(Math.abs(da)>3)st.moved=1;if(!st.moved)return;manDeg=st.m-da;if(vm!==3){setVM(3)}applyView()});
  function end(){if(!st)return;var s=st;st=null;el.classList.remove("dg");if(!s.moved){if(vm)setVM(0);else{manDeg=0}}}
  dl.addEventListener("pointerup",end);dl.addEventListener("pointercancel",end);
  mp.addEventListener("pointerdown",function(e){if(vm!==3||e.target.closest&&e.target.closest(".leaflet-control"))return;pn={x:e.clientX,y:e.clientY,id:e.pointerId};try{mp.setPointerCapture(e.pointerId)}catch(_){}});
  mp.addEventListener("pointermove",function(e){if(!pn||pn.id!==e.pointerId||vm!==3)return;var dx=e.clientX-pn.x,dy=e.clientY-pn.y;pn.x=e.clientX;pn.y=e.clientY;var r=manDeg*Math.PI/180,c=Math.cos(r),s=Math.sin(r);var vx=dx*c-dy*s,vy=dx*s+dy*c;follow=false;map.panBy([-vx,-vy],{animate:false})});
  var up=function(e){if(pn&&pn.id===e.pointerId)pn=null};mp.addEventListener("pointerup",up);mp.addEventListener("pointercancel",up)})();$(".nm b").textContent=title();
 var inp=$(".sbar input");inp.value=title();inp.addEventListener("keydown",function(e){if(e.key==="Enter"){inp.blur();search(inp.value)}});inp.addEventListener("focus",function(){inp.select();if(!RES.length)showCats()});inp.addEventListener("input",function(){var r=$(".res");if(r&&r.classList.contains("cats")){r.classList.remove("on","cats");r.innerHTML=""}});
 $(".sbar .av").onclick=close;$(".cls").onclick=close;$(".rts").onclick=function(e){var b=e.target.closest&&e.target.closest("button");if(!b)return;useRoute(+b.dataset.i);if(!driving)fit();upd(lastP||coords[0])};$(".ex").onclick=close;
 $(".shr").onclick=function(){var u="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);if(navigator.share)navigator.share({title:title(),url:u}).catch(function(){});else if(navigator.clipboard){navigator.clipboard.writeText(u);status(true,"Link copied");setTimeout(function(){status(false)},1500)}};
 $(".st").onclick=function(){if(!coords.length)return;driving=true;follow=true;el.classList.remove("pre");sh();setTurn("Starting…","Follow the blue line",0,"arr");if(lastP){map.setView(lastP,17);var r=[lastP].concat(coords);casing.setLatLngs(r);line.setLatLngs(r);upd(lastP)}};
 $(".rc").onclick=function(){follow=true;m3last=null;if(lastP){if(driving)map.setView(lastP,17);else map.setView(lastP,15)}else if(line)fit()};
 $(".cmp").onclick=function(){setVM((vm+1)%2)};$(".aib").onclick=function(){if(recOn){aiStop();return}aiOpen()};$(".txb").onclick=aiTxt;$(".aix").onclick=aiClose;$(".turn").onclick=function(){if(aiShow)aiHide()};$(".mic").onclick=aiMic;[].forEach.call(el.querySelectorAll(".aic button"),function(b){b.onclick=function(){aiAsk(b.getAttribute("data-q"))}});var ai_in=$(".air input");ai_in.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();ai_in.blur();aiAsk(ai_in.value)}});ai_in.addEventListener("focus",aiStop);
  $(".zi").onclick=function(){if(m3on&&m3)m3.zoomIn();else map.zoomIn()};$(".zo").onclick=function(){if(m3on&&m3)m3.zoomOut();else map.zoomOut()};$(".lyr").onclick=cycleTheme;
 if(window.ResizeObserver){ro=new ResizeObserver(sh);ro.observe($(".sheet"));ro.observe($(".drv"))}setTimeout(sh,60);
 load(function(){if(!el)return;map=L.map($(".map"),{zoomControl:false,attributionControl:true,preferCanvas:true,tap:false,zoomSnap:.5,fadeAnimation:true,markerZoomAnimation:false,inertia:true}).setView([52.1,5.3],6);
  tl=mkTile(th).addTo(map);
  var iv=function(){if(map){map.invalidateSize();if(el&&el.classList.contains("pre")&&line&&!lastP)fit()}};setTimeout(iv,0);setTimeout(iv,250);setTimeout(iv,800);
  onRz=function(){setTimeout(iv,120)};window.addEventListener("resize",onRz);window.addEventListener("orientationchange",onRz);if(window.visualViewport)window.visualViewport.addEventListener("resize",onRz);if(window.ResizeObserver){ro2=new ResizeObserver(iv);ro2.observe($(".map"))}
  map.on("dragstart",function(){follow=false});
  if(destLL)setDest(destLL);
  geoFull(q,function(i){if(!el)return;if(!destLL)setDest(i.ll,i);else setDest(destLL,i)},function(){if(!destLL)status(true,"Place not found")});
  function askLoc(){if(!el)return;var msg="Location is turned off for this site. Turn it on in your browser or phone settings and the map will find you automatically.";var c=el.querySelector(".lreq");if(c){var sm=c.querySelector("small");if(sm)sm.textContent=msg;var bt=c.querySelector("button");if(bt)bt.remove();c.style.display="flex";return}
 c=document.createElement("div");c.className="lreq gl";c.innerHTML='<i>'+IC.loc+'</i><b>Location is off</b><small>'+msg+'</small>';el.appendChild(c)}
 var hiAcc=true;function startW(){if(!el)return;if(wid!=null){try{navigator.geolocation.clearWatch(wid)}catch(e){}wid=null}wid=navigator.geolocation.watchPosition(function(p){var c=el&&el.querySelector(".lreq");if(c)c.style.display="none";onPos(p)},function(e){if(!el)return;if(e&&e.code===1){askLoc();return}if(hiAcc){hiAcc=false;startW();return}if(!lastP)status(true,"Can't get your location")},{enableHighAccuracy:hiAcc,maximumAge:hiAcc?0:30000,timeout:hiAcc?20000:30000})}
 function startGeo(){hiAcc=true;navigator.geolocation.getCurrentPosition(function(p){if(el&&!lastP)onPos(p)},function(e){if(el&&e&&e.code===1)askLoc()},{enableHighAccuracy:false,maximumAge:300000,timeout:12000});startW()}
 startGeo();try{if(navigator.permissions&&navigator.permissions.query){navigator.permissions.query({name:"geolocation"}).then(function(r){if(!el)return;if(r.state==="denied")askLoc();r.onchange=function(){if(!el)return;if(r.state==="granted"){var c=el.querySelector(".lreq");if(c)c.style.display="none";startGeo()}else if(r.state==="denied")askLoc()}},function(){})}}catch(e){}
 var lf=function(){if(!el||document.hidden||lastP)return;startGeo()};if(window.__xmmLF){document.removeEventListener("visibilitychange",window.__xmmLF);window.removeEventListener("focus",window.__xmmLF)}window.__xmmLF=lf;document.addEventListener("visibilitychange",lf);window.addEventListener("focus",lf);tick=setInterval(function(){if(!el||!driving||Date.now()-lastFix<1500)return;try{navigator.geolocation.getCurrentPosition(function(p){if(el)onPos(p)},function(){},{enableHighAccuracy:true,maximumAge:0,timeout:4000})}catch(e){}},1500)})}


/* view angle: 0 north up, 1 heading up, 2 road ahead (3D tilt, route pointing up) */
function smoothV(d){var diff=((d-viewDeg)%360+540)%360-180;viewDeg+=diff;return viewDeg}
function applyView(){if(!el)return;var m=$(".map");if(!m)return;var d=0;if(vm===3)d=manDeg;else if(vm===1)d=lastHead!=null?lastHead:(roadB!=null?roadB:0);else if(vm===2)d=roadB!=null?roadB:(lastHead!=null?lastHead:0);if(vm===3)viewDeg=d;else d=vm?smoothV(d):0;if(!vm)viewDeg=0;
 var tl=vm===2?42:0,ty=vm===2?Math.round(el.clientHeight*.2):(vm===1?Math.round(el.clientHeight*.12):0);
 el.style.setProperty("--un",d+"deg");el.style.setProperty("--sy",tl?(1/Math.cos(tl*Math.PI/180)).toFixed(3):"1");
 m.style.transform="translateY("+ty+"px) perspective(1000px) rotateX("+tl+"deg) rotate("+(-d)+"deg)";
 var c=$(".cmp .cn");if(c)c.style.transform="rotate("+(-d)+"deg)";var dl=$(".dial i");if(dl)dl.style.transform="rotate("+(-d)+"deg)";paintArrow()}
function setVM(n){if(!map||!el)return;vm=n;var c=map.getCenter(),z=map.getZoom();el.classList.toggle("rot",vm>0);el.classList.toggle("tilt",false);map.invalidateSize({animate:false});
 if(vm>0){map.dragging.disable();map.touchZoom.disable();map.doubleClickZoom.disable();if(vm!==3)follow=true;var t=lastP||[c.lat,c.lng];if(vm!==3)map.setView(t,Math.max(z,16),{animate:false})}
 else{map.dragging.enable();map.touchZoom.enable();map.doubleClickZoom.enable();map.setView(c,z,{animate:false});viewDeg=0;if(!driving&&line)fit()}
 var b=$(".cmp");if(b){b.classList.remove("m1","m2");if(vm&&vm<3)b.classList.add("m"+vm)}
 applyView();status(true,["North up","Heading up","","Free view"][vm]);setTimeout(function(){status(false)},1300)}
/* ---- AI road assistant: talk (voice) or type, reply in text ---- */
var SRC=window.SpeechRecognition||window.webkitSpeechRecognition;
function aiLang(){var m={en:"en-US",fa:"fa-IR",ar:"ar-SA",de:"de-DE",es:"es-ES",fr:"fr-FR",nl:"nl-NL",tr:"tr-TR"},l="en";try{l=localStorage.getItem("xmm.lang")||"en"}catch(e){}return m[l]||(l.length>2?l:navigator.language||"en-US")}
function aiCtx(){var o=[];o.push("Destination: "+(info&&info.full?info.full:q));if(lastP)o.push("Driver position: "+lastP[0].toFixed(5)+", "+lastP[1].toFixed(5));
 o.push("Mode: "+(driving?"driving now":"previewing the route"));
 if(straight)o.push("ROUTE STATUS: no drivable road route could be found (only a straight dashed line is shown). Tell the user honestly that no road connection was found or the routing service did not answer.");
 else if(coords.length){o.push("ROUTE STATUS: a drivable road route exists.");o.push("Remaining: "+fmtD(remM||total)+", about "+fmtT(remT||dur)+" (typical speed, no live traffic).");
  if(roads.length)o.push("Roads on the route in order: "+roads.slice(0,14).join(" > "));
  o.push(alts.length?"Alternative routes available: "+alts.slice(0,2).map(function(a,i){return(i+1)+") "+fmtD(a.d)+", "+fmtT(a.t)}).join("; ")+" (main route is "+fmtD(total)+", "+fmtT(dur)+")":"No alternative route was offered by the router.")}
 else o.push("ROUTE STATUS: still calculating.");
 if(lastTurn)o.push("Current instruction: "+lastTurn);if(driving)o.push("Speed: "+lastSpd+" km/h");var w=$(".wx");if(w&&w.textContent)o.push("Weather: "+w.textContent);return o.join("\n")}
function aiSay(t,cls){var tn=$(".turn");if(!tn||!el)return;aiShow=true;el.classList.add("airep");var sm=tn.querySelector("small"),bb=tn.querySelector("b"),ti=tn.querySelector(".ti");sm.textContent=cls==="e"?"AI":"AI \u00b7 tap to close";bb.textContent=t;if(ti)ti.innerHTML=IC.ai;clearTimeout(aiTimer);if(t!=="\u2026")aiTimer=setTimeout(aiHide,Math.min(20000,5000+String(t).length*70))}
function aiHide(){clearTimeout(aiTimer);if(!aiShow)return;aiShow=false;if(el)el.classList.remove("airep");if(!el)return;if(lastP&&coords.length)upd(lastP);else setTurn("Starting\u2026","Follow the blue line",0,"arr")}
function aiStop(){if(el)el.classList.remove("aion");if(rec){try{rec.onresult=rec.onend=rec.onerror=null;rec.stop()}catch(e){}rec=null}recOn=false;var m=$(".mic");if(m)m.classList.remove("on")}
function aiAsk(text){text=String(text||"").trim();if(!text)return;aiStop();var G=window.XMM_GROQ||(window.XMM_API&&window.XMM_API.groq);
 aiHist.push({role:"user",content:text});aiHist=aiHist.slice(-6);var inp=$(".air input");if(inp)inp.value="";
 if(!G){aiSay("The AI is not available right now.","e");return}
 if(aiAbort)try{aiAbort.abort()}catch(e){}aiAbort=new AbortController();var my=aiAbort;aiSay("…");
 var sys="You are the road assistant inside the XMM AI maps app. Answer the driver's question about the road, route, roads available, alternatives, distance, time, next turn or the trip, using ONLY the live trip data below plus general road knowledge. Be very short: 1 to 3 plain sentences, no markdown, no emojis. Reply in the same language the user spoke. You have no live traffic, closure or police data: if asked, say so briefly and suggest checking a live traffic app. Never invent road names, speeds or times that are not in the data. If the user is driving, keep it extra short.\n\nTRIP DATA:\n"+aiCtx();
 var msgs=[{role:"system",content:sys}].concat(aiHist.slice(-5));var cfg=(window.XMM_API&&window.XMM_API.CFG)||{};
 G(msgs,{model:cfg.FAST_MODEL||cfg.TEXT_MODEL,maxTokens:260,temp:.3,stream:true,signal:my.signal,onDelta:function(t){if(my!==aiAbort)return;aiSay(String(t||"").replace(/<think>[\s\S]*?(<\/think>|$)/g,"").trim()||"…")}}).then(function(r){if(my!==aiAbort)return;r=String(r||"").replace(/<think>[\s\S]*?<\/think>/g,"").trim();aiHist.push({role:"assistant",content:r});aiHist=aiHist.slice(-6);aiSay(r||"I could not answer that.")}).catch(function(e){if(my!==aiAbort||(e&&e.name==="AbortError"))return;aiSay((e&&e.message)||"Could not reach the AI. Try again.","e")})}
function aiNoVoice(m){aiTxt(true);aiSay(m||"Voice isn't available here. Type, or tap the mic on your keyboard.","e")}
function aiMic(){if(recOn){aiStop();return}if(!SRC){aiNoVoice();return}
 var r=new SRC(),got="",m=$(".mic");rec=r;recOn=true;r.lang=aiLang();r.interimResults=true;r.continuous=false;r.maxAlternatives=1;if(m)m.classList.add("on");if(el)el.classList.add("aion");var inp=$(".air input");
 r.onresult=function(e){got="";for(var i=0;i<e.results.length;i++)got+=e.results[i][0].transcript;if(inp)inp.value=got;if(e.results[e.results.length-1].isFinal){var t=got;aiStop();aiAsk(t)}};
 r.onerror=function(e){var c=e&&e.error;aiStop();if(c==="not-allowed"||c==="service-not-allowed")aiNoVoice("Mic is blocked. Allow it in Settings, or type / use the keyboard mic.");else if(c&&c!=="no-speech"&&c!=="aborted")aiSay("Could not hear you. Try again or type.","e")};
 r.onend=function(){var t=got;aiStop();if(t&&t.trim())aiAsk(t)};
 try{r.start()}catch(e){aiStop()}}
function aiOpen(){if(!el)return;if(aiShow)aiHide();if(!SRC){aiNoVoice();return}aiMic()}
function aiTxt(force){var p=$(".aip");if(!p)return;var on=force===true?true:!p.classList.contains("on");p.classList.toggle("on",on);sh();if(on){aiStop();var i=$(".air input");if(i)setTimeout(function(){try{i.focus()}catch(e){}},60)}}
function aiClose(){aiStop();if(aiAbort){try{aiAbort.abort()}catch(e){}aiAbort=null}var p=$(".aip");if(p)p.classList.remove("on");if(el)el.classList.remove("aion");aiHide()}
function close(){if(tick){clearInterval(tick);tick=null}aiStop();if(aiAbort){try{aiAbort.abort()}catch(e){}aiAbort=null}aiHist=[];if(wid!=null)navigator.geolocation.clearWatch(wid);wid=null;if(ro){ro.disconnect();ro=null}if(ro2){ro2.disconnect();ro2=null}if(onRz){window.removeEventListener("resize",onRz);window.removeEventListener("orientationchange",onRz);if(window.visualViewport)window.visualViewport.removeEventListener("resize",onRz);onRz=null}chev=null;if(m3t){clearInterval(m3t);m3t=null}if(m3){try{m3.remove()}catch(e){}m3=null}m3on=false;m3mk=null;m3dm=null;m3ready=false;tl=null;if(map){map.remove();map=null}if(el){el.remove();el=null}lastP=null;coords=[];steps=[];dest=null;me=null}
/* mini map preview inside chat place boxes */
function mini(){var n=document.querySelectorAll(".xe-mini[data-q]:not([data-done])");if(!n.length)return;load(function(){[].forEach.call(n,function(b){if(b.dataset.done)return;b.dataset.done=1;var qq=b.getAttribute("data-q"),ll=b.getAttribute("data-ll"),nm=b.getAttribute("data-n")||String(qq).split(",")[0];
 var go=function(d){try{var m=L.map(b,{zoomControl:false,attributionControl:true,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,tap:false}).setView([d[0]+0.0006,d[1]],15);L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,referrerPolicy:"origin",attribution:"© OpenStreetMap"}).addTo(m);L.marker(d,{icon:opIcon(nm)}).addTo(m)}catch(e){}};
 if(ll)go(ll.split(",").map(Number));else geo(qq,go,function(){b.textContent="Map not found"})})})}
var _mq=0;new MutationObserver(function(){if(_mq)return;_mq=setTimeout(function(){_mq=0;css();mini()},300)}).observe(document.body,{childList:true,subtree:true});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-xe=nav]");if(!b)return;e.preventDefault();e.stopPropagation();var ll=b.getAttribute("data-ll");open(b.getAttribute("data-q"),ll?ll.split(",").map(Number):null)},true);
window.XMM_NAV={open:open,close:close};
})();
