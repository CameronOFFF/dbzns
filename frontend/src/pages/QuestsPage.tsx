import DashboardLayout from '../components/DashboardLayout';

const QuestsPage = () => (
  <DashboardLayout>
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Missões & Eventos</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Diárias</h3>
          <p className="text-sm text-slate-300">Complete objetivos rápidos para XP e Aurum.</p>
        </div>
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Semanais</h3>
          <p className="text-sm text-slate-300">Missões longas com Gemas Lúmen.</p>
        </div>
      </div>
      <div className="rounded-2xl bg-abyss-700 p-4">
        <h3 className="font-semibold">Evento: Ecos Lúmen</h3>
        <p className="text-sm text-slate-300">Participe de desafios sazonais e troque por cosméticos.</p>
      </div>
    </div>
  </DashboardLayout>
);

export default QuestsPage;
