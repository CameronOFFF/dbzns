import DashboardLayout from '../components/DashboardLayout';

const ShopPage = () => (
  <DashboardLayout>
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold">Loja & Cosméticos</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Loja Aurum</h3>
          <p className="text-sm text-slate-300">Consumíveis e materiais básicos.</p>
        </div>
        <div className="rounded-2xl bg-abyss-700 p-4">
          <h3 className="font-semibold">Loja Lúmen</h3>
          <p className="text-sm text-slate-300">Pacotes premium e skins exclusivas.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default ShopPage;
