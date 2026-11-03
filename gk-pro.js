/* GETOKEN Pro: proje klasörleri, yerel arşiv, Bitcoin onay takibi.
   Kayıtlar yalnızca kullanıcının kendi tarayıcısında (IndexedDB) tutulur; hiçbir sunucuya gönderilmez. */
(function(){
var TR={title:'Arşiv ve projeler (Pro)',lock:'Pro ve Büro üyeliğinde: aldığınız her kanıt proje klasörlerine göre bu cihazda arşivlenir, Bitcoin onayı gelince size hatırlatılır ve onaylı .ots dosyası tek tıkla indirilir.',buy:'Planları gör',
 proj:'Aktif proje',projPh:'Örn. Kayapa B Blok teslim',projHint:'Yeni kanıtlar bu projeye kaydedilir.',all:'Tüm projeler',none:'Henüz arşivde kanıt yok. Bir dosyanın kanıtını aldığınızda burada görünür.',
 check:'Bitcoin onaylarını kontrol et',checking:'Kontrol ediliyor…',exp:'Arşivi dışa aktar',pend:'Bitcoin onayı bekleniyor',conf:'Bitcoin bloğu',dl:'.ots indir',del:'Sil',delQ:'Bu kayıt arşivden silinsin mi? (Dosyanın kendisi silinmez)',
 newConf:function(n){return n+' kanıtınız Bitcoin onayı aldı. Onaylı .ots dosyalarını indirip saklayın.'},nothing:'Yeni onay yok. Onay genelde 2–24 saat içinde gelir.',pack:'Paket',noProj:'(Projesiz)',local:'Arşiv yalnızca bu cihazda ve bu tarayıcıda durur. Düzenli olarak dışa aktarın.',count:function(n){return n+' kanıt'}};
var EN={title:'Archive and projects (Pro)',lock:'With Pro and Office: every proof you create is archived on this device by project, you are reminded when the Bitcoin confirmation arrives, and the confirmed .ots file downloads in one click.',buy:'See plans',
 proj:'Active project',projPh:'e.g. Flat 4 handover',projHint:'New proofs are saved to this project.',all:'All projects',none:'No proofs archived yet. They appear here once you create one.',
 check:'Check Bitcoin confirmations',checking:'Checking…',exp:'Export archive',pend:'Waiting for Bitcoin confirmation',conf:'Bitcoin block',dl:'Download .ots',del:'Delete',delQ:'Remove this record from the archive? (Your file is not deleted)',
 newConf:function(n){return n+' of your proofs are now confirmed in Bitcoin. Download and keep the confirmed .ots files.'},nothing:'No new confirmations yet. They usually arrive within 2–24 hours.',pack:'Pack',noProj:'(No project)',local:'The archive lives only in this browser on this device. Export it regularly.',count:function(n){return n+' proofs'}};
function s(k){var d=(document.documentElement.lang||'tr').slice(0,2)==='tr'?TR:EN;return d[k]}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function hex(b){return Array.from(b).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
function unhex(h){var o=new Uint8Array(h.length/2);for(var i=0;i<o.length;i++)o[i]=parseInt(h.substr(i*2,2),16);return o}

/* ---------- IndexedDB ---------- */
var DBP=null;
function db(){if(DBP)return DBP;DBP=new Promise(function(res,rej){var r=indexedDB.open('gk-arsiv',1);r.onupgradeneeded=function(){r.result.createObjectStore('k',{keyPath:'id'})};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}});return DBP}
function tx(mode,fn){return db().then(function(d){return new Promise(function(res,rej){var t=d.transaction('k',mode),st=t.objectStore('k'),out=fn(st);t.oncomplete=function(){res(out&&out.result!==undefined?out.result:out)};t.onerror=function(){rej(t.error)}})})}
function all(){return tx('readonly',function(st){return st.getAll()})}
function put(r){return tx('readwrite',function(st){st.put(r)})}
function del(id){return tx('readwrite',function(st){st.delete(id)})}

/* ---------- OpenTimestamps ayrıştırma / yükseltme ---------- */
var MAGICLEN=31,PENDING='83dfe30d2ef90c8e',BTC='0588960d73d71901';
function R(b){this.b=b;this.i=0}
R.prototype.u8=function(){if(this.i>=this.b.length)throw 'eof';return this.b[this.i++]};
R.prototype.bytes=function(n){if(this.i+n>this.b.length)throw 'eof';var o=this.b.slice(this.i,this.i+n);this.i+=n;return o};
R.prototype.vu=function(){var v=0,sh=0,x;do{x=this.u8();v+=(x&0x7f)*Math.pow(2,sh);sh+=7}while(x&0x80);return v};
R.prototype.vb=function(){return this.bytes(this.vu())};
function vuEnc(n){var o=[];do{var x=n%128;n=Math.floor(n/128);o.push(n?x|0x80:x)}while(n);return o}
async function apply(tag,arg,msg){
  if(tag===0xf0){var o=new Uint8Array(msg.length+arg.length);o.set(msg);o.set(arg,msg.length);return o}
  if(tag===0xf1){var p=new Uint8Array(msg.length+arg.length);p.set(arg);p.set(msg,arg.length);return p}
  if(tag===0x08)return new Uint8Array(await crypto.subtle.digest('SHA-256',msg));
  if(tag===0x02)return new Uint8Array(await crypto.subtle.digest('SHA-1',msg));
  throw 'op';
}
async function parse(r,msg){var node={msg:msg,atts:[],ops:[]};
  for(;;){var tag=r.u8();if(tag===0xff){await item(r,r.u8(),node);continue}await item(r,tag,node);break}
  return node}
async function item(r,tag,node){
  if(tag===0x00){node.atts.push({tag:hex(r.bytes(8)),payload:r.vb()});return}
  var arg=(tag===0xf0||tag===0xf1)?r.vb():null;var m=await apply(tag,arg,node.msg);
  node.ops.push({tag:tag,arg:arg,child:await parse(r,m)})}
function ser(node,out){var items=[];node.atts.forEach(function(a){items.push(function(){out.push(0x00);unhex(a.tag).forEach(function(x){out.push(x)});vuEnc(a.payload.length).forEach(function(x){out.push(x)});a.payload.forEach(function(x){out.push(x)})})});
  node.ops.forEach(function(o){items.push(function(){out.push(o.tag);if(o.arg){vuEnc(o.arg.length).forEach(function(x){out.push(x)});o.arg.forEach(function(x){out.push(x)})}ser(o.child,out)})});
  items.forEach(function(f,i){if(i<items.length-1)out.push(0xff);f()})}
function walk(node,fn){fn(node);node.ops.forEach(function(o){walk(o.child,fn)})}
async function readOts(ots){var r=new R(ots);r.i=MAGICLEN;var ver=r.u8(),op=r.u8();if(ver!==1||op!==0x08)throw 'hdr';var d=r.bytes(32);return {head:ots.slice(0,MAGICLEN+2),d:d,tree:await parse(r,d)}}
function info(tree){var btc=null,pend=0;walk(tree,function(n){n.atts.forEach(function(a){if(a.tag===BTC){var h=new R(a.payload).vu();if(btc===null||h<btc)btc=h}if(a.tag===PENDING)pend++})});return {btc:btc,pend:pend}}
async function upgrade(ots){var o=await readOts(ots),changed=false,list=[];walk(o.tree,function(n){n.atts.forEach(function(a){if(a.tag===PENDING)list.push({n:n,a:a})})});
  for(var k=0;k<list.length;k++){var it=list[k];try{var uri=new TextDecoder().decode(new R(it.a.payload).vb());if(!/^https:\/\/[a-z0-9.\-]+(\/[^\s]*)?$/i.test(uri))continue;
    var resp=await fetch(uri.replace(/\/$/,'')+'/timestamp/'+hex(it.n.msg),{headers:{Accept:'application/vnd.opentimestamps.v1'}});if(!resp.ok)continue;
    var sub=await parse(new R(new Uint8Array(await resp.arrayBuffer())),it.n.msg);if(!info(sub).btc)continue;
    it.n.atts=it.n.atts.filter(function(x){return x!==it.a});sub.atts.forEach(function(x){it.n.atts.push(x)});sub.ops.forEach(function(x){it.n.ops.push(x)});changed=true}catch(e){}}
  if(!changed)return null;var out=Array.from(o.head);out=out.concat(Array.from(o.d));ser(o.tree,out);var nb=new Uint8Array(out);return {ots:nb,btc:info(o.tree).btc}}

/* ---------- kayıt ---------- */
async function pro(){try{if(!window.GK||!GK.lic)return false;var i=await GK.lic();return !!(i&&!i.bad&&i.unlimited)}catch(e){return false}}
function proj(){try{return localStorage.getItem('gk-proje')||''}catch(e){return ''}}
async function save(o){if(!(await pro()))return;try{await put({id:o.hash+'-'+Date.now(),name:o.name,hash:o.hash,size:o.size||0,at:(o.at||new Date()).toISOString(),n:o.n||0,ots:o.ots,json:o.json||null,kind:o.kind||'tek',proje:proj(),btc:null,checked:null});render()}catch(e){}}
function dl(name,bytes,type){var a=el('a');a.href=URL.createObjectURL(new Blob([bytes],{type:type||'application/octet-stream'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500)}
async function checkAll(btn,msg){if(btn){btn.disabled=true;btn.textContent=s('checking')}var L=await all(),got=0;
  for(var i=0;i<L.length;i++){var r=L[i];if(r.btc)continue;try{var u=await upgrade(r.ots);r.checked=new Date().toISOString();if(u){r.ots=u.ots;r.btc=u.btc;got++}await put(r)}catch(e){}}
  if(btn){btn.disabled=false;btn.textContent=s('check')}if(msg)msg.textContent=got?s('newConf')(got):s('nothing');await render(got?s('newConf')(got):null);return got}
async function exportAll(){var L=await all();var out=L.map(function(r){return {name:r.name,proje:r.proje,kind:r.kind,at:r.at,sha256:r.hash,bitcoinBlock:r.btc,ots_base64:btoa(String.fromCharCode.apply(null,r.ots)),manifest:r.json?new TextDecoder().decode(r.json):undefined}});
  dl('getoken-arsiv-'+new Date().toISOString().slice(0,10)+'.json',new TextEncoder().encode(JSON.stringify({type:'getoken-archive',version:1,exported:new Date().toISOString(),items:out},null,1)),'application/json')}

/* ---------- görünüm ---------- */
var FILTER=null,BANNER=null;
async function render(banner){var host=document.getElementById('gk-arsiv');if(!host)return;if(banner!==undefined)BANNER=banner;host.innerHTML='';
  host.appendChild(el('h3',null,s('title')));
  if(!(await pro())){host.appendChild(el('p','note',s('lock')));var a=el('a','btn ghost',s('buy'));a.href='magaza.html';host.appendChild(a);return}
  if(BANNER){var bn=el('div','st ok',BANNER);host.appendChild(bn)}
  var row=el('div','row');var lab=el('label',null,s('proj'));var inp=el('input');inp.placeholder=s('projPh');inp.value=proj();inp.style.minWidth='220px';
  inp.onchange=function(){try{localStorage.setItem('gk-proje',inp.value.trim())}catch(e){}};row.append(lab,inp);host.appendChild(row);host.appendChild(el('p','note',s('projHint')));
  var L=(await all()).sort(function(a,b){return b.at<a.at?-1:1});
  var projs=Array.from(new Set(L.map(function(r){return r.proje||''})));
  if(L.length){var sel=el('select');var o0=el('option',null,s('all')+' ('+s('count')(L.length)+')');o0.value='*';sel.appendChild(o0);
    projs.forEach(function(p){var o=el('option',null,(p||s('noProj'))+' ('+L.filter(function(r){return (r.proje||'')===p}).length+')');o.value=p;if(FILTER===p)o.selected=true;sel.appendChild(o)});
    sel.onchange=function(){FILTER=sel.value==='*'?null:sel.value;render()};
    var tools=el('div','row');var cb=el('button','btn',s('check'));cb.type='button';var msg=el('span','note');cb.onclick=function(){checkAll(cb,msg)};
    var ex=el('button','btn ghost',s('exp'));ex.type='button';ex.onclick=exportAll;tools.append(sel,cb,ex,msg);host.appendChild(tools)}
  else{host.appendChild(el('p','note',s('none')));return}
  var list=el('div','list');L.filter(function(r){return FILTER===null||(r.proje||'')===FILTER}).forEach(function(r){var it=el('div','item');
    it.appendChild(el('h3',null,(r.kind==='paket'?s('pack')+': ':'')+r.name));
    it.appendChild(el('div','hash',r.hash));
    it.appendChild(el('div','note',new Date(r.at).toLocaleString()+' · '+(r.proje||s('noProj'))));
    it.appendChild(el('div',r.btc?'st ok':'st wait',r.btc?s('conf')+' #'+r.btc:s('pend')));
    var rr=el('div','row');var d1=el('button','btn',s('dl'));d1.type='button';d1.onclick=function(){dl(r.name+'.ots',r.ots)};rr.appendChild(d1);
    if(r.json){var dj=el('button','btn ghost','.json');dj.type='button';dj.onclick=function(){dl(r.name,r.json,'application/json')};rr.appendChild(dj)}
    var dx=el('button','btn ghost',s('del'));dx.type='button';dx.onclick=async function(){if(confirm(s('delQ'))){await del(r.id);render()}};rr.appendChild(dx);it.appendChild(rr);list.appendChild(it)});
  host.appendChild(list);host.appendChild(el('p','note',s('local')))}

/* açılışta: 1 saatten eski, onaysız kayıtları sessizce kontrol et ve hatırlat */
async function boot(){await render();if(!(await pro()))return;try{var L=await all();var due=L.filter(function(r){return !r.btc&&(Date.now()-new Date(r.at).getTime())>3600e3&&(!r.checked||Date.now()-new Date(r.checked).getTime()>1800e3)});if(due.length)checkAll(null,null)}catch(e){}}
window.GKPRO={save:save,render:render,upgrade:upgrade,readOts:readOts,info:info};
document.addEventListener('langchange',function(){render()});document.addEventListener('gklic',function(){render()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
