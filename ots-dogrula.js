/* GETOKEN — OpenTimestamps (.ots) doğrulayıcı.
   Kanıt dosyasını açar, bekleyen kayıtları zaman sunucularından tamamlar ve
   Bitcoin blok başlığındaki Merkle köküyle karşılaştırır. Tarayıcıda çalışır;
   blok bilgisi iki bağımsız kamu gezgininden (blockstream.info, mempool.space) okunur. */
(function(g){
'use strict';
var MAGIC=[0x00,0x4f,0x70,0x65,0x6e,0x54,0x69,0x6d,0x65,0x73,0x74,0x61,0x6d,0x70,0x73,0x00,0x00,0x50,0x72,0x6f,0x6f,0x66,0x00,0xbf,0x89,0xe2,0xe8,0x84,0xe8,0x92,0x94];
var BTC='0588960d73d71901',PEND='83dfe30d2ef90c8e';
var EXPL=['https://blockstream.info/api','https://mempool.space/api'];
function hex(b){return Array.from(b,function(x){return x.toString(16).padStart(2,'0')}).join('')}
function unhex(s){var o=new Uint8Array(s.length/2);for(var i=0;i<o.length;i++)o[i]=parseInt(s.substr(i*2,2),16);return o}
function cat(a,b){var o=new Uint8Array(a.length+b.length);o.set(a);o.set(b,a.length);return o}
function eq(a,b){if(a.length!==b.length)return false;for(var i=0;i<a.length;i++)if(a[i]!==b[i])return false;return true}
function sha256(b){return crypto.subtle.digest('SHA-256',b).then(function(d){return new Uint8Array(d)})}
function ripemd160(msg){
  var zl=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13];
  var zr=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11];
  var sl=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6];
  var sr=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];
  var hl=[0x00000000,0x5a827999,0x6ed9eba1,0x8f1bbcdc,0xa953fd4e],hr=[0x50a28be6,0x5c4dd124,0x6d703ef3,0x7a6d76e9,0x00000000];
  function f(j,x,y,z){return j<16?(x^y^z):j<32?((x&y)|(~x&z)):j<48?((x|~y)^z):j<64?((x&z)|(y&~z)):(x^(y|~z))}
  function rl(x,n){return (x<<n)|(x>>>(32-n))}
  var len=msg.length,padLen=((len+8)>>6)+1,buf=new Uint8Array(padLen*64);buf.set(msg);buf[len]=0x80;
  var bits=len*8;buf[padLen*64-8]=bits&0xff;buf[padLen*64-7]=(bits>>>8)&0xff;buf[padLen*64-6]=(bits>>>16)&0xff;buf[padLen*64-5]=(bits>>>24)&0xff;buf[padLen*64-4]=Math.floor(bits/4294967296)&0xff;
  var h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476,h4=0xc3d2e1f0;
  for(var b=0;b<padLen;b++){
    var X=new Array(16);for(var i=0;i<16;i++){var o=b*64+i*4;X[i]=buf[o]|(buf[o+1]<<8)|(buf[o+2]<<16)|(buf[o+3]<<24)}
    var al=h0,bl=h1,cl=h2,dl=h3,el=h4,ar=h0,br=h1,cr=h2,dr=h3,er=h4,t;
    for(var j=0;j<80;j++){
      t=(rl((al+f(j,bl,cl,dl)+X[zl[j]]+hl[j>>4])|0,sl[j])+el)|0;al=el;el=dl;dl=rl(cl,10);cl=bl;bl=t;
      t=(rl((ar+f(79-j,br,cr,dr)+X[zr[j]]+hr[j>>4])|0,sr[j])+er)|0;ar=er;er=dr;dr=rl(cr,10);cr=br;br=t;
    }
    t=(h1+cl+dr)|0;h1=(h2+dl+er)|0;h2=(h3+el+ar)|0;h3=(h4+al+br)|0;h4=(h0+bl+cr)|0;h0=t;
  }
  var out=new Uint8Array(20);[h0,h1,h2,h3,h4].forEach(function(h,i){out[i*4]=h&0xff;out[i*4+1]=(h>>>8)&0xff;out[i*4+2]=(h>>>16)&0xff;out[i*4+3]=(h>>>24)&0xff});
  return out;
}
function Reader(b){this.b=b;this.p=0}
Reader.prototype.byte=function(){if(this.p>=this.b.length)throw new Error('eof');return this.b[this.p++]};
Reader.prototype.bytes=function(n){if(this.p+n>this.b.length)throw new Error('eof');var o=this.b.slice(this.p,this.p+n);this.p+=n;return o};
Reader.prototype.varuint=function(){var v=0,s=0,c;do{c=this.byte();v+=(c&0x7f)*Math.pow(2,s);s+=7}while(c&0x80);return v};
Reader.prototype.varbytes=function(){return this.bytes(this.varuint())};
function W(){this.a=[]}
W.prototype.byte=function(x){this.a.push(x)};
W.prototype.bytes=function(b){for(var i=0;i<b.length;i++)this.a.push(b[i])};
W.prototype.varuint=function(v){do{var c=v%128;v=Math.floor(v/128);this.a.push(v>0?(c|0x80):c)}while(v>0)};
W.prototype.varbytes=function(b){this.varuint(b.length);this.bytes(b)};
/* İşlem sonucu async olduğu (sha256) için önce ham ağaç okunur, sonra mesajlar hesaplanır. */
function parseTree(r,depth){
  var node={atts:[],ops:[]};
  function one(tag){
    if(tag===0x00){var t=hex(r.bytes(8));node.atts.push({tag:t,payload:r.varbytes()});return}
    var op={tag:tag,arg:null};
    if(tag===0xf0||tag===0xf1)op.arg=r.varbytes();
    else if([0x08,0x02,0x03,0x67,0xf2,0xf3].indexOf(tag)<0)throw new Error('bilinmeyen işlem 0x'+tag.toString(16));
    op.child=parseTree(r,depth+1);node.ops.push(op);
  }
  if(depth>256)throw new Error('ağaç çok derin');
  var tag=r.byte();
  while(tag===0xff){one(r.byte());tag=r.byte()}
  one(tag);
  return node;
}
function apply(op,msg){
  switch(op.tag){
    case 0xf0:return Promise.resolve(cat(msg,op.arg));
    case 0xf1:return Promise.resolve(cat(op.arg,msg));
    case 0xf2:return Promise.resolve(msg.slice().reverse());
    case 0xf3:return Promise.resolve(new TextEncoder().encode(hex(msg)));
    case 0x08:return sha256(msg);
    case 0x02:return crypto.subtle.digest('SHA-1',msg).then(function(d){return new Uint8Array(d)});
    case 0x03:return Promise.resolve(ripemd160(msg));
    default:return Promise.reject(new Error('desteklenmeyen işlem 0x'+op.tag.toString(16)));
  }
}
function computeMsgs(node,msg){
  node.msg=msg;
  return node.ops.reduce(function(p,op){return p.then(function(){return apply(op,msg).then(function(m){return computeMsgs(op.child,m)},function(){op.child.msg=null})})},Promise.resolve());
}
function walk(node,fn){fn(node);node.ops.forEach(function(op){walk(op.child,fn)})}
function writeTree(w,node){
  var items=node.atts.map(function(a){return {k:0,a:a}}).concat(node.ops.map(function(o){return {k:1,o:o}}));
  items.forEach(function(it,i){
    if(i<items.length-1)w.byte(0xff);
    if(it.k===0){w.byte(0x00);w.bytes(unhex(it.a.tag));w.varbytes(it.a.payload)}
    else{w.byte(it.o.tag);if(it.o.arg)w.varbytes(it.o.arg);writeTree(w,it.o.child)}
  });
}
function parse(bytes){
  var b=new Uint8Array(bytes),r=new Reader(b);
  for(var i=0;i<MAGIC.length;i++)if(r.byte()!==MAGIC[i])throw new Error('Bu bir OpenTimestamps kanıt dosyası değil');
  var ver=r.varuint();if(ver!==1)throw new Error('Bilinmeyen sürüm');
  var ftag=r.byte();if(ftag!==0x08)throw new Error('Yalnızca SHA-256 kanıtları desteklenir');
  var digest=r.bytes(32);
  var tree=parseTree(r,0);
  return {digest:digest,tree:tree};
}
function serialize(p){
  var w=new W();w.bytes(MAGIC);w.varuint(1);w.byte(0x08);w.bytes(p.digest);writeTree(w,p.tree);return new Uint8Array(w.a);
}
function fetchT(url,opt,ms){
  var c=new AbortController();var t=setTimeout(function(){c.abort()},ms||12000);
  return fetch(url,Object.assign({signal:c.signal},opt||{})).finally(function(){clearTimeout(t)});
}
/* Bekleyen (pending) kayıtları ilgili zaman sunucusundan tamamla */
function upgrade(p){
  var jobs=[],changed=false;
  walk(p.tree,function(n){n.atts.forEach(function(a){if(a.tag===PEND){var uri=new TextDecoder().decode(new Reader(a.payload).varbytes());jobs.push({n:n,a:a,uri:uri})}})});
  return Promise.all(jobs.map(function(j){
    if(!/^https:\/\/[a-z0-9.\-]+(\/[a-z0-9.\-\/]*)?$/i.test(j.uri))return null;
    return fetchT(j.uri.replace(/\/$/,'')+'/timestamp/'+hex(j.n.msg),{headers:{Accept:'application/vnd.opentimestamps.v1'}}).then(function(res){
      if(!res.ok)return null;return res.arrayBuffer().then(function(buf){
        var sub=parseTree(new Reader(new Uint8Array(buf)),0);
        var hasBtc=false;walk(sub,function(x){x.atts.forEach(function(a){if(a.tag===BTC)hasBtc=true})});
        if(!hasBtc)return null;
        j.n.ops=j.n.ops.concat(sub.ops);j.n.atts=j.n.atts.concat(sub.atts.filter(function(a){return a.tag!==PEND}));changed=true;
        return computeMsgs(j.n,j.n.msg);
      });
    }).catch(function(){return null});
  })).then(function(){return changed});
}
function blockInfo(height){
  var i=0;
  function next(){
    if(i>=EXPL.length)return Promise.reject(new Error('Blok gezginine ulaşılamadı'));
    var base=EXPL[i++];
    return fetchT(base+'/block-height/'+height).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(h){
      return fetchT(base+'/block/'+h.trim()).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){return {hash:h.trim(),merkle:j.merkle_root,time:j.timestamp,src:base.replace('/api','')}});
    }).catch(next);
  }
  return next();
}
/* Ana fonksiyon: {fileHash, status:'bitcoin'|'pending'|'bad', blocks:[...], upgraded:Uint8Array|null} */
function verify(otsBytes,fileHashHex){
  var p;
  try{p=parse(otsBytes)}catch(e){return Promise.resolve({status:'bad',error:e.message})}
  var res={fileHash:hex(p.digest),matchesFile:fileHashHex?hex(p.digest)===fileHashHex.toLowerCase():null,blocks:[],upgraded:null};
  return computeMsgs(p.tree,p.digest).then(function(){return upgrade(p)}).then(function(changed){
    if(changed)res.upgraded=serialize(p);
    var cand=[],pend=0;
    walk(p.tree,function(n){n.atts.forEach(function(a){
      if(a.tag===BTC&&n.msg)cand.push({height:new Reader(a.payload).varuint(),msg:n.msg});
      if(a.tag===PEND)pend++;
    })});
    if(!cand.length){res.status=pend?'pending':'bad';return res}
    return Promise.all(cand.map(function(c){
      return blockInfo(c.height).then(function(b){
        var ok=eq(c.msg,unhex(b.merkle).reverse());
        return {height:c.height,ok:ok,time:new Date(b.time*1000),hash:b.hash,src:b.src};
      }).catch(function(e){return {height:c.height,ok:null,error:e.message}});
    })).then(function(bs){
      res.blocks=bs;
      res.status=bs.some(function(b){return b.ok===true})?'bitcoin':(bs.every(function(b){return b.ok===null})?'unreachable':'bad');
      return res;
    });
  });
}
g.GKOTS={verify:verify,parse:parse,serialize:serialize,hex:hex};
})(typeof window!=='undefined'?window:globalThis);
