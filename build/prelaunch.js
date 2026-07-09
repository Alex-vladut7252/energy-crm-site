const fs=require('fs');
const REPO='C:/Users/vladu/Desktop/energy-crm-site/';
const IMG='https://crm.progemisoft.com/assets/og-image.png';
const URL='https://crm.progemisoft.com/';
const META={
ro:`<meta name="description" content="Energy CRM — platformă de asset management și trading automat pentru producători de energie regenerabilă. Controlează parcuri și baterii prin SCADA, vinde automat pe PZU și PI și rămâi echilibrat 24/7, fără intervenție manuală.">
<meta name="theme-color" content="#05070d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Energy CRM">
<meta property="og:title" content="Energy CRM — De la control activ la profit pe piață">
<meta property="og:description" content="Asset management & trading automat pentru energie regenerabilă: SCADA, vânzare automată pe PZU/PI și echilibrare 24/7.">
<meta property="og:image" content="${IMG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${URL}">
<meta property="og:locale" content="ro_RO">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Energy CRM — De la control activ la profit pe piață">
<meta name="twitter:description" content="SCADA + trading automat PZU/PI + echilibrare 24/7 pentru energie regenerabilă.">
<meta name="twitter:image" content="${IMG}">`,
en:`<meta name="description" content="Energy CRM — asset-management and automated-trading platform for renewable energy producers. Control parks and batteries over SCADA, sell automatically on the day-ahead and intraday markets, and stay balanced 24/7 — hands-off.">
<meta name="theme-color" content="#05070d">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Energy CRM">
<meta property="og:title" content="Energy CRM — From asset control to market profit">
<meta property="og:description" content="Asset management & automated trading for renewable energy: SCADA, automated day-ahead/intraday selling, 24/7 balancing.">
<meta property="og:image" content="${IMG}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${URL}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Energy CRM — From asset control to market profit">
<meta name="twitter:description" content="SCADA + automated day-ahead/intraday trading + 24/7 balancing for renewables.">
<meta name="twitter:image" content="${IMG}">`
};
const CRMBTN='<a class="btn btn-g" href="https://crm.progemisoft.com"><i class="ri-external-link-line"></i>crm.progemisoft.com</a>';
const FAV='<link rel="shortcut icon" href="assets/favicon.ico">';
for(const [file,lang] of [['product-ro.html','ro'],['product-en.html','en']]){
  let h=fs.readFileSync(REPO+file,'utf8');
  const a1=h.split('href="#journey"').length-1; h=h.split('href="#journey"').join('href="#s-forecast"');
  const a2=h.split('href="#why"').length-1;     h=h.split('href="#why"').join('href="#s-compare"');
  const c =h.split(CRMBTN).length-1;            h=h.split(CRMBTN).join('');
  let m=0; if(!h.includes('og:image')){h=h.replace(FAV,FAV+'\n'+META[lang]); m=1;}
  fs.writeFileSync(REPO+file,h,'utf8');
  console.log(file,'| #journey→s-forecast:',a1,'| #why→s-compare:',a2,'| crm btn removed:',c,'| meta added:',m);
}
