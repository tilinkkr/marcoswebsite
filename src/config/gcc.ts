/**
 * GCC country data for the Malayali-trader landing pages.
 * Regulator links were opened and checked on 20 November 2026.
 * Session times use winter (GMT) market hours; in northern summer the
 * London and New York sessions start one hour earlier in local time.
 */

export type Regulator = { name: string; role: string; url?: string };

export type GccCountry = {
  slug: string;
  name: string;
  shortName: string;
  demonym: string;
  cities: string[];
  utcOffset: string;
  timeZone: string;
  londonOpen: string;
  goldPrime: string;
  currency: string;
  currencyNote: string;
  regulators: Regulator[];
  checks: string[];
  mlName: string;
  mlLocative: string;
  /** Overrides the default northern-summer note under the session table. */
  seasonNote?: string;
  /** Country-specific questions drawn from local search suggestions. */
  extraFaqs?: { q: string; a: string }[];
};

export const GCC_COUNTRIES: GccCountry[] = [
  {
    slug: "uae",
    name: "United Arab Emirates",
    shortName: "UAE",
    demonym: "UAE",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
    utcOffset: "UTC+4",
    timeZone: "Gulf Standard Time (GST)",
    londonOpen: "12:00",
    goldPrime: "17:00 – 20:00",
    currency: "UAE dirham (AED)",
    currencyNote:
      "The dirham is pegged to the US dollar, so USD-denominated trading accounts and prop-firm rewards convert at a predictable rate — but your bank's conversion margin still applies.",
    regulators: [
      {
        name: "UAE Capital Market Authority (formerly SCA)",
        role: "Federal securities and derivatives regulator for onshore UAE",
        url: "https://www.uaecma.gov.ae/en/home.aspx",
      },
      {
        name: "Dubai Financial Services Authority (DFSA)",
        role: "Regulates firms in the Dubai International Financial Centre (DIFC)",
        url: "https://www.dfsa.ae/public-register/firms",
      },
      {
        name: "Financial Services Regulatory Authority (FSRA)",
        role: "Regulates firms in Abu Dhabi Global Market (ADGM)",
      },
    ],
    checks: [
      "If a broker says it is UAE-regulated, find the exact entity on the Capital Market Authority, DFSA or FSRA register — a logo is not proof.",
      "Several well-known prop firms are headquartered in the UAE; a company address is not the same as a licence to offer leveraged trading to you.",
      "Check whether a prop firm accepts UAE residents for the specific product — some firms restrict residents of their own home country.",
      "Keep payout records in AED and USD; personal tax treatment can change, so confirm with a UAE adviser rather than assuming 0%.",
    ],
    mlName: "യുഎഇ",
    mlLocative: "യുഎഇയിൽ",
    extraFaqs: [
      {
        q: "Which is the best trading platform in the UAE for Malayali beginners?",
        a: "Start with a broker licensed by the UAE Capital Market Authority, the DFSA or the FSRA, a demo account and a charting tool such as TradingView. The best platform is one that is licensed, has low costs and an app you understand — check the licence on the regulator's register, not the broker's website.",
      },
      {
        q: "How do I start trading as a beginner in the UAE?",
        a: "Learn the basics, practise on a demo for at least a month, then trade small with a licensed broker during the 17:00–20:00 gold window. MARKOS runs this path for Malayali beginners in Dubai, Abu Dhabi and Sharjah — message the team on WhatsApp.",
      },
      {
        q: "Is there a Malayali trading company or community in Dubai?",
        a: "MARKOS is a Kerala-based trading community with Malayali members in Dubai and across the UAE. It is a community and education provider, not a broker or a licensed investment firm.",
      },
    ],
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    shortName: "Saudi Arabia",
    demonym: "Saudi",
    cities: ["Riyadh", "Jeddah", "Dammam", "Khobar"],
    utcOffset: "UTC+3",
    timeZone: "Arabia Standard Time (AST)",
    londonOpen: "11:00",
    goldPrime: "16:00 – 19:00",
    currency: "Saudi riyal (SAR)",
    currencyNote:
      "The riyal is pegged to the US dollar. Rewards paid in USD convert predictably, though transfer and bank fees vary.",
    regulators: [
      {
        name: "Capital Market Authority (CMA)",
        role: "Regulates securities activities and licenses capital-market firms in the Kingdom",
        url: "https://cma.gov.sa/Pages/default.aspx",
      },
      {
        name: "Saudi Central Bank (SAMA)",
        role: "Banking and payments regulator",
      },
    ],
    checks: [
      "Confirm whether a broker is CMA-licensed in the Kingdom or only regulated elsewhere — overseas regulation gives you different protections.",
      "Prop firms are usually overseas companies; read their country-eligibility list for Saudi residents before paying.",
      "Check which payout methods work with Saudi banks and wallets, and the fees involved.",
      "Many Malayali traders in Saudi trade after work — plan around the 16:00–19:00 gold window rather than late-night US sessions.",
    ],
    mlName: "സൗദി അറേബ്യ",
    mlLocative: "സൗദി അറേബ്യയിൽ",
  },
  {
    slug: "qatar",
    name: "Qatar",
    shortName: "Qatar",
    demonym: "Qatar",
    cities: ["Doha", "Al Wakrah", "Al Khor"],
    utcOffset: "UTC+3",
    timeZone: "Arabia Standard Time (AST)",
    londonOpen: "11:00",
    goldPrime: "16:00 – 19:00",
    currency: "Qatari riyal (QAR)",
    currencyNote:
      "The riyal is pegged to the US dollar, so USD account balances are easy to track in QAR.",
    regulators: [
      {
        name: "Qatar Financial Markets Authority (QFMA)",
        role: "Capital-markets regulator",
        url: "https://www.qfma.org.qa/arabic/Pages/default.aspx",
      },
      {
        name: "Qatar Central Bank (QCB)",
        role: "Central bank and financial-sector regulator",
        url: "https://www.qcb.gov.qa/en/Pages/default.aspx",
      },
      {
        name: "Qatar Financial Centre Regulatory Authority (QFCRA)",
        role: "Regulates firms in the Qatar Financial Centre",
        url: "https://www.qfcra.com/",
      },
    ],
    checks: [
      "Verify any 'Qatar-regulated' claim with the QFMA, QCB or QFCRA rather than the broker's own website.",
      "Some brokers and prop firms restrict Qatar residents; check the eligibility list for your exact product.",
      "Never send money to an individual's account to 'open' a trading account — use the provider's official payment page.",
      "Keep records of every fee and payout for your own tax and banking questions.",
    ],
    mlName: "ഖത്തർ",
    mlLocative: "ഖത്തറിൽ",
  },
  {
    slug: "kuwait",
    name: "Kuwait",
    shortName: "Kuwait",
    demonym: "Kuwait",
    cities: ["Kuwait City", "Salmiya", "Farwaniya", "Mangaf"],
    utcOffset: "UTC+3",
    timeZone: "Arabia Standard Time (AST)",
    londonOpen: "11:00",
    goldPrime: "16:00 – 19:00",
    currency: "Kuwaiti dinar (KWD)",
    currencyNote:
      "The dinar is managed against a basket of currencies rather than a pure dollar peg, so the KWD value of a USD reward can move slightly.",
    regulators: [
      {
        name: "Capital Markets Authority (CMA Kuwait)",
        role: "Securities and capital-markets regulator",
      },
      {
        name: "Central Bank of Kuwait (CBK)",
        role: "Banking and payments regulator",
        url: "https://www.cbk.gov.kw/default",
      },
    ],
    checks: [
      "Ask any broker which regulator licenses it to serve Kuwait residents and check that directly.",
      "Because the dinar floats against a basket, track your results in USD and convert only when you withdraw.",
      "Check prop-firm eligibility for Kuwait residents and the payout methods that work with Kuwaiti banks.",
      "Treat 'guaranteed return' or 'account management' offers on WhatsApp or Telegram as red flags.",
    ],
    mlName: "കുവൈറ്റ്",
    mlLocative: "കുവൈറ്റിൽ",
    extraFaqs: [
      {
        q: "Is there a list of Malayali trading companies in Kuwait?",
        a: "There is no official list of 'Malayali' trading companies. What matters is whether a firm is licensed — ask any broker or investment company for its licence and verify it with Kuwait's Capital Markets Authority. MARKOS is a Kerala-based education community, not a broker.",
      },
    ],
  },
  {
    slug: "oman",
    name: "Oman",
    shortName: "Oman",
    demonym: "Omani",
    cities: ["Muscat", "Salalah", "Sohar", "Nizwa"],
    utcOffset: "UTC+4",
    timeZone: "Gulf Standard Time (GST)",
    londonOpen: "12:00",
    goldPrime: "17:00 – 20:00",
    currency: "Omani rial (OMR)",
    currencyNote:
      "The rial is pegged to the US dollar, so USD balances translate predictably into OMR.",
    regulators: [
      {
        name: "Financial Services Authority (FSA)",
        role: "Capital-market and insurance regulator (formerly the Capital Market Authority)",
        url: "https://fsa.gov.om/",
      },
      {
        name: "Central Bank of Oman (CBO)",
        role: "Banking and payments regulator",
        url: "https://cbo.gov.om/",
      },
    ],
    checks: [
      "Check any local-regulation claim with Oman's Financial Services Authority.",
      "Confirm a prop firm accepts Omani residents and supports a payout method your bank accepts.",
      "Oman shares UAE time, so the 17:00–20:00 gold window fits an after-work routine.",
      "Avoid 'investment groups' that ask you to deposit money with an agent — use regulated providers only.",
    ],
    mlName: "ഒമാൻ",
    mlLocative: "ഒമാനിൽ",
  },
  {
    slug: "bahrain",
    name: "Bahrain",
    shortName: "Bahrain",
    demonym: "Bahrain",
    cities: ["Manama", "Muharraq", "Riffa"],
    utcOffset: "UTC+3",
    timeZone: "Arabia Standard Time (AST)",
    londonOpen: "11:00",
    goldPrime: "16:00 – 19:00",
    currency: "Bahraini dinar (BHD)",
    currencyNote:
      "The dinar is pegged to the US dollar, so USD trading balances are straightforward to track.",
    regulators: [
      {
        name: "Central Bank of Bahrain (CBB)",
        role: "Single regulator for banking, insurance and capital markets",
        url: "https://www.cbb.gov.bh/",
      },
    ],
    checks: [
      "Bahrain has a single financial regulator — check any 'Bahrain-licensed' claim on the CBB's records.",
      "Some brokers list Bahrain as a restricted country; read the eligibility page before opening an account.",
      "Check prop-firm eligibility for Bahrain residents and the payout routes available.",
      "Keep a record of every payment and payout for your own banking and tax questions.",
    ],
    mlName: "ബഹ്റൈൻ",
    mlLocative: "ബഹ്റൈനിൽ",
  },
];

export function getGccCountry(slug: string) {
  return GCC_COUNTRIES.find((country) => country.slug === slug);
}

/** Malayali communities outside the GCC. */
export const ABROAD_COUNTRIES: GccCountry[] = [
  {
    slug: "canada",
    name: "Canada",
    shortName: "Canada",
    demonym: "Canadian",
    cities: ["Toronto", "Brampton", "Calgary", "Vancouver"],
    utcOffset: "UTC-5 (Toronto)",
    timeZone: "Eastern Time (ET)",
    londonOpen: "03:00",
    goldPrime: "08:00 – 11:00",
    currency: "Canadian dollar (CAD)",
    currencyNote:
      "The Canadian dollar floats freely against the US dollar, so the CAD value of a USD trading balance or reward changes daily.",
    regulators: [
      {
        name: "Canadian Investment Regulatory Organization (CIRO)",
        role: "National self-regulatory organisation for investment dealers",
        url: "https://www.ciro.ca/",
      },
      {
        name: "Provincial securities regulators (Canadian Securities Administrators)",
        role: "Each province regulates securities and derivatives — e.g. the Ontario Securities Commission",
      },
    ],
    checks: [
      "Check that a broker is a CIRO-regulated dealer, or registered with your provincial regulator, before depositing.",
      "Some prop firms and offshore brokers restrict Canadian residents or certain provinces — read the eligibility list for your province.",
      "London–New York overlap falls in the Toronto morning (08:00–11:00 ET) — plan around work hours.",
      "Keep records of every fee and reward in CAD for your own tax filing.",
    ],
    mlName: "കാനഡ",
    mlLocative: "കാനഡയിൽ",
    seasonNote:
      "Times shown for Toronto (Eastern Time). Vancouver is three hours earlier. Canadian and UK clock changes usually keep these times similar year-round, except for a few weeks in March and late October.",
  },
  {
    slug: "australia",
    name: "Australia",
    shortName: "Australia",
    demonym: "Australian",
    cities: ["Melbourne", "Sydney", "Brisbane", "Perth"],
    utcOffset: "UTC+11 (Sydney, summer)",
    timeZone: "Australian Eastern Daylight Time (AEDT)",
    londonOpen: "19:00",
    goldPrime: "00:00 – 03:00",
    currency: "Australian dollar (AUD)",
    currencyNote:
      "The Australian dollar floats against the US dollar, so the AUD value of a USD balance or reward changes daily.",
    regulators: [
      {
        name: "Australian Securities and Investments Commission (ASIC)",
        role: "Regulates financial services, including CFD and forex brokers; ASIC limits the leverage brokers may offer retail CFD clients",
        url: "https://www.asic.gov.au/",
      },
      {
        name: "Moneysmart (ASIC)",
        role: "ASIC's consumer site with investment warnings and scam checks",
        url: "https://moneysmart.gov.au/",
      },
    ],
    checks: [
      "Check that a broker holds an Australian Financial Services licence on ASIC's professional register.",
      "ASIC caps leverage for retail CFD clients, so offers of very high leverage are a warning sign.",
      "The London–New York overlap falls after midnight in Sydney and Melbourne — Perth traders get it at 21:00–00:00 AWST in the Australian summer.",
      "Check prop-firm eligibility for Australian residents and keep records for your own tax return.",
    ],
    mlName: "ഓസ്ട്രേലിയ",
    mlLocative: "ഓസ്ട്രേലിയയിൽ",
    seasonNote:
      "Times shown for Sydney and Melbourne in the Australian summer (AEDT, roughly October to April). In the Australian winter (AEST, with UK summer time) the sessions start about two hours earlier — the gold overlap is roughly 22:00 – 01:00 in Sydney.",
  },
];

export function getAbroadCountry(slug: string) {
  return ABROAD_COUNTRIES.find((country) => country.slug === slug);
}
