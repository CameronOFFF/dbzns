# Chrona Rift - RPG Browser (React + Express + MySQL)

Projeto original inspirado em RPGs de anime, com identidade própria, layout em painel triplo e módulos completos de progressão. Nenhum conteúdo protegido foi usado.

## Stack
- **Frontend:** React (Vite) + TypeScript + Tailwind + Headless UI + Zustand.
- **Backend:** Node.js (Express) + TypeScript + Socket.IO + mysql2.
- **Banco:** MySQL com SQL puro (MySQL 8+).
- **Auth:** JWT + Refresh Token.
- **Uploads:** Storage local com opção S3 compatível configurável.
- **Cache/Redis:** Não usado neste MVP porque as tabelas de ranking e as consultas principais já estão paginadas e com índices; recomenda-se adicionar Redis para cache de rankings e sessões em ambiente de produção.

## Estrutura de pastas
```
backend/
  db/
  src/
frontend/
  src/
```

## Visão geral do jogo
- Progressão de personagem com raça/classe original, atributos, stamina, KI e XP.
- Treinos AFK validados no servidor.
- Missões diárias/semanais com cron de reset.
- PvP assíncrono e ranked com ELO e temporadas.
- Torneios programados e eventos sazonais.
- Loja com moedas **Aurum** (soft) e **Lúmen** (premium).
- Clãs com chat e benefícios.
- Painel admin com CRUD e auditoria completa.

## Layout (referência visual, identidade própria)
- **Topo:** avisos de temporada e alertas.
- **Coluna esquerda:** arte do mundo + perfil do jogador.
- **Centro:** cards de atividades, temporadas e rankings.
- **Coluna direita:** menu vertical com ícones e notificações.

## Segurança
- Senhas com **bcrypt (12 salt rounds)**.
- **LEGACY_MD5** (opcional): permite login com MD5 apenas para usuários marcados como legado e migra automaticamente para bcrypt.
- Rate limiting, validação de entrada (Zod), CORS correto e logs de auditoria.
- Logs separados para login, transações, PvP, drops e ações admin.

## Diagrama lógico (principais entidades)
```
User ─┬─ Character ─┬─ InventoryItem ─ Item ─ ShopItem
     │             ├─ Equipment
     │             ├─ Wallet
     │             ├─ QuestProgress ─ Quest
     │             ├─ TrainingSession
     │             ├─ ArenaMatch
     │             └─ ClanMember ─ Clan
     ├─ RefreshToken
     ├─ AuditLog
     └─ Friend / Block

Season ─ Ranking
SagaChapter
Tournament
Event
Challenge
DailyRewardClaim
Coupon
TransactionLog
```

## APIs principais (exemplos)
```
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/2fa/setup
POST /auth/2fa/confirm
POST /auth/2fa/disable

GET  /player/me
POST /player/character
GET  /player/stats
GET  /player/equip

GET  /quests
POST /quests/claim

POST /training/start
POST /training/cancel
POST /training/claim

GET  /sagas

GET  /events/events
GET  /events/challenges
GET  /events/tournaments

POST /rewards/daily

POST /arena/attack
GET  /arena/rank

GET  /shop/items
POST /shop/buy

POST /clan/create
POST /clan/invite

GET  /admin/users
GET  /admin/logs
POST /admin/reward
```

## Combate (auto-battle)
Sistema por turnos automáticos:
- Dano = `max(5, força*2 - defesa)` com variação aleatória de ±10%.
- Crit calculado por chance do atacante com multiplicador baseado em dano crítico.
- Ordem de ataque por velocidade.

## Banco de dados (.sql para XAMPP)
1) Abra o XAMPP e inicie MySQL.
2) Importe o arquivo `backend/db/schema.sql` no phpMyAdmin (ou rode via CLI).
3) (Opcional) Rode `backend/db/seed.sql` para inserir classes, itens e sagas de exemplo.

## Scripts
### Backend
```
cd backend
cp .env.example .env
# Ajuste DB_HOST, DB_USER, DB_PASSWORD, DB_NAME para o MySQL do XAMPP
# (O seed e o servidor carregam variáveis do .env automaticamente)
npm install
npm run seed
npm run dev
```

### Frontend
```
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Docker
```
docker compose up --build
```

## Testes
```
cd backend
npm run test
```

## Observações de Deploy & Performance
- Paginação em rankings e logs.
- Jobs cron para reset diário de quests e recompensas.
- Cache de rankings recomendado via Redis em produção.

## Seeds incluídas
- 3 raças/classes originais (`backend/db/seed.sql`).
- Itens básicos.
- Quests diárias e semanais.
- 3 capítulos de saga.

## Uploads (local / S3)
- Local: `/uploads` com URL relativa.
- S3: configurar `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`.

## Notas finais
Todo o universo, nomes e descrições são originais e não referenciam obras protegidas.
