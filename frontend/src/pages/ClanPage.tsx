import DashboardLayout from '../components/DashboardLayout';

const ClanPage = () => (
  <DashboardLayout>
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Clã e Equipe</h2>
      <p className="text-sm text-slate-300">
        Crie ou junte-se a um clã para desbloquear bônus de treino, chat exclusivo e ranking coletivo.
      </p>
      <div className="rounded-2xl bg-abyss-700 p-4">
        <h3 className="font-semibold">Benefícios</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
          <li>+3% XP em treinos.</li>
          <li>Banco de clã com logs e contribuições.</li>
          <li>Quadro de avisos interno.</li>
        </ul>
      </div>
    </div>
  </DashboardLayout>
);

export default ClanPage;
