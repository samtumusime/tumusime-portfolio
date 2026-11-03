export const PASSWORD_MIN_LENGTH = 16;

export const PASSWORD_RULES = Object.freeze([
  { key: 'length', label: `At least ${PASSWORD_MIN_LENGTH} characters` },
  { key: 'lowercase', label: 'At least one lowercase letter' },
  { key: 'uppercase', label: 'At least one uppercase letter' },
  { key: 'number', label: 'At least one number' },
  { key: 'symbol', label: 'At least one symbol or punctuation mark' },
]);

export function evaluatePasswordPolicy(password) {
  const value = typeof password === 'string' ? password : '';
  const length = Array.from(value).length;

  return {
    length: length >= PASSWORD_MIN_LENGTH,
    lowercase: /\p{Ll}/u.test(value),
    uppercase: /\p{Lu}/u.test(value),
    number: /\p{Nd}/u.test(value),
    symbol: /[\p{P}\p{S}]/u.test(value),
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
