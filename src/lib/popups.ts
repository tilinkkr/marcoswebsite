/**
 * Coordination between the site's engagement popups: at most one popup per
 * browser session, so visitors never see two in a row.
 */
export const POPUP_SESSION_KEY = "markos-popup-shown";

/**
 * Only /get-funded shows the partner offer card; all other pages (home,
 * insights, city hubs, guides) run the high-converting WhatsApp Community
 * Prompt so WhatsApp inquiries remain the #1 conversion channel.
 */
const FUNDED_INTENT = /^\/get-funded(\/|$)/;

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
