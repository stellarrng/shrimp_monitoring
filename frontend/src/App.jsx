import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
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
    <Container fluid className="p-0 overflow-x-hidden">
      <Navbar />
      <main className="min-vh-100">
        <AlertBanner />
        <Outlet />
      </main>
    </Container>
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
