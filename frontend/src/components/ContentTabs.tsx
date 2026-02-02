import { Tab } from '@headlessui/react';
import clsx from 'clsx';

const tabs = [
  { label: 'Arena', content: 'Desafios rápidos contra rivais com ranking ativo.' },
  { label: 'Quests', content: 'Missões diárias e semanais com recompensas escalonadas.' },
  { label: 'Sagas', content: 'História episódica com capítulos e cutscenes originais.' },
];

const ContentTabs = () => (
  <Tab.Group>
    <Tab.List className="flex gap-2">
      {tabs.map((tab) => (
        <Tab
          key={tab.label}
          className={({ selected }) =>
            clsx(
              'rounded-full px-4 py-2 text-sm',
              selected ? 'bg-lumen/20 text-lumen' : 'bg-abyss-700 text-slate-200'
            )
          }
        >
          {tab.label}
        </Tab>
      ))}
    </Tab.List>
    <Tab.Panels className="mt-4">
      {tabs.map((tab) => (
        <Tab.Panel key={tab.label} className="text-sm text-slate-300">
          {tab.content}
        </Tab.Panel>
      ))}
    </Tab.Panels>
  </Tab.Group>
);

export default ContentTabs;
