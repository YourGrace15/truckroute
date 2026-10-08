/* kill-switch service worker: purges old caches and unregisters, forcing fresh content everywhere */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{ const keys = await caches.keys(); await Promise.all(keys.map(function(k){ return caches.delete(k); })); }catch(err){}
    try{ await self.registration.unregister(); }catch(err){}
    try{ const cs = await self.clients.matchAll({type:'window'}); cs.forEach(function(c){ try{ c.navigate(c.url); }catch(e){} }); }catch(err){}
  })());
});
self.addEventListener('fetch', function(e){ /* pass through to network */ });