const TopRankWidget = () => (
  <section className="card">
    <h3 className="text-sm uppercase tracking-widest text-slate-400">Top 5 da Temporada</h3>
    <ul className="mt-4 space-y-3 text-sm">
      {['Aurora Krynn', 'Vantor Lux', 'Mira Solen', 'Oris Vale', 'Kael Vey'].map((name, index) => (
        <li key={name} className="flex items-center justify-between">
          <span className="text-slate-200">#{index + 1} {name}</span>
          <span className="text-lumen">ELO {2100 - index * 90}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default TopRankWidget;
