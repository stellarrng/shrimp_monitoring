import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
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
      <Row className="g-0 flex-column flex-md-row">
        <Col xs={12} md={3} lg={2} className="sidebar-col border-secondary border-opacity-25">
          <Navbar />
        </Col>
        <Col className="min-vh-100">
          <AlertBanner />
          <Outlet />
        </Col>
      </Row>
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
