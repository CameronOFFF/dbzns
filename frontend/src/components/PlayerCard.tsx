const PlayerCard = () => (
  <section className="card glow">
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-lumen to-ember flex items-center justify-center font-bold">
        CR
      </div>
      <div>
        <p className="text-lg font-semibold">Nova Lys</p>
        <p className="text-sm text-slate-400">Classe: Aetherion · Nível 12</p>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="text-slate-400">HP</p>
        <p className="font-semibold">920</p>
      </div>
      <div>
        <p className="text-slate-400">KI</p>
        <p className="font-semibold">310</p>
      </div>
      <div>
        <p className="text-slate-400">Stamina</p>
        <p className="font-semibold">78%</p>
      </div>
      <div>
        <p className="text-slate-400">Moedas</p>
        <p className="font-semibold text-aurum">4.200 Aurum</p>
      </div>
    </div>
    <div className="mt-4 text-xs text-slate-400">
      Força 28 · Defesa 22 · Velocidade 31 · Resiliência 26 · Crítico 8% · Dano Crítico 45%
    </div>
  </section>
);

export default PlayerCard;
