export function isAuthenticatedClient(): boolean {
  if (typeof document === 'undefined') return false;
  // Simple cookie-based check; real OAuth flow will set this cookie securely server-side
  return /(?:^|; )ai_auth=1(?:;|$)/.test(document.cookie || '');
}
