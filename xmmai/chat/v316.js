/* XMM AI v316 — Claude-style shell: sidebar, top bar, composer, settings, live Preview panel.
   Reuses the existing chat engine (messages, models, uploads, voice, Build) through its own DOM/API. */
(function(){"use strict";
var D=document,H=D.documentElement,B=D.body;
var hostA,hostB,srA,srB,CSS=`button{font-family:var(--sans);cursor:pointer;-webkit-tap-highlight-color:transparent;border:0;background:none;color:inherit;padding:0;margin:0;font:inherit;appearance:none;-webkit-appearance:none}
svg{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
input,textarea,select{font-family:var(--sans)}
/* XMM AI v316 — full Claude-style UI (sidebar, top bar, composer, settings, preview panel). Loaded last. */
*{box-sizing:border-box}
:host{--b0:#191919;--b1:#1f1f1f;--b2:#303030;--b3:#404040;--b4:#2a2a2a;--ln:#353535;--ln2:#2a2a2a;--tx:#efefef;--tx2:#c8c8c8;--mu:#9a9a9a;--ph:#808080;--ac:#d97757;--bl:#5aa0e8;--sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--serif:"Tiempos Text","Source Serif 4",Georgia,"Times New Roman",serif}
:host([data-th="light"]){--b0:#faf9f5;--b1:#f3f2ec;--b2:#ffffff;--b3:#e8e6dc;--b4:#eceae1;--ln:#e3e1d7;--ln2:#e3e1d7;--tx:#141413;--tx2:#3d3d3a;--mu:#73726c;--ph:#8a8880;--bl:#2a6fc4}
.v3-ib{width:32px;height:32px;border:0;border-radius:8px;background:none;color:var(--tx2);display:inline-grid;place-items:center;padding:0}
.v3-ib:hover{background:var(--b4);color:var(--tx)}
.v3-ib.sm{width:28px;height:28px}
.v3-ib.sm svg{width:16px;height:16px}

/* root */
#v3{position:fixed;left:0;top:var(--xtop,0px);right:0;height:calc(var(--app-h,100dvh) - var(--xtop,0px));z-index:50;display:flex;background:var(--b0);color:var(--tx);font:400 14px/1.4 var(--sans);--sw:288px;--pw:535px;overflow:hidden;transition:padding-right .22s ease}
#v3.pn{padding-right:var(--pw)}
#v3Ctr{position:relative;flex:1;min-width:0;height:100%}

/* sidebar */
#v3Side{flex:none;width:var(--sw);height:100%;background:var(--b1);display:flex;flex-direction:column;transition:margin-left .22s ease;overflow:hidden;z-index:3}
#v3.col #v3Side{margin-left:calc(-1 * var(--sw))}
.v3-sh{display:flex;align-items:center;gap:8px;height:44px;flex:none;padding:0 10px 0 17px;margin-top:0}
.v3-sh .v3-ib{margin-left:-6px}
.v3-wm{font:500 21px/1 var(--serif);letter-spacing:-.01em;color:var(--tx)}
.v3-nav{display:flex;flex-direction:column;padding:6px 0 0;flex:none}
.v3-nav button{display:flex;align-items:center;gap:12px;height:32px;margin:0 8px 2px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tx);font:400 14px var(--sans);text-align:left}
.v3-nav button svg{color:var(--tx2)}
.v3-nav button:hover{background:var(--b4)}
.v3-nav button.on{background:var(--b3)}
.v3-lh{display:flex;align-items:center;justify-content:space-between;margin:20px 8px 4px 18px;flex:none}
.v3-lh button.l{display:flex;align-items:center;gap:6px;border:0;background:none;color:var(--tx2);font:400 13px var(--sans);padding:0}
.v3-lh button.l svg{width:14px;height:14px}
.v3-list{flex:1;min-height:0;overflow-y:auto;padding:2px 0 8px;scrollbar-width:thin;scrollbar-color:var(--b3) transparent}
.v3-ci{display:flex;align-items:center;gap:12px;width:calc(100% - 16px);height:32px;margin:0 8px 2px;padding:0 6px 0 12px;border:0;border-radius:8px;background:none;color:var(--tx);font:400 14px var(--sans);text-align:left;position:relative}
.v3-ci i{flex:none;width:9px;height:9px;border-radius:50%;border:1.5px solid var(--mu);margin:0 4px 0 1px;opacity:.75}
.v3-ci span.t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v3-ci:hover{background:var(--b4)}
.v3-ci.on{background:var(--b3)}
.v3-ci .d{flex:none;width:26px;height:26px;border-radius:6px;display:none;place-items:center;color:var(--tx2)}
.v3-ci .d svg{width:16px;height:16px}
.v3-ci:hover .d,.v3-ci.on .d{display:grid}
.v3-ci .d:hover{background:rgba(127,127,127,.25)}
.v3-none{padding:6px 20px;color:var(--mu);font-size:13px}
.v3-user{flex:none;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:8px 10px 8px 8px;border-top:1px solid var(--ln2)}
.v3-user>button.u{display:flex;align-items:center;gap:10px;min-width:0;flex:1;height:44px;padding:0 8px;border:0;border-radius:8px;background:none;color:var(--tx);font:400 14px var(--sans);text-align:left}
.v3-user>button.u:hover{background:var(--b4)}
.v3-user .un{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--mu)}
.v3-user .un b{font-weight:500;color:var(--tx)}
.v3-user .un~svg{width:14px;height:14px;color:var(--mu)}
.v3-av{width:22px;height:22px;border-radius:50%;background:#1f9d2d;color:#fff;display:grid;place-items:center;font:600 12px var(--sans);flex:none;background-size:cover;background-position:center;overflow:hidden}

/* top bar */
#v3Top{position:absolute;left:0;right:0;top:0;height:45px;display:flex;align-items:center;gap:6px;padding:0 12px;z-index:4;background:var(--b0)}
#v3[data-empty="0"] #v3Top{border-bottom:1px solid var(--ln)}
#v3Menu{display:none}
#v3.col #v3Menu{display:inline-grid}
#v3Title{display:flex;align-items:center;gap:6px;height:32px;padding:0 10px;border:0;border-radius:8px;background:none;color:var(--tx);font:400 15px var(--sans);max-width:46%}
#v3Title:hover{background:var(--b4)}
#v3Title span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#v3Title svg{width:14px;height:14px;color:var(--tx2)}
#v3[data-empty="1"] #v3Title{display:none}
.v3-free{position:absolute;left:50%;top:9px;transform:translateX(-50%);display:none;align-items:center;height:30px;padding:0 12px;border-radius:9px;background:var(--b1);color:var(--mu);font:400 13px var(--sans);white-space:nowrap}
#v3[data-empty="1"] .v3-free{display:flex}
.v3-sp{flex:1}
.v3-pv{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 11px 0 10px;border:1px solid var(--ln)!important;border-radius:8px;background:var(--b2)!important;color:var(--tx);font:500 13.5px var(--sans)}
.v3-pv:hover{background:var(--b3)!important}
.v3-pv i,#v3Float i{display:none;width:7px;height:7px;border-radius:50%;background:var(--ac)}
.v3-pv.busy i,#v3Float.busy i{display:block;animation:v3p 1s ease-in-out infinite}
@keyframes v3p{50%{opacity:.25}}

/* old chat core inside the new frame */
#v3Main{position:absolute;left:0;right:0;top:45px;bottom:0;overflow:hidden}
#v3[data-view="other"] #v3Home,#v3[data-view="other"] #v3Dock{display:none!important}

/* greeting */
#v3Home{position:absolute;left:0;right:0;top:35.5%;transform:translateY(-50%);display:none;justify-content:center;padding:0 20px;pointer-events:none;z-index:2}
#v3[data-empty="1"] #v3Home{display:flex}
#v3Home h1{margin:0;display:flex;align-items:center;gap:12px;font:400 clamp(30px,4.2vw,42px)/1.2 var(--serif);letter-spacing:-.01em;color:var(--tx);text-align:center}
#v3Home h1 img{width:clamp(34px,4.4vw,46px);height:clamp(34px,4.4vw,46px);border-radius:22%;flex:none}

/* composer */
#v3Dock{position:absolute;left:0;right:0;bottom:0;padding:0 16px 6px;display:flex;flex-direction:column;align-items:center;pointer-events:none;z-index:3}
#v3[data-empty="1"] #v3Dock{top:43.4%;bottom:auto}
.v3-comp{pointer-events:auto;width:min(100%,768px);background:var(--b2);border-radius:20px;padding:14px 14px 10px 16px;box-shadow:0 1px 0 rgba(255,255,255,.02);transition:width .2s}
#v3[data-empty="1"] .v3-comp{width:min(100%,655px)}
:host([data-th="light"]) .v3-comp{box-shadow:0 2px 14px rgba(0,0,0,.08);border:1px solid var(--ln)}
.v3-comp #atts{display:flex!important;flex-wrap:wrap;gap:8px;padding:0 0 10px!important;margin:0!important;position:static!important;max-width:100%;background:none!important}
.v3-comp #atts:empty{display:none!important}
.v3-comp textarea{display:block;width:100%;min-height:26px;max-height:220px;resize:none;border:0;outline:0;background:transparent;color:var(--tx);font:400 16px/1.5 var(--sans);padding:0 2px 0 0;margin:0}
.v3-comp textarea::placeholder{color:var(--ph)}
.v3-row{display:flex;align-items:center;gap:6px;margin-top:10px}
.v3-seg{display:flex;background:var(--b4);border-radius:9px;padding:2px;margin-left:4px}
.v3-seg button{height:28px;padding:0 12px;border:0;border-radius:7px;background:none;color:var(--tx2);font:400 14px var(--sans)}
.v3-seg button.on{background:var(--b3);color:var(--tx)}
#v3[data-empty="0"] .v3-seg,#v3[data-empty="0"] .v3-model{display:none}
.v3-model{border:0;background:none;color:var(--tx2);font:400 14px var(--sans);height:32px;padding:0 8px;border-radius:8px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.v3-model:hover{background:var(--b4);color:var(--tx)}
.v3-model b{font-weight:500;color:var(--tx)}
.v3-mic.on{color:var(--ac);background:rgba(217,119,87,.16)}
.v3-go{width:34px;height:32px;border-radius:9px;border:0;background:var(--b4);color:var(--tx);display:grid;place-items:center;padding:0}
.v3-go:hover{background:var(--b3)}
.v3-go.send{background:var(--ac);color:#fff}
.v3-go svg{width:18px;height:18px}
.v3-foot{pointer-events:auto;width:min(100%,768px);display:flex;justify-content:space-between;align-items:center;gap:12px;padding:6px 6px 0;color:var(--mu);font:400 12px var(--sans)}
#v3[data-empty="1"] .v3-foot{display:none}
.v3-foot button{border:0;background:none;color:var(--mu);font:400 12px var(--sans);padding:2px 4px;border-radius:6px;white-space:nowrap}
.v3-foot button:hover{color:var(--tx)}

/* preview panel (fixed so it also works above Build) */
#v3Panel{position:fixed;top:var(--xtop,0px);right:0;bottom:auto;height:calc(var(--app-h,100dvh) - var(--xtop,0px));width:var(--pw,535px);max-width:100vw;z-index:100;background:var(--b0);color:var(--tx);border-left:1px solid var(--ln);display:none;flex-direction:column;font:400 14px/1.45 var(--sans);--pw:535px}
#v3Panel.on{display:flex}
.v3p-h{flex:none;height:45px;display:flex;align-items:center;justify-content:space-between;padding:0 12px 0 18px;border-bottom:1px solid var(--ln)}
.v3p-h b{font:500 15px var(--sans);display:flex;align-items:center;gap:8px}
.v3p-h b i{width:8px;height:8px;border-radius:50%;background:var(--mu)}
.v3p-h b i.busy{background:var(--ac);animation:v3p 1s ease-in-out infinite}
.v3p-h b i.done{background:#4cae6a}
.v3p-b{flex:1;min-height:0;overflow:auto;padding:18px}
.v3p-empty{height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 22%}
.v3p-empty small{color:var(--mu);font-size:12.5px;margin-bottom:12px}
.v3p-empty button{display:flex;align-items:center;gap:12px;border:0;background:none;color:var(--tx);font:400 15px var(--sans);padding:6px 0;text-align:left}
.v3p-empty button span.ic{width:28px;height:28px;border-radius:8px;display:grid;place-items:center}
.v3p-empty button svg{width:16px;height:16px}
.v3p-empty button:nth-of-type(1) .ic{background:#1a2531;color:#5aa0e8}
.v3p-empty button:nth-of-type(2) .ic{background:#33241a;color:#e0905a}
.v3p-empty button:nth-of-type(3) .ic{background:#261f38;color:#a78bfa}
.v3p-empty p{margin:22px 0 0;color:var(--mu);font-size:12.5px}
.v3p-card{border:1px solid var(--ln);background:var(--b1);border-radius:12px;padding:12px 14px;margin-bottom:14px}
.v3p-st{display:flex;align-items:center;gap:10px;font-weight:500}
.v3p-st .sp{width:14px;height:14px;border-radius:50%;border:2px solid var(--b3);border-top-color:var(--ac);animation:v3s .8s linear infinite;flex:none}
.v3p-st .ok{color:#4cae6a;display:grid}
.v3p-st em{margin-left:auto;font-style:normal;color:var(--mu);font-weight:400;font-size:12.5px}
@keyframes v3s{to{transform:rotate(360deg)}}
.v3p-t{font:500 12px var(--sans);color:var(--mu);text-transform:uppercase;letter-spacing:.04em;margin:16px 2px 8px}
.v3p-steps{display:flex;flex-direction:column;gap:6px}
.v3p-step{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:var(--tx2)}
.v3p-step i{flex:none;margin-top:5px;width:8px;height:8px;border-radius:50%;background:var(--b3)}
.v3p-step.done i{background:#4cae6a}
.v3p-step.act i{background:var(--ac);animation:v3p 1s ease-in-out infinite}
.v3p-step.act{color:var(--tx)}
.v3p-out{margin:0;max-height:48vh;overflow:auto;white-space:pre-wrap;word-break:break-word;background:var(--b1);border:1px solid var(--ln);border-radius:12px;padding:12px 14px;font:400 12.5px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--tx2)}
.v3p-files{display:flex;flex-wrap:wrap;gap:6px}
.v3p-files span{background:var(--b2);border-radius:7px;padding:3px 9px;font:400 12.5px ui-monospace,Menlo,Consolas,monospace;color:var(--tx2)}
.v3p-btn{margin-top:14px;height:34px;padding:0 14px;border:0;border-radius:8px;background:var(--b3);color:var(--tx);font:500 13.5px var(--sans)}
.v3p-btn:hover{filter:brightness(1.15)}
#v3Float{position:fixed;top:calc(var(--xtop,0px) + 9px);right:64px;z-index:101;display:none;align-items:center;gap:7px;height:32px;padding:0 11px;border:1px solid var(--ln);border-radius:8px;background:var(--b2);color:var(--tx);font:500 13.5px var(--sans)}
#v3Float.on{display:inline-flex}

/* chat search */
#v3Srch{position:fixed;inset:0;z-index:200003;background:rgba(0,0,0,.55);display:grid;place-items:start center;padding-top:12vh}
#v3Srch .bx{width:min(620px,calc(100% - 24px));max-height:70vh;display:flex;flex-direction:column;background:var(--b1);color:var(--tx);border:1px solid var(--ln);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
#v3Srch input{border:0;outline:0;background:none;color:var(--tx);font:400 16px var(--sans);padding:16px 18px;border-bottom:1px solid var(--ln)}
#v3Srch .rs{overflow:auto;padding:6px}
#v3Srch .rs button{display:block;width:100%;text-align:left;border:0;background:none;color:var(--tx);font:400 14.5px var(--sans);padding:10px 12px;border-radius:8px}
#v3Srch .rs button:hover{background:var(--b4)}
#v3Srch .rs p{margin:0;padding:14px;color:var(--mu)}

/* settings */
#v3Set{position:fixed;inset:0;z-index:200003;background:rgba(0,0,0,.58);display:grid;place-items:center}
#v3Set .m{width:min(1022px,calc(100% - 48px));height:min(735px,calc(100dvh - 34px));background:var(--b1);color:var(--tx);border:1px solid var(--ln2);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.55);font:400 14px/1.45 var(--sans)}
#v3Set .h{flex:none;display:flex;align-items:center;justify-content:space-between;height:60px;padding:0 14px 0 22px;border-bottom:1px solid var(--ln2)}
#v3Set .h h3{margin:0;font:500 16px var(--sans)}
#v3Set .v3-bk{display:none}
#v3Set nav .sl,#v3Set nav .bta{display:none}
#v3Set .c{flex:1;min-height:0;display:flex}
#v3Set nav{flex:none;width:212px;padding:16px 12px;display:flex;flex-direction:column;gap:2px;overflow:auto}
#v3Set nav .sr{display:flex;align-items:center;gap:8px;height:34px;padding:0 10px;background:var(--b4);border-radius:8px;color:var(--mu);margin-bottom:8px}
#v3Set nav .sr input{flex:1;min-width:0;border:0;outline:0;background:none;color:var(--tx);font:400 14px var(--sans)}
#v3Set nav button{display:flex;align-items:center;gap:12px;height:34px;padding:0 12px;border:0;border-radius:8px;background:none;color:var(--tx);font:400 14px var(--sans);text-align:left}
#v3Set nav button svg{color:var(--tx2)}
#v3Set nav button:hover{background:var(--b4)}
#v3Set nav button.on{background:var(--b3)}
#v3Set nav hr{border:0;border-top:1px solid var(--ln2);margin:8px 14px}
#v3Set .p{flex:1;min-width:0;overflow:auto;padding:22px 26px 28px;border-left:1px solid var(--ln2)}
#v3Set .p h4{margin:0 0 6px;font:500 15px var(--sans)}
#v3Set .row{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:15px 0;border-bottom:1px solid var(--ln2)}
#v3Set .row small{display:block;color:var(--mu);font-size:13px;margin-top:2px}
#v3Set .row>div:first-child{min-width:0}
#v3Set .in{width:230px;max-width:100%;height:34px;padding:0 12px;border:0;border-radius:8px;background:var(--b4);color:var(--tx);font:400 14px var(--sans);outline:0}
#v3Set select.in{appearance:none;-webkit-appearance:none;cursor:pointer}
#v3Set textarea.in{height:160px;width:100%;padding:10px 12px;resize:vertical;line-height:1.5}
#v3Set .bt{height:34px;padding:0 14px;border:0;border-radius:8px;background:var(--b3);color:var(--tx);font:400 14px var(--sans)}
#v3Set .bt:hover{filter:brightness(1.15)}
#v3Set .bt.dg{background:none;color:#ef6a5e;box-shadow:inset 0 0 0 1px rgba(239,106,94,.4)}
#v3Set .av{width:40px;height:40px;border-radius:50%;background:#1f9d2d;color:#fff;display:grid;place-items:center;font:600 16px var(--sans);border:0;background-size:cover;background-position:center;padding:0}
#v3Set .sec{margin:34px 0 8px;display:flex;align-items:center;justify-content:space-between;gap:12px}
#v3Set .sec b{font:500 15px var(--sans)}
#v3Set code{font:13px ui-monospace,Menlo,Consolas,monospace;color:var(--mu)}
#v3Set .cp{display:inline-flex;align-items:center;gap:8px}
#v3Set table{width:100%;border-collapse:collapse;margin-top:6px}
#v3Set th{text-align:left;font:400 13px var(--sans);color:var(--mu);padding:12px 0}
#v3Set td{padding:15px 0;border-top:1px solid var(--ln2);font-size:14px}
#v3Set .cur{margin-left:8px;padding:2px 8px;border-radius:6px;background:#1f2a36;color:var(--bl);font-size:12.5px}
:host([data-th="light"]) #v3Set .cur{background:#dbe9fb}
#v3Set .note{color:var(--mu);font-size:13px;margin:6px 0 0}
#v3Set .th{display:flex;gap:12px;flex-wrap:wrap;margin-top:12px}
#v3Set .th button{width:132px;height:92px;border:1px solid var(--ln);border-radius:12px;background:var(--b4);color:var(--tx);font:400 13.5px var(--sans);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
#v3Set .th button.on{border-color:var(--ac);box-shadow:0 0 0 1px var(--ac)}
#v3Set .th i{width:64px;height:34px;border-radius:7px;border:1px solid var(--ln)}
#v3Set .th i.l{background:#faf9f5}#v3Set .th i.d{background:#191919}#v3Set .th i.s{background:linear-gradient(90deg,#faf9f5 50%,#191919 50%)}
#v3Set .sw{position:relative;width:40px;height:23px;border-radius:12px;border:0;background:var(--b3);padding:0;flex:none}
#v3Set .sw::after{content:"";position:absolute;left:3px;top:3px;width:17px;height:17px;border-radius:50%;background:#fff;transition:left .15s}
#v3Set .sw.on{background:var(--ac)}
#v3Set .sw.on::after{left:20px}
#v3Set a{color:var(--bl)}
@media (max-width:899px){
 #v3{--sw:min(310px,86vw)}
 #v3Side{position:fixed;left:0;top:var(--xtop,0px);bottom:auto;height:calc(var(--app-h,100dvh) - var(--xtop,0px));width:var(--sw);padding-bottom:env(safe-area-inset-bottom,0px);z-index:200;margin-left:0!important;transform:translateX(-102%);transition:transform .24s ease;box-shadow:0 0 40px rgba(0,0,0,.5)}
 #v3.open #v3Side{transform:none}
 #v3Scrim{position:fixed;left:0;right:0;top:var(--xtop,0px);bottom:auto;height:calc(var(--app-h,100dvh) - var(--xtop,0px));z-index:190;background:rgba(0,0,0,.5);display:none}
 #v3.open #v3Scrim{display:block}
 #v3Menu{display:inline-grid!important}
 #v3.pn{padding-right:0}
 #v3Panel{width:100vw}
 .v3p-empty{padding:0 12%}
 #v3Top{padding:0 8px}
 .v3-pv span{display:none}
 .v3-pv{padding:0 8px}
 .v3-comp{border-radius:18px}
 .v3-model{max-width:120px}
 .v3-foot{font-size:11px}
 #v3Set .m{width:100%;height:calc(var(--app-h,100dvh) - var(--xtop,0px));margin-top:var(--xtop,0px);border-radius:0;border:0}
 #v3Set .c{flex-direction:column}
 #v3Set nav{width:100%;flex:1;min-height:0;flex-direction:column;overflow-y:auto;padding:4px 10px calc(env(safe-area-inset-bottom,0px) + 14px);gap:2px;border-bottom:0;background:var(--b1)}
 #v3Set nav .sr,#v3Set nav hr{display:none}
 #v3Set nav .sl{display:block;padding:18px 10px 6px;font:500 13px var(--sans);color:var(--mu)}
 #v3Set nav .bta{display:flex;align-items:center;gap:12px;height:44px;padding:0 10px;font-size:15px;background:none;color:var(--tx);width:100%}
 #v3Set nav button{flex:none;height:44px;padding:0 10px;background:none;border-radius:10px;font-size:15px;width:100%}
 #v3Set nav button svg{display:block}
 #v3Set nav button.on{background:var(--b4)}
 #v3Set.mm nav button.on{background:none}
 #v3Set.pg nav{display:none}
 #v3Set.mm .p{display:none}
 #v3Set.mm .h{display:none}
 #v3Set .m,#v3Set .h,#v3Set .p{background:var(--b1)}
 #v3Set .h{border-bottom:0}
 #v3Set .p{border-left:0;padding:16px;flex:1}
 #v3Set .v3-bk{display:inline-grid}
 #v3Set.mm .v3-bk{display:none}
 #v3Set .h{justify-content:flex-start;gap:6px;padding:0 10px}
 #v3Set .h h3{flex:1;font-size:17px}
 #v3Set.pg #v3SX{display:none}
 #v3Set .row{flex-wrap:wrap}
 #v3Set .in{width:100%}
 #v3Set table{font-size:13px}
 #v3Set .row{flex-wrap:nowrap;gap:12px}
 #v3Set .row:has(.in){flex-direction:column;align-items:stretch;gap:10px}
 #v3Set .row:has(.in)>div{width:100%;min-width:0}
 #v3Set .row .in{width:100%;max-width:100%;box-sizing:border-box}
 #v3Set .row>div:last-child{flex:none;max-width:60%}
 #v3Set .row:has(.in)>div:last-child{max-width:100%}
 #v3Set .row:has(.cp){flex-direction:column;align-items:stretch;gap:8px}
 #v3Set .row:has(.cp)>div:last-child{max-width:100%}
 #v3Set .cp{display:flex;width:100%;min-width:0;justify-content:space-between}
 #v3Set .cp code{min-width:0;overflow-wrap:anywhere;word-break:break-all;font-size:12px}
 #v3Set .sec{flex-wrap:wrap;margin-top:26px}
 #v3Set table,#v3Set tbody,#v3Set tr,#v3Set td{display:block;width:100%}
 #v3Set thead{display:none}
 #v3Set tr{border-top:1px solid var(--ln2);padding:6px 0}
 #v3Set td{display:flex;justify-content:space-between;gap:12px;border:0;padding:8px 0;text-align:right}
 #v3Set td::before{content:attr(data-l);color:var(--mu);text-align:left;flex:none}
 #v3Set .th{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
 #v3Set .th button{width:100%;height:84px}
 #v3Set .p{overflow-x:hidden;word-break:break-word}
 #v3Float{right:56px}
}
@media (min-width:900px){#v3Scrim{display:none}}

.v3-comp ::slotted(*){max-width:100%}
#v3[data-build="1"] .v3-comp{position:relative}
#v3[data-build="1"] .v3-comp::before,#v3[data-build="1"] .v3-comp::after{content:"";position:absolute;inset:-2px;border-radius:inherit;pointer-events:none;background:linear-gradient(90deg,#ff3b6b,#ff9f0a,#ffe14d,#34d399,#38bdf8,#a78bfa,#ff3b6b,#ff9f0a,#ffe14d,#34d399,#38bdf8,#a78bfa,#ff3b6b);background-size:300% 100%;animation:v3rb 5s linear infinite}
#v3[data-build="1"] .v3-comp::before{padding:2px;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);mask-composite:exclude}
#v3[data-build="1"] .v3-comp::after{z-index:-1;filter:blur(12px);opacity:.5}
@keyframes v3rb{to{background-position:300% 0}}
@media (max-width:899px){
 #v3Hi{display:none}
 #v3Home{top:38%}
 #v3Home h1 img{width:64px;height:64px}
 #v3Dock{padding-left:10px;padding-right:10px}
 #v3Top{height:44px}
 .v3-comp{padding:12px 12px 8px 14px}
}
@media (max-width:1024px),(pointer:coarse){
 #v3[data-empty="1"] #v3Dock{top:auto!important;bottom:0!important}
 #v3Dock{padding-bottom:calc(6px + env(safe-area-inset-bottom,0px))!important}
 #v3Panel{padding-bottom:env(safe-area-inset-bottom,0px)}
}
@media (max-width:899px){
 #v3 #v3Dock{padding:0!important}
 #v3 .v3-comp,#v3[data-empty="1"] .v3-comp{width:100%!important;max-width:none!important;border-radius:20px 20px 0 0!important;border-left:0!important;border-right:0!important;border-bottom:0!important;padding:12px 14px calc(10px + env(safe-area-inset-bottom,0px)) 16px!important;box-shadow:0 -4px 20px rgba(0,0,0,.18)!important}
 #v3 .v3-foot{display:none!important}
 #v3 .v3-comp,#v3[data-empty="1"] .v3-comp{border-radius:32px 32px 0 0!important;padding:22px 20px calc(14px + env(safe-area-inset-bottom,0px)) 22px!important}
 #v3 .v3-comp textarea{font-size:18px!important;line-height:1.4!important;min-height:30px!important}
 #v3 .v3-comp .v3-row{margin-top:18px!important;gap:8px!important}
 #v3 .v3-comp .v3-ib,#v3 .v3-comp .v3-go{width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid var(--ln)!important;background:none!important;color:var(--tx)!important;flex:none}
 #v3 .v3-comp .v3-go.send{background:var(--ac)!important;border-color:var(--ac)!important;color:#fff!important}
 #v3 .v3-comp .v3-ib svg,#v3 .v3-comp .v3-go svg{width:20px!important;height:20px!important}
 #v3 .v3-comp .v3-model{height:42px!important;padding:0 16px!important;border:1px solid var(--ln)!important;border-radius:99px!important;font:600 15px var(--sans)!important;color:var(--tx)!important;max-width:128px!important;background:none!important}
 #v3 .v3-comp .v3-seg,#v3 .v3-comp #v3Mic{display:none!important}
 #v3 .v3-comp .v3-seg{margin-left:2px!important;padding:3px!important;border-radius:99px!important}
 #v3 .v3-comp .v3-seg button{height:34px!important;padding:0 11px!important;border-radius:99px!important;font-size:13px!important}
}
`;
function $(s,r){if(r)return r.querySelector(s);return(srA&&srA.querySelector(s))||(srB&&srB.querySelector(s))||D.querySelector(s)}
function $$(s,r){var L=function(x){return Array.prototype.slice.call(x.querySelectorAll(s))};if(r)return L(r);var a=srA?L(srA):[];if(a.length)return a;var b=srB?L(srB):[];if(b.length)return b;return L(D)}
function isLight(){return H.getAttribute("data-cl-theme")==="light"}
function mkHost(id){var h=D.createElement("div");h.id=id;h.setAttribute("data-th",isLight()?"light":"dark");var s=h.attachShadow({mode:"open"});var st=D.createElement("style");st.textContent=CSS;s.appendChild(st);return[h,s]}
function el(t,c,h){var e=D.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e}
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function API(){return window.XMM_API||{}}
function CL(){return window.XMM_CLONE||{}}
function uname(){return String(ld("xmm.name","")||"").trim()}
function toast(t){try{API().toast(t)}catch(e){}}
function sw(c){return'<svg viewBox="0 0 24 24" aria-hidden="true">'+c+'</svg>'}
var I={
 panel:sw('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15"/>'),
 panelR:sw('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M14.5 4.5v15"/>'),
 plus:sw('<path d="M12 5v14M5 12h14"/>'),
 search:sw('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
 proj:sw('<path d="M6 4.5h12M4.5 8h15"/><rect x="3.5" y="11" width="17" height="9.5" rx="2.5"/>'),
 art:sw('<rect x="3.5" y="8" width="12" height="12" rx="3"/><path d="M8.5 8V6.5a3 3 0 0 1 3-3H17a3.5 3.5 0 0 1 3.5 3.5v5.5a3 3 0 0 1-3 3H16"/>'),
 code:sw('<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'),
 plug:sw('<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4"/>'),
 chev:sw('<path d="m7 10 5 5 5-5"/>'),
 flt:sw('<path d="M4 7h16M7 12h10M10 17h4"/>'),
 dots:sw('<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'),
 mic:sw('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>'),
 wave:sw('<path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/>'),
 enter:sw('<path d="M20 6v6a2 2 0 0 1-2 2H5M9 10l-4 4 4 4"/>'),
 stop:sw('<rect x="6.5" y="6.5" width="11" height="11" rx="2.5"/>'),
 x:sw('<path d="M6 6l12 12M18 6L6 18"/>'),
 copy:sw('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>'),
 dev:sw('<rect x="3" y="4" width="14" height="10" rx="2"/><path d="M7 18h6M10 14v4"/><rect x="17" y="9" width="4.5" height="9" rx="1.2"/>'),
 eye:sw('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
 spark:sw('<path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3L5.3 18.7"/>'),
 doc:sw('<path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1zM14 3.5V8h4"/>'),
 sld:sw('<rect x="3.5" y="4.5" width="17" height="12" rx="2"/><path d="M12 16.5V20M8 20h8"/>'),
 dsg:sw('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-.9-.6-1.3-.6-2.1 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>'),
 ok:sw('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
 card:sw('<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18"/>'),
 pal:sw('<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-.9-.6-1.3-.6-2.1 0-.9.7-1.5 1.6-1.5H17a4 4 0 0 0 4-4C21 6.7 17 3 12 3z"/>'),
 usr:sw('<circle cx="12" cy="8.5" r="3.7"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>'),
 cap:sw('<rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/>'),
 bell:sw('<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5zM10 20.5a2 2 0 0 0 4 0"/>'),
 lock:sw('<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
 sparkle:sw('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>')
};

/* ------------------------------------------------------------------ build */
var root,side,top,ctr,main,home,dock,ta,sendB,micB,waveB,panel,float_,list,flt=0,lastSig="",busyT0=0,wasBusy=false,lastOut={status:"",steps:[],out:"",files:[],t:0,done:false};
function weekday(){try{return new Date().toLocaleDateString("en-US",{weekday:"long"})}catch(e){return"day"}}
function hello(){var n=uname();return"Happy "+weekday()+(n?", "+n:"")}
function avatarCss(){var a=ld("xmm.v3.avatar","");return a?"url("+a+")":""}
function initial(){return(uname()||"X").charAt(0).toUpperCase()}

function build(){
 if($("#v3"))return;
 var ha=mkHost("v3host");hostA=ha[0];srA=ha[1];var hb=mkHost("v3ov");hostB=hb[0];srB=hb[1];hostA.setAttribute("data-empty","1");root=el("div");root.id="v3";root.setAttribute("data-empty","1");
 root.innerHTML=
 '<aside id="v3Side"><div class="v3-sh"><button class="v3-ib" id="v3Col" type="button" aria-label="Close sidebar">'+I.panel+'</button><span class="v3-wm">XMM AI</span></div>'+
 '<nav class="v3-nav" id="v3Nav">'+
 '<button data-n="new" class="on" type="button">'+I.plus+'<span>New</span></button>'+
 '<button data-n="search" type="button">'+I.search+'<span>Search</span></button>'+
 '</nav>'+
 '<div class="v3-lh"><button class="l" id="v3Lbl" type="button"><span>Chats and tasks</span>'+I.chev+'</button><button class="v3-ib sm" id="v3Flt" type="button" aria-label="Show more or fewer chats">'+I.flt+'</button></div>'+
 '<div class="v3-list" id="v3List"></div>'+
 '<div class="v3-user"><button class="u" id="v3Usr" type="button"><span class="v3-av" id="v3Av">X</span><span class="un"><b id="v3Un">XMM</b></span>'+I.chev+'</button><button class="v3-ib" id="v3Dev" type="button" aria-label="Get the app">'+I.dev+'</button></div></aside>'+
 '<div id="v3Scrim"></div>'+
 '<div id="v3Ctr"><header id="v3Top"><button class="v3-ib" id="v3Menu" type="button" aria-label="Open sidebar">'+I.panel+'</button>'+
 '<button id="v3Title" type="button"><span id="v3TitleT">New chat</span>'+I.chev+'</button><span class="v3-sp"></span>'+
 '<button class="v3-pv" id="v3Prev" type="button" aria-label="New chat">'+I.plus+'<span>New chat</span></button>'+
 '<button class="v3-ib" id="v3PanelBtn" type="button" aria-label="Toggle panel">'+I.panelR+'</button></header>'+
 '<div id="v3Main"><slot></slot></div>'+
 '<section id="v3Home"><h1><img src="icon.svg?v=gpu6" alt=""><span id="v3Hi"></span></h1></section>'+
 '<div id="v3Dock"><div class="v3-comp" id="v3Comp"><slot name="atts"></slot><textarea id="v3In" rows="1" dir="auto" placeholder="How can I help you today?" aria-label="Message"></textarea>'+
 '<div class="v3-row"><button class="v3-ib" id="v3Add" type="button" aria-label="Add">'+I.plus+'</button>'+
 '<div class="v3-seg"><button class="on" data-m="chat" type="button">Chat</button><button data-m="code" type="button">Build</button></div><span class="v3-sp"></span>'+
 '<button class="v3-model" id="v3Model" type="button"></button>'+
 '<button class="v3-ib v3-mic" id="v3Mic" type="button" aria-label="Dictate">'+I.mic+'</button>'+
 '<button class="v3-go" id="v3Go" type="button" aria-label="Voice mode">'+I.wave+'</button></div></div>'+
 '<div class="v3-foot"><span>XMM AI is AI and can make mistakes. Please double-check responses.</span><button id="v3Model2" type="button"></button></div></div></div>';
 srA.appendChild(root);B.appendChild(hostA);B.appendChild(hostB);
 side=$("#v3Side");top=$("#v3Top");ctr=$("#v3Ctr");main=$("#v3Main");home=$("#v3Home");dock=$("#v3Dock");ta=$("#v3In");sendB=$("#v3Go");micB=$("#v3Mic");list=$("#v3List");
 ["#convo","#viewSearch","#viewNotebooks"].forEach(function(q){var n=D.querySelector(q);if(n)hostA.appendChild(n)});
 var at=D.querySelector("#atts");if(at){at.setAttribute("slot","atts");hostA.appendChild(at)}
 panel=el("aside");panel.id="v3Panel";panel.innerHTML=
  '<div class="v3p-h"><b><i id="v3PDot"></i>Preview</b><button class="v3-ib" id="v3PClose" type="button" aria-label="Close panel">'+I.panelR+'</button></div><div class="v3p-b" id="v3PBody"></div>';
 srB.appendChild(panel);
 float_=el("button");float_.id="v3Float";float_.type="button";float_.setAttribute("aria-label","New chat");float_.innerHTML=I.plus+"<span>New chat</span>";srB.appendChild(float_);
 H.classList.add("v3");
 if(innerWidth<900)root.classList.add("col");
 srB.addEventListener("click",panelClicks);wire();paintPanel(true);tick();
}


/* ------------------------------------------------------------------ resizable sidebar + preview (desktop / big tablets) */
function initResize(){
 var LS={sw:"xmm.v3.sw",pw:"xmm.v3.pw"};
 var css='.v3-rz{position:absolute;top:0;bottom:0;width:9px;z-index:30;cursor:col-resize;touch-action:none;display:none;background:transparent}.v3-rz::after{content:"";position:absolute;top:0;bottom:0;left:4px;width:2px;background:var(--ac,#8ab4ff);opacity:0;transition:opacity .25s ease}.v3-rz:hover::after,.v3-rz.drag::after{opacity:.7}@media(min-width:900px){.v3-rz{display:block}#v3Side{position:relative}}#v3.rzing,#v3.rzing *{transition:none!important;user-select:none!important}';
 [srA,srB].forEach(function(sr){var s=el("style");s.textContent=css;sr.appendChild(s)});
 var sh=el("div");sh.className="v3-rz";sh.style.right="-4px";side.appendChild(sh);
 var ph=el("div");ph.className="v3-rz";ph.style.left="-4px";panel.appendChild(ph);
 function rd(k,d){try{var n=parseInt(localStorage.getItem(LS[k]),10);return n>0?n:d}catch(e){return d}}
 function wr(k,n){try{localStorage.setItem(LS[k],String(Math.round(n)))}catch(e){}}
 function apply(){
  if(isMobile()){root.style.removeProperty("--sw");root.style.removeProperty("--pw");panel.style.removeProperty("--pw");panel.style.removeProperty("width");return}
  var sw=Math.min(Math.max(rd("sw",288),220),Math.round(innerWidth*.45));
  var pw=Math.min(Math.max(rd("pw",535),320),Math.round(innerWidth*.7));
  root.style.setProperty("--sw",sw+"px");root.style.setProperty("--pw",pw+"px");panel.style.setProperty("--pw",pw+"px");
 }
 function drag(h,kind){
  h.addEventListener("pointerdown",function(e){
   if(isMobile())return;e.preventDefault();
   try{h.setPointerCapture(e.pointerId)}catch(_){}
   h.classList.add("drag");root.classList.add("rzing");
   var move=function(ev){
    if(kind==="sw"){var n=Math.min(Math.max(ev.clientX,220),Math.round(innerWidth*.45));root.style.setProperty("--sw",n+"px");h.__n=n}
    else{var m=Math.min(Math.max(innerWidth-ev.clientX,320),Math.round(innerWidth*.7));root.style.setProperty("--pw",m+"px");panel.style.setProperty("--pw",m+"px");h.__n=m}
   };
   var up=function(){h.classList.remove("drag");root.classList.remove("rzing");h.removeEventListener("pointermove",move);h.removeEventListener("pointerup",up);h.removeEventListener("pointercancel",up);if(h.__n)wr(kind,h.__n)};
   h.addEventListener("pointermove",move);h.addEventListener("pointerup",up);h.addEventListener("pointercancel",up);
  });
  h.addEventListener("dblclick",function(){try{localStorage.removeItem(LS[kind])}catch(e){}apply()});
 }
 drag(sh,"sw");drag(ph,"pw");apply();
 window.addEventListener("resize",apply);
}
/* ------------------------------------------------------------------ actions */
function isMobile(){return innerWidth<900}
function openSide(){if(isMobile())root.classList.add("open");else root.classList.remove("col")}
function closeSide(){if(isMobile())root.classList.remove("open");else root.classList.add("col")}
function togglePanel(f){var on=typeof f==="boolean"?f:!panel.classList.contains("on");panel.classList.toggle("on",on);root.classList.toggle("pn",on&&!isMobile());if(on)paintPanel(true)}
function newChat(){try{API().newChat()}catch(e){}if(isMobile())closeSide();setTimeout(function(){ta&&ta.focus()},60)}
function srcChats(){return $$("#chatList .chat-i[data-id]")}
function openChat(id){var s=$('#chatList .chat-i[data-id="'+id+'"]');if(s)s.click();if(isMobile())closeSide()}
function chatMenu(btn,id){var its=[];try{if(window.XMM_TWIN&&XMM_TWIN.chatItems)its=XMM_TWIN.chatItems(id)||[]}catch(e){}
 its.push({label:"Delete chat",danger:1,fn:function(){try{API().delChat(id)}catch(e){}}});try{API().showMenu(btn,its,"right")}catch(e){}}
function openSearch(){
 if($("#v3Srch"))return;var o=el("div");o.id="v3Srch";
 o.innerHTML='<div class="bx"><input id="v3SIn" placeholder="Search chats" dir="auto" autocomplete="off"><div class="rs" id="v3SRs"></div></div>';srB.appendChild(o);
 var inp=$("#v3SIn"),rs=$("#v3SRs");
 function go(){var q=inp.value.trim().toLowerCase(),h="",n=0;srcChats().forEach(function(c){var sp=c.querySelector("span"),t=(sp?sp.textContent:c.textContent||"").trim()||"Untitled";if(!q||t.toLowerCase().indexOf(q)>-1){h+='<button type="button" data-id="'+esc(c.dataset.id)+'" dir="auto">'+esc(t)+'</button>';n++}});rs.innerHTML=n?h:'<p>No chats found</p>'}
 inp.oninput=go;go();setTimeout(function(){inp.focus()},30);
 o.onclick=function(e){if(e.target===o){o.remove();return}var b=e.target.closest("button[data-id]");if(b){o.remove();openChat(b.dataset.id)}};
}
function navGo(k){
 if(k==="new"){newChat();return}
 if(isMobile())closeSide();
 if(k==="search"){openSearch();return}
 if(k==="projects"){var b=$('.sidenav2 [data-k="notebooks"]');if(b)b.click();return}
 if(k==="artifacts"){var s=$('#seg [data-m="code"]');if(s)s.click();return}
 if(k==="code"){var c=$("#sideCode");if(c)c.click();return}
 if(k==="plugins"){var m=$(".xmcp-btn");if(m)m.click();else openSettings("plugins");return}
}
function send(){
 var m=$("#msg");if(!m)return;var S=API().S||{};
 if(S.busy){var st=$("#sendBtn");if(st)st.click();return}
 var at=$("#atts"),has=at&&at.children.length;
 if(!ta.value.trim()&&!has)return;
 m.value=ta.value;m.dispatchEvent(new Event("input",{bubbles:true}));
 var sb=$("#sendBtn");if(sb)sb.click();
 ta.value="";fit();
}
function fit(){ta.style.height="auto";ta.style.height=Math.min(220,ta.scrollHeight)+"px"}

function wire(){
 $("#v3Col").onclick=closeSide;$("#v3Menu").onclick=openSide;$("#v3Scrim").onclick=closeSide;
 $("#v3Nav").addEventListener("click",function(e){var b=e.target.closest("button[data-n]");if(b)navGo(b.dataset.n)});
 $("#v3Flt").onclick=function(){flt=flt?0:1;lastSig="";toast(flt?"Showing recent chats":"Showing all chats")};
 $("#v3Lbl").onclick=function(){$("#v3Flt").click()};
 $("#v3Usr").onclick=function(){openSettings("acc")};
 $("#v3Dev").onclick=function(){var i=$('[data-act="install"]');if(i)i.click();else toast("Open xmm-ai.com on your phone to install")};
 list.addEventListener("click",function(e){var d=e.target.closest(".d");var r=e.target.closest(".v3-ci");if(!r)return;if(d){e.stopPropagation();chatMenu(d,r.dataset.id);return}openChat(r.dataset.id)});
 var lp=0;list.addEventListener("pointerdown",function(e){var r=e.target.closest(".v3-ci");if(!r)return;clearTimeout(lp);lp=setTimeout(function(){r.__lp=1;chatMenu(r,r.dataset.id)},560)});
 ["pointerup","pointermove","pointercancel","pointerleave"].forEach(function(n){list.addEventListener(n,function(){clearTimeout(lp)})});
 $("#v3Title").onclick=function(){var c=$("#chatList .chat-i.on");var id=c&&c.dataset.id;if(id)chatMenu($("#v3Title"),id)};
 try{[srA,srB].forEach(function(sr){var s=el("style");s.textContent=PCSS;sr.appendChild(s);var l=el("link");l.rel="stylesheet";l.href="anim.css?v=6";sr.appendChild(l)})}catch(e){}try{initResize()}catch(e){}$("#v3Prev").onclick=function(){newChat()};$("#v3PanelBtn").onclick=function(){togglePanel()};$("#v3PClose").onclick=function(){togglePanel(false)};
 float_.onclick=function(){newChat()};
 $("#v3Add").onclick=function(){try{CL().openAdd()}catch(e){var a=$("#attBtn");if(a)a.click()}};
 $("#v3Model").onclick=$("#v3Model2").onclick=function(){try{CL().openModel()}catch(e){var m=$("#modeBtn");if(m)m.click()}};
 $(".v3-seg").addEventListener("click",function(e){var b=e.target.closest("button[data-m]");if(!b)return;var m=b.dataset.m,s=$('#seg [data-m="'+(m==="code"?"code":"chat")+'"]');if(s)s.click();else{document.body.classList.toggle("v-build",m==="code");document.body.classList.remove("code-on")}$$(".v3-seg button",b.parentNode).forEach(function(x){x.classList.toggle("on",x===b)})});
 micB.onclick=function(){var m=$("#gMic");if(m)m.click();else toast("Dictation is not available")};
 sendB.onclick=function(){var S=API().S||{};if(S.busy||ta.value.trim()||($("#atts")&&$("#atts").children.length)){send();return}try{CL().openVoice()}catch(e){var w=$("#gWave");if(w)w.click()}};
 ta.addEventListener("input",function(){fit();var m=$("#msg");if(m){m.value=ta.value;m.dispatchEvent(new Event("input",{bubbles:true}))}upd()});
 ta.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey&&!e.isComposing&&!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){e.preventDefault();send()}});
 D.addEventListener("keydown",function(e){if(e.key==="Escape"){var s=$("#v3Set");if(s){s.remove();return}var q=$("#v3Srch");if(q){q.remove();return}if(panel.classList.contains("on"))togglePanel(false)}});
 /* old drawer / settings triggers now open the new ones */
 new MutationObserver(function(){if(B.classList.contains("cl-drawer")){B.classList.remove("cl-drawer");openSide()}}).observe(B,{attributes:true,attributeFilter:["class"]});
 var os=$("#settings");if(os)new MutationObserver(function(){if(!os.hidden){os.hidden=true;openSettings("acc")}}).observe(os,{attributes:true,attributeFilter:["hidden"]});
 D.addEventListener("click",function(e){var t=e.target;if(!t.closest)return;if(t.closest('[data-act="settings"]')&&!t.closest("#v3,#v3Set")){e.stopImmediatePropagation();e.preventDefault();openSettings("acc")}},true);
 addEventListener("resize",function(){if(!isMobile())root.classList.remove("open");root.classList.toggle("pn",panel.classList.contains("on")&&!isMobile())});
 addEventListener("xmm-code-start",function(){lastOut={status:"Starting…",steps:[],out:"",files:[],t:Date.now(),done:false}});
 addEventListener("xmm-code-end",function(){lastOut.done=true});
 /* the mic button of the old composer is hidden, listen to its state */
}
function upd(){var S=API().S||{},has=ta.value.trim()||($("#atts")&&$("#atts").children.length);
 var busy=!!S.busy;var want=busy?"stop":has?"send":"wave";
 if(sendB.__s!==want){sendB.__s=want;sendB.className="v3-go"+(want==="send"||want==="stop"?" send":"");sendB.innerHTML=want==="stop"?I.stop:want==="send"?I.enter:I.wave;sendB.setAttribute("aria-label",want==="wave"?"Voice mode":want==="stop"?"Stop":"Send")}}

/* ------------------------------------------------------------------ preview panel */
function snapshot(){
 var S=API().S||{},busy=!!S.busy,code=$("#code"),cd=$("#cdLog"),r={status:"",steps:[],out:"",files:[],busy:false,t:0,thought:"",code:{}};
 var bb=window.__v3bb;
 if(cd){
  $$(".stp",cd).forEach(function(s){r.steps.push({t:(s.textContent||"").replace(/\s+/g," ").trim(),done:s.classList.contains("done")})});
  var lv=$(".cd-live",cd);if(lv)r.status=(lv.textContent||"").replace(/\s+/g," ").trim();
  var bots=$$(".m-bot .body",cd);if(bots.length){var lb=bots[bots.length-1];if($(".think",lb))r.status=r.status||"Planning…";var tx=(lb.textContent||"").trim();if(tx)r.out=tx.slice(-2200)}
  $$(".cd-fcard",cd).forEach(function(f){var p=f.getAttribute("data-fp");if(p&&r.files.indexOf(p)<0)r.files.push(p)});
  if(!r.files.length)$$(".stp",cd).forEach(function(s){var m=/([\w\-./]+\.(html|css|js|json|md|svg|txt|py|ts|jsx))/i.exec(s.textContent||"");if(m&&r.files.indexOf(m[1])<0)r.files.push(m[1])});
 }
 var buildBusy=!!(cd&&$(".stp.active",cd))||!!(cd&&$(".cd-live",cd)&&$(".think",cd))||bb;
 if(buildBusy){r.busy=true;if(!r.status){var a=r.steps.filter(function(s){return!s.done}).pop();r.status=a?a.t:"Working…"}}
 else if(busy){
  r.busy=true;var bots2=$$("#msgs .m-bot");var lb2=bots2[bots2.length-1];
  if(lb2){var body=$(".body",lb2)||lb2;if($(".think",body)&&!(body.textContent||"").replace(/Thinking|…|\.\.\./g,"").trim())r.status="Thinking…";
   else if($(".genbox:not(.ok)",lb2))r.status="Generating an image…";
   else{r.status="Writing the answer…";var tx2=(body.textContent||"").trim();r.out=tx2.slice(-2200)}}
  else r.status="Working…";
 }
 try{var R=window.__xmmChatFiles||{},best=-1,ks=Object.keys(R).filter(function(k){var e=R[k];if(!e.code)return false;var bs=$$('#msgs .m-bot[data-i="'+e.i+'"] .g-file b',D);return bs.some(function(b){return b.textContent===e.name})});
  ks.forEach(function(k){var n=parseInt(R[k].i,10);if(n>best)best=n});
  if(best>=0){ks.forEach(function(k){if(parseInt(R[k].i,10)===best)r.code[R[k].name]=R[k].code});r.chatFiles=true}}catch(e){}
 try{r.thought=String(window.__xmmThought||"");var cf=window.XMM_CODE&&XMM_CODE.getFiles&&XMM_CODE.getFiles();if(cf&&!r.chatFiles)Object.keys(cf).forEach(function(k){if(typeof cf[k]==="string")r.code[k]=cf[k]});}catch(e){}
 return r;
}
var PCSS=`.v3p-b{display:flex;flex-direction:column;padding:0!important;overflow:hidden!important}
.v3p-empty{overflow:auto}
.v3p-tabs{flex:none;display:flex;align-items:center;gap:4px;padding:8px 12px;border-bottom:1px solid var(--ln);overflow-x:auto}
.v3p-tabs button{padding:6px 13px;border-radius:999px;font:500 13px var(--sans);color:var(--mu);white-space:nowrap}
.v3p-tabs button.on{background:var(--b3,#2d2d30);color:var(--tx)}
.v3p-dot{margin-left:auto;width:8px;height:8px;border-radius:50%;background:#4cae6a;flex:none}.v3p-dot.busy{background:var(--ac);animation:v3p 1s ease-in-out infinite}
.v3p-view{flex:1;min-height:0;overflow:auto;padding:14px 16px}
.v3p-view:has(.v3p-fr){padding:0;overflow:hidden}
.v3p-view:has(.v3p-fr){display:flex;flex-direction:column}.v3p-bar{flex:none;display:flex;align-items:center;gap:6px;padding:6px 10px;border-bottom:1px solid var(--ln);font-size:12px;color:var(--mu)}.v3p-bar button{padding:5px 10px;border-radius:999px;background:var(--b3,#2d2d30);color:var(--tx);font:500 12px var(--sans)}.v3p-bar span{margin-left:auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v3p-fr{display:block;width:100%;flex:1;min-height:0;border:0;background:#fff;touch-action:manipulation}
.v3p-none{color:var(--mu);font-size:13px;padding:6px 2px}
.v3p-th{white-space:pre-wrap;font-size:13.5px;line-height:1.6;color:var(--tx2);padding:12px 14px;border-radius:14px;background:var(--b1);border:1px solid var(--ln)}
.v3p-cf{margin:0 0 8px;border-radius:14px;background:var(--b1);border:1px solid var(--ln);overflow:hidden}
.v3p-cf summary{cursor:pointer;padding:11px 14px;font-size:13px;font-weight:600;display:flex;justify-content:space-between;gap:8px;list-style:none}
.v3p-cf summary::-webkit-details-marker{display:none}
.v3p-cf summary em{font-style:normal;opacity:.55;font-weight:400}
.v3p-code{margin:0;padding:12px 14px;max-height:60vh;overflow:auto;font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre;tab-size:2;border-top:1px solid var(--ln)}
.v3p-files2{display:flex;flex-direction:column;gap:6px}
.v3p-files2 button{display:flex;align-items:center;gap:10px;width:100%;padding:11px 14px;border-radius:12px;background:var(--b1);border:1px solid var(--ln);text-align:left;font-size:13.5px}
.v3p-files2 b{font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.v3p-files2 em{font-style:normal;opacity:.55;font-size:12px}
`;
var ptab="thoughts",userTab=false,lastRun=0,docSig="",htmlSeen=false,openFile="";
function pageDoc(code){
 var names=Object.keys(code),pg=code["index.html"]!=null?"index.html":names.filter(function(n){return /\.html?$/i.test(n)})[0];
 if(!pg)return null;var h=code[pg];
 function lk(p){p=String(p||"").split("?")[0].split("#")[0].replace(/^\.?\//,"");return code[p]!=null?p:(code[p.split("/").pop()]!=null?p.split("/").pop():null)}
 h=h.replace(/<link[^>]+href=["']([^"']+)["'][^>]*>/gi,function(m,u){var k=lk(u);return k&&/stylesheet|\.css/i.test(m+u)?"<style>"+code[k]+"</style>":m});
 h=h.replace(/<script([^>]*)src=["']([^"']+)["']([^>]*)>\s*<\/script>/gi,function(m,a,u,b){var k=lk(u);return k?"<script"+a+b+">"+code[k].replace(/<\/script/gi,"<\\/script")+"<\/script>":m});
 var pre='<script>try{var _m=function(){var d={};return{getItem:function(k){return k in d?d[k]:null},setItem:function(k,v){d[k]=String(v)},removeItem:function(k){delete d[k]},clear:function(){d={}},key:function(i){return Object.keys(d)[i]||null},get length(){return Object.keys(d).length}}};["localStorage","sessionStorage"].forEach(function(n){try{void window[n]}catch(e){Object.defineProperty(window,n,{value:_m(),configurable:true})}})}catch(e){}addEventListener("keydown",function(e){if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.key)>-1&&!/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||""))e.preventDefault()},false);<\/script><style>canvas{touch-action:none}html,body{-webkit-tap-highlight-color:transparent}</style>';
 if(!/<meta[^>]+viewport/i.test(h))pre='<meta name="viewport" content="width=device-width,initial-scale=1">'+pre;
 if(/<head[^>]*>/i.test(h))h=h.replace(/<head[^>]*>/i,function(m){return m+pre});else h=pre+h;
 return {name:pg,html:h};
}
function paintPanel(force){
 var body=$("#v3PBody");if(!body)return;
 var r=snapshot();
 if(r.busy&&!wasBusy){busyT0=Date.now()}
 if(r.busy){lastOut={status:r.status,steps:r.steps,out:r.out,files:r.files,t:busyT0,done:false}}
 if(r.thought)lastOut.thought=r.thought;if(Object.keys(r.code).length){if(r.chatFiles||!lastOut.chatF)lastOut.code=r.code;lastOut.chatF=!!r.chatFiles}
 var has=lastOut.t||r.busy||Object.keys(lastOut.code||{}).length;
 var el_=r.busy?Math.max(0,Math.round((Date.now()-busyT0)/1000))+"s":"";
 var code=lastOut.code||{},names=Object.keys(code),pd=names.length?pageDoc(code):null;
 if(busyT0!==lastRun){lastRun=busyT0;userTab=false;htmlSeen=false;docSig=""}
 if(!userTab){
  if(pd&&!htmlSeen){ptab="preview";htmlSeen=true}
  else if(!pd&&!htmlSeen){ptab=names.length&&!r.busy?"code":"thoughts"}
 }
 var sig=JSON.stringify([has,ptab,r.busy,lastOut.status,lastOut.steps,lastOut.out&&lastOut.out.length,lastOut.thought&&lastOut.thought.length,names.map(function(k){return k+":"+code[k].length}),openFile,el_]);
 if(!force&&body.__sig===sig)return;body.__sig=sig;
 if(!has){
  body.innerHTML='<div class="v3p-empty"><small>Make something new</small>'+
   '<button type="button" data-mk="doc"><span class="ic">'+I.doc+'</span>Docs</button>'+
   '<button type="button" data-mk="sld"><span class="ic">'+I.sld+'</span>Slides</button>'+
   '<button type="button" data-mk="dsg"><span class="ic">'+I.dsg+'</span>Design</button>'+
   '<p>Open a file, artifact, or page to see it here. While XMM AI works, this panel shows exactly what it is doing.</p></div>';
  body.__tabs=0;return;
 }
 if(!body.__tabs||!body.querySelector("#v3PTabs")){body.innerHTML='<div class="v3p-tabs" id="v3PTabs"></div><div class="v3p-view" id="v3PView"></div>';body.__tabs=1;docSig=""}
 var T=[["preview","Preview"],["code","Code"],["files","Files"+(names.length?" "+names.length:"")],["thoughts","Thoughts"]];
 $("#v3PTabs").innerHTML=T.map(function(t){return'<button type="button" data-pt="'+t[0]+'" class="'+(ptab===t[0]?"on":"")+'">'+t[1]+'</button>'}).join("")+'<span class="v3p-dot'+(r.busy?" busy":"")+'"></span>';
 var view=$("#v3PView"),st=lastOut.done&&!r.busy?"Done":(lastOut.status||"Working…");
 var card='<div class="v3p-card"><div class="v3p-st">'+(r.busy?'<span class="sp"></span>':'<span class="ok">'+I.ok+'</span>')+'<span>'+esc(st)+'</span><em>'+esc(el_)+'</em></div></div>';
 if(ptab==="preview"){
  var fr=view.querySelector("iframe");
  if(!pd){view.innerHTML=card+'<div class="v3p-none">No web page yet. When the AI makes an HTML file it shows here, running.</div>';return}
  if(!fr){view.innerHTML='<div class="v3p-bar"><button type="button" data-pr="reload">↻ Restart</button><button type="button" data-pr="full">⛶ Fullscreen</button><span>Click the page, then play with keys or taps</span></div><iframe class="v3p-fr" tabindex="0" allow="autoplay; fullscreen; gamepad; accelerometer; gyroscope; clipboard-write" allowfullscreen sandbox="allow-scripts allow-forms allow-modals allow-popups allow-pointer-lock allow-downloads" title="Preview"></iframe>';fr=view.querySelector("iframe");docSig="";fr.addEventListener("load",function(){try{fr.focus();fr.contentWindow.focus()}catch(e){}});fr.addEventListener("pointerenter",function(){try{fr.focus()}catch(e){}})}
  if(docSig!==pd.html.length+":"+pd.html.slice(-200)){docSig=pd.html.length+":"+pd.html.slice(-200);fr.srcdoc=pd.html}
  return;
 }
 docSig="";
 if(ptab==="code"){
  if(!names.length){view.innerHTML=card+'<div class="v3p-none">No code yet.</div>';return}
  view.innerHTML=names.map(function(k,i){var src=code[k];return'<details class="v3p-cf" data-f="'+esc(k)+'"'+((openFile?openFile===k:(names.length===1||(r.busy&&i===names.length-1)))?" open":"")+'><summary>'+esc(k)+'<em>'+src.split("\n").length+' lines</em></summary><pre class="v3p-code">'+esc(src.length>30000?src.slice(0,30000)+"\n…":src)+'</pre></details>'}).join("");
  var op=view.querySelector("details[open]");if(op&&openFile)try{op.scrollIntoView({block:"nearest"})}catch(e){}
  return;
 }
 if(ptab==="files"){
  view.innerHTML=names.length?'<div class="v3p-files2">'+names.map(function(k){return'<button type="button" data-gf="'+esc(k)+'"><span>'+(/\.html?$/i.test(k)?"🌐":"📄")+'</span><b>'+esc(k)+'</b><em>'+(code[k].length>1024?Math.round(code[k].length/102.4)/10+" KB":code[k].length+" B")+'</em></button>'}).join("")+'</div>':card+'<div class="v3p-none">No files yet.</div>';
  return;
 }
 var h=card;
 h+='<div class="v3p-t">'+(r.busy?"Thinking & planning":"Thoughts")+'</div>';
 if(lastOut.thought)h+='<div class="v3p-th">'+esc(lastOut.thought)+'</div>';
 else h+='<div class="v3p-none">'+(r.busy?"Thinking…":"No thoughts for this reply.")+'</div>';
 if(lastOut.steps.length){h+='<div class="v3p-t">Plan</div><div class="v3p-steps">'+lastOut.steps.map(function(s,i){var act=r.busy&&!s.done&&i===lastOut.steps.length-1;return'<div class="v3p-step'+(s.done?" done":act?" act":"")+'"><i></i><span>'+esc(s.t)+'</span></div>'}).join("")+'</div>'}
 if(lastOut.out&&!lastOut.thought){h+='<div class="v3p-t">'+(r.busy?"Live output":"Last output")+'</div><pre class="v3p-out" id="v3POut">'+esc(lastOut.out)+'</pre>'}
 view.innerHTML=h;var po=$("#v3POut");if(po)po.scrollTop=po.scrollHeight;
}
function panelClicks(e){
 var b=e.target.closest&&e.target.closest("[data-mk]");
 if(b){var k=b.dataset.mk,pre=k==="doc"?"Write a document about ":k==="sld"?"Create a presentation about ":"Design a modern landing page for ";
  if(ta){ta.value=pre;ta.dispatchEvent(new Event("input",{bubbles:true}));if(isMobile())togglePanel(false);ta.focus();ta.setSelectionRange(pre.length,pre.length)}return}
 var pr=e.target.closest&&e.target.closest("[data-pr]");if(pr){var f2=srB.querySelector(".v3p-fr");if(f2){if(pr.dataset.pr==="reload"){var d0=f2.srcdoc;f2.srcdoc="";setTimeout(function(){f2.srcdoc=d0;try{f2.focus()}catch(x){}},30)}else{try{(f2.requestFullscreen||f2.webkitRequestFullscreen).call(f2)}catch(x){}}}return}
 var pt=e.target.closest&&e.target.closest("[data-pt]");if(pt){ptab=pt.dataset.pt;userTab=true;paintPanel(true);return}
 var gf=e.target.closest&&e.target.closest("[data-gf]");if(gf){openFile=gf.dataset.gf;ptab="code";userTab=true;paintPanel(true);return}
 var o=e.target.closest&&e.target.closest("[data-open]");
 if(o){var s=D.querySelector('#seg [data-m="code"]');if(s)s.click()}
}
window.addEventListener("xmm-code-start",function(){window.__v3bb=true;busyT0=Date.now()});
window.addEventListener("xmm-code-end",function(){window.__v3bb=false});

/* ------------------------------------------------------------------ list + state */
function render(){
 var src=srcChats(),sig=flt+"|"+src.map(function(c){var sp=c.querySelector("span");return c.dataset.id+":"+(c.classList.contains("on")?1:0)+":"+((sp?sp.textContent:c.textContent)||"").trim()}).join("|");
 if(sig===lastSig)return;lastSig=sig;
 var h="",i=0;
 src.forEach(function(c){if(flt&&i>=12){i++;return}var sp=c.querySelector("span"),t=(sp?sp.textContent:c.textContent||"").trim()||"Untitled";
  h+='<div class="v3-ci'+(c.classList.contains("on")?" on":"")+'" role="button" tabindex="0" data-id="'+esc(c.dataset.id)+'"><i></i><span class="t" dir="auto">'+esc(t)+'</span><span class="d" role="button" aria-label="Chat options">'+I.dots+'</span></div>';i++});
 list.innerHTML=h||'<div class="v3-none">No conversations yet</div>';
}
function tick(){
 if(!root)return;
 var mc=D.querySelector("#mainChat"),empty=!mc||mc.getAttribute("data-empty")==="1";
 var vc=D.querySelector("#viewChat"),other=vc&&vc.hidden;
 var e1=empty?"1":"0";if(root.getAttribute("data-empty")!==e1){root.setAttribute("data-empty",e1);hostA.setAttribute("data-empty",e1)}
 var th=isLight()?"light":"dark";[hostA,hostB].forEach(function(h){if(h.getAttribute("data-th")!==th)h.setAttribute("data-th",th)});
 var vw=other?"other":"chat";if(root.getAttribute("data-view")!==vw){root.setAttribute("data-view",vw);hostA.setAttribute("data-view",vw)}
 var nw=$('#v3Nav button[data-n="new"]');if(nw)nw.classList.toggle("on",empty&&!other);
 var hi=$("#v3Hi");if(hi){var t=hello();if(hi.textContent!==t)hi.textContent=t}
 var on=$("#chatList .chat-i.on span"),tt=on?on.textContent.trim():"New chat";var tel=$("#v3TitleT");if(tel&&tel.textContent!==(tt||"New chat"))tel.textContent=tt||"New chat";
 var mo=$("#modeBtn span"),mn="Models";
 var m1=$("#v3Model"),m2=$("#v3Model2");if(m1&&m1.__t!==mn){m1.__t=mn;m1.innerHTML="<b>"+esc(mn)+"</b>";if(m2)m2.textContent=mn}
 var gm=$("#gMic");if(gm)micB.classList.toggle("on",gm.classList.contains("on"));
 var m=$("#msg");if(m&&D.activeElement!==ta&&m.value!==ta.value){ta.value=m.value;fit()}
 var av=$("#v3Av"),a=avatarCss(),l=initial();if(av){if(av.textContent!==(a?"":l))av.textContent=a?"":l;if(av.style.backgroundImage!==a)av.style.backgroundImage=a}
 var un=$("#v3Un");if(un&&un.textContent!==(uname()||"XMM"))un.textContent=uname()||"XMM";
 upd();render();paintPanel(false);
 /* floating Preview button while the Build screen covers the app */
 var c=$("#code"),cv=c&&c.offsetParent!==null&&getComputedStyle(c).display!=="none";
 float_.classList.toggle("on",!!cv);
}

/* ------------------------------------------------------------------ settings */
function devName(){var u=navigator.userAgent,b=/Edg\//.test(u)?"Edge":/OPR\//.test(u)?"Opera":/Firefox|FxiOS/.test(u)?"Firefox":/Chrome|CriOS/.test(u)?"Chrome":/Safari/.test(u)?"Safari":"Browser";
 var o=/iPhone|iPad|iPod/.test(u)?"iOS":/Android/.test(u)?"Android":/Windows/.test(u)?"Windows":/Mac OS X/.test(u)?"macOS":/Ubuntu/.test(u)?"Ubuntu":/Linux/.test(u)?"Linux":"";return b+(o?" ("+o+")":"")}
function uid(){var u=ld("xmm.v3.uid","");if(!u){try{u=crypto.randomUUID()}catch(e){u="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==="x"?r:(r&3|8)).toString(16)})}sv("xmm.v3.uid",u)}return u}
function fmt(t){try{return new Date(t).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}catch(e){return""}}
function loc(){try{var z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";return z.split("/").pop().replace(/_/g," ")}catch(e){return""}}
function themePref(){return ld("xmm.cl.theme","dark")}
function applyTheme(p){sv("xmm.cl.theme",p);var d=p!=="light";if(p==="system"){try{d=matchMedia("(prefers-color-scheme:dark)").matches}catch(e){}}H.setAttribute("data-cl-theme",d?"dark":"light");H.dataset.clTheme=d?"dark":"light"}
function row(l,c,s){return'<div class="row"><div>'+l+(s?'<small>'+s+'</small>':'')+'</div><div>'+c+'</div></div>'}
function tog(k,on){return'<button class="sw'+(on?" on":"")+'" type="button" data-sw="'+k+'" aria-label="Toggle"></button>'}
var NAV=[["acc","Account",I.usr],["priv","Privacy",I.lock],0,["app","Appearance",I.pal],["mem","Your XMM",I.sparkle],["cap","Capabilities",I.cap],["notif","Notifications",I.bell],["plugins","Plugins",I.plug],["code","Code",I.code]];
function page(k){
 var n=uname();
 if(k==="acc"){var a=avatarCss(),si=ld("xmm.v3.signin",0);if(!si){si=Date.now();sv("xmm.v3.signin",si)}
  var lang=$("#topLang"),lo="";if(lang){lo=$$("option",lang).map(function(o){return'<option value="'+esc(o.value)+'"'+(o.value===lang.value?" selected":"")+'>'+esc(o.textContent)+'</option>'}).join("")}
  var wk=ld("xmm.v3.work","Other");var WK=["Other","Software development","Student","Design","Business","Education","Writing","Research"];
  return'<h4>Profile</h4>'+row('Profile photo','<button class="av" id="v3PhBtn" type="button" style="'+(a?"background-image:"+a:"")+'">'+(a?"":esc(initial()))+'</button>','PNG, JPEG, or WebP, up to 10MB.')+
   row('Full name','<input class="in" id="v3Nm" maxlength="40" dir="auto" value="'+esc(n)+'">')+
   row('What should XMM call you?','<input class="in" id="v3Nm2" maxlength="40" dir="auto" value="'+esc(n)+'">')+
   row('What best describes your work?','<select class="in" id="v3Wk">'+WK.map(function(w){return'<option'+(w===wk?" selected":"")+'>'+w+'</option>'}).join("")+'</select>')+
   (lo?row('Language','<select class="in" id="v3Lg">'+lo+'</select>'):"")+
   row('User ID','<span class="cp"><code>'+esc(uid())+'</code><button class="v3-ib sm" id="v3Cp" type="button" aria-label="Copy">'+I.copy+'</button></span>')+
   '<div class="sec"><b>Where you’re logged in</b><button class="bt" id="v3Lo" type="button">Log out of all devices</button></div>'+
   '<table><thead><tr><th>Device</th><th>Location</th><th>Signed in</th><th>Last active</th></tr></thead><tbody><tr><td data-l="Device"><span>'+esc(devName())+'<span class="cur">Current</span></span></td><td data-l="Location">'+esc(loc()||"—")+'</td><td data-l="Signed in">'+esc(fmt(si))+'</td><td data-l="Last active">'+esc(fmt(Date.now()))+'</td></tr></tbody></table>'+
   (window.XMM_APP?"":'<div class="sec"><b>Installed app</b><button class="bt" id="v3Ins" type="button">Install XMM AI</button></div><p class="note">Add XMM AI to your home screen or desktop for full-screen use.</p>');}
 if(k==="bill")return'<h4>Billing</h4>'+row('Plan','Free','XMM AI is free to use. No payment details are needed.')+row('Usage','Fair use','Some features such as video have cooldowns to keep servers fast for everyone.');
 if(k==="app"){var p=themePref();return'<h4>Appearance</h4><div class="th">'+[["light","Light","l"],["dark","Dark","d"],["system","System","s"]].map(function(t){return'<button type="button" data-th="'+t[0]+'" class="'+(p===t[0]?"on":"")+'"><i class="'+t[2]+'"></i>'+t[1]+'</button>'}).join("")+'</div>'+
  row('Haptic feedback',tog("hap",ld("xmm.cl.hap",true)!==false),'Tiny vibration on taps (phones).')}
 if(k==="mem")return'<h4>Your XMM</h4><p class="note" style="margin:0 0 12px">Anything you write here is remembered and used to make answers fit you better.</p><textarea class="in" id="v3Mem" placeholder="For example: I build websites, I prefer short answers…">'+esc(ld("xmm.mem",""))+'</textarea>';
 if(k==="cap")return'<h4>Capabilities</h4>'+row('Open links in the same tab',tog("links",ld("xmm.cl.links","tab")==="same"),'Off opens links in a new tab.')+row('Voice mode','<button class="bt" id="v3Vo" type="button">Open</button>','Talk with XMM AI hands-free.');
 if(k==="notif"){var pm="";try{pm=Notification.permission}catch(e){pm="unsupported"}
  return'<h4>Notifications</h4>'+row('Browser notifications',pm==="granted"?'On':pm==="denied"?'Blocked in browser':pm==="unsupported"?'Not supported':'<button class="bt" id="v3Nf" type="button">Allow</button>','Get told when a long task such as a build is done.')}
 if(k==="priv")return'<h4>Privacy</h4>'+row('Terms of Use','<a href="https://xmm-ai.com/terms" target="_blank" rel="noopener">View</a>')+row('Privacy Policy','<a href="https://xmm-ai.com/privacy" target="_blank" rel="noopener">View</a>')+
  row('Delete all chats','<button class="bt dg" id="v3Del" type="button">Delete</button>','Removes every chat saved on this device.')+row('Log out','<button class="bt" id="v3Out" type="button">Log out</button>');
 if(k==="plugins")return'<h4>Plugins</h4>'+row('MCP server','<button class="bt" id="v3Mcp" type="button">Open</button>','Connect external tools to XMM AI.');
 if(k==="code")return'<h4>Code</h4>'+row('Build mode','<button class="bt" id="v3Bd" type="button">Open Build</button>','XMM AI Engine 5.2 writes complete files and shows them live in Preview.');
 return"";
}
function openSettings(k){
 var old=$("#v3Set");if(old)old.remove();
 var o=el("div");o.id="v3Set";
 o.innerHTML='<div class="m"><div class="h"><button class="v3-ib v3-bk" id="v3SB" type="button" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><h3 id="v3ST">Settings</h3><button class="v3-ib" id="v3SX" type="button" aria-label="Close">'+I.x+'</button></div><div class="c"><nav id="v3SN"><div class="sr">'+I.search+'<input id="v3SS" placeholder="Search" autocomplete="off"></div>'+
  '<button type="button" class="bta" id="v3BA"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>Back to app</span></button><div class="sl">Account</div>'+NAV.map(function(x){return x?'<button type="button" data-k="'+x[0]+'">'+x[2]+'<span>'+x[1]+'</span></button>':'<hr><div class="sl">App</div>'}).join("")+'</nav><div class="p" id="v3SP"></div></div></div>';
 srB.appendChild(o);var cur="acc";
 var mob=function(){try{return matchMedia("(max-width:899px)").matches}catch(e){return false}},pushed=0,skipPop=0;
 function title(key){var f=NAV.filter(function(x){return x&&x[0]===key})[0];return f?f[1]:"Settings"}
 function menu(){cur="";o.classList.remove("pg");o.classList.add("mm");$("#v3ST").textContent="Settings";$("#v3SP").innerHTML=""}
 function show(key){cur=key;$$("#v3SN button").forEach(function(b){b.classList.toggle("on",b.dataset.k===key)});$("#v3SP").innerHTML=page(key);if(mob()){o.classList.remove("mm");o.classList.add("pg");$("#v3ST").textContent=title(key);var pp=$("#v3SP");if(pp)pp.scrollTop=0}}
 function push(){try{history.pushState({v3s:1},"");pushed++}catch(e){}}
 function closeAll(){var n=pushed;pushed=0;o.remove();window.removeEventListener("popstate",onPop);if(n>0){skipPop=1;try{history.go(-n)}catch(e){}setTimeout(function(){skipPop=0},400)}}
 function onPop(){if(skipPop)return;if(!o.isConnected){window.removeEventListener("popstate",onPop);return}if(pushed>0)pushed--;if(mob()&&o.classList.contains("pg"))menu();else{pushed=0;o.remove();window.removeEventListener("popstate",onPop)}}
 function goBack(){if(pushed>0){try{history.back();return}catch(e){}}if(o.classList.contains("pg"))menu();else closeAll()}
 var start=k&&NAV.some(function(x){return x&&x[0]===k})?k:"acc";
 if(mob()){window.addEventListener("popstate",onPop);push();if(k&&k!=="acc"&&start===k){push();show(start)}else menu()}else show(start);
 o.addEventListener("mousedown",function(e){if(e.target===o)closeAll()});
 $("#v3SX").onclick=closeAll;
 $("#v3SB").onclick=goBack;$("#v3BA").onclick=closeAll;
 $("#v3SN").addEventListener("click",function(e){var b=e.target.closest("button[data-k]");if(!b)return;var wasMenu=o.classList.contains("mm");show(b.dataset.k);if(mob()&&wasMenu)push()});
 $("#v3SS").addEventListener("input",function(e){var q=e.target.value.trim().toLowerCase();$$("#v3SN button").forEach(function(b){b.style.display=!q||b.textContent.toLowerCase().indexOf(q)>-1?"":"none"})});
 var P=$("#v3SP");
 P.addEventListener("input",function(e){var t=e.target;
  if(t.id==="v3Nm"||t.id==="v3Nm2"){var v=t.value;if(v.trim()){try{API().setName(v)}catch(x){sv("xmm.name",v)}var o2=$(t.id==="v3Nm"?"#v3Nm2":"#v3Nm");if(o2&&o2!==t)o2.value=v}}
  else if(t.id==="v3Mem")sv("xmm.mem",t.value)});
 P.addEventListener("change",function(e){var t=e.target;
  if(t.id==="v3Wk")sv("xmm.v3.work",t.value);
  else if(t.id==="v3Lg"){var l=$("#topLang");if(l){l.value=t.value;l.dispatchEvent(new Event("change",{bubbles:true}))}}
  else if(t.id==="v3Ph"){var f=t.files&&t.files[0];if(!f)return;if(f.size>10*1048576){toast("Photo is larger than 10MB");return}
   var img=new Image(),u=URL.createObjectURL(f);img.onload=function(){var c=D.createElement("canvas"),s=Math.min(img.width,img.height),z=160;c.width=c.height=z;c.getContext("2d").drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,z,z);try{sv("xmm.v3.avatar",c.toDataURL("image/jpeg",.85))}catch(x){}URL.revokeObjectURL(u);show(cur)};img.src=u}});
 P.addEventListener("click",function(e){var t=e.target.closest("button,a");if(!t)return;var id=t.id;
  if(t.dataset.th){applyTheme(t.dataset.th);show("app");return}
  if(t.dataset.sw){var k2=t.dataset.sw,on=!t.classList.contains("on");t.classList.toggle("on",on);if(k2==="hap")sv("xmm.cl.hap",on);else if(k2==="links")sv("xmm.cl.links",on?"same":"tab");return}
  if(id==="v3PhBtn"){var fi=el("input");fi.type="file";fi.accept="image/png,image/jpeg,image/webp";fi.id="v3Ph";fi.style.display="none";P.appendChild(fi);fi.click();return}
  if(id==="v3Cp"){try{navigator.clipboard.writeText(uid());toast("Copied")}catch(x){}return}
  if(id==="v3Lo"||id==="v3Out"){o.remove();var lg=$("#logout");if(lg)lg.click();return}
  if(id==="v3Ins"){o.remove();var ins=$('[data-act="install"]');if(ins)ins.click();return}
  if(id==="v3Del"){if(confirm("Delete all chats on this device?")){o.remove();var ca=$("#clearAll");if(ca)ca.click()}return}
  if(id==="v3Nf"){try{Notification.requestPermission().then(function(){show("notif")})}catch(x){}return}
  if(id==="v3Vo"){o.remove();try{CL().openVoice()}catch(x){}return}
  if(id==="v3Mcp"){o.remove();var mb=$(".xmcp-btn");if(mb)mb.click();else toast("Plugins are loading, try again");return}
  if(id==="v3Bd"){o.remove();var sb=$('#seg [data-m="code"]');if(sb)sb.click();return}
 });
}
window.XMM_V3={openSettings:openSettings,togglePanel:togglePanel,openSearch:openSearch};

/* ------------------------------------------------------------------ boot */
var n=0;
(function wait(){
 if(D.body&&D.querySelector("#shell-chat")&&D.querySelector("#mainChat")&&D.querySelector("#msg")&&(window.XMM_API||n>160)){try{B=D.body;build();setInterval(tick,260)}catch(e){try{console.error("v316",e)}catch(_){}}return}
 n++;setTimeout(wait,60);
})();
})();
