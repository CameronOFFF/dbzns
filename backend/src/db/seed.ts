import { query } from './mysql.js';

async function seed() {
  await query(
    "INSERT INTO race_classes (id, name, description, base_stats) VALUES (UUID(), :name, :description, :base_stats)",
    {
      name: 'Aetherion',
      description: 'Nômades cósmicos que canalizam energia astral em golpes precisos.',
      base_stats: JSON.stringify({ strength: 6, defense: 5, resilience: 6, agility: 7, speed: 8, ki: 10 }),
    }
  );

  await query(
    "INSERT INTO race_classes (id, name, description, base_stats) VALUES (UUID(), :name, :description, :base_stats)",
    {
      name: 'Ferrum',
      description: 'Guerreiros de metal vivo com grande resistência e foco defensivo.',
      base_stats: JSON.stringify({ strength: 8, defense: 9, resilience: 8, agility: 4, speed: 4, ki: 6 }),
    }
  );

  await query(
    "INSERT INTO race_classes (id, name, description, base_stats) VALUES (UUID(), :name, :description, :base_stats)",
    {
      name: 'Sylphide',
      description: 'Seres ligados ao vento, mestres de esquiva e ataques críticos.',
      base_stats: JSON.stringify({ strength: 5, defense: 4, resilience: 5, agility: 10, speed: 10, ki: 7 }),
    }
  );

  await query(
    "INSERT INTO items (id, name, description, category, rarity, effects, stackable) VALUES (UUID(), :name, :description, 'CONSUMABLE', 'Comum', :effects, 1)",
    {
      name: 'Elixir Prisma',
      description: 'Recupera KI e stamina moderadamente.',
      effects: JSON.stringify({ ki: 25, stamina: 25 }),
    }
  );

  await query(
    "INSERT INTO items (id, name, description, category, rarity, effects, stackable) VALUES (UUID(), :name, :description, 'EQUIPMENT', 'Raro', :effects, 0)",
    {
      name: 'Manoplas Ígneas',
      description: 'Equipamento que aumenta força e chance crítica.',
      effects: JSON.stringify({ strength: 3, critChance: 2 }),
    }
  );

  await query(
    "INSERT INTO items (id, name, description, category, rarity, effects, stackable) VALUES (UUID(), :name, :description, 'MATERIAL', 'Incomum', :effects, 1)",
    {
      name: 'Fragmento Lúmen',
      description: 'Material usado em crafting avançado.',
      effects: JSON.stringify({}),
    }
  );

  await query(
    "INSERT INTO quests (id, name, description, type, objectives, rewards) VALUES (UUID(), :name, :description, 'DAILY', :objectives, :rewards)",
    {
      name: 'Eco das Ruínas',
      description: 'Complete 2 treinos e colete 3 Fragmentos Lúmen.',
      objectives: JSON.stringify({ trainings: 2, items: [{ item: 'Fragmento Lúmen', qty: 3 }] }),
      rewards: JSON.stringify({ xp: 120, aurum: 150 }),
    }
  );

  await query(
    "INSERT INTO quests (id, name, description, type, objectives, rewards) VALUES (UUID(), :name, :description, 'WEEKLY', :objectives, :rewards)",
    {
      name: 'Vanguarda Nebular',
      description: 'Vença 1 combate de arena e complete 1 missão repetível.',
      objectives: JSON.stringify({ arenaWins: 1, quests: 1 }),
      rewards: JSON.stringify({ xp: 480, aurum: 600, lumen: 5 }),
    }
  );

  await query(
    "INSERT INTO saga_chapters (id, title, synopsis, difficulty, requirements, rewards) VALUES (UUID(), :title, :synopsis, 'NORMAL', :requirements, :rewards)",
    {
      title: 'Capítulo 1 - Portões de Halcyon',
      synopsis: 'Uma antiga estação orbital desperta e ameaça o arquipélago celeste.',
      requirements: JSON.stringify({ level: 1, ki: 10 }),
      rewards: JSON.stringify({ xp: 150, aurum: 200 }),
    }
  );

  await query(
    "INSERT INTO saga_chapters (id, title, synopsis, difficulty, requirements, rewards) VALUES (UUID(), :title, :synopsis, 'NORMAL', :requirements, :rewards)",
    {
      title: 'Capítulo 2 - O Coração da Névoa',
      synopsis: 'Criaturas etéreas emergem para proteger um núcleo instável.',
      requirements: JSON.stringify({ level: 4, ki: 15 }),
      rewards: JSON.stringify({ xp: 220, aurum: 300 }),
    }
  );

  await query(
    "INSERT INTO saga_chapters (id, title, synopsis, difficulty, requirements, rewards) VALUES (UUID(), :title, :synopsis, 'HARD', :requirements, :rewards)",
    {
      title: 'Capítulo 3 - Eclipse de Lúmen',
      synopsis: 'Um eclipse corrompe a energia do mundo e revela um inimigo oculto.',
      requirements: JSON.stringify({ level: 8, ki: 25 }),
      rewards: JSON.stringify({ xp: 400, aurum: 500, lumen: 3 }),
    }
  );
}

seed()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
