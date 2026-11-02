/* GETOKEN · Dosya Kanıtı — PDF rapor ve lisans modülü */
(function(){
'use strict';
var BASE=(function(){try{return new URL('.',document.currentScript.src).href}catch(e){return 'https://gepara.com/'}})();
var SITE='https://gepara.com/';
var LIBS={jspdf:'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',qr:'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js'};
var COST={proof:1,verify:2,pack:4};
var TRIAL_PER_MONTH=3;

var S={
tr:{rTitle:'DOSYA KANITI RAPORU',rTitlePack:'TESLİM PAKETİ KANIT RAPORU',rTitleVer:'DOĞRULAMA RAPORU',rNo:'Rapor no',rDate:'Düzenlenme',
s1:'1. Dosya bilgileri',s1p:'2. Paketteki dosyalar',pS1:'1. Paket ve zaman kanıtı',s2:'2. Zaman kanıtı',s3:'3. Görüntü',s4:'Nasıl doğrulanır?',s5:'Hukuki açıklama',
fName:'Dosya adı',fSize:'Boyut',fMod:'Dosyanın cihazdaki son değişiklik tarihi',fSha:'SHA-256 parmak izi',bytes:'bayt',
tAt:'Kanıtın oluşturulduğu an',tUtc:'Aynı an (UTC)',tInfra:'Zaman damgası altyapısı',tInfraV:'OpenTimestamps → Bitcoin blokzinciri',tCals:'Kaydı alan sunucu',tOts:'Kanıt dosyası',tOtsSha:'Kanıt dosyasının parmak izi',tBtc:'Bitcoin onayı',tBtcV:'Parmak izi zaman sunucularına bu raporun düzenlendiği anda ulaştı. Bitcoin blokzincirine işlenmesi genellikle birkaç saat sürer; sonrasında yapılacak kontrol, kaydın hangi Bitcoin bloğunda yer aldığını gösterir.',
pNote:'Paket notu',pCount:'Dosya sayısı',pList:'Paket listesi',pListSha:'Paket listesinin parmak izi',
v1:'1. Kontrol edilen dosyalar',vRes:'Sonuç',vAt:'Kontrol zamanı',
how:['Orijinal dosyayı ve kanıt dosyasını (.ots) birlikte saklayın; dosyayı hiç değiştirmeyin.','gepara.com/dosya-kaniti.html adresindeki "Kontrol et" bölümüne iki dosyayı birlikte bırakın.','Bağımsız kontrol için aynı iki dosyayı opentimestamps.org adresinde de doğrulayabilirsiniz; orada Bitcoin bloğu ve tarih görünür.','Dosyanın parmak izini herhangi bir SHA-256 aracıyla hesaplayıp bu rapordaki değerle karşılaştırabilirsiniz.'],
legal:'Bu rapor, yukarıda parmak izi yazılı dosyanın belirtilen anda var olduğunu ve o andan sonra değişmediğini gösteren teknik bir kayıttır. Dosyanın içeriğinin doğruluğunu, çekildiği yeri ya da kime ait olduğunu tek başına kanıtlamaz. Noter onayı veya nitelikli elektronik zaman damgası değildir; mahkemede takdiri delil olarak değerlendirilir. Dosyanın kendisi GETOKEN\'e gönderilmemiş ve saklanmamıştır.',
qr:'Kontrol sayfası',page:'Sayfa',foot:'GETOKEN · gepara.com · info@gepara.com',
btnProof:'PDF kanıt raporu',btnPack:'Paket raporu (PDF)',btnVer:'Doğrulama raporu (PDF)',making:'Rapor hazırlanıyor…',
payTitle:'PDF rapor ücretli bir hizmettir.',payBody:'Tek rapor 49 TL. Kontör paketleri ve sınırsız Pro üyelik için fiyatlara bakın. Lisans kodunuz varsa aşağıya girin.',payBuy:'Satın al',payHave:'Lisans kodum var',
trialEnd:'Bu ayki 3 ücretsiz deneme hakkınız doldu. Devam etmek için lisans kodu girin ya da bir paket satın alın.',trialLeft:'Bu ay kalan ücretsiz deneme',
lic:'Lisans',licPh:'Lisans kodu (örn. GK-XXXX-XXXX-XXXX)',licSave:'Kaydet',licBad:'Kod geçerli değil ya da süresi dolmuş.',licPro:'Sınırsız kullanım',licUntil:'tarihine kadar',licCredits:'kontör kaldı',licNone:'Lisans girilmedi',licOut:'Kontörünüz bitti.',licRemove:'Kaldır',need:'Bu rapor için gereken kontör'},
en:{rTitle:'FILE PROOF REPORT',rTitlePack:'HANDOVER PACK PROOF REPORT',rTitleVer:'VERIFICATION REPORT',rNo:'Report no',rDate:'Issued',
s1:'1. File details',s1p:'2. Files in the pack',pS1:'1. Pack and time proof',s2:'2. Time proof',s3:'3. Image',s4:'How to verify',s5:'Legal note',
fName:'File name',fSize:'Size',fMod:'Last modified on the device',fSha:'SHA-256 fingerprint',bytes:'bytes',
tAt:'Proof created at',tUtc:'Same moment (UTC)',tInfra:'Timestamp infrastructure',tInfraV:'OpenTimestamps → Bitcoin blockchain',tCals:'Servers that recorded it',tOts:'Proof file',tOtsSha:'Proof file fingerprint',tBtc:'Bitcoin confirmation',tBtcV:'The fingerprint reached the timestamp servers at the moment this report was issued. Anchoring in the Bitcoin blockchain usually takes a few hours; a later check shows the Bitcoin block that contains the record.',
pNote:'Pack note',pCount:'Number of files',pList:'Pack list',pListSha:'Pack list fingerprint',
v1:'1. Files checked',vRes:'Result',vAt:'Checked at',
how:['Keep the original file and the proof file (.ots) together; never modify the file.','Drop both files into "Check" at gepara.com/dosya-kaniti.html.','For an independent check, verify the same two files at opentimestamps.org, which shows the Bitcoin block and date.','You can compute the file\'s SHA-256 fingerprint with any tool and compare it with the value in this report.'],
legal:'This report is a technical record showing that the file with the fingerprint above existed at the stated moment and has not changed since. On its own it does not prove what the file shows, where it was made or who owns it. It is not a notarisation or a qualified electronic timestamp; courts weigh it as evidence at their discretion. The file itself was never sent to or stored by GETOKEN.',
qr:'Verification page',page:'Page',foot:'GETOKEN · gepara.com · info@gepara.com',
btnProof:'PDF proof report',btnPack:'Pack report (PDF)',btnVer:'Verification report (PDF)',making:'Preparing report…',
payTitle:'The PDF report is a paid service.',payBody:'A single report is $4. See pricing for credit packs and unlimited Pro. If you have a licence code, enter it below.',payBuy:'Buy',payHave:'I have a licence code',
trialEnd:'Your 3 free tries for this month are used. Enter a licence code or buy a plan to continue.',trialLeft:'Free tries left this month',
lic:'Licence',licPh:'Licence code (e.g. GK-XXXX-XXXX-XXXX)',licSave:'Save',licBad:'Code not valid or expired.',licPro:'Unlimited use',licUntil:'until',licCredits:'credits left',licNone:'No licence entered',licOut:'You have no credits left.',licRemove:'Remove',need:'Credits needed for this report'}
};
function lang(){var l=(document.documentElement.lang||'tr').slice(0,2);return l==='tr'?'tr':'en'}
function s(k){return S[lang()][k]}
function ls(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||'null');localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
function hex(b){return Array.from(b).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
async function sha(u8){return new Uint8Array(await crypto.subtle.digest('SHA-256',u8))}
function load(src){return new Promise(function(ok,no){if(document.querySelector('script[src="'+src+'"]')){var w=setInterval(function(){if((src===LIBS.jspdf&&window.jspdf)||(src===LIBS.qr&&window.qrcode)){clearInterval(w);ok()}},50);return}var e=document.createElement('script');e.src=src;e.onload=ok;e.onerror=no;document.head.appendChild(e)})}
async function font(n){var r=await fetch(BASE+'fonts/rapor-'+n+'.ttf');var b=new Uint8Array(await r.arrayBuffer());var str='';for(var i=0;i<b.length;i+=8192)str+=String.fromCharCode.apply(null,b.subarray(i,i+8192));return btoa(str)}

/* ---------- Lisans ---------- */
var LICS=null;
async function licList(){if(LICS)return LICS;try{var r=await fetch(BASE+'lisans.json?'+Date.now());LICS=await r.json()}catch(e){LICS=[]}return LICS}
async function licInfo(){var code=ls('gk-lic');if(!code)return null;var h=hex(await sha(new TextEncoder().encode(code.trim().toUpperCase())));var L=await licList();var x=L.find(function(e){return e.h===h});if(!x)return {bad:true};
  if(x.exp&&new Date(x.exp+'T23:59:59')<new Date())return {bad:true,expired:true};
  if(x.plan==='kontor'){var used=(ls('gk-used')||{})[h]||0;return {plan:'kontor',left:Math.max(0,(x.n||0)-used),h:h,exp:x.exp}}
  return {plan:x.plan,unlimited:true,exp:x.exp,h:h}}
async function spend(n){var i=await licInfo();if(!i||i.bad)return false;if(i.unlimited)return true;if(i.left<n)return false;var u=ls('gk-used')||{};u[i.h]=(u[i.h]||0)+n;ls('gk-used',u);return true}
async function canSpend(n){var i=await licInfo();return !!(i&&!i.bad&&(i.unlimited||i.left>=n))}
function month(){var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')}
function trialUsed(){var t=ls('gk-trial');return t&&t.m===month()?t.n:0}
async function allowProof(){var i=await licInfo();if(i&&!i.bad&&(i.unlimited||i.left>0))return true;return trialUsed()<TRIAL_PER_MONTH}
function countProof(){licInfo().then(function(i){if(i&&!i.bad&&i.unlimited)return;var n=trialUsed()+1;ls('gk-trial',{m:month(),n:n});renderLic()})}

function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function payBox(need){var b=el('div','res info');b.style.marginTop='10px';b.appendChild(el('b',null,s('payTitle')));b.appendChild(el('div',null,s('payBody')+(need?' '+s('need')+': '+need+'.':'')));
  var r=el('div','row');var a=el('a','btn gold',s('payBuy'));a.href=BASE+'fiyatlar.html#siparis';var c=el('button','btn ghost',s('payHave'));c.type='button';c.onclick=function(){var x=document.getElementById('gk-lic');if(x){x.scrollIntoView({behavior:'smooth',block:'center'});var i=x.querySelector('input');if(i)i.focus()}};r.append(a,c);b.appendChild(r);return b}
function trialBox(){var b=payBox();b.firstChild.textContent=s('trialEnd');return b}

async function renderLic(){var host=document.getElementById('gk-lic');if(!host)return;host.innerHTML='';
  host.appendChild(el('h3',null,s('lic')));var st=el('div','note');var i=await licInfo();
  if(!i)st.textContent=s('licNone')+' · '+s('trialLeft')+': '+Math.max(0,TRIAL_PER_MONTH-trialUsed());
  else if(i.bad)st.textContent=s('licBad');
  else if(i.unlimited)st.textContent=(i.plan||'').toUpperCase()+' · '+s('licPro')+(i.exp?' · '+new Date(i.exp).toLocaleDateString(lang())+' '+s('licUntil'):'');
  else st.textContent=i.left+' '+s('licCredits')+(i.exp?' · '+new Date(i.exp).toLocaleDateString(lang())+' '+s('licUntil'):'');
  var row=el('div','row');var inp=el('input');inp.placeholder=s('licPh');inp.autocomplete='off';inp.spellcheck=false;inp.style.cssText='flex:1;min-width:200px;font:inherit;padding:9px 10px;border:1px solid var(--rule,#ccc);border-radius:8px';
  var sv=el('button','btn',s('licSave'));sv.type='button';sv.onclick=async function(){var v=inp.value.trim().toUpperCase();if(!v)return;ls('gk-lic',v);LICS=null;await renderLic()};
  row.append(inp,sv);if(ls('gk-lic')){var rm=el('button','btn ghost',s('licRemove'));rm.type='button';rm.onclick=function(){try{localStorage.removeItem('gk-lic')}catch(e){}renderLic()};row.appendChild(rm)}
  host.append(st,row)}

/* ---------- PDF ---------- */
async function doc(){await load(LIBS.jspdf);await load(LIBS.qr);var J=window.jspdf.jsPDF;var d=new J({unit:'mm',format:'a4'});
  var f=await Promise.all([font('Regular'),font('Bold'),font('Mono')]);
  d.addFileToVFS('r.ttf',f[0]);d.addFont('r.ttf','R','normal');d.addFileToVFS('b.ttf',f[1]);d.addFont('b.ttf','R','bold');d.addFileToVFS('m.ttf',f[2]);d.addFont('m.ttf','M','normal');d.setFont('R','normal');return d}
var M=18,W=210-2*M;
function Writer(d){this.d=d;this.y=M}
Writer.prototype.need=function(h){if(this.y+h>297-M-10){this.d.addPage();this.y=M}};
Writer.prototype.text=function(t,o){o=o||{};var d=this.d;d.setFont(o.mono?'M':'R',o.bold?'bold':'normal');d.setFontSize(o.size||10);var lines=d.splitTextToSize(t,o.w||W);var lh=(o.size||10)*0.42;this.need(lines.length*lh+1);d.text(lines,o.x||M,this.y+lh*0.8);this.y+=lines.length*lh+(o.gap==null?2:o.gap)};
Writer.prototype.h=function(t){this.y+=3;this.need(12);this.text(t,{bold:true,size:11.5,gap:1});this.d.setDrawColor(0);this.d.setLineWidth(0.2);this.d.line(M,this.y,M+W,this.y);this.y+=3};
Writer.prototype.table=function(rows){var d=this.d,c1=58,pad=2;rows.forEach(function(r){d.setFontSize(9);d.setFont('R','bold');var a=d.splitTextToSize(r[0],c1-2*pad);d.setFont(r[2]?'M':'R','normal');d.setFontSize(r[2]?8:9);var b=d.splitTextToSize(String(r[1]),W-c1-2*pad);var h=Math.max(a.length,b.length)*3.9+2*pad;this.need(h);
  d.setDrawColor(0);d.setLineWidth(0.2);d.rect(M,this.y,W,h);d.line(M+c1,this.y,M+c1,this.y+h);
  d.setFont('R','bold');d.setFontSize(9);d.text(a,M+pad,this.y+pad+3);d.setFont(r[2]?'M':'R','normal');d.setFontSize(r[2]?8:9);d.text(b,M+c1+pad,this.y+pad+3);this.y+=h}.bind(this));this.y+=3};
Writer.prototype.grid=function(head,rows,ws){var d=this.d,pad=1.6;var draw=function(cells,bold){d.setFontSize(8);var ls2=cells.map(function(c,i){d.setFont(i===ws.length-1&&!bold?'M':'R',bold?'bold':'normal');return d.splitTextToSize(String(c),ws[i]-2*pad)});var h=Math.max.apply(null,ls2.map(function(l){return l.length}))*3.4+2*pad;this.need(h);var x=M;
  ls2.forEach(function(l,i){d.setDrawColor(0);d.setLineWidth(0.2);d.rect(x,this.y,ws[i],h);d.setFont(i===ws.length-1&&!bold?'M':'R',bold?'bold':'normal');d.setFontSize(i===ws.length-1&&!bold?7:8);d.text(l,x+pad,this.y+pad+2.6);x+=ws[i]}.bind(this));this.y+=h}.bind(this);
  draw(head,true);rows.forEach(function(r){draw(r,false)});this.y+=3};
function qrData(text){var q=window.qrcode(0,'M');q.addData(text);q.make();return q.createDataURL(4,0)}
function header(w,title,no,at){var d=w.d;d.setFillColor(18,40,74);d.rect(0,0,210,24,'F');d.setTextColor(255,255,255);d.setFont('R','bold');d.setFontSize(15);d.text(title,M,11.5);d.setFont('R','normal');d.setFontSize(8.5);d.text('GETOKEN · gepara.com',M,18);
  d.text(s('rNo')+': '+no,210-M,11.5,{align:'right'});d.text(s('rDate')+': '+at.toLocaleString(lang()==='tr'?'tr-TR':'en-GB'),210-M,18,{align:'right'});d.setTextColor(0,0,0);w.y=32}
function footer(d){var n=d.getNumberOfPages();for(var i=1;i<=n;i++){d.setPage(i);d.setDrawColor(0);d.setLineWidth(0.2);d.line(M,297-12,210-M,297-12);d.setFont('R','normal');d.setFontSize(8);d.setTextColor(60,60,60);d.text(s('foot'),M,297-7.5);d.text(s('page')+' '+i+' / '+n,210-M,297-7.5,{align:'right'});d.setTextColor(0,0,0)}}
function fmtSize(n){return n.toLocaleString(lang()==='tr'?'tr-TR':'en-GB')+' '+s('bytes')}
function dt(x){return new Date(x).toLocaleString(lang()==='tr'?'tr-TR':'en-GB',{dateStyle:'long',timeStyle:'medium'})}
function closing(w,hash){var d=w.d;w.h(s('s4'));var y0=w.y;s('how').forEach(function(t,i){w.text((i+1)+'. '+t,{w:W-40,size:9.5})});var url=SITE+'dosya-kaniti.html#kontrol';try{d.addImage(qrData(url),'PNG',M+W-32,y0,30,30)}catch(e){}d.setFontSize(7.5);d.text(s('qr'),M+W-17,y0+33,{align:'center'});if(w.y<y0+36)w.y=y0+36;
  w.h(s('s5'));w.text(s('legal'),{size:9})}
async function thumb(file){if(!file||!/^image\/(jpeg|png|webp)$/.test(file.type))return null;try{var bmp=await createImageBitmap(file);var max=1400,sc=Math.min(1,max/Math.max(bmp.width,bmp.height));var c=document.createElement('canvas');c.width=Math.round(bmp.width*sc);c.height=Math.round(bmp.height*sc);c.getContext('2d').drawImage(bmp,0,0,c.width,c.height);return {url:c.toDataURL('image/jpeg',0.82),w:c.width,h:c.height}}catch(e){return null}}
async function save(d,name){var bytes=new Uint8Array(d.output('arraybuffer'));var dl=window.claude&&window.claude.use?await window.claude.use('downloads').catch(function(){return null}):null;if(dl){try{await dl.save({filename:name,data:bytes});return}catch(e){}}
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},1000)}

async function proofPDF(o){/* o:{file,digestHex,ots,n,at} */
  var d=await doc(),w=new Writer(d);var no=o.digestHex.slice(0,8).toUpperCase()+'-'+o.at.toISOString().slice(0,10).replace(/-/g,'');
  header(w,s('rTitle'),no,o.at);
  w.h(s('s1'));w.table([[s('fName'),o.file.name],[s('fSize'),fmtSize(o.file.size)],[s('fMod'),dt(o.file.lastModified)],[s('fSha'),o.digestHex,1]]);
  var otsH=hex(await sha(o.ots));
  w.h(s('s2'));w.table([[s('tAt'),dt(o.at)],[s('tUtc'),o.at.toISOString()],[s('tInfra'),s('tInfraV')],[s('tCals'),o.n+' / 3'],[s('tOts'),o.file.name+'.ots'],[s('tOtsSha'),otsH,1],[s('tBtc'),s('tBtcV')]]);
  var im=await thumb(o.file);if(im){var mw=W,mh=95,r=Math.min(mw/im.w,mh/im.h),iw=im.w*r,ih=im.h*r;w.need(ih+18);w.h(s('s3'));d.addImage(im.url,'JPEG',M+(W-iw)/2,w.y,iw,ih);d.setDrawColor(0);d.rect(M+(W-iw)/2,w.y,iw,ih);w.y+=ih+4}
  closing(w,o.digestHex);footer(d);await save(d,'kanit-raporu-'+no+'.pdf')}
async function packPDF(o){/* o:{man,digestHex,ots,n,files} */
  var at=new Date(o.man.created),d=await doc(),w=new Writer(d);var no=o.digestHex.slice(0,8).toUpperCase()+'-'+o.man.created.slice(0,10).replace(/-/g,'');
  header(w,s('rTitlePack'),no,at);
  w.h(s('pS1'));var otsH=hex(await sha(o.ots));
  w.table([[s('pNote'),o.man.note||'—'],[s('pCount'),String(o.man.files.length)],[s('tAt'),dt(at)],[s('tUtc'),o.man.created],[s('tInfra'),s('tInfraV')],[s('tCals'),o.n+' / 3'],[s('pList'),'kanit-paketi-'+o.man.created.slice(0,10)+'.json'],[s('pListSha'),o.digestHex,1],[s('tOtsSha'),otsH,1],[s('tBtc'),s('tBtcV')]]);
  w.h(s('s1p'));w.grid(['#',s('fName'),s('fSize'),s('fSha')],o.man.files.map(function(f,i){return [i+1,f.name,f.size.toLocaleString(lang()==='tr'?'tr-TR':'en-GB'),f.sha256]}),[8,58,20,W-86]);
  var imgs=[];for(var i=0;i<(o.files||[]).length&&imgs.length<12;i++){var t=await thumb(o.files[i]);if(t)imgs.push([i+1,t])}
  if(imgs.length){w.need(60);w.h(s('s3'));var cw=(W-8)/3,ch=42;for(var k=0;k<imgs.length;k++){var col=k%3;if(col===0)w.need(ch+8);var t2=imgs[k][1],rr=Math.min(cw/t2.w,ch/t2.h),iw=t2.w*rr,ih=t2.h*rr,x=M+col*(cw+4);d.addImage(t2.url,'JPEG',x+(cw-iw)/2,w.y,iw,ih);d.setFontSize(7.5);d.setFont('R','normal');d.text('#'+imgs[k][0],x,w.y+ch+3.5);if(col===2||k===imgs.length-1)w.y+=ch+7}}
  closing(w,o.digestHex);footer(d);await save(d,'teslim-paketi-raporu-'+no+'.pdf')}
async function verifyPDF(o){/* o:{rows:[[name,sha,result]]} */
  var at=new Date(),d=await doc(),w=new Writer(d);var no='V-'+at.toISOString().slice(0,19).replace(/[-:T]/g,'');
  header(w,s('rTitleVer'),no,at);w.table([[s('vAt'),dt(at)],[s('tUtc'),at.toISOString()]]);
  w.h(s('v1'));o.rows.forEach(function(r){var res=String(r[2]).replace(/✓\s*/g,'').replace(/✗\s*/g,(lang()==='tr'?'UYUMSUZ: ':'MISMATCH: '));w.table([[s('fName'),r[0]],[s('vRes'),res],[s('fSha'),r[1],1]])});
  closing(w);footer(d);await save(d,'dogrulama-raporu-'+no+'.pdf')}

async function gated(cost,btn,box,fn){if(!(await canSpend(cost))){if(!box.querySelector('.gk-pay'))box.appendChild(Object.assign(payBox(cost),{className:'res info gk-pay'}));return}
  var old=btn.textContent;btn.disabled=true;btn.textContent=s('making');try{await fn();await spend(cost);renderLic()}catch(e){console.error(e);alert('PDF: '+e.message)}finally{btn.disabled=false;btn.textContent=old}}
function button(key,cost,box,fn){var b=el('button','btn ghost','📄 '+s(key));b.type='button';b.onclick=function(){gated(cost,b,box,fn)};return b}

window.GK={allowProof:allowProof,countProof:countProof,trialBox:trialBox,renderLic:renderLic,
  proofButton:function(box,o){return button('btnProof',COST.proof,box,function(){return proofPDF(o)})},
  packButton:function(box,o){return button('btnPack',COST.pack,box,function(){return packPDF(o)})},
  verifyButton:function(box,o){return button('btnVer',COST.verify,box,function(){return verifyPDF(o)})}};
document.addEventListener('DOMContentLoaded',renderLic);if(document.readyState!=='loading')renderLic();
var mo=new MutationObserver(function(){renderLic()});mo.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
