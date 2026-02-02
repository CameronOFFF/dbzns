import { PropsWithChildren } from 'react';
import SidebarMenu from './SidebarMenu';
import PlayerCard from './PlayerCard';

const DashboardLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-abyss-900 text-white">
    <header className="border-b border-abyss-800 bg-abyss-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-lumen">Chrona Rift</p>
          <h1 className="text-xl font-semibold">Painel da Fenda</h1>
        </div>
        <div className="text-sm text-slate-400">Aviso: temporada "Aurora Eclipse" termina em 04:12:45</div>
      </div>
    </header>
    <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr_260px]">
      <div className="space-y-6">
        <div className="card">
          <div className="h-32 rounded-xl bg-gradient-to-r from-abyss-700 to-abyss-600 flex items-center justify-center text-sm text-slate-300">
            Arte do mundo: Ilhas de Halcyon
          </div>
        </div>
        <PlayerCard />
      </div>
      <div>{children}</div>
      <div className="space-y-6">
        <SidebarMenu />
        <div className="card">
          <h3 className="text-sm uppercase tracking-widest text-slate-400">Notificações</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Daily Reward disponível.</li>
            <li>Evento "Ecos Lúmen" começa em 2h.</li>
            <li>3 convites de clã pendentes.</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
);

export default DashboardLayout;
