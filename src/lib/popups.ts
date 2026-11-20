/**
 * Coordination between the site's engagement popups: at most one popup per
 * browser session, so visitors never see two in a row.
 */
export const POPUP_SESSION_KEY = "markos-popup-shown";

/** Pages where visitors are researching funded accounts; the offer popup
 * runs here instead of the generic WhatsApp invitation. */
const FUNDED_INTENT =
  /^\/(get-funded|funded-account-guide|gcc|abroad|kerala)(\/|$)|^\/insights\/[^/]*(prop|fund|payout|challenge|ftmo|the5ers|fundingpips|fundednext|blueberry|goat|alpha|top-one|maven|xauusd|scale)/;

export function isFundedIntentPath(pathname: string): boolean {
  return FUNDED_INTENT.test(pathname);
}

export function popupAlreadyShown(): boolean {
  try {
    return Boolean(window.sessionStorage.getItem(POPUP_SESSION_KEY));
  } catch {
    return false;
  }
}

export function markPopupShown() {
  try {
    window.sessionStorage.setItem(POPUP_SESSION_KEY, "1");
  } catch {
    // Storage blocked: the per-popup caps still apply.
  }
}
