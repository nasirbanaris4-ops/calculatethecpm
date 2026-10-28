const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const server=http.createServer((req,res)=>{const p=new URL(req.url,'http://localhost').pathname;const f=p==='/contact'?'contact.html':p.slice(1);try{res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404);res.end();}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}});let requests=0,scenario='success';const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://formsubmit.co/ajax/**',async route=>{requests++;if(scenario==='timeout')return;await new Promise(r=>setTimeout(r,200));await route.fulfill({status:scenario==='http-error'?503:200,contentType:'application/json',body:JSON.stringify(scenario==='success'?{success:'true',message:'Form submitted successfully.'}:scenario==='activation'?{success:true,message:'Please activate your form'}:{success:false})});});
  async function fill(){await page.goto('http://127.0.0.1:'+server.address().port+'/contact');await page.fill('#name','Website test');await page.fill('#email','support@calculatethecpm.net');await page.fill('#subject','Test');await page.fill('#message','Testing form states without sending email.');}
  await fill();await page.click('button[type=submit]');assert.equal(await page.locator('#send-label').textContent(),'Sending…');assert.equal(await page.locator('button[type=submit]').isDisabled(),true);await page.waitForFunction(()=>document.querySelector('#contact-status').classList.contains('success'));assert.equal(await page.inputValue('#message'),'');assert.equal(requests,1);
  for(scenario of ['failure','http-error','activation','timeout']){await fill();await page.click('button[type=submit]');await page.waitForFunction(()=>document.querySelector('#contact-status').classList.contains('error'),{},{timeout:15000});assert.equal(await page.inputValue('#message'),'Testing form states without sending email.');assert.equal(await page.locator('button[type=submit]').isEnabled(),true);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await page.screenshot({path:'contact-mobile-proof.png',fullPage:true});
  console.log('PASS: submitting, success, rejected response, HTTP failure, activation, timeout, preserved inputs and mobile layout. Provider requests mocked; no email sent.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
