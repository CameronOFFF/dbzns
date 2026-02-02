import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ArenaPage from './pages/ArenaPage';
import QuestsPage from './pages/QuestsPage';
import SagasPage from './pages/SagasPage';
import ShopPage from './pages/ShopPage';
import ClanPage from './pages/ClanPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';

const App = () => (
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/arena" element={<ArenaPage />} />
    <Route path="/quests" element={<QuestsPage />} />
    <Route path="/sagas" element={<SagasPage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/clan" element={<ClanPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
);

export default App;
