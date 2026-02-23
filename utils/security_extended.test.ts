import { test } from 'node:test';
import assert from 'node:assert';
import { stripDangerousTags } from './security';

test('stripDangerousTags - basic sanitization', () => {
  const input = 'Hello <script>alert("xss")</script> World';
  const expected = 'Hello  World';
  assert.strictEqual(stripDangerousTags(input), expected);
});

test('stripDangerousTags - multiple tags', () => {
  const input = '<iframe></iframe><object></object><embed></embed>';
  const expected = '';
  assert.strictEqual(stripDangerousTags(input), expected);
});

test('stripDangerousTags - inline handlers', () => {
  const input = '<div onmouseover="alert(1)" onclick="evil()">Safe</div>';
  const expected = '<div>Safe</div>';
  assert.strictEqual(stripDangerousTags(input), expected);
});

test('stripDangerousTags - javascript protocols', () => {
  const input = '<a href="javascript:alert(1)">Click me</a>';
  const expected = '<a href="#">Click me</a>';
  assert.strictEqual(stripDangerousTags(input), expected);
});
