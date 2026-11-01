(function(){
var h=document.documentElement,b=document.getElementById('lg'),L=null;
try{L=localStorage.getItem('lg')}catch(e){}
var q=new URLSearchParams(location.search).get('lang');if(q==='en'||q==='tr')L=q;
if(L==='en'||(!L&&!/^tr/i.test(navigator.language||'')))h.lang='en';
function setB(){if(b)b.textContent=h.lang==='en'?'Türkçe':'English';document.dispatchEvent(new Event('langchange'))}
setB();
if(b)b.onclick=function(){h.lang=h.lang==='en'?'tr':'en';try{localStorage.setItem('lg',h.lang)}catch(e){}setB()};
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})})}
var dp=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;document.querySelectorAll('.install').forEach(function(x){x.hidden=false})});
document.addEventListener('click',function(e){var t=e.target.closest('.install');if(t&&dp){dp.prompt();dp=null}});
})();
