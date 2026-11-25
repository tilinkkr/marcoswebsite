/**
 * Prime Indian metro city data for local SEO, AEO, and GEO ("funded groups
 * near me", "funded firms groups in bangalore", etc.).
 * All Indian cities run on IST (UTC+5:30).
 */

export type IndiaCity = {
  slug: string;
  name: string;
  altName?: string;
  state: string;
  neighborhoods: string[];
  traderProfile: string;
  localAngle: string;
  extraFaqs: { q: string; a: string }[];
};

export const INDIA_CITIES: IndiaCity[] = [
  {
    slug: "bangalore",
    name: "Bangalore",
    altName: "Bengaluru",
    state: "Karnataka",
    neighborhoods: [
      "Koramangala",
      "Indiranagar",
      "Whitefield",
      "HSR Layout",
      "Electronic City",
    ],
    traderProfile:
      "Software engineers, startup founders, and quantitative-minded traders balancing full-time work with evening London–New York XAUUSD and forex sessions.",
    localAngle:
      "Many traders searching for funded firms groups in Bangalore run into Telegram signal sellers or paid account-passing agents that violate prop-firm IP and third-party trading rules. MARKOS gives Bengaluru traders a transparent, daily private Google Meet live trading stream where you learn to pass evaluations yourself.",
    extraFaqs: [
      {
        q: "Are there genuine funded firms groups in Bangalore (Bengaluru)?",
        a: "Yes — MARKOS connects Bengaluru traders in Koramangala, Indiranagar, Whitefield, and HSR Layout through daily private Google Meet live trading streams and WhatsApp trade reviews. Unlike shady offline passing desks that risk account bans, MARKOS teaches you to trade and pass your own evaluation with strict drawdown discipline.",
      },
      {
        q: "What is the best time to trade XAUUSD or funded accounts from Bangalore?",
        a: "In IST (UTC+5:30), London opens around 1:30 PM IST in winter (12:30 PM in summer) and the high-liquidity London–New York overlap runs roughly 6:30 PM to 9:30 PM IST — fitting smoothly after office hours in Bengaluru.",
      },
    ],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    neighborhoods: ["Bandra", "BKC", "Powai", "Lower Parel", "Navi Mumbai", "Thane"],
    traderProfile:
      "Finance professionals, equity/F&O traders exploring global prop evaluations, and business owners who value structured risk controls over tip groups.",
    localAngle:
      "Mumbai traders know how quickly leverage destroys undisciplined accounts. MARKOS separates global prop-firm rule literacy (FundingPips, FTMO, Alpha Capital) from domestic NSE/BSE rules and hosts live weekday Google Meet execution study sessions.",
    extraFaqs: [
      {
        q: "Can Mumbai traders join a funded account group near me online?",
        a: "Yes. Traders across Bandra, BKC, Powai, Thane, and Navi Mumbai join MARKOS daily on Google Meet and WhatsApp to study London and New York market structure, prop-firm drawdown rules, and XAUUSD execution without commuting.",
      },
    ],
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    altName: "Gurugram & Noida",
    state: "Delhi / Haryana / Uttar Pradesh",
    neighborhoods: ["South Delhi", "Gurugram", "Noida", "Dwarka", "Connaught Place"],
    traderProfile:
      "Corporate professionals in Gurugram and Noida alongside active full-time index and commodities traders expanding into disciplined prop evaluations.",
    localAngle:
      "Search results for funded trading groups in Delhi NCR and Gurugram are crowded with unverified 'guaranteed pass' brokers. MARKOS focuses on verifiable written rules, daily live Google Meet walkthroughs, and risk caps you control yourself.",
    extraFaqs: [
      {
        q: "Is there a live funded-account trading community in Delhi, Gurugram or Noida?",
        a: "MARKOS welcomes traders across South Delhi, Gurugram, and Noida into our daily private Google Meet live trading stream and WhatsApp review desk. Message us on WhatsApp to ask about session timings in IST.",
      },
    ],
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    neighborhoods: ["HITEC City", "Gachibowli", "Jubilee Hills", "Banjara Hills", "Madhapur"],
    traderProfile:
      "Tech professionals in HITEC City and Gachibowli plus disciplined swing and intraday traders seeking structured post-work live sessions.",
    localAngle:
      "Because the London–New York gold (XAUUSD) overlap falls between 6:30 PM and 9:30 PM IST, Hyderabad tech professionals can attend MARKOS's daily Google Meet stream after work without sacrificing sleep or breaking prop rules.",
    extraFaqs: [
      {
        q: "How can traders in Hyderabad prepare for FundingPips or FTMO challenges?",
        a: "Start by reading the exact daily loss, maximum drawdown, and payout terms, then practise with fixed 0.5% risk per trade. Hyderabad members use MARKOS's weekday Google Meet sessions to review setups and avoid common consistency-rule breaches.",
      },
    ],
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    neighborhoods: ["Hinjawadi", "Koregaon Park", "Baner", "Viman Nagar", "Kothrud"],
    traderProfile:
      "IT engineers, young professionals, and disciplined retail traders transitioning from noisy Telegram channels into rule-based execution.",
    localAngle:
      "Pune's growing trading community faces the same challenge everywhere: passing Phase 1 and Phase 2 without over-trading. MARKOS replaces isolated trial-and-error with live weekday screen sharing and structured risk review.",
    extraFaqs: [
      {
        q: "Are there funded trading groups near me in Pune?",
        a: "Yes — traders from Hinjawadi, Baner, Koregaon Park, and Viman Nagar join MARKOS's daily live Google Meet sessions and WhatsApp community for funded-account rule education and live market review.",
      },
    ],
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    neighborhoods: ["OMR", "Adyar", "Anna Nagar", "Velachery", "T. Nagar"],
    traderProfile:
      "Analytical engineers, finance graduates, and business owners looking for methodical, low-hype prop-firm preparation and XAUUSD structure.",
    localAngle:
      "Chennai traders appreciate process over flash. MARKOS publishes primary-source prop-firm rule breakdowns, teaches strict position sizing, and runs weekday Google Meet sessions in clear English (plus Malayalam support).",
    extraFaqs: [
      {
        q: "How do I join a funded trading group from Chennai?",
        a: "Send one WhatsApp message to MARKOS (+91 91875 87488). The team explains our daily Google Meet live stream schedule, risk framework, and membership options without pushy sales tactics.",
      },
    ],
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    altName: "Gujarat & GIFT City",
    state: "Gujarat",
    neighborhoods: ["SG Highway", "Prahlad Nagar", "Satellite", "Bopal", "GIFT City"],
    traderProfile:
      "Entrepreneurial traders and active market participants in Gujarat looking closely at capital efficiency, compliance, and risk-reward asymmetry.",
    localAngle:
      "Gujarat has one of India's strongest trading cultures. MARKOS helps Ahmedabad and GIFT City-area traders evaluate prop-firm rules objectively, understand RBI/FEMA boundaries clearly, and build disciplined execution habits.",
    extraFaqs: [
      {
        q: "Can traders in Ahmedabad and Gujarat join MARKOS live trading streams?",
        a: "Yes. Traders across Ahmedabad, Surat, Vadodara, and Rajkot attend MARKOS's daily private Google Meet live trading streams and get direct answers on prop-firm rules and risk discipline via WhatsApp.",
      },
    ],
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    neighborhoods: ["Salt Lake", "New Town", "Park Street", "Ballygunge", "Alipore"],
    traderProfile:
      "Independent market students, commodities/gold watchers, and finance professionals seeking honest funded-account guidance.",
    localAngle:
      "Rather than chasing expensive offline workshops or unverified signal rooms, Kolkata traders join MARKOS online for daily live Google Meet market breakdowns, prop-firm payout checklists, and community accountability.",
    extraFaqs: [
      {
        q: "What should Kolkata traders check before buying a funded account?",
        a: "Check total fees, static vs. trailing drawdown formulas, consistency caps, payout rails in India (Rise/crypto/wire), and RBI/FEMA compliance before paying any evaluation fee.",
      },
    ],
  },
  {
    slug: "kochi",
    name: "Kochi",
    altName: "Ernakulam, Kerala",
    state: "Kerala",
    neighborhoods: ["Kakkanad", "Infopark", "Edappally", "MG Road", "Panampilly Nagar"],
    traderProfile:
      "Kerala's hub of Malayali traders, Infopark professionals, and Gulf-connected families studying forex, XAUUSD gold, and prop-firm challenges.",
    localAngle:
      "MARKOS is rooted in Kerala — Kochi and Ernakulam traders get full support in both Malayalam and English, daily Google Meet live sessions, and honest guidance that steers clear of 'passing group' scams.",
    extraFaqs: [
      {
        q: "Does MARKOS have a trading community in Kochi and Kerala?",
        a: "Yes — MARKOS is Kerala-based with active members across Kochi, Kakkanad, Trivandrum, Kozhikode, Thrissur, and the GCC. Ask us in Malayalam or English on WhatsApp (+91 91875 87488).",
      },
    ],
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    altName: "Mohali & Panchkula",
    state: "Chandigarh / Punjab / Haryana",
    neighborhoods: ["Sector 17", "Sector 35", "Mohali", "Panchkula", "Zirakpur"],
    traderProfile:
      "Young entrepreneurs, NRI-connected families, and full-time retail traders across the Tricity region focusing on forex, gold, and prop-firm funding.",
    localAngle:
      "Tricity traders searching for 'funded groups near me' often find aggressive Instagram marketers. MARKOS provides a grounded alternative: daily live Google Meet study desks, written risk limits, and transparent rule reviews.",
    extraFaqs: [
      {
        q: "How do Chandigarh and Mohali traders join the daily Google Meet stream?",
        a: "Message MARKOS on WhatsApp (+91 91875 87488) to see the weekday IST schedule, membership format, and how our funded-account preparation community works.",
      },
    ],
  },
];

export function getIndiaCity(slug: string): IndiaCity | undefined {
  return INDIA_CITIES.find((city) => city.slug === slug);
}
