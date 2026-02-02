import DashboardLayout from '../components/DashboardLayout';
import ContentTabs from '../components/ContentTabs';
import SearchBar from '../components/SearchBar';
import TopRankWidget from '../components/TopRankWidget';

const activities = [
  { title: 'Arena Prismática', description: 'Desafios rápidos com ranking diário.', cta: 'Entrar' },
  { title: 'Missões da Névoa', description: 'Complete tarefas diárias e semanais.', cta: 'Ver Missões' },
  { title: 'Treino Temporal', description: 'Treinos AFK com recompensa progressiva.', cta: 'Treinar' },
  { title: 'Recompensa Diária', description: 'Calendário de 14 dias com bônus.', cta: 'Resgatar' },
];

const DashboardPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <SearchBar />
      <section className="card">
        <h2 className="text-lg font-semibold">Atividades Principais</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {activities.map((activity) => (
            <div key={activity.title} className="rounded-2xl bg-abyss-700 p-4">
              <h3 className="text-base font-semibold">{activity.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{activity.description}</p>
              <button className="mt-4 rounded-full bg-lumen/20 px-4 py-2 text-sm text-lumen">
                {activity.cta}
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Estação da Aurora</h3>
            <p className="text-sm text-slate-400">Encerramento em 04:12:45</p>
          </div>
          <div className="text-right text-sm text-slate-400">
            <p>Recompensa global: 3.500 Lúmen</p>
            <p>Meta de vitórias: 1.200</p>
          </div>
        </div>
        <div className="mt-4">
          <ContentTabs />
        </div>
      </section>
      <TopRankWidget />
    </div>
  </DashboardLayout>
);

export default DashboardPage;
