import { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { mockUser } from '../../services/auth'

function savePreferencesDraft() {
}

export default function UserPreferences() {
  const [farmName, setFarmName] = useState(mockUser.farmName)
  const [email, setEmail] = useState(mockUser.email)
  const [emailAlerts, setEmailAlerts] = useState(mockUser.emailAlerts)
  const [browserAlerts, setBrowserAlerts] = useState(mockUser.browserNotifications)
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-bs-theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [theme])

  return (
    <div className="d-flex flex-column gap-4">
      <div className="surface-card rounded-3 p-3">
        <Form.Group className="mb-3">
          <Form.Label>Farm name</Form.Label>
          <Form.Control value={farmName} onChange={(e) => setFarmName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Notifications email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Check
          id="pref-email-alerts"
          type="switch"
          label="Email alerts"
          checked={emailAlerts}
          onChange={(e) => setEmailAlerts(e.target.checked)}
          className="mb-2"
        />
        <Form.Check
          id="pref-browser-alerts"
          type="switch"
          label="Browser notifications"
          checked={browserAlerts}
          onChange={(e) => setBrowserAlerts(e.target.checked)}
        />

        <div className="mt-3 border-top pt-3">
          <div className="h6 mb-2">Appearance</div>
          <ButtonGroupTheme theme={theme} setTheme={setTheme} />
        </div>

        <Button variant="primary" className="mt-4" type="button" onClick={savePreferencesDraft}>
          Save
        </Button>
      </div>
    </div>
  )
}

function ButtonGroupTheme({ theme, setTheme }) {
  return (
    <div>
      <div className="d-flex gap-3 flex-wrap align-items-center">
        <span className="small text-secondary me-2">Theme</span>
        <Button size="sm" variant={theme === 'light' ? 'primary' : 'outline-secondary'} onClick={() => setTheme('light')}>
          Light
        </Button>
        <Button size="sm" variant={theme === 'dark' ? 'primary' : 'outline-secondary'} onClick={() => setTheme('dark')}>
          Dark
        </Button>
      </div>
    </div>
  )
}
