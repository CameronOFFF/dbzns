import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const races = await prisma.raceClass.createMany({
    data: [
      {
        name: 'Aetherion',
        description: 'Nômades cósmicos que canalizam energia astral em golpes precisos.',
        baseStats: { strength: 6, defense: 5, resilience: 6, agility: 7, speed: 8, ki: 10 },
      },
      {
        name: 'Ferrum',
        description: 'Guerreiros de metal vivo com grande resistência e foco defensivo.',
        baseStats: { strength: 8, defense: 9, resilience: 8, agility: 4, speed: 4, ki: 6 },
      },
      {
        name: 'Sylphide',
        description: 'Seres ligados ao vento, mestres de esquiva e ataques críticos.',
        baseStats: { strength: 5, defense: 4, resilience: 5, agility: 10, speed: 10, ki: 7 },
      },
    ],
    skipDuplicates: true,
  });

  const items = await prisma.item.createMany({
    data: [
      {
        name: 'Elixir Prisma',
        description: 'Recupera KI e stamina moderadamente.',
        category: 'CONSUMABLE',
        rarity: 'Comum',
        effects: { ki: 25, stamina: 25 },
        stackable: true,
      },
      {
        name: 'Manoplas Ígneas',
        description: 'Equipamento que aumenta força e chance crítica.',
        category: 'EQUIPMENT',
        rarity: 'Raro',
        effects: { strength: 3, critChance: 2 },
        stackable: false,
      },
      {
        name: 'Fragmento Lúmen',
        description: 'Material usado em crafting avançado.',
        category: 'MATERIAL',
        rarity: 'Incomum',
        effects: { },
        stackable: true,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.quest.createMany({
    data: [
      {
        name: 'Eco das Ruínas',
        description: 'Complete 2 treinos e colete 3 Fragmentos Lúmen.',
        type: 'DAILY',
        objectives: { trainings: 2, items: [{ item: 'Fragmento Lúmen', qty: 3 }] },
        rewards: { xp: 120, aurum: 150 },
      },
      {
        name: 'Vanguarda Nebular',
        description: 'Vença 1 combate de arena e complete 1 missão repetível.',
        type: 'WEEKLY',
        objectives: { arenaWins: 1, quests: 1 },
        rewards: { xp: 480, aurum: 600, lumen: 5 },
      },
    ],
    skipDuplicates: true,
  });

  await prisma.sagaChapter.createMany({
    data: [
      {
        title: 'Capítulo 1 - Portões de Halcyon',
        synopsis: 'Uma antiga estação orbital desperta e ameaça o arquipélago celeste.',
        difficulty: 'NORMAL',
        requirements: { level: 1, ki: 10 },
        rewards: { xp: 150, aurum: 200 },
      },
      {
        title: 'Capítulo 2 - O Coração da Névoa',
        synopsis: 'Criaturas etéreas emergem para proteger um núcleo instável.',
        difficulty: 'NORMAL',
        requirements: { level: 4, ki: 15 },
        rewards: { xp: 220, aurum: 300 },
      },
      {
        title: 'Capítulo 3 - Eclipse de Lúmen',
        synopsis: 'Um eclipse corrompe a energia do mundo e revela um inimigo oculto.',
        difficulty: 'HARD',
        requirements: { level: 8, ki: 25 },
        rewards: { xp: 400, aurum: 500, lumen: 3 },
      },
    ],
    skipDuplicates: true,
  });

  console.log({ races, items });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
