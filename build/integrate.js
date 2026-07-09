const fs=require('fs');
const REPO='C:/Users/vladu/Desktop/energy-crm-site/';
const HERE='C:/Users/vladu/Desktop/energy_crm_presentation/';
const target=process.argv[2];
const injectFile=process.argv[3]||'sc-inject.html';
if(!target){console.error('usage: node integrate.js <targetHtml> [injectFile]');process.exit(1);}
let html=fs.readFileSync(REPO+target,'utf8');
const inj=fs.readFileSync(HERE+injectFile,'utf8');
const between=(s,a,b)=>{const i=s.indexOf(a);if(i<0)throw new Error('missing '+a);const st=i+a.length;const j=b?s.indexOf(b):s.length;return s.slice(st,j).trim();};
const css   =between(inj,'<!-- ==SC-CSS== -->','<!-- ==SC-BEFORE-STORAGE== -->');
const bStore =between(inj,'<!-- ==SC-BEFORE-STORAGE== -->','<!-- ==SC-BEFORE-JOURNEY== -->');
const bJourn =between(inj,'<!-- ==SC-BEFORE-JOURNEY== -->','<!-- ==SC-BEFORE-CAPABILITIES== -->');
const bCap   =between(inj,'<!-- ==SC-BEFORE-CAPABILITIES== -->','<!-- ==SC-JS== -->');
const js    =between(inj,'<!-- ==SC-JS== -->',null);
html=html.replace(/\n?<!--SX-->[\s\S]*?<!--\/SX-->\n?/g,'');   // idempotent: strip prior injection
const wrap=c=>'\n<!--SX-->\n'+c+'\n<!--/SX-->\n';
function ins(anchor,content){if(html.indexOf(anchor)<0)throw new Error('anchor not found: '+anchor);html=html.replace(anchor,wrap(content)+anchor);}
ins('</head>',css);
ins('<section class="sec" id="storage"',bStore);
ins('<section class="journey" id="journey"',bJourn);
ins('<section class="sec" id="capabilities"',bCap);
ins('</body>',js);
fs.writeFileSync(REPO+target,html,'utf8');
console.log('injected into',target,'| size',(html.length/1024).toFixed(0),'KB');
