// Ringside 32 service worker: nätverk först för spelet (alltid senaste versionen), cache som reserv offline
const C='rs32-cache-11';
const A=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','three.module.min.js','human.json','human.bin','cannon-es.js','boxer3d.json','boxer3d.bin','mix.json','mix.bin','tex/boxer_red.jpg','tex/boxer_blue.jpg','boxer.json','tex/skin_warm.png','tex/shorts_red.png','tex/shorts_blue.png','tex/gloves_red.png','tex/boots_white.png','tex/hair_dark.png','tex/wrap_white.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),page=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html')||u.pathname.endsWith('sw.js');
  if(page&&u.origin===location.origin){
    e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{});return res}).catch(()=>m);return m||net}));
});
