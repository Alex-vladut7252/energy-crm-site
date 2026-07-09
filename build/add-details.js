const fs=require('fs');
const HERE='C:/Users/vladu/Desktop/energy_crm_presentation/';
let s=fs.readFileSync(HERE+'sc-inject.html','utf8');

// ---- 1. CSS ----
const CSS=`
.sxwrap .sxdet-wrap{margin-top:.9rem;}
.sxwrap .sxdet{display:inline-flex;align-items:center;gap:.5rem;background:rgba(255,255,255,.03);border:1px solid var(--sx-line);border-radius:999px;padding:.5rem .95rem;color:var(--sx-t2);font-family:var(--sx-disp);font-weight:600;font-size:.82rem;cursor:pointer;transition:.25s;}
.sxwrap .sxdet:hover{border-color:var(--sx-lines);color:#f4f6fb;background:rgba(255,255,255,.05);}
.sxwrap .sxdet i{transition:transform .3s;color:#22d3a0;font-size:1.05rem;}
.sxwrap .sxdet.open i{transform:rotate(90deg);}
.sxwrap .sxdet-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s ease;}
.sxwrap .sxdet-panel>div{overflow:hidden;}
.sxwrap .sxdet-panel.open{grid-template-rows:1fr;}
.sxwrap .sxdet-panel ul{list-style:none;border:1px solid var(--sx-line);border-radius:14px;background:rgba(255,255,255,.02);padding:1.1rem 1.3rem;display:flex;flex-direction:column;gap:.7rem;margin-top:.5rem;}
.sxwrap .sxdet-panel li{position:relative;padding-left:1.4rem;font-size:.88rem;color:var(--sx-t2);line-height:1.55;}
.sxwrap .sxdet-panel li::before{content:'';position:absolute;left:0;top:.55em;width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#4d8bff,#22d3a0);}
.sxwrap .sxdet-panel b{color:#f4f6fb;font-weight:600;}
`;
if(!s.includes('.sxwrap .sxdet{')){
  s=s.replace('@media(max-width:820px)',CSS+'@media(max-width:820px)');
  console.log('CSS added');
}else console.log('CSS already present');

// ---- 2. panels ----
const panel=items=>`<div class="sxdet-wrap"><button class="sxdet" aria-expanded="false"><i class="ri-arrow-right-s-line"></i>Cum funcționează</button><div class="sxdet-panel"><div><ul>${items.map(i=>'<li>'+i+'</li>').join('')}</ul></div></div></div>`;
const panels={
 's-forecast':panel([
  '<b>Surse comerciale, per parc:</b> Meteologica (SOAP, benzi P10/P50/P90) și ANT Energy (REST/OAuth2), configurabile pentru fiecare parc.',
  '<b>Selecție pe acuratețe:</b> comparăm sursele zilnic pe eroarea față de producția realizată (MAE/RMSE); cea mai bună primește prioritate automat.',
  '<b>Curbă pe 96 de intervale:</b> din prognoza aleasă generăm 96 de perechi preț/cantitate, la pasul de 15 min.',
  '<b>Gate closure OPCOM 12:00 CET:</b> oferta se trimite prin API înainte de 11:50, cu marjă de siguranță.',
  '<b>Rezultate booked la 13:00:</b> prețurile de închidere (clearing) sunt preluate și înregistrate per parc.',
 ]),
 's-autopilot':panel([
  '<b>Un singur pipeline, fără operator:</b> prognoză → ofertă DAM → submit → rezultate → balansare intraday, rulat cap-coadă.',
  '<b>Fallback pe fiecare pas:</b> dacă o sursă de prognoză cade, trece pe următoarea; dacă submit-ul eșuează, reîncearcă până la gate closure.',
  '<b>Auditabil integral:</b> fiecare acțiune e logată (cine, ce, când), cu notificări la evenimentele-cheie.',
  '<b>Human-in-the-loop:</b> poți trece oricând un parc pe manual, fără a opri restul portofoliului.',
  '<b>Non-stop:</b> rulează 24/7 pe fus orar CET — inclusiv nopțile și weekendul.',
 ]),
 's-idm':panel([
  '<b>Detectarea gap-ului:</b> compară în timp real prognoza actualizată cu poziția vândută pe DAM și calculează dezechilibrul, per interval.',
  '<b>Ordine automate pe IDM:</b> când gap-ul trece de un prag configurabil, plasează ordine pe piața intraday pentru a reveni pe poziție.',
  '<b>Sincronizare la ~10s:</b> deciziile țin cont de preț, lichiditate și timpul rămas până la livrare.',
  '<b>Obiectiv real:</b> minimizarea energiei de dezechilibru facturate de OTS (Transelectrica), nu doar volumul tranzacționat.',
  '<b>Ultim strat:</b> bateria poate absorbi diferența rămasă, ca tampon de echilibrare.',
 ]),
 's-battery':panel([
  '<b>Comandă directă prin SCADA:</b> trimiți un setpoint grid-centric (MW) — pozitiv = descărcare, negativ = încărcare.',
  '<b>Program 96×15min:</b> încărcare pe surplusul ieftin de prânz, descărcare în vârful de preț al serii (arbitraj).',
  '<b>Telemetrie live (~10s):</b> SoC, SoH și C-rate, monitorizate în timp real.',
  '<b>Calculat sau manual:</b> setpoint-urile sunt calculate față de preț și prognoză — sau le suprascrii manual, live.',
  '<b>Legat de echilibrare:</b> aceleași setpoint-uri alimentează strategia anti-dezechilibru.',
 ]),
};
const DEMO='<div class="sx-demo">';
for(const [id,html] of Object.entries(panels)){
  const secIdx=s.indexOf('id="'+id+'"');
  if(secIdx<0){console.log('MISSING section',id);continue;}
  const demoIdx=s.indexOf(DEMO,secIdx);
  if(demoIdx<0){console.log('NO sx-demo for',id);continue;}
  if(s.slice(demoIdx-500,demoIdx).includes('sxdet-wrap')){console.log('panel already in',id);continue;}
  s=s.slice(0,demoIdx)+html+'\n  '+s.slice(demoIdx);
  console.log('panel added to',id);
}

// ---- 3. JS toggle ----
if(!s.includes("querySelectorAll('.sxdet')")){
  const IIFE=`  (function(){document.querySelectorAll('.sxdet').forEach(function(btn){btn.addEventListener('click',function(){var p=btn.nextElementSibling;var open=p.classList.toggle('open');btn.classList.toggle('open',open);btn.setAttribute('aria-expanded',open);});});})();\n`;
  // insert before the outer IIFE close that precedes </script>
  const idx=s.lastIndexOf('})();\n</script>');
  s=s.slice(0,idx)+IIFE+s.slice(idx);
  console.log('JS toggle added');
}else console.log('JS toggle already present');

fs.writeFileSync(HERE+'sc-inject.html',s,'utf8');
console.log('sc-inject.html updated');
