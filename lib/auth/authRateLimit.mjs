export const AUTH_RATE_LIMIT_BACKOFF_MS = 60_000;

const RATE_LIMIT_CODES = new Set([
  'over_request_rate_limit',
  'over_email_send_rate_limit',
  'too_many_requests',
]);

export function isAuthRateLimited(error) {
  if (!error || typeof error !== 'object') return false;
  if (Number(error.status) === 429) return true;
  return typeof error.code === 'string' && RATE_LIMIT_CODES.has(error.code.toLowerCase());
}
