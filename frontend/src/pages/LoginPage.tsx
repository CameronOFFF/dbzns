import { Link } from 'react-router-dom';

const LoginPage = () => (
  <div className="min-h-screen bg-abyss-900 text-white flex items-center justify-center px-6">
    <div className="max-w-md w-full space-y-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.5em] text-lumen">Chrona Rift</p>
        <h1 className="text-3xl font-semibold">Entre na Fenda</h1>
        <p className="text-slate-400">RPG de navegador com energia cósmica e rivalidades épicas.</p>
      </div>
      <div className="card">
        <form className="space-y-4">
          <input
            className="w-full rounded-xl bg-abyss-700 px-4 py-3 text-sm text-slate-200 outline-none"
            placeholder="Email ou usuário"
          />
          <input
            className="w-full rounded-xl bg-abyss-700 px-4 py-3 text-sm text-slate-200 outline-none"
            placeholder="Senha"
            type="password"
          />
          <button className="w-full rounded-xl bg-lumen py-3 text-sm font-semibold text-abyss-900">
            Entrar
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>Esqueceu a senha?</span>
          <Link to="/register" className="text-lumen">Criar conta</Link>
        </div>
      </div>
    </div>
  </div>
);

export default LoginPage;
