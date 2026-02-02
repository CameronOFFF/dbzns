import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';

describe('password utilities', () => {
  it('hashes and verifies', async () => {
    const hash = await hashPassword('StrongPass123');
    const valid = await verifyPassword('StrongPass123', hash);
    expect(valid).toBe(true);
  });
});
