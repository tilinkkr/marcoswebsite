export const membershipProduct = {
  slug: "marcos-membership",
  type: "membership",
  name: "MARKOS Membership",
  originalPrice: 200,
  offerPrice: 100,
  currency: "USD",
  discountPercent: 50,
  billingLabel: null,
} as const;

export const indicatorProduct = {
  slug: "marcos-one",
  type: "indicator",
  name: "MARKOS ONE",
  originalPrice: 100,
  offerPrice: 50,
  currency: "USD",
  discountPercent: 50,
  note: "Name pending final product approval",
} as const;

export const membershipBenefits = [
  "Community access",
  "Trading education",
  "Market discussion",
  "Trade review",
  "Risk-management frameworks",
  "Trading psychology discussions",
  "Prop-firm evaluation education",
  "Indicator access",
] as const;

export const indicatorFeatures = [
  "Market context visualization",
  "Structure awareness",
  "Configurable chart overlays",
  "Designed for discretionary analysis",
  "No automatic trade execution",
] as const;
