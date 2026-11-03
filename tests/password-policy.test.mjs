import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PASSWORD_MIN_LENGTH,
  evaluatePasswordPolicy,
  getPasswordPolicyErrors,
  isPasswordPolicySatisfied,
} from '../lib/auth/passwordPolicy.mjs';

test('requires at least 16 Unicode code points and all four character classes', () => {
  assert.equal(PASSWORD_MIN_LENGTH, 16);
  assert.equal(isPasswordPolicySatisfied('SufficientlyLong9!Pass'), true);
  assert.deepEqual(getPasswordPolicyErrors('SufficientlyLong9!Pass'), []);
});

test('reports missing length and character classes', () => {
  assert.deepEqual(getPasswordPolicyErrors('short'), [
    'At least 16 characters',
    'At least one uppercase letter',
    'At least one number',
    'At least one symbol or punctuation mark',
  ]);
});

test('does not treat whitespace as a symbol', () => {
  const result = evaluatePasswordPolicy('LongEnoughPassword7 ');
  assert.equal(result.length, true);
  assert.equal(result.lowercase, true);
  assert.equal(result.uppercase, true);
  assert.equal(result.number, true);
  assert.equal(result.symbol, false);
});

test('supports Unicode upper/lowercase letters, decimal digits, and symbols', () => {
  assert.equal(isPasswordPolicySatisfied('ÄnderungPasswort٤🔒'), true);
});

test('rejects non-string values safely', () => {
  assert.equal(isPasswordPolicySatisfied(null), false);
  assert.equal(isPasswordPolicySatisfied(undefined), false);
});
