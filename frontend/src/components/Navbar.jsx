import Badge from 'react-bootstrap/Badge'
import Nav from 'react-bootstrap/Nav'
import { Bell, LayoutGrid, Settings as SettingsIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAlertStore } from '../store/alertStore'
import { mockUser } from '../services/auth'

function linkClassName({ isActive }) {
  return `d-flex align-items-center justify-content-center gap-3 py-2 px-3 rounded-3 text-decoration-none ${
    isActive ? 'active-nav-link text-body' : 'text-secondary'
  }`
}

export default function Navbar() {
  const count = useAlertStore((s) => s.alerts.length)

  return (
    <header className="top-nav border-bottom border-secondary border-opacity-25">
      <div className="top-nav-inner">
        <div className="top-nav-brand">
          <div className="text-uppercase small text-secondary">Farm</div>
          <div className="h5 mb-0">{mockUser.farmName}</div>
          <div className="text-secondary small mt-1">Shrimp Acoustic Monitor</div>
        </div>

        <Nav className="top-nav-links gap-2" activeKey={undefined}>
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
