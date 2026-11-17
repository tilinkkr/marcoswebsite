# SEO change log

## 2026-11-17 — Audit follow-up: host consolidation, literal H1, link accuracy

- **Evidence:** 17 November 2026 public audit. Live recheck the same day: sitemap now lists 38 URLs including all 16 non-redirected articles; title suffix duplication and `campaign-day-*` keywords already fixed; payout-checklist consolidation already 308s. Still open: `https://www.markos.in/*` returned 200 instead of redirecting.
- **Change:** `www.markos.in` now 308-redirects to `https://markos.in` preserving path and query (exact host match only). Home H1 is now the literal description ("An India-first trading community for education, live market learning and risk discipline"); the slogan keeps its visual role as a paragraph. Insights drawdown field note links to `/faq#risk` (the actual daily/maximum drawdown answers) instead of the risk disclosure. ITR-2 source links relabelled "ITR-2 filing FAQ" so the label matches the destination; the surrounding text makes no specific tax claim from it.
- **Tests:** e2e checks for the www redirect and a single literal home H1.
- **Not changed (owner decisions):** membership billing period/renewal/refund terms and the "50% OFFER" comparison price; real human reviewers for articles marked "no human review"; Search Console baseline export.
- **Measurement:** After deploy, confirm in Search Console that www URLs move to "Page with redirect" and that the apex URLs remain indexed. Compare home-page non-branded impressions for "trading community" queries over the next 28 days against the preceding 28.

## 2026-10-26 — Prop-firm rules article prepared for review

- **Search intent:** Search Console screenshot supplied by the owner shows `prop firms india rules` at 47 impressions and 0 clicks in the selected three-month window; no page-level query export was supplied, so the URL receiving those impressions is unknown.
- **Change:** Added the article `prop-firm-rules-india` to Supabase `public.blog_posts` with a practical evaluation checklist, five official RBI/SEBI source URLs, a careful distinction between simulated challenges and actual forex activity, FAQs, risk notes, and a WhatsApp CTA for questions about MARKOS itself.
- **Status:** `review`; `editorial_verified=false`; no publication timestamp; author and reviewer are unassigned. It is not public. A real editor must verify the exact legal/regulatory wording and supply supported author/reviewer details before publication.
- **Freshness:** Research checked 26 October 2026. RBI forex FAQ cited in the draft says it was updated 28 August 2024; the RBI Alert List page surfaced in research says it was updated 22 October 2024. The article flags these dates and directs readers to check current official rules rather than treating these pages as complete or current legal advice.
- **Measurement:** After publication and recrawl, inspect Search Console page+query data for the article URL and query family. Measure clicks and WhatsApp inquiries separately; do not treat this small impression count as proven demand or promise a traffic lift.

## 2026-10-26 — FAQ query relevance and WhatsApp path

- **Evidence:** Owner-provided Search Console screenshots show 6 clicks, 141 impressions, 4.3% CTR, and average position 40 over the selected three-month window. The visible query `prop firms india rules` has 47 impressions and 0 clicks. The screenshots do not identify which URL received those query impressions, so page/query attribution remains unconfirmed.
- **Change:** Reframed the FAQ page title, description, visible H1 and existing India prop-firm question around a specific pre-payment rules checklist. Added a clearly scoped WhatsApp CTA for questions about MARKOS education/membership; the link uses the existing `WhatsAppLink` event instrumentation.
- **Decision:** Treated this as a relevance/coverage improvement, not a CTR-only title test: the displayed average position is about 40 and the evidence sample is small. Did not promise results, add keyword-stuffed text, or claim that the topic is a verified high-volume Kerala search. Did not publish the repository's separate prop-firm article because the live blog workflow requires human author/reviewer evidence and an explicit review attestation.
- **Measurement:** Once deployed and recrawled, export Search Console page + query data for `/faq` and compare clicks for the target query and related non-brand queries against the preceding 28 days; also review the 90-day trend. Record WhatsApp leads separately from clicks if analytics is configured. Avoid judging the change on impressions or average position alone.
- **Review trigger:** Reassess after Google has had time to recrawl (typically days to weeks) and at least four weeks of post-change click data are available; do not infer a causal lift from this small baseline.
