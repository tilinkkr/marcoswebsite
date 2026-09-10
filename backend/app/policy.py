RISK_POLICY_VERSION = "2026-09-v1"

RISK_POLICY_SECTIONS = [
    (
        "TRADING RISK",
        "Trading financial instruments involves substantial risk. Losses are possible and trading may not be suitable for everyone.",
    ),
    (
        "NO GUARANTEE",
        "MARCOS does not guarantee profits, returns, prop-firm challenge passes, funded accounts, payouts or any specific trading result.",
    ),
    (
        "EDUCATIONAL PURPOSE",
        "MARCOS provides educational material, tools, community discussions and general trading-related information. Content is not a personalized promise of investment performance.",
    ),
    (
        "PROP-FIRM TERMS",
        "Third-party prop firms set and control their own evaluation rules, drawdown limits, account rules, payout terms, eligibility, pricing and policies. Those terms may change. MARCOS does not control them.",
    ),
    (
        "PERSONAL RESPONSIBILITY",
        "Users are responsible for their own trading decisions, understanding provider rules, assessing financial risk, complying with applicable laws and deciding whether trading is appropriate for them.",
    ),
    (
        "PAST PERFORMANCE",
        "Past performance, examples, screenshots or member experiences do not guarantee future results.",
    ),
    (
        "TOOLS / INDICATORS",
        "MARCOS indicators and tools assist analysis. They do not predict markets with certainty and do not remove trading risk.",
    ),
    (
        "NO GUARANTEED FUNDING",
        "Participation in MARCOS does not guarantee acceptance or funding from any third-party prop firm.",
    ),
    (
        "PAYMENT / MEMBERSHIP",
        "The user understands what their selected MARCOS product provides before purchasing. Refund and cancellation terms require approved policy configuration.",
    ),
]

RISK_POLICY_SNAPSHOT = "\n\n".join(
    f"{index}. {title}\n{body}" for index, (title, body) in enumerate(RISK_POLICY_SECTIONS, 1)
)
