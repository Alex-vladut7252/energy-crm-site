// Lead-capture demo form (modal) -> FormSubmit (email to contact@progemisoft.com).
// Idempotent. Applies to both product-ro.html and product-en.html.
const fs=require('fs');
const REPO='C:/Users/vladu/Desktop/energy-crm-site/';
const EMAIL='contact@progemisoft.com';

const CSS=`<style id="lf-styles">
.lf-overlay{position:fixed;inset:0;z-index:99999;background:rgba(4,6,12,.74);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:1.2rem;opacity:0;animation:lf-in .22s ease forwards;}
.lf-overlay[hidden]{display:none;}
@keyframes lf-in{to{opacity:1;}}
.lf-modal{position:relative;width:100%;max-width:440px;background:linear-gradient(180deg,#131a2e,#090d18);border:1px solid rgba(255,255,255,.14);border-radius:20px;box-shadow:0 40px 100px rgba(0,0,0,.6);padding:1.9rem 1.8rem;font-family:'Manrope',system-ui,sans-serif;max-height:94vh;overflow:auto;transform:translateY(8px);animation:lf-up .28s ease forwards;}
@keyframes lf-up{to{transform:none;}}
.lf-close{position:absolute;top:.9rem;right:1.05rem;background:none;border:none;color:rgba(244,246,251,.5);font-size:1.7rem;line-height:1;cursor:pointer;transition:.2s;}
.lf-close:hover{color:#f4f6fb;}
.lf-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#22d3a0;}
.lf-modal h3{font-family:'Sora',system-ui,sans-serif;font-weight:800;font-size:1.5rem;color:#f4f6fb;margin:.45rem 0 .5rem;letter-spacing:-.01em;}
.lf-sub{font-size:.92rem;color:rgba(244,246,251,.62);line-height:1.5;margin-bottom:1.35rem;}
.lf-form{display:flex;flex-direction:column;gap:.8rem;}
.lf-form[hidden],.lf-success[hidden]{display:none!important;}
.lf-form label{display:flex;flex-direction:column;gap:.32rem;font-size:.74rem;font-weight:600;color:rgba(244,246,251,.68);font-family:'Sora',system-ui,sans-serif;}
.lf-form input{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:11px;padding:.72rem .85rem;color:#f4f6fb;font-size:.95rem;font-family:'Manrope',system-ui,sans-serif;transition:.18s;}
.lf-form input:focus{outline:none;border-color:#4d8bff;background:rgba(77,139,255,.07);box-shadow:0 0 0 3px rgba(77,139,255,.16);}
.lf-form input::placeholder{color:rgba(244,246,251,.3);}
.lf-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0;}
.lf-submit{margin-top:.5rem;background:linear-gradient(100deg,#4d8bff,#22d3a0);color:#05070d;font-family:'Sora',system-ui,sans-serif;font-weight:700;font-size:.98rem;border:none;border-radius:11px;padding:.85rem;cursor:pointer;transition:.18s;}
.lf-submit:hover{filter:brightness(1.08);transform:translateY(-1px);}
.lf-submit:disabled{opacity:.6;cursor:default;transform:none;filter:none;}
.lf-note{font-size:.69rem;color:rgba(244,246,251,.4);text-align:center;margin-top:.2rem;line-height:1.45;}
.lf-err{font-size:.8rem;color:#ff5d6c;text-align:center;min-height:1em;}
.lf-success{text-align:center;padding:1.2rem .5rem;}
.lf-success i{font-size:3.1rem;color:#22d3a0;line-height:1;}
.lf-success p{font-size:.95rem;color:rgba(244,246,251,.64);margin-bottom:1.35rem;line-height:1.5;}
</style>`;

const T={
  ro:{eyebrow:'DEMO LIVE',title:'Programează un demo',sub:'Lasă-ne datele și te contactăm rapid pentru un demo live al platformei Energy CRM.',
      l_nume:'Nume',l_tel:'Telefon',l_email:'Email',l_comp:'Companie (opțional)',
      p_nume:'Numele tău',p_tel:'07xx xxx xxx',p_email:'nume@companie.ro',p_comp:'Parc solar, trader, furnizor…',
      submit:'Trimite cererea',sending:'Se trimite…',note:'Datele tale ajung direct la echipa Energy CRM. Nu le folosim în alt scop.',
      s_title:'Mulțumim!',s_body:'Am primit cererea ta — te contactăm cât de curând pentru demo.',close:'Închide',
      err:'A apărut o eroare. Încearcă din nou sau scrie-ne la '+EMAIL+'.',subj:'Lead nou — demo Energy CRM (RO)',src:'Pagina RO',aria:'Închide'},
  en:{eyebrow:'LIVE DEMO',title:'Book a live demo',sub:'Leave your details and we\'ll reach out shortly for a live demo of the Energy CRM platform.',
      l_nume:'Name',l_tel:'Phone',l_email:'Email',l_comp:'Company (optional)',
      p_nume:'Your name',p_tel:'+40 7xx xxx xxx',p_email:'name@company.com',p_comp:'Solar park, trader, supplier…',
      submit:'Send request',sending:'Sending…',note:'Your details go straight to the Energy CRM team. We won\'t use them for anything else.',
      s_title:'Thank you!',s_body:'We\'ve received your request — we\'ll be in touch shortly for your demo.',close:'Close',
      err:'Something went wrong. Please try again or email us at '+EMAIL+'.',subj:'New lead — Energy CRM demo (EN)',src:'EN page',aria:'Close'},
};

function block(t){
  return `<!--LF-->
<div class="lf-overlay" id="lf-overlay" hidden>
  <div class="lf-modal" role="dialog" aria-modal="true" aria-labelledby="lf-title">
    <button class="lf-close" id="lf-close" type="button" aria-label="${t.aria}">&times;</button>
    <div class="lf-form-wrap" id="lf-form-wrap">
      <span class="lf-eyebrow">${t.eyebrow}</span>
      <h3 id="lf-title">${t.title}</h3>
      <p class="lf-sub">${t.sub}</p>
      <form class="lf-form" id="lf-form" novalidate>
        <label>${t.l_nume}<input type="text" name="Nume" required autocomplete="name" placeholder="${t.p_nume}"></label>
        <label>${t.l_tel}<input type="tel" name="Telefon" required autocomplete="tel" placeholder="${t.p_tel}"></label>
        <label>${t.l_email}<input type="email" name="Email" required autocomplete="email" placeholder="${t.p_email}"></label>
        <label>${t.l_comp}<input type="text" name="Companie" autocomplete="organization" placeholder="${t.p_comp}"></label>
        <input class="lf-hp" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input type="hidden" name="_subject" value="${t.subj}">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_cc" value="alexandru.vladut@progemisoft.com">
        <input type="hidden" name="Sursa" value="${t.src}">
        <div class="lf-err" id="lf-err"></div>
        <button type="submit" class="lf-submit" id="lf-submit">${t.submit}</button>
        <p class="lf-note">${t.note}</p>
      </form>
    </div>
    <div class="lf-success" id="lf-success" hidden>
      <i class="ri-checkbox-circle-line"></i>
      <h3>${t.s_title}</h3>
      <p>${t.s_body}</p>
      <button class="lf-submit" id="lf-done" type="button">${t.close}</button>
    </div>
  </div>
</div>
<script>
(function(){
  var ov=document.getElementById('lf-overlay');if(!ov)return;
  var wrap=document.getElementById('lf-form-wrap'),succ=document.getElementById('lf-success'),
      form=document.getElementById('lf-form'),btn=document.getElementById('lf-submit'),err=document.getElementById('lf-err');
  function open(e){if(e)e.preventDefault();ov.hidden=false;document.body.style.overflow='hidden';setTimeout(function(){var i=form.querySelector('input');if(i)i.focus();},60);}
  function close(){ov.hidden=true;document.body.style.overflow='';}
  [].forEach.call(document.querySelectorAll('[data-demo]'),function(b){b.addEventListener('click',open);});
  document.getElementById('lf-close').addEventListener('click',close);
  document.getElementById('lf-done').addEventListener('click',close);
  ov.addEventListener('click',function(e){if(e.target===ov)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)close();});
  form.addEventListener('submit',function(e){
    e.preventDefault();err.textContent='';
    if(!form.checkValidity()){form.reportValidity&&form.reportValidity();return;}
    btn.disabled=true;btn.textContent=${JSON.stringify(t.sending)};
    fetch('https://formsubmit.co/ajax/${EMAIL}',{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
      .then(function(r){return r.json();})
      .then(function(d){wrap.hidden=true;succ.hidden=false;})
      .catch(function(){btn.disabled=false;btn.textContent=${JSON.stringify(t.submit)};err.textContent=${JSON.stringify(t.err)};});
  });
})();
</script>
<!--/LF-->`;
}

for(const [file,lang] of [['product-ro.html','ro'],['product-en.html','en']]){
  let h=fs.readFileSync(REPO+file,'utf8');
  h=h.replace(/\n?<!--LF-->[\s\S]*?<!--\/LF-->\n?/g,'');
  h=h.replace(/<style id="lf-styles">[\s\S]*?<\/style>\n?/g,'');
  h=h.replace('</head>',CSS+'\n</head>');
  h=h.replace('</body>',block(T[lang])+'\n</body>');
  const rw=[
    ['<a class="btn btn-p" href="#contact">','<a class="btn btn-p" href="#" data-demo>'],
    ['<a class="btn btn-p" href="mailto:contact@progemisoft.com">','<a class="btn btn-p" href="#" data-demo>'],
    ['<a class="btn btn-g" href="#journey">','<a class="btn btn-g" href="#s-forecast">'],
  ];
  for(const [a,b] of rw){const n=h.split(a).length-1;h=h.split(a).join(b);console.log('  '+file,n+'x',a.slice(0,40));}
  // display contact@ email in the contact CTA (idempotent)
  const mailLine=lang==='ro'
    ? 'sau scrie-ne direct la'
    : 'or email us directly at';
  const mailP='<p class="cta-mail" style="margin-top:1.15rem;font-size:.92rem;color:rgba(244,246,251,.6)">'+mailLine+' <a href="mailto:contact@progemisoft.com" style="color:#22d3a0;text-decoration:none;font-weight:600">contact@progemisoft.com</a></p>';
  if(!h.includes('cta-mail')){
    h=h.replace(/(crm\.progemisoft\.com<\/a>\s*<\/div>)(\s*<\/div><\/div><\/section>)/, '$1\n  '+mailP+'$2');
    console.log('  '+file,'contact email displayed:',h.includes('cta-mail'));
  }
  fs.writeFileSync(REPO+file,h,'utf8');
  console.log(file,'| lead form injected ('+lang+')');
}
