import test from 'node:test';
import assert from 'node:assert/strict';
import { createToken, hashPassword, verifyPassword, verifyToken } from './auth.js';

test('creates and verifies a token', () => {
  const user = { id: 'u-1', name: 'Test', email: 'test@example.com', role: 'creator' };
  const token = createToken(user);
  assert.deepEqual(verifyToken(token), user);
  assert.equal(verifyToken(`${token}invalid`), null);
});

test('hashes and verifies passwords without storing plaintext', async () => {
  const hash = await hashPassword('StrongPassword123!');
  assert.notEqual(hash, 'StrongPassword123!');
  assert.equal(await verifyPassword('StrongPassword123!', hash), true);
  assert.equal(await verifyPassword('wrong-password', hash), false);
});
