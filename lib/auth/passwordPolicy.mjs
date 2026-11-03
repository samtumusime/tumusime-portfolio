export const PASSWORD_MIN_LENGTH = 16;

// Keep these checks aligned with Supabase Auth's configurable character classes.
// Supabase's supported symbol set is deliberately narrower than all Unicode punctuation.
const SUPPORTED_SYMBOLS = "!@#$%^&*()_+-=[]{};':\\\"|<>?,./`~";

export const PASSWORD_RULES = Object.freeze([
  { key: 'length', label: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { key: 'lowercase', label: 'At least one lowercase English letter (a-z)' },
  { key: 'uppercase', label: 'At least one uppercase English letter (A-Z)' },
  { key: 'number', label: 'At least one number (0-9)' },
  { key: 'symbol', label: 'At least one supported symbol (for example ! or #)' },
]);

export function evaluatePasswordPolicy(password) {
  const value = typeof password === 'string' ? password : '';
  const length = Array.from(value).length;

  return {
    length: length >= PASSWORD_MIN_LENGTH,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    symbol: Array.from(SUPPORTED_SYMBOLS).some((character) => value.includes(character)),
  };
}

export function getPasswordPolicyErrors(password) {
  const result = evaluatePasswordPolicy(password);
  return PASSWORD_RULES
    .filter(({ key }) => !result[key])
    .map(({ label }) => label);
}

export function isPasswordPolicySatisfied(password) {
  return Object.values(evaluatePasswordPolicy(password)).every(Boolean);
}
