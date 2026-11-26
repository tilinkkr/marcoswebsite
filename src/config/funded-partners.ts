/**
 * Prop-firm partner (affiliate) links shown on /get-funded and in the
 * funded-account offer popup.
 *
 * Add an entry only with a real partner URL supplied by the firm. The page
 * and popup disclose that MARKOS may earn a commission, as ASCI and most
 * prop-firm affiliate terms require. Links use rel="sponsored".
 */
export type FundedPartner = {
  name: string;
  url: string;
  guide?: string;
  note?: string;
  code?: string;
};

export const FUNDED_PARTNERS: FundedPartner[] = [
  {
    name: "BrightFunded",
    url: "https://affiliates.brightfunded.com/click?campaign_id=3&ref_id=103",
    note: "Funded-account challenges for forex, gold and more: start through the MARKOS partner link",
  },
];

/** The partner promoted in the site-wide offer popup. */
export const FEATURED_PARTNER: FundedPartner | undefined = FUNDED_PARTNERS[0];
