const fs=require('node:fs');
const rules=['# Legacy policy addresses','/privacy-policy.html /privacy 301','/privacy-policy /privacy 301','# Permanent canonical redirects for known HTML documents'];
for(const f of fs.readdirSync('.').filter(f=>f.endsWith('.html')&&f!=='404.html')){const path=f==='index.html'?'/':'/'+f.slice(0,-5);rules.push('/'+f+' '+path+' 301');if(path!=='/')rules.push(path+'/ '+path+' 301');}
fs.writeFileSync('_redirects',rules.join('\n')+'\n');
