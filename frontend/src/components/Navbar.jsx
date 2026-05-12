import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav'
import { Bell, LayoutGrid, Search, Settings as SettingsIcon } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAlertStore } from '../store/alertStore'
import { useTankStore } from '../store/tankStore'
import { mockUser } from '../services/auth'

function linkClassName({ isActive }) {
  return `d-flex align-items-center gap-2 text-decoration-none ${
    isActive ? 'active-nav-link text-body' : 'text-secondary'
  }`
}

export default function Navbar() {
  const count = useAlertStore((s) => s.alerts.length)
  const query = useTankStore((s) => s.tankSearchQuery)
  const setTankSearchQuery = useTankStore((s) => s.setTankSearchQuery)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <header className="top-nav border-bottom border-secondary border-opacity-25">
      <div className="top-nav-inner">
        <div className="top-nav-identity">
          <img src="/shrimpy.png" alt="" className="top-nav-logo" width={100} height={100} />
          <div className="top-nav-brand">
            <div className="h5 mb-0 fw-semibold">{mockUser.farmName}</div>
            <div className="text-secondary small mt-1">Shrimp Acoustic Monitor</div>
          </div>
        </div>

        <Form
          className="top-nav-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            if (pathname !== '/') navigate('/')
          }}
        >
          <Search className="top-nav-search-icon" size={18} strokeWidth={2} aria-hidden />
          <Form.Control
            type="search"
            className="top-nav-search-input"
            placeholder="Search tanks…"
            value={query}
            onChange={(e) => setTankSearchQuery(e.target.value)}
            aria-label="Search tanks"
          />
        </Form>

        <Nav className="top-nav-links" activeKey={undefined}>
          <Nav.Link as={NavLink} end to="/" className={linkClassName}>
            <LayoutGrid size={18} />
            Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/alerts" className={linkClassName}>
            <Bell size={18} />
            <span className="flex-grow-1 text-start">Alerts</span>
            {count > 0 && (
              <Badge bg="danger" pill className="top-nav-badge">
                {count}
              </Badge>
            )}
          </Nav.Link>
          <Nav.Link as={NavLink} to="/settings" className={linkClassName}>
            <SettingsIcon size={18} />
            Settings
          </Nav.Link>
        </Nav>
      </div>
    </header>
  )
}
