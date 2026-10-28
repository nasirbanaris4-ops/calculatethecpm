const fs = require('node:fs');
const home = fs.readFileSync('index.html', 'utf8');
const header = home.match(/<header>[\s\S]*?<\/header>/)[0].replace(' aria-current="page"', '');
const footer = '<footer><div class="footer-inner"><a href="/about.html">About Us</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms of Service</a><p>© 2026 CalculateTheCPM. Independent tools; not affiliated with the advertising platforms mentioned.</p></div></footer>';
function page(file, title, description, content, type = 'WebPage') {
 const url = 'https://calculatethecpm.net/' + file;
 const schema = JSON.stringify({'@context':'https://schema.org','@type':type,name:title,description,url,inLanguage:'en'});
 fs.writeFileSync(file, `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — CalculateTheCPM</title><meta name="description" content="${description}"><link rel="canonical" href="${url}">
<link rel="icon" type="image/webp" href="/favicon.webp"><link rel="stylesheet" href="/styles.css?v=${file === 'contact.html' ? '5' : '4'}">
<meta property="og:title" content="${title} — CalculateTheCPM"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:image" content="https://calculatethecpm.net/calculatethecpm%20thumbnail.webp">
<script type="application/ld+json">${schema}</script></head><body><a class="skip" href="#main">Skip to content</a>${header}<main id="main"><article class="support-content">${content}</article></main>${footer}</body></html>\n`);
}
for (const file of ['privacy.html','terms.html']) {
 const old = fs.readFileSync(file, 'utf8');
 const article = old.match(/<article\b[^>]*>([\s\S]*?)<\/article>/);
 if (!article) throw new Error('Missing legal article: ' + file);
 const content = article[1].replace(/ class="[^"]*"/g, '');
 page(file, file === 'privacy.html' ? 'Privacy Policy' : 'Terms of Service', file === 'privacy.html' ? 'Read the privacy policy for CalculateTheCPM.' : 'Read the terms for using CalculateTheCPM advertising calculators.', content);
}
page('about.html','About Us','Learn about CalculateTheCPM, our advertising calculators, calculation methods, and editorial approach.',`
<h1>About CalculateTheCPM</h1>
<p>CalculateTheCPM provides free tools for understanding advertising costs and campaign results. Our calculators cover CPM, CPC, CTR, eCPM, ROAS, and CPM-to-CPC conversion, alongside platform-specific CPM examples.</p>
<h2>What you can do here</h2><p>Calculate a missing campaign metric, inspect the formula behind a result, and compare budget scenarios. The tools support marketers, publishers, small business owners, and people learning how digital advertising metrics work.</p>
<h2>How our calculators work</h2><p>Each calculator shows its formula and a worked example. Calculations run in your browser. Currency options label monetary values in USD, GBP, or EUR; they do not perform exchange-rate conversions.</p>
<p>For example, spending $800 on 160,000 ad impressions gives a CPM of $5. The result describes the cost of ad delivery; it does not predict conversions or profit.</p>
<h2>Our approach to accuracy</h2><p>We check calculation modes with worked examples, including zero and invalid inputs. Results are rounded for display. Estimates depend on your inputs and assume the supplied rates stay constant.</p>
<p>Examples are illustrative rather than claimed market averages. Platform terms can differ, so use consistent definitions and reporting periods when entering data.</p>
<h2>Editorial approach</h2><p>Our explanations focus on clear definitions, reproducible calculations, and practical limitations. Platform-specific explanations link to official documentation where relevant. We distinguish advertiser costs from publisher revenue and avoid presenting estimates as guaranteed results.</p>
<h2>Independent tools</h2><p>CalculateTheCPM is an independent website. It is not affiliated with Google, YouTube, Meta, or TikTok and does not access your advertising accounts.</p>
<h2>Explore the tools</h2><p>Start with the <a href="/">CPM calculator</a>, compare <a href="/cpc-calculator.html">cost per click</a>, or measure <a href="/roas-calculator.html">return on ad spend</a>. Visit our <a href="/contact.html">contact page</a> for support availability.</p>
`, 'AboutPage');
// Recipient explicitly selected by the site owner. FormSubmit inbox activation is required.
page('contact.html','Contact Us','Email CalculateTheCPM support or send a message about our advertising calculators using the contact form.',`
<h1>Contact Us</h1><p>Have a question or feedback? Send us a message.</p>
<p class="contact-email"><a href="mailto:support@calculatethecpm.net">support@calculatethecpm.net</a></p>
<form id="contact-form" action="https://formsubmit.co/support@calculatethecpm.net" method="POST" aria-label="Contact form"><fieldset><legend class="sr-only">Message details</legend>
<input type="hidden" name="_subject" value="CalculateTheCPM website contact">
<input type="hidden" name="_template" value="table">
<div class="contact-trap" aria-hidden="true"><label for="website">Leave this field empty</label><input id="website" name="_honey" tabindex="-1" autocomplete="off"></div>
<label for="name">Your name</label><input id="name" name="name" autocomplete="name" maxlength="100" required>
<label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" required>
<label for="subject">Subject</label><input id="subject" name="subject" maxlength="160" required>
<label for="message">Message</label><textarea id="message" name="message" rows="6" maxlength="5000" required></textarea>
<button type="submit"><span class="send-spinner" aria-hidden="true" hidden></span><span id="send-label">Send message</span></button></fieldset>
<p id="contact-status" class="contact-status" role="status" aria-live="polite" aria-atomic="true" tabindex="-1"></p>
<p class="note contact-privacy">Your details are used to respond to your message. <a href="/privacy.html#contact-messages">Privacy Policy</a></p></form>
<script src="/contact.js?v=2" defer></script>
`, 'ContactPage');
for (const file of fs.readdirSync('.').filter(file => file.endsWith('.html'))) {
 let html = fs.readFileSync(file, 'utf8').replace(/<footer\b[\s\S]*?<\/footer>/, footer).replace('/styles.css?v=3', '/styles.css?v=4');
 fs.writeFileSync(file, html);
}
let sitemap = fs.readFileSync('sitemap.xml', 'utf8');
if (!sitemap.includes('/about.html')) sitemap = sitemap.replace('</urlset>', '  <url><loc>https://calculatethecpm.net/about.html</loc></url>\n</urlset>');
fs.writeFileSync('sitemap.xml', sitemap);
console.log('Unified support pages; configured support email and FormSubmit contact form.');
