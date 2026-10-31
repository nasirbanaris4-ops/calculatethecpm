const fs=require('node:fs');const base='https://calculatethecpm.net';const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html')&&f!=='index.html'&&f!=='404.html')){
let h=fs.readFileSync(file,'utf8');const name=h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g,'').replaceAll('&amp;','&');const path='/'+file.replace('.html','');const parts=[{name:'Home',path:'/'}];if(['cpm-vs-ecpm.html','cpm-vs-cpc-vs-cpa.html'].includes(file))parts.push({name:'Blog',path:'/blog'});parts.push({name,path});
h=h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,(_,s)=>{const j=JSON.parse(s);const list=(Array.isArray(j)?j:[j]).filter(x=>x['@type']!=='BreadcrumbList');return list.length?'<script type="application/ld+json">'+JSON.stringify(Array.isArray(j)?list:list[0])+'</script>':'';});
const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:parts.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,item:base+p.path}))};
h=h.replace(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/g,'').replace('<p><a href="/blog">Blog</a></p>','');
const nav='<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>'+parts.map((p,i)=>'<li>'+(i===parts.length-1?'<span aria-current="page">'+esc(p.name)+'</span>':'<a href="'+p.path+'">'+esc(p.name)+'</a>')+'</li>').join('')+'</ol></nav>';
h=h.replace('<main id="main">','<main id="main">'+nav).replace('</head>','<script type="application/ld+json">'+JSON.stringify(schema)+'</script></head>');if(!h.includes('/breadcrumbs.css?v=1'))h=h.replace('</head>','<link rel="stylesheet" href="/breadcrumbs.css?v=1"></head>');fs.writeFileSync(file,h);
}
console.log('Applied matching visible and structured breadcrumbs on 16 inner pages.');
