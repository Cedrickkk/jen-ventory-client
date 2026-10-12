import assert from "node:assert/strict";
import { test } from "node:test";
import { SubmissionIdentity } from "../src/lib/idempotency.ts";

test("uncertain submission reuses key; payload changes or success create new key", () => {
  const identity = new SubmissionIdentity();
  const first = identity.forPayload({ amount: 20 });
  assert.equal(identity.forPayload({ amount: 20 }), first);
  assert.notEqual(identity.forPayload({ amount: 30 }), first);
  const second = identity.forPayload({ amount: 30 });
  identity.complete();
  assert.notEqual(identity.forPayload({ amount: 30 }), second);
});
