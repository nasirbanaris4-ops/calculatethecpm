const fs=require('node:fs'),assert=require('node:assert/strict');
const base='https://calculatethecpm.net';
const urls=[...fs.readFileSync('sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);
const expected=fs.readdirSync('.').filter(f=>f.endsWith('.html')&&f!=='404.html').map(f=>base+(f==='index.html'?'/':'/'+f.replace(/\.html$/,'')));
assert.deepEqual([...urls].sort(),expected.sort());assert.equal(new Set(urls).size,expected.length);
const titles=new Set(),descriptions=new Set();let checks=0;
for(const url of urls){
 assert.ok(!url.endsWith('.html'));const pathname=new URL(url).pathname;
 const file=pathname==='/'?'index.html':pathname.slice(1)+'.html';
 const html=fs.readFileSync(file,'utf8');
 const canonical=[...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];assert.equal(canonical.length,1);assert.equal(canonical[0][1],url);checks++;
 const title=html.match(/<title>(.*?)<\/title>/)[1],description=html.match(/<meta name="description" content="([^"]+)"/)[1];
 assert.ok(!titles.has(title));titles.add(title);assert.ok(!descriptions.has(description));descriptions.add(description);checks+=2;
 assert.ok(!/noindex/i.test(html));assert.equal((html.match(/<main\b/g)||[]).length,1);assert.equal((html.match(/<\/main>/g)||[]).length,1);checks+=3;
 assert.ok(!/(?:href|content)="https:\/\/calculatethecpm\.net\/[^" ]+\.html/.test(html));checks++;
 for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(m[1]);for(const item of (Array.isArray(data)?data:[data])){
   if(item.url)assert.equal(item.url,url);
   if(item['@type']==='FAQPage')for(const question of item.mainEntity){
    const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    assert.ok(html.includes(escape(question.name)));assert.ok(html.includes(escape(question.acceptedAnswer.text)));checks++;
   }
  }
 }
}
assert.ok(fs.readFileSync('robots.txt','utf8').includes('Sitemap: '+base+'/sitemap.xml'));checks++;
assert.ok(fs.readFileSync('_redirects','utf8').includes('/privacy-policy.html /privacy 301'));checks++;
console.log(`PASS: ${checks} canonical, sitemap, metadata, schema-to-visible-FAQ and crawl checks.`);
