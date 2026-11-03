import test from 'node:test';
import assert from 'node:assert/strict';
import { isAuthRateLimited } from '../lib/auth/authRateLimit.mjs';

test('recognizes HTTP 429 Supabase Auth errors', () => {
  assert.equal(isAuthRateLimited({ status: 429 }), true);
  assert.equal(isAuthRateLimited({ status: '429' }), true);
});

test('recognizes known Auth rate-limit error codes', () => {
  assert.equal(isAuthRateLimited({ code: 'over_request_rate_limit' }), true);
  assert.equal(isAuthRateLimited({ code: 'over_email_send_rate_limit' }), true);
  assert.equal(isAuthRateLimited({ code: 'TOO_MANY_REQUESTS' }), true);
});

test('does not classify credentials and network errors as rate-limited', () => {
  assert.equal(isAuthRateLimited({ status: 400, code: 'invalid_credentials' }), false);
  assert.equal(isAuthRateLimited(new Error('network error')), false);
  assert.equal(isAuthRateLimited(null), false);
});
