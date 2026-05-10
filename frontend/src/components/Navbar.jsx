import Badge from 'react-bootstrap/Badge'
import Nav from 'react-bootstrap/Nav'
import { Activity, Bell, LayoutGrid, Settings as SettingsIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAlertStore } from '../store/alertStore'
import { mockUser } from '../services/auth'

function linkClassName({ isActive }) {
  return `d-flex align-items-center gap-2 py-2 px-3 rounded-2 text-decoration-none ${
    isActive ? 'active-nav-link text-body' : 'text-secondary'
  }`
}

export default function Navbar() {
  const count = useAlertStore((s) => s.alerts.length)

  return (
    <div className="p-3 p-md-4">
      <div className="mb-4">
        <div className="text-uppercase small text-secondary">Farm</div>
        <div className="h5 mb-0">{mockUser.farmName}</div>
        <div className="text-secondary small mt-1">Shrimp Acoustic Monitor</div>
      </div>

      <Nav className="flex-column gap-1" activeKey={undefined}>
        <Nav.Link as={NavLink} end to="/" className={linkClassName}>
          <LayoutGrid size={18} />
          Dashboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/alerts" className={linkClassName}>
          <Bell size={18} />
          <span className="flex-grow-1 text-start">Alerts</span>
          {count > 0 && (
            <Badge bg="danger" pill>
              {count}
            </Badge>
          )}
        </Nav.Link>
        <Nav.Link as={NavLink} to="/settings" className={linkClassName}>
          <SettingsIcon size={18} />
          Settings
        </Nav.Link>
      </Nav>

      <hr className="border-secondary opacity-25 my-4" />

      <div className="d-none d-md-flex align-items-center gap-2 text-secondary small">
        <Activity size={16} />
        <span className="font-mono-nums">Telemetry: mock</span>
      </div>
    </div>
  )
}
