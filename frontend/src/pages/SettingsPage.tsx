import DashboardLayout from '../components/DashboardLayout';

const SettingsPage = () => (
  <DashboardLayout>
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Configurações</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Segurança</h3>
          <p className="text-sm text-slate-300">Troca de senha, email e 2FA (TOTP).</p>
        </div>
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Preferências</h3>
          <p className="text-sm text-slate-300">Idioma, tema e notificações.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default SettingsPage;
