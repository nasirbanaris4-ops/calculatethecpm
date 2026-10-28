// Cloudflare Pages serves HTML at extensionless URLs. Keep all discovery signals aligned.
const fs = require('node:fs');
const base = 'https://calculatethecpm.net';
const files = fs.readdirSync('.').filter(file => file.endsWith('.html') && file !== '404.html');
for (const file of files) {
 let html = fs.readFileSync(file, 'utf8');
 html = html.replace(/<link rel="icon"[^>]*>/g, '<link rel="icon" type="image/png" sizes="96x96" href="/favicon.png">');
 html = html.replace(/((?:https:\/\/calculatethecpm\.net)?\/[a-z0-9-]+)\.html(?=["#?])/g, (_, path) => path.endsWith('/index') ? path.slice(0,-5) : path);
 if(file === 'index.html') {
  html = html.replace('<title>CPM Calculator — Free Formula &amp; Examples</title>', '<title>CPM Calculator — Calculate the CPM, Cost &amp; Impressions</title>');
  html = html.replaceAll('Calculate CPM, ad spend, or impressions with a free CPM calculator. See the formula and worked examples in USD, GBP, or EUR.', 'Calculate the CPM, ad spend, or impressions with our free CPM calculator. See formulas and worked examples in USD, GBP, or EUR.');
 }
 fs.writeFileSync(file, html);
}
const urls = files.map(file => base + (file === 'index.html' ? '/' : '/' + file.replace(/\.html$/, '')));
fs.writeFileSync('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(url => '  <url><loc>' + url + '</loc></url>').join('\n') + '\n</urlset>\n');
fs.writeFileSync('robots.txt', 'User-agent: *\nAllow: /\n\nSitemap: https://calculatethecpm.net/sitemap.xml\n');
console.log(`Aligned canonical, schema, social and internal URLs; generated ${urls.length} canonical sitemap entries.`);

