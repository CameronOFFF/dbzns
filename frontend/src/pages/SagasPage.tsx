import DashboardLayout from '../components/DashboardLayout';

const chapters = [
  { title: 'Portões de Halcyon', desc: 'Nível mínimo 1 · Energia 10' },
  { title: 'Coração da Névoa', desc: 'Nível mínimo 4 · Energia 15' },
  { title: 'Eclipse de Lúmen', desc: 'Nível mínimo 8 · Energia 25' },
];

const SagasPage = () => (
  <DashboardLayout>
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Sagas Originais</h2>
      {chapters.map((chapter) => (
        <div key={chapter.title} className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">{chapter.title}</h3>
          <p className="text-sm text-slate-300">{chapter.desc}</p>
          <p className="mt-2 text-xs text-slate-400">
            "As ruínas vibram quando a fenda revela seus guardiões."
          </p>
        </div>
      ))}
    </div>
  </DashboardLayout>
);

export default SagasPage;
