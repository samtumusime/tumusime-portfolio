import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PASSWORD_MIN_LENGTH,
  evaluatePasswordPolicy,
  getPasswordPolicyErrors,
  isPasswordPolicySatisfied,
} from '../lib/auth/passwordPolicy.mjs';

test('requires at least 16 characters and all configured character classes', () => {
  assert.equal(PASSWORD_MIN_LENGTH, 16);
  assert.equal(isPasswordPolicySatisfied('SufficientlyLong9!Pass'), true);
  assert.deepEqual(getPasswordPolicyErrors('SufficientlyLong9!Pass'), []);
});

test('reports missing length and character classes', () => {
  assert.deepEqual(getPasswordPolicyErrors('short'), [
    'At least 16 characters',
    'At least one uppercase English letter (A-Z)',
    'At least one number (0-9)',
    'At least one supported symbol (for example ! or #)',
  ]);
});

test('does not treat whitespace or emoji as a configured symbol', () => {
  const result = evaluatePasswordPolicy('LongEnoughPassword7 🔒');
  assert.equal(result.length, true);
  assert.equal(result.lowercase, true);
  assert.equal(result.uppercase, true);
  assert.equal(result.number, true);
  assert.equal(result.symbol, false);
});

test('accepts Supabase-supported punctuation and symbol characters', () => {
  for (const symbol of Array.from("!@#$%^&*()_+-=[]{};':\\"|<>?,./`~")) {
    assert.equal(isPasswordPolicySatisfied(`LongEnoughPassword7${symbol}`), true, `symbol ${symbol}`);
  }
});

test('requires English character classes rather than unrelated Unicode classes', () => {
  const result = evaluatePasswordPolicy('ÄnderungPasswort٤🔒');
  assert.equal(result.lowercase, false);
  assert.equal(result.uppercase, false);
  assert.equal(result.number, false);
  assert.equal(result.symbol, false);
});

test('rejects non-string values safely', () => {
  assert.equal(isPasswordPolicySatisfied(null), false);
  assert.equal(isPasswordPolicySatisfied(undefined), false);
});
