const C='jogos-v3';
const SC=['festa','praia','quarto','banco','cozinha'];
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'].concat(SC.map(s=>'./scenes/'+s+'.jpg'),SC.map(s=>'./scenes/'+s+'_mini.jpg'));
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const isPage=r.mode==='navigate'||r.url.endsWith('.html')||r.url.endsWith('/');
  if(isPage){
    // pagina: tenta a internet primeiro (pega atualizacoes), sem internet usa a copia guardada
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp));return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res;}).catch(()=>caches.match('./index.html'))));
});
