const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
let playwright;try{playwright=require('playwright');}catch{playwright=require('C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');}
const {chromium}=playwright;
const cases=[['index.html','spend','impressions','rate',800,160000,5,'$5.00'],['cpc-calculator.html','spend','clicks','rate',500,250,2,'$2.00'],['ctr-calculator.html','clicks','impressions','rate',500,25000,2,'2%'],['ecpm-calculator.html','revenue','impressions','rate',1200,300000,4,'$4.00'],['roas-calculator.html','revenue','spend','rate',2000,500,4,'4x'],['cpm-to-cpc-calculator.html','cpc','ctr','cpm',.5,2,10,'$0.50']];
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=pathname==='/'?'index.html':pathname.slice(1);if(file.includes('..')){res.writeHead(403);return res.end();}try{const data=fs.readFileSync(file);res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'application/javascript':file.endsWith('.webp')?'image/webp':'text/html');res.end(data);}catch{res.writeHead(404);res.end();}});
(async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;const browser=await chromium.launch({headless:true,channel:"chrome"});const page=await browser.newPage();let checks=0;const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
for(const [file,a,b,c,x,y,z,expected] of cases){
 await page.goto(origin+'/'+file);const fields=[a,b,c],values=[x,y,z];
 for(let target=0;target<3;target++){
  await page.selectOption('#solve-for',fields[target]);
  for(let i=0;i<3;i++)if(i!==target)await page.fill('#input-'+fields[i],String(values[i]));
  await page.click('button[type=submit]');
  const output=await page.locator('#output-value').textContent();
  const numeric=Number(output.replace(/[^0-9.]/g,''));assert.ok(Math.abs(numeric-values[target])<.0001,`${file} ${fields[target]}: ${output}`);checks++;
 }
 await page.selectOption('#solve-for',file.includes('cpm-to-cpc')?a:c);
 if(file.includes('cpm-to-cpc')){await page.fill('#input-'+b,'0');await page.fill('#input-'+c,'10');}else{await page.fill('#input-'+a,'10');await page.fill('#input-'+b,'0');}
 await page.click('button[type=submit]');assert.match(await page.locator('#input-error').textContent(),/divisor/);checks++;
 const visible=page.locator('.field:not([hidden]) input').first();await visible.fill('-1');await page.click('button[type=submit]');assert.match(await page.locator('#input-error').textContent(),/zero or greater/);checks++;
 await page.click('#reset-inputs');assert.equal(await page.locator('#output-value').textContent(),'—');checks++;
 await page.click('button[type=submit]');assert.match(await page.locator('#input-error').textContent(),/both known values/);checks++;
}
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(file,'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'duplicate ids '+file);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){const path=decodeURIComponent(match[1].slice(1)||'index.html');assert.ok(fs.existsSync(path),file+' missing '+path);checks++;}
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){JSON.parse(match[1]);checks++;}
 assert.equal((html.match(/<h1\b/g)||[]).length,1,'single h1 '+file);
 if(html.includes('id="calculator"')){
  await page.goto(origin+'/'+file);assert.equal(await page.locator('.field:not([hidden])').count(),2);await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' mobile overflow');checks++;
 }
}
await page.goto(origin+'/');await page.selectOption('#currency','GBP');await page.fill('#input-spend','800');await page.fill('#input-impressions','160000');assert.equal(await page.locator('#output-value').textContent(),'£5.00');await page.selectOption('#currency','EUR');assert.equal(await page.locator('#output-value').textContent(),'€5.00');checks+=2;
await page.fill('#input-spend','0');assert.equal(await page.locator('#output-value').textContent(),'€0.00');checks++;
await page.screenshot({path:'mobile-preview.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'desktop-preview.png',fullPage:true});assert.deepEqual(errors,[]);console.log(`PASS: ${checks} formula, validation, currency, metadata, link, and mobile checks; no browser JavaScript errors.`);
}finally{await browser.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1;server.close();});

