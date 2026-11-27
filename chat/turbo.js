/* turbo mode: toggles html.xmm-turbo while the AI is busy (see turbo.css) */
(function(){var on=0,h=document.documentElement;
setInterval(function(){try{var a=window.XMM_API,b=!!(a&&a.S&&a.S.busy);if(b!==on){on=b;h.classList.toggle("xmm-turbo",b)}}catch(e){}},120)})();
