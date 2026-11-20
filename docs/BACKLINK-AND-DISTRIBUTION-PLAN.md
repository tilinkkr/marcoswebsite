# MARKOS backlink and distribution plan (Kerala + GCC)

Goal: more Google impressions and genuine clicks from Malayali traders in Kerala and the GCC, and more WhatsApp messages.

Ground rules (Google spam policies, current as of November 2026):
- **Never buy links, link packages or "DA 50+ guest posts".** Paid links that pass ranking signals violate Google's link-spam policy and can get the site demoted.
- **No mass AI pages.** "Scaled content abuse" targets many low-value pages made mainly to rank. Each new page must answer a real question better than what already ranks.
- **Links must come from real people and relevant sites.** Ten relevant links beat a hundred directory links.

## Week 1 — foundations (do these first)

| Task | Where | Link to |
|---|---|---|
| Create/claim Google Business Profile **only if MARKOS has a real Kerala address or service area** | business.google.com | `/kerala` |
| Add the website to every social bio | Instagram, YouTube, Facebook page, LinkedIn, TradingView, X | `/` or `/gcc` |
| WhatsApp Business: quick reply for "free 30-day gold plan" with the link | WhatsApp Business app | `/insights/xauusd-30-day-practice-plan` |
| WhatsApp Business: catalogue/description mentioning "Kerala & GCC forex community" | WhatsApp Business app | `/` |
| Submit sitemap and request indexing for `/kerala`, `/gcc`, the six country pages and `/get-funded` | Google Search Console | — |
| Add the site to Bing Webmaster Tools (feeds ChatGPT search and Copilot) | bing.com/webmasters | sitemap |

## Weeks 2–4 — earn links where Malayali traders already are

1. **YouTube (Malayalam).** Turn each article into a 5–8 minute Malayalam video ("What is forex — Malayalam", "XAUUSD for beginners — Malayalam"). Put the article link in the first line of the description. YouTube is the strongest source for Malayalam trading searches and is often cited by Google's AI answers.
2. **Instagram / Facebook reels.** 30-second hooks ("Funded account passing group? Watch this first") pointing to `/kerala` or the article. Use the link in bio.
3. **TradingView profile.** Publish weekly XAUUSD ideas with your analysis; link the profile to the site. TradingView ideas rank in Google.
4. **Quora and Reddit — answer, don't advertise.** Answer real questions ("Is forex legal in India?", "Best prop firm for UAE?") fully, and add the guide link only where it genuinely helps. Read each subreddit's self-promotion rules first.
5. **Malayali GCC community sites and groups.** Kerala associations, NRI portals and Gulf Malayali Facebook groups often accept educational posts, webinars or event listings. Offer a free online "forex safety for NRIs" session — event pages link back.
6. **Guest articles / interviews.** Pitch Kerala finance bloggers, Malayalam podcasts and GCC Indian community publications on a topic only you can cover: "How Malayali NRIs are losing money to fake forex platforms — and how to check a broker". Use the November 2026 Kochi scam reports as the news hook.
7. **Prop-firm partner pages.** If you join a prop firm's affiliate or partner programme, ask whether they list partner communities with a link.
8. **Cross-post with canonical links.** Republish selected articles on Medium or LinkedIn with a canonical link or "originally published on markos.in" line.

## Content to make people *link* to you

- **Free 30-day XAUUSD practice plan** — printable checklist (people share free tools).
- **GCC session-time table** — "When to trade gold from Dubai/Riyadh/Doha" image for social media.
- **Scam checklist for Malayali NRIs** — a one-page graphic that groups can repost.
- **Your own data** — e.g. anonymised community stats such as "how many members passed a challenge after the 30-day plan". Only publish numbers you can back up.

## Content still needed from the owner

- **"4 years of learning trading and now I found this"** — needs the founder's real story (first-hand experience is a strong trust signal for Google and AI answers; it can't be written for you).
- **Real names and photos** of the people who teach and run sessions, plus what they've done, so articles can carry a real author.
- **Course details** (syllabus, duration, language, price) for a dedicated forex course page.
- **Prop-firm partner links** for `/get-funded` (add to `src/config/funded-partners.ts`).

## How to measure (weekly)

- Search Console → Performance → filter Country = United Arab Emirates, Saudi Arabia, Qatar, Kuwait, Oman, Bahrain, India; compare impressions and clicks week on week.
- Search Console → Links → new linking sites.
- WhatsApp: count messages that mention an article or "free plan".
- PostHog (once keys are set): `whatsapp_prompt_shown`, `whatsapp_prompt_topic`, `whatsapp_click` by `placement`.

## What to say (and not say) about "leading"

Google's AI answers repeat facts they can verify across many sources. Saying "leading community in Kerala" on our own site carries no weight and can read as an unsupported claim. What builds that reputation:
- the same description everywhere — "MARKOS, a Kerala-based forex, gold and funded-account trading community for Malayali traders in Kerala and the GCC" — on the site, YouTube, Instagram, Google Business Profile and partner pages;
- mentions by other sites, groups and creators;
- reviews on Google and Trustpilot from real members.
