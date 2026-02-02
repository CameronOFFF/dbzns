export interface Combatant {
  id: string;
  name: string;
  stats: {
    strength: number;
    defense: number;
    resilience: number;
    agility: number;
    speed: number;
    critChance: number;
    critDamage: number;
  };
}

export interface CombatRound {
  attackerId: string;
  defenderId: string;
  damage: number;
  crit: boolean;
}

export interface CombatResult {
  winnerId: string;
  rounds: CombatRound[];
}

export function simulateCombat(a: Combatant, b: Combatant): CombatResult {
  const rounds: CombatRound[] = [];
  let aHp = 100 + a.stats.resilience * 10;
  let bHp = 100 + b.stats.resilience * 10;

  const order = a.stats.speed >= b.stats.speed ? [a, b] : [b, a];
  let attackerIndex = 0;

  while (aHp > 0 && bHp > 0 && rounds.length < 20) {
    const attacker = order[attackerIndex % 2];
    const defender = order[(attackerIndex + 1) % 2];

    const baseDamage = Math.max(5, attacker.stats.strength * 2 - defender.stats.defense);
    const variance = Math.random() * 0.2 + 0.9;
    const critRoll = Math.random() * 100;
    const crit = critRoll <= attacker.stats.critChance;
    const critMultiplier = crit ? 1 + attacker.stats.critDamage / 100 : 1;
    const damage = Math.round(baseDamage * variance * critMultiplier);

    if (defender.id === a.id) {
      aHp -= damage;
    } else {
      bHp -= damage;
    }

    rounds.push({ attackerId: attacker.id, defenderId: defender.id, damage, crit });
    attackerIndex += 1;
  }

  const winnerId = aHp > bHp ? a.id : b.id;
  return { winnerId, rounds };
}
