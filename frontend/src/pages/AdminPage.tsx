import DashboardLayout from '../components/DashboardLayout';

const AdminPage = () => (
  <DashboardLayout>
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Admin Console</h2>
      <p className="text-sm text-slate-300">
        Gerencie usuários, personagens, itens, quests e eventos com auditoria completa.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Ações rápidas</h3>
          <ul className="mt-2 text-sm text-slate-300 space-y-1">
            <li>Banir / Mutar usuário</li>
            <li>Editar moedas e stamina</li>
            <li>Enviar recompensas globais</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Auditoria</h3>
          <p className="text-sm text-slate-300">Filtre por usuário, período e tipo de ação.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminPage;
