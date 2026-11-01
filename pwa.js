(function(){
var base=(document.currentScript&&document.currentScript.src)||location.href;
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register(new URL('sw.js',base).href).catch(function(){})})}
var dp=null,st=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;document.querySelectorAll('.install').forEach(function(x){x.hidden=false})});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.install');if(t&&dp){dp.prompt();dp=null;t.hidden=true}});
if(!st&&/iphone|ipad|ipod/i.test(navigator.userAgent)){document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.ios-hint').forEach(function(x){x.hidden=false})})}
})();
