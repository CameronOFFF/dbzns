import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  ShieldCheckIcon,
  FireIcon,
  SparklesIcon,
  TrophyIcon,
  MapIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Squares2X2Icon },
  { name: 'Desafios', path: '/arena', icon: ShieldCheckIcon },
  { name: 'Torneio', path: '/arena', icon: TrophyIcon },
  { name: 'Sagas', path: '/sagas', icon: MapIcon },
  { name: 'Especial', path: '/quests', icon: SparklesIcon },
  { name: 'Arena', path: '/arena', icon: FireIcon },
  { name: 'Quests', path: '/quests', icon: ShieldCheckIcon },
  { name: 'Loja', path: '/shop', icon: ShoppingBagIcon },
  { name: 'Equipe/Clã', path: '/clan', icon: UsersIcon },
  { name: 'Config', path: '/settings', icon: Cog6ToothIcon },
  { name: 'Suporte', path: '/settings', icon: QuestionMarkCircleIcon },
];

const SidebarMenu = () => (
  <aside className="flex flex-col gap-3 rounded-2xl bg-abyss-800/90 p-4 border border-abyss-700">
    <h3 className="text-sm uppercase tracking-widest text-abyss-600">Navegação</h3>
    <div className="flex flex-col gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
              isActive ? 'bg-lumen/20 text-lumen' : 'text-slate-200 hover:bg-abyss-700'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          {item.name}
        </NavLink>
      ))}
    </div>
  </aside>
);

export default SidebarMenu;
