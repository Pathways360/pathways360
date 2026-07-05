export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // Use fallback values if environment variables are not set
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL || "https://api.manus.im";
  const appId = import.meta.env.VITE_APP_ID || "pathways360";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error("Failed to construct login URL:", error);
    // Return a safe fallback
    return `${oauthPortalUrl}/app-auth?appId=${appId}&redirectUri=${encodeURIComponent(redirectUri)}&type=signIn`;
  }
};
