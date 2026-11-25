/** Open Dalila's Instagram profile in the Instagram app on phones (falls back to the website). */
export const IG_USER = "dalilafitlife";
export const IG_WEB = `https://www.instagram.com/${IG_USER}/`;

const isAndroid = () => /Android/i.test(navigator.userAgent);
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Returns true when it handled the open (phone), false on desktop so the normal link is used. */
export function openInstagramApp(): boolean {
  if (isAndroid()) {
    // Android intent: opens the app on the profile, or the website if the app isn't installed.
    window.location.href = `intent://instagram.com/_u/${IG_USER}/#Intent;package=com.instagram.android;scheme=https;S.browser_fallback_url=${encodeURIComponent(IG_WEB)};end`;
    return true;
  }
  if (isIOS()) {
    const started = Date.now();
    window.location.href = `instagram://user?username=${IG_USER}`;
    // If the app didn't open (not installed), go to the website instead.
    setTimeout(() => { if (!document.hidden && Date.now() - started < 3000) window.location.href = IG_WEB; }, 1500);
    return true;
  }
  return false;
}

/** Any click on an Instagram link anywhere on the site opens the app on phones. */
export function installInstagramLinks() {
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (!/^https?:\/\/(www\.)?(instagram\.com|ig\.me)\//i.test(href)) return;
    if (openInstagramApp()) e.preventDefault();
  }, true);
}
