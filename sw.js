const C='infiltrado-v2';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const isPage=r.mode==='navigate'||new URL(r.url).pathname.endsWith('.html');
  if(isPage){
    // Página: busca a versão mais nova na internet; sem internet, usa a cópia salva.
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{const copy=res.clone();caches.open(C).then(c=>c.put(r,copy));return res;})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(hit=>hit||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{
    const copy=res.clone();caches.open(C).then(c=>c.put(r,copy));return res;
  })));
});
