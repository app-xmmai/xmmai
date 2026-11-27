/* kbfix.js: make the iOS keyboard reliably appear (incl. jailbroken / tweaked iOS where it silently fails).
   iOS only opens the keyboard when focus() runs inside a real tap. This focuses text fields synchronously inside the tap,
   and keeps a hidden proxy field focused for taps that focus the composer a moment later (e.g. New chat). */
(function(){"use strict";
var ua=navigator.userAgent||"",ios=/iPhone|iPad|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
if(!ios)return;
var D=document,proxy=null,pt=0;
function isField(e){if(!e||e.nodeType!==1)return false;var t=e.tagName;if(t==="TEXTAREA")return true;if(t!=="INPUT")return false;return!/^(button|checkbox|radio|range|file|submit|reset|image|color|hidden)$/i.test(e.type||"text")}
function ok(e){return isField(e)&&!e.disabled&&!e.readOnly}
function target(ev){var p=ev.composedPath?ev.composedPath():[ev.target];for(var i=0;i<p.length;i++){var n=p[i];if(n&&n.nodeType===1){if(isField(n))return n;if(n.tagName==="LABEL"&&n.control&&isField(n.control))return n.control}}return null}
function fix(e){try{if(e.readOnly&&!e.hasAttribute("readonly"))e.readOnly=false;if(e.getAttribute("inputmode")==="none")e.removeAttribute("inputmode");if(e.tagName==="TEXTAREA"||/^(text|search|url|email|tel|)$/i.test(e.type||"")){if(!e.hasAttribute("autocorrect"))e.setAttribute("autocorrect","on")}}catch(_){}}
function focusNow(e){if(!ok(e))return;fix(e);var a=D.activeElement;while(a&&a.shadowRoot&&a.shadowRoot.activeElement)a=a.shadowRoot.activeElement;if(a===e)return;try{e.focus({preventScroll:true})}catch(_){try{e.focus()}catch(__){}}}
function onTap(ev){var e=target(ev);if(!e)return;focusNow(e)}
D.addEventListener("touchend",onTap,true);
D.addEventListener("pointerup",function(ev){if(ev.pointerType==="touch"||ev.pointerType==="pen")onTap(ev)},true);
D.addEventListener("click",onTap,true);
/* taps that open the keyboard a moment later: grab the keyboard now with a hidden field, the real field takes it over */
function mk(){if(proxy&&proxy.isConnected)return proxy;proxy=D.createElement("input");proxy.type="text";proxy.setAttribute("aria-hidden","true");proxy.tabIndex=-1;proxy.autocapitalize="off";proxy.setAttribute("autocorrect","off");proxy.style.cssText="position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;border:0;padding:0;margin:0;font-size:16px;pointer-events:none;z-index:-1";(D.body||D.documentElement).appendChild(proxy);return proxy}
function grab(){try{var p=mk();p.focus({preventScroll:true});clearTimeout(pt);pt=setTimeout(drop,1800)}catch(_){}}
function drop(){if(proxy&&D.activeElement===proxy){try{proxy.blur()}catch(_){}}if(proxy){try{proxy.remove()}catch(_){}}proxy=null}
var WANT='[data-act="newchat"],[data-act="focus"],[aria-label="New chat"],[aria-label="New Chat"],.v3-nc,#v3New';
function wants(ev){var p=ev.composedPath?ev.composedPath():[ev.target];for(var i=0;i<p.length;i++){var n=p[i];if(n&&n.matches&&n.matches(WANT))return true}return false}
function onWant(ev){if(wants(ev))grab()}
D.addEventListener("touchend",onWant,true);
D.addEventListener("click",onWant,true);
/* once any real field is focused the proxy is no longer needed */
D.addEventListener("focusin",function(ev){var t=ev.composedPath?ev.composedPath()[0]:ev.target;if(proxy&&t!==proxy&&isField(t))setTimeout(drop,200)},true);
/* make every field iOS-friendly as it appears */
function scan(root){try{var l=root.querySelectorAll?root.querySelectorAll("textarea,input"):[];for(var i=0;i<l.length;i++)fix(l[i])}catch(_){}}
scan(D);try{new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++){var n=a[j];if(n.nodeType===1){if(isField(n))fix(n);else scan(n)}}}}).observe(D.documentElement,{childList:true,subtree:true})}catch(_){}
})();
