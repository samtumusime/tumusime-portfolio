import test from 'node:test';
import assert from 'node:assert/strict';
import { safeAdminRedirect, safeRecoveryRedirect } from '../lib/auth/safeRedirect.mjs';

test('keeps safe internal admin paths and their query/hash', () => {
  assert.equal(safeAdminRedirect('/admin'), '/admin');
  assert.equal(safeAdminRedirect('/admin/projects?status=draft#list'), '/admin/projects?status=draft#list');
});

test('rejects external, protocol-relative, and non-admin redirects', () => {
  for (const value of [
    'https://attacker.example',
    '//attacker.example/path',
    '/login',
    '/administrator',
    '/admin%2f..%2flogin',
    '/admin\\\\attacker.example',
    '/admin/\nattacker.example',
  ]) {
    assert.equal(safeAdminRedirect(value), '/admin', `rejected ${JSON.stringify(value)}`);
  }
});

test('rejects non-string values and empty paths', () => {
  assert.equal(safeAdminRedirect(null), '/admin');
  assert.equal(safeAdminRedirect(''), '/admin');
});

test('password recovery can return only to the password update route', () => {
  assert.equal(safeRecoveryRedirect('/update-password'), '/update-password');
  assert.equal(safeRecoveryRedirect('https://attacker.example'), '/update-password');
  assert.equal(safeRecoveryRedirect('/admin?next=https://attacker.example'), '/update-password');
});
