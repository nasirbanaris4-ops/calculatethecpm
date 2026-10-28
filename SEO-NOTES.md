# Calculator update — October 28, 2026

## Implemented

- Ten calculator pages with independent metric definitions and all three solve modes.
- CPM, CPC, CTR, eCPM, ROAS and CPM/CPC conversion formulas; blank, negative, and zero-divisor handling.
- US-first English content, USD default, GBP and EUR choices. Currency selection does not perform FX conversion.
- Lightweight local calculator CSS in place of runtime Tailwind CDN; responsive layout and keyboard controls.
- Unique page titles, descriptions, canonical URLs, Open Graph and Twitter metadata.
- Matching visible FAQs and FAQPage data, WebApplication data, and breadcrumbs on secondary calculators.
- Direct answers, formula explanations, worked examples, calculation limitations, and related links.
- Removed unsupported market-average tables and clarified YouTube CPM versus RPM.
- Fixed privacy URLs, favicon references, social image paths, and sitemap entries.

## Keyword mapping

| Page | Primary query intent |
| --- | --- |
| `/` | CPM calculator, calculate CPM, CPM formula |
| `/youtube-cpm-calculator.html` | YouTube CPM calculator |
| `/tiktok-cpm-calculator.html` | TikTok ad CPM calculator |
| `/facebook-ads-cpm-calculator.html` | Facebook ads CPM calculator |
| `/google-ads-cpm-calculator.html` | Google Ads CPM calculator |
| `/cpc-calculator.html` | CPC calculator, cost per click |
| `/ctr-calculator.html` | CTR calculator, click-through rate |
| `/ecpm-calculator.html` | eCPM calculator, effective CPM |
| `/roas-calculator.html` | ROAS calculator, return on ad spend |
| `/cpm-to-cpc-calculator.html` | CPM to CPC calculator, CPM CPC conversion |

These are intent assignments, not claims about measured keyword volume or ranking difficulty. Do not force the broad seed word CPM into unrelated page titles.

## Remaining work requiring live data or account access

1. Confirm hosting deploys the repository's main branch, then check live URLs and assets after deployment.
2. Verify the domain in Google Search Console and Bing Webmaster Tools; submit `/sitemap.xml` and inspect indexing.
3. Compare US, UK, and individual European country performance in Search Console. Track impressions, clicks, CTR, and query/page trends over comparable periods.
4. Measure deployed performance with PageSpeed Insights and field Core Web Vitals. Local layout tests are not a live performance score.
5. Add real analytics only with the site's actual measurement ID and appropriate privacy configuration. No tracking IDs were invented.
6. Verify legal text against the site's actual advertising and data practices. Existing policy content was preserved; link repairs are not a legal review.
7. Add sourced market research only when dataset scope, dates, countries, formats, and methodology are available. Do not publish invented CPM averages.
8. Keep future content focused on distinct visitor questions rather than generating repetitive country pages.

## SEO, answers, and AI search

The implementation emphasizes accessible text, accurate formulas, useful direct answers, and consistent structured data. Schema does not guarantee rich results, rankings, or AI citations. FAQ content remains useful even when a search engine does not display an FAQ enhancement.

Sources consulted:
- [Google Search Central: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [YouTube Help: understand ad revenue analytics](https://support.google.com/youtube/answer/9314357?hl=en)

## Maintenance

Edit `build-pages.cjs` and run `node build-pages.cjs` to rebuild calculator pages. This preserves existing legal/contact content while repairing known URLs. Run `node verify.cjs` with Playwright and Chrome installed. The test script includes a bundled-runtime fallback for the original development workstation.
