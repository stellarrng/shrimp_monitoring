import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import AlertBanner from './components/AlertBanner'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard/index'
import TankDetail from './pages/TankDetail/index'
import Alerts from './pages/Alerts/index'
import Settings from './pages/Settings/index'
import { useWebSocket } from './hooks/useWebSocket'

function AppShell() {
  useWebSocket()
  return (
    <div className="app-viewport overflow-x-hidden">
      <Navbar />
      <AlertBanner />
      <div className="app-shell">
        <main className="app-shell-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tank/:id" element={<TankDetail />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
