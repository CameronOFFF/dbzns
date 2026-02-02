import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const mockItems = [
  'Missão Eco das Ruínas',
  'Item Elixir Prisma',
  'Jogador Aurora Krynn',
  'Habilidade Fenda Astral',
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const results = mockItems.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl bg-abyss-800 px-4 py-3 border border-abyss-700">
        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
        <input
          className="w-full bg-transparent text-sm text-slate-200 outline-none"
          placeholder="Buscar missões, itens, jogadores, habilidades..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {query && (
        <div className="absolute z-20 mt-2 w-full rounded-xl bg-abyss-800 border border-abyss-700 p-3 text-sm">
          {results.length === 0 ? (
            <p className="text-slate-400">Nenhum resultado.</p>
          ) : (
            <ul className="space-y-2">
              {results.map((result) => (
                <li key={result} className="text-slate-200">
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
