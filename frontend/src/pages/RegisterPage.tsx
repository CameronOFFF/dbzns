import { Link } from 'react-router-dom';

const RegisterPage = () => (
  <div className="min-h-screen bg-abyss-900 text-white flex items-center justify-center px-6">
    <div className="max-w-md w-full space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-lumen">Chrona Rift</p>
        <h1 className="text-3xl font-semibold">Criar Conta</h1>
        <p className="text-slate-400">Monte seu vínculo com a energia da fenda.</p>
      </div>
      <div className="card">
        <form className="space-y-4">
          <input className="w-full rounded-xl bg-abyss-700 px-4 py-3 text-sm" placeholder="Email" />
          <input className="w-full rounded-xl bg-abyss-700 px-4 py-3 text-sm" placeholder="Usuário" />
          <input
            className="w-full rounded-xl bg-abyss-700 px-4 py-3 text-sm"
            placeholder="Senha"
            type="password"
          />
          <button className="w-full rounded-xl bg-ember py-3 text-sm font-semibold text-abyss-900">
            Registrar
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>Já possui conta?</span>
          <Link to="/" className="text-lumen">Entrar</Link>
        </div>
      </div>
    </div>
  </div>
);

export default RegisterPage;
