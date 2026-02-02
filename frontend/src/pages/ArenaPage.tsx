import DashboardLayout from '../components/DashboardLayout';

const ArenaPage = () => (
  <DashboardLayout>
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Arena & Ranked</h2>
      <p className="text-sm text-slate-300">
        Desafie rivais com snapshots de atributos. As vitórias elevam seu ELO e desbloqueiam
        recompensas sazonais.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Arena Assíncrona</h3>
          <p className="text-sm text-slate-300">Cooldown de 15 minutos · Anti-farm ativo.</p>
        </div>
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Ranked</h3>
          <p className="text-sm text-slate-300">MMR dinâmico e recompensas ao final da season.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default ArenaPage;
