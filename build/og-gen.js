const puppeteer=require('puppeteer');
const card=`<!doctype html><html><head><meta charset=utf8>
<link rel=preconnect href=https://fonts.googleapis.com><link rel=preconnect href=https://fonts.gstatic.com crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;600&family=JetBrains+Mono:wght@500&display=swap" rel=stylesheet>
<style>*{margin:0;box-sizing:border-box}html,body{width:1200px;height:630px;overflow:hidden}
.card{width:1200px;height:630px;background:radial-gradient(120% 130% at 82% -15%, rgba(77,139,255,.24), transparent 52%),radial-gradient(95% 95% at 8% 115%, rgba(34,211,160,.17), transparent 55%),#05070d;display:flex;flex-direction:column;justify-content:center;padding:92px;font-family:'Manrope',sans-serif;position:relative;border-bottom:5px solid transparent;border-image:linear-gradient(90deg,#4d8bff,#22d3a0) 1}
.brand{display:flex;align-items:center;gap:15px;margin-bottom:44px}
.mark{width:40px;height:40px;border-radius:11px;background:linear-gradient(135deg,#4d8bff,#22d3a0);display:flex;align-items:center;justify-content:center}
.mark svg{width:22px;height:22px}
.brand b{font-family:'Sora';font-weight:800;font-size:31px;letter-spacing:.18em;color:#f4f6fb}
.eyebrow{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:20px;letter-spacing:.14em;color:#22d3a0;text-transform:uppercase;margin-bottom:24px}
h1{font-family:'Sora';font-weight:800;font-size:68px;line-height:1.04;letter-spacing:-.02em;color:#f4f6fb;max-width:960px}
.g{background:linear-gradient(100deg,#4d8bff 20%,#22d3a0);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
p{font-size:27px;color:rgba(244,246,251,.64);margin-top:30px;max-width:850px;line-height:1.42}
.foot{position:absolute;bottom:74px;left:92px;font-family:'JetBrains Mono',monospace;font-size:19px;color:rgba(244,246,251,.42);letter-spacing:.05em}
</style></head><body>
<div class=card>
  <div class=brand><div class=mark><svg viewBox="0 0 24 24" fill="none"><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" fill="#05070d"/></svg></div><b>HYBRIX</b></div>
  <div class=eyebrow>Energy CRM · asset management &amp; trading automat</div>
  <h1>De la <span class=g>control activ</span><br>la <span class=g>profit pe piață</span></h1>
  <p>Controlează parcuri și baterii prin SCADA, vinde automat pe PZU &amp; PI și rămâi echilibrat 24/7.</p>
  <div class=foot>crm.progemisoft.com</div>
</div></body></html>`;
(async()=>{const b=await puppeteer.launch({headless:'new',args:['--no-sandbox']});const p=await b.newPage();
await p.setViewport({width:1200,height:630,deviceScaleFactor:1});
await p.setContent(card,{waitUntil:'networkidle0',timeout:30000});
try{await p.evaluate(()=>document.fonts.ready)}catch(e){}
await new Promise(r=>setTimeout(r,500));
await p.screenshot({path:'C:/Users/vladu/Desktop/energy-crm-site/assets/og-image.png'});
await b.close();console.log('og-image.png generated');})();
