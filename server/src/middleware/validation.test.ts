import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApiPayload } from './validation.js';

function run(body: unknown) {
  const result = { status: 200, body: null as unknown };
  const req = { method: 'POST', body } as any;
  const res = {
    status(code: number) { result.status = code; return this; },
    json(value: unknown) { result.body = value; return this; }
  } as any;
  let nextCalled = false;
  validateApiPayload(req, res, () => { nextCalled = true; });
  return { ...result, nextCalled };
}

test('rejects empty payloads', () => {
  assert.equal(run({}).status, 400);
});

test('rejects negative financial values', () => {
  assert.equal(run({ amount: -10 }).status, 400);
});

test('accepts valid payloads', () => {
  assert.equal(run({ email: 'valid@example.com', amount: 10 }).nextCalled, true);
});
