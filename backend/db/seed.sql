USE rpg;

INSERT INTO race_classes (id, name, description, base_stats) VALUES
(UUID(), 'Aetherion', 'Nômades cósmicos que canalizam energia astral em golpes precisos.', JSON_OBJECT('strength',6,'defense',5,'resilience',6,'agility',7,'speed',8,'ki',10)),
(UUID(), 'Ferrum', 'Guerreiros de metal vivo com grande resistência e foco defensivo.', JSON_OBJECT('strength',8,'defense',9,'resilience',8,'agility',4,'speed',4,'ki',6)),
(UUID(), 'Sylphide', 'Seres ligados ao vento, mestres de esquiva e ataques críticos.', JSON_OBJECT('strength',5,'defense',4,'resilience',5,'agility',10,'speed',10,'ki',7));

INSERT INTO items (id, name, description, category, rarity, effects, stackable) VALUES
(UUID(), 'Elixir Prisma', 'Recupera KI e stamina moderadamente.', 'CONSUMABLE', 'Comum', JSON_OBJECT('ki',25,'stamina',25), 1),
(UUID(), 'Manoplas Ígneas', 'Equipamento que aumenta força e chance crítica.', 'EQUIPMENT', 'Raro', JSON_OBJECT('strength',3,'critChance',2), 0),
(UUID(), 'Fragmento Lúmen', 'Material usado em crafting avançado.', 'MATERIAL', 'Incomum', JSON_OBJECT(), 1);

INSERT INTO quests (id, name, description, type, objectives, rewards) VALUES
(UUID(), 'Eco das Ruínas', 'Complete 2 treinos e colete 3 Fragmentos Lúmen.', 'DAILY', JSON_OBJECT('trainings',2,'items',JSON_ARRAY(JSON_OBJECT('item','Fragmento Lúmen','qty',3))), JSON_OBJECT('xp',120,'aurum',150)),
(UUID(), 'Vanguarda Nebular', 'Vença 1 combate de arena e complete 1 missão repetível.', 'WEEKLY', JSON_OBJECT('arenaWins',1,'quests',1), JSON_OBJECT('xp',480,'aurum',600,'lumen',5));

INSERT INTO saga_chapters (id, title, synopsis, difficulty, requirements, rewards) VALUES
(UUID(), 'Capítulo 1 - Portões de Halcyon', 'Uma antiga estação orbital desperta e ameaça o arquipélago celeste.', 'NORMAL', JSON_OBJECT('level',1,'ki',10), JSON_OBJECT('xp',150,'aurum',200)),
(UUID(), 'Capítulo 2 - O Coração da Névoa', 'Criaturas etéreas emergem para proteger um núcleo instável.', 'NORMAL', JSON_OBJECT('level',4,'ki',15), JSON_OBJECT('xp',220,'aurum',300)),
(UUID(), 'Capítulo 3 - Eclipse de Lúmen', 'Um eclipse corrompe a energia do mundo e revela um inimigo oculto.', 'HARD', JSON_OBJECT('level',8,'ki',25), JSON_OBJECT('xp',400,'aurum',500,'lumen',3));
