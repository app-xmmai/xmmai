/* fix.js v88 — remove duplicate settings buttons, make sure a settings tab is always open */
(function(){
var Q=function(s,r){return(r||document).querySelector(s)};
function kill(){
  ["#gFabS",".g-dmo",".xs-gear"].forEach(function(s){var n=document.querySelectorAll(s);for(var i=0;i<n.length;i++)n[i].remove()})}
function tabs(){
  var R=document.getElementById("settings");if(!R||R.hidden)return;
  var nav=Q(".stabs",R),panes=Q(".spanes",R);if(!nav||!panes)return;
  if(!Q(".pane.on",panes)){var b=Q("button",nav);if(b)b.click()}}
kill();setInterval(kill,1000);
var R=document.getElementById("settings");
if(R)new MutationObserver(function(){setTimeout(tabs,30)}).observe(R,{attributes:true,attributeFilter:["hidden"]});
var _kq=0;new MutationObserver(function(){if(_kq)return;_kq=setTimeout(function(){_kq=0;kill()},400)}).observe(document.body,{childList:true,subtree:true});
})();
