const fs=require('node:fs');
const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
const links=[['CPM','/'],['YouTube CPM','/youtube-cpm-calculator'],['TikTok CPM','/tiktok-cpm-calculator'],['Facebook Ads CPM','/facebook-ads-cpm-calculator'],['Google Ads CPM','/google-ads-cpm-calculator'],['CPC','/cpc-calculator'],['CTR','/ctr-calculator'],['eCPM','/ecpm-calculator'],['ROAS','/roas-calculator'],['CPM to CPC','/cpm-to-cpc-calculator']];
const markets=[['USD','United States · USD'],['GBP','United Kingdom · GBP'],['EUR','Europe (euro campaigns) · EUR'],['CAD','Canada · CAD'],['AUD','Australia · AUD'],['INR','India · INR'],['PKR','Pakistan · PKR'],['AED','United Arab Emirates · AED'],['SAR','Saudi Arabia · SAR'],['JPY','Japan · JPY']];
for(const file of files){let h=fs.readFileSync(file,'utf8');const path=file==='index.html'?'/':'/'+file.replace('.html','');
const header=`<header><div class="header-inner"><a class="brand" href="/"><img class="brand-logo" src="/favicon.png" width="36" height="36" alt="">CalculateTheCPM</a><nav class="main-nav" aria-label="Main navigation"><a href="/#calculator">Calculators</a><a href="/blog"${path==='/blog'?' aria-current="page"':''}>Blog</a><a href="/about"${path==='/about'?' aria-current="page"':''}>About Us</a><a href="/contact"${path==='/contact'?' aria-current="page"':''}>Contact</a></nav></div><nav class="tool-nav" aria-label="Advertising calculators">${links.map(([label,url])=>`<a href="${url}"${url===path?' aria-current="page"':''}>${label}</a>`).join('')}</nav></header>`;
h=h.replace(/<header>[\s\S]*?<\/header>/,header);
h=h.replace(/<footer>[\s\S]*?<\/footer>/,`<footer><div class="footer-inner"><div><a class="brand" href="/"><img class="brand-logo" src="/favicon.png" width="36" height="36" alt="">CalculateTheCPM</a><p>Independent advertising calculators with clear formulas and practical explanations.</p></div><div><h2>Explore</h2><a href="/#calculator">Calculators</a><a href="/blog">Blog</a><a href="/about">About Us</a></div><div><h2>Support &amp; legal</h2><a href="/contact">Contact</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a></div><p class="copyright">© 2026 CalculateTheCPM. Independent tools; not affiliated with the advertising platforms mentioned.</p></div></footer>`);
if(h.includes('id="solve-for"')){
 const select=h.match(/<select id="solve-for">([\s\S]*?)<\/select>/)[1];
 const opts=[...select.matchAll(/<option value="([^"]+)"([^>]*)>(.*?)<\/option>/g)];
 const tabs=`<div class="solve-tabs" role="group" aria-label="Calculate">${opts.slice().sort((a,b)=>(b[2].includes('selected')?1:0)-(a[2].includes('selected')?1:0)).map(o=>`<button type="button" data-solve="${o[1]}" aria-pressed="${o[2].includes('selected')}">${o[3]}</button>`).join('')}</div>`;
 h=h.replace(/<label for="solve-for">Calculate<select id="solve-for">[\s\S]*?<\/select><\/label>/,`${tabs}<label class="sr-only" for="solve-for">Calculate<select id="solve-for">${select}</select></label>`);
 h=h.replace(/Currency<select id="currency">[\s\S]*?<\/select>/,`Market / currency<select id="currency">${markets.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select>`);
 h=h.replace(/<button type="submit">Calculate result<\/button>/,'<span class="note">Results update as you type</span>');
}
h=h.replace(/\/styles.css\?v=\d+/g,'/styles.css?v=7').replace('/script.js?v=3','/script.js?v=4');
fs.writeFileSync(file,h);
}
console.log('Applied Option A; all page titles, H1s, canonicals and body explanations preserved.');

