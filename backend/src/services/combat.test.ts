import { describe, it, expect } from 'vitest';
import { simulateCombat } from './combat.js';

describe('simulateCombat', () => {
  it('returns a winner and rounds', () => {
    const result = simulateCombat(
      {
        id: 'a',
        name: 'A',
        stats: { strength: 8, defense: 4, resilience: 6, agility: 5, speed: 7, critChance: 5, critDamage: 50 },
      },
      {
        id: 'b',
        name: 'B',
        stats: { strength: 6, defense: 5, resilience: 6, agility: 5, speed: 6, critChance: 3, critDamage: 30 },
      }
    );

    expect(result.winnerId).toBeTruthy();
    expect(result.rounds.length).toBeGreaterThan(0);
  });
});
