// RO terminology layer — aligns product-ro.html to the actual Energy CRM app vocabulary.
// Run AFTER integrate.js product-ro.html (post-injection). EN page is never touched.
const fs=require('fs');
const F='C:/Users/vladu/Desktop/energy-crm-site/product-ro.html';
let h=fs.readFileSync(F,'utf8');
const R=[
  // ── forecast ──
  ["Prognoze din surse comerciale precum Meteologica","Prognoze de la furnizori precum Meteologica"],
  ["<span>surse configurate</span>","<span>furnizori configurați</span>"],
  ["Meteologica (94% acuratețe)","Meteologica (94% precizie)"],
  ["Ofertă DAM · 96 intervale","Ofertă PZU · 96 intervale"],
  ["Trimis la OPCOM prin API · 11:50 CET","Trimisă pe piață · OPCOM · 11:50 CET"],
  ["<b>Surse comerciale, configurabile per parc:</b> precum Meteologica, cu benzi de probabilitate P10/P50/P90 — plus sursele tale de prognoză.","<b>Furnizori de prognoze, configurabili per parc:</b> precum Meteologica, cu benzi de probabilitate P10/P50/P90 — plus furnizorii tăi."],
  ["<b>Selecție pe acuratețe:</b> comparăm sursele zilnic după eroarea față de producția realizată (MAE/RMSE); cea mai bună primește prioritate automat.","<b>Selecție pe precizie:</b> comparăm furnizorii zilnic față de datele de producție reale (MAE/RMSE); cel mai bun primește prioritate automat."],
  ["<b>Gate closure OPCOM 12:00 CET:</b> oferta se trimite prin API înainte de 11:50, cu marjă de siguranță.","<b>Închiderea porții · 12:00 CET:</b> oferta se trimite pe piață înainte de 11:50, cu marjă de siguranță."],
  ["<b>Rezultate confirmate la 13:00:</b>","<b>Rezultate PZU la 13:00:</b>"],
  // ── zero-touch ──
  ["Flux zero-touch","Pipeline automat"],
  ["rezultate și balansare. Fără o singură intervenție manuală.","rezultate și echilibrare. Fără o singură intervenție manuală."],
  ["<h4>Ofertă DAM</h4>","<h4>Ofertă PZU</h4>"],
  ["<h4>Submit</h4>","<h4>Trimitere</h4>"],
  ["<h4>Balansare</h4>","<h4>Echilibrare</h4>"],
  ["<p>auto-construită</p>","<p>auto-generată</p>"],
  ["<p>13:00 · booked</p>","<p>13:00 · confirmat</p>"],
  [">Dezechilibru curent<",">Deviație curentă<"],
  ["preluare prognoze de la sursele configurate (precum Meteologica)","acceptare prognoză de la furnizorii configurați (precum Meteologica)"],
  ["ofertă DAM construită din prognoza acceptată","ofertă PZU generată din prognoza acceptată"],
  ["ofertă trimisă la OPCOM — înainte de 12:00 CET","ofertă trimisă pe piață — înainte de închiderea porții (12:00 CET)"],
  ["auto-balancer plasează ordine intraday · interval 71/96","auto-balancer plasează ordine de echilibrare · interval 71/96"],
  ["prognoză → ofertă DAM → submit → rezultate → balansare intraday, rulat de la cap la coadă.","acceptare prognoză → ofertă PZU → trimitere → rezultate → echilibrare PI, de la cap la coadă."],
  ["dacă o sursă de prognoză cade, trece pe următoarea; dacă submit-ul eșuează, reîncearcă până la gate closure.","dacă un furnizor de prognoză cade, trece pe următorul; dacă trimiterea eșuează, reîncearcă până la închiderea porții."],
  ["<b>Human-in-the-loop:</b>","<b>Suprascriere per parc:</b>"],
  // ── idm / echilibrare PI ──
  ["<span class=\"k\">Echilibrare intraday</span>","<span class=\"k\">Echilibrare PI</span>"],
  ["urmărește abaterea față de poziția vândută și plasează ordine pe piața intraday","urmărește deviația față de poziția vândută pe PZU și plasează ordine pe piața intraday"],
  [">DAM Sold<",">Vândut PZU<"],
  [">Dezechilibru (gap)<",">Diferență vs. PZU<"],
  [">Ordine auto-plasate<",">Ordine PI plasate<"],
  [">Poziție vândută<",">Vândut PZU<"],
  [">Deviere prognoză<",">Deviație prognoză<"],
  [">Ordine balansare<",">Ordine echilibrare<"],
  ["<b>Detectarea gap-ului:</b> compară în timp real prognoza actualizată cu poziția vândută pe DAM și calculează dezechilibrul, per interval.","<b>Detectarea diferenței:</b> compară în timp real ultima prognoză cu poziția vândută pe PZU și calculează deviația, per interval."],
  ["<b>Ordine automate pe IDM:</b> când gap-ul trece de un prag configurabil, plasează ordine pe piața intraday pentru a reveni pe poziție.","<b>Ordine automate de echilibrare:</b> când deviația depășește pragul configurat, plasează ordine pe piața intraday pentru a reveni pe poziție."],
  // ── battery / SCADA ──
  ["Trage de setpoint — încarci sau descarci, în timp real.","Reglează puterea — încarci sau descarci, în timp real."],
  ["Trage de setpoint (−40…+40 MW)","Reglează puterea (−40…+40 MW)"],
  [">Setpoint trimis → SCADA<",">Putere setată → SCADA<"],
  [">State of Health<",">Sănătate (SoH)<"],
  ["<b>Comandă directă prin SCADA:</b> trimiți un setpoint grid-centric (MW)","<b>Comandă directă prin SCADA:</b> trimiți o comandă de putere pe rețea (MW)"],
  ["<b>Telemetrie live (~10s):</b>","<b>Date în timp real (~10s):</b>"],
  ["<b>Calculat sau manual:</b> setpoint-urile sunt calculate față de preț și prognoză","<b>Calculat sau manual:</b> comenzile de putere sunt calculate față de preț și prognoză"],
  ["aceleași setpoint-uri alimentează strategia anti-dezechilibru.","aceleași comenzi de putere alimentează strategia anti-dezechilibru."],
  // ── comparison / impact ──
  ["Balansare intraday la telefon — lentă și cu întârziere","Echilibrare PI la telefon — lentă și cu întârziere"],
  ["Auto-balancer plasează ordine IDM non-stop, fără intervenție","Auto-balancer plasează ordine de echilibrare non-stop, fără intervenție"],
  ["tranzacționare & balansare automată","tranzacționare & echilibrare automată"],
  ["refresh date SCADA, în producție","date SCADA în timp real"],
  // ── base: OPCOM market card ──
  ["DAM &amp; IDM","PZU &amp; PI"],
  ["· DAM & IDM","· PZU & PI"],
];
let miss=[];
for(const [a,b] of R){const n=h.split(a).length-1; if(n===0)miss.push(a.slice(0,45)); else h=h.split(a).join(b);}
fs.writeFileSync(F,h,'utf8');
console.log('applied',R.length-miss.length,'/',R.length,'replacements');
if(miss.length)console.log('NO MATCH (check):\n - '+miss.join('\n - '));
