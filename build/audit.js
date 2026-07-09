const puppeteer=require('puppeteer');const path=require('path');const fs=require('fs');
const OUT=path.join(__dirname,'_verify');fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--allow-file-access-from-files'],defaultViewport:{width:1440,height:1000,deviceScaleFactor:1}});
 for(const lang of ['ro','en']){
  const p=await b.newPage();const errs=[],fails=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,90)));
  p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,90));});
  p.on('requestfailed',r=>{const u=r.url();if(!/favicon|blob:|og-image/.test(u))fails.push(u.slice(0,60));});
  await p.goto('file://C:/Users/vladu/Desktop/energy-crm-site/product-'+lang+'.html',{waitUntil:'networkidle2',timeout:60000});
  await sleep(3500);
  const r=await p.evaluate(()=>{
    const brokenAnchors=[];
    document.querySelectorAll('a[href^="#"]').forEach(a=>{const id=a.getAttribute('href').slice(1);if(!id)return;const el=document.getElementById(id);if(!el)brokenAnchors.push(a.getAttribute('href')+' (missing)');else if(getComputedStyle(el).display==='none')brokenAnchors.push(a.getAttribute('href')+' (hidden) → '+a.textContent.trim());});
    const crmLinks=[...document.querySelectorAll('a[href]')].filter(a=>/crm\.progemisoft\.com/.test(a.href)).length;
    const brokenImgs=[...document.querySelectorAll('img')].filter(i=>i.naturalWidth===0).map(i=>i.alt||i.src.slice(-24));
    const toggle=(document.querySelector('a[href="product-ro.html"]')?'ro':'')+'|'+(document.querySelector('a[href="product-en.html"]')?'en':'');
    const sora=[...document.fonts].some(f=>f.family.replace(/["']/g,'')==='Sora'&&f.status==='loaded');
    const clock=document.getElementById('ap-clock')?.textContent;
    const desc=document.querySelector('meta[name=description]')?.content.length;
    const ogimg=document.querySelector('meta[property="og:image"]')?.content;
    const overflow=document.documentElement.scrollWidth-document.documentElement.clientWidth;
    return {brokenAnchors,crmLinks,brokenImgs,toggle,sora,clock,desc,ogimg,overflow};
  });
  // demo modal test
  const modal=await p.evaluate(()=>{const t=document.querySelector('[data-demo]');if(!t)return'no-trigger';t.click();const ov=document.getElementById('lf-overlay');return ov&&!ov.hidden?'opens':'fail';});
  await p.evaluate(()=>{const ov=document.getElementById('lf-overlay');if(ov)ov.hidden=true;});
  // mobile overflow
  await p.setViewport({width:390,height:840,deviceScaleFactor:2});await sleep(1200);
  const mob=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  await p.screenshot({path:path.join(OUT,'mobile-'+lang+'.png'),fullPage:false});
  console.log('\n['+lang.toUpperCase()+']');
  console.log('  console errors:',errs.length,errs.slice(0,3).join(' | ')||'none');
  console.log('  failed requests:',fails.length,fails.join(' | ')||'none');
  console.log('  broken anchors:',r.brokenAnchors.length?r.brokenAnchors.join(' ; '):'NONE ✓');
  console.log('  links to crm.progemisoft.com:',r.crmLinks,r.crmLinks===0?'✓':'✗');
  console.log('  broken images:',r.brokenImgs.length?r.brokenImgs.join(','):'0 ✓');
  console.log('  lang toggle:',r.toggle,'| Sora:',r.sora,'| clock:',r.clock,'| demo modal:',modal);
  console.log('  meta desc len:',r.desc,'| og:image:',r.ogimg);
  console.log('  H-overflow desktop:',r.overflow+'px | mobile(390):',mob+'px');
  await p.close();
 }
 await b.close();
})();
