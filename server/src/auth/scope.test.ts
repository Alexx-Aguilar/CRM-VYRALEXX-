import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessRecord } from './scope.js';

test('creator scope only exposes linked creator records', () => {
  const user = { id: 'u-1', name: 'Creator', email: 'creator@example.com', role: 'creator', creatorId: 'cr-1' };
  assert.equal(canAccessRecord(user, 'creators', { id: 'cr-1' }), true);
  assert.equal(canAccessRecord(user, 'creators', { id: 'cr-2' }), false);
  assert.equal(canAccessRecord(user, 'campaigns', { creatorIds: ['cr-1'] }), true);
  assert.equal(canAccessRecord(user, 'campaigns', { creatorIds: ['cr-2'] }), false);
});

test('brand scope only exposes linked brand records', () => {
  const user = { id: 'u-1', name: 'Brand', email: 'brand@example.com', role: 'brand', brandId: 'br-1' };
  assert.equal(canAccessRecord(user, 'brands', { id: 'br-1' }), true);
  assert.equal(canAccessRecord(user, 'campaigns', { brandId: 'br-2' }), false);
});

test('superadmin can access every record', () => {
  const user = { id: 'u-1', name: 'Admin', email: 'admin@example.com', role: 'superadmin' };
  assert.equal(canAccessRecord(user, 'payments', { entityId: 'anything' }), true);
});
