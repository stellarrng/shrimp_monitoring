import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import AlertThresholds from './AlertThresholds'
import UserPreferences from './UserPreferences'

export default function Settings() {
  return (
    <div className="page-root py-3">
      <div className="mb-3">
        <h1 className="h3 mb-1">Settings</h1>
        <div className="text-secondary small">Operational configuration · mock-backed</div>
      </div>

      <Tabs defaultActiveKey="alerts" justify variant="tabs" id="settings-tabs">
        <Tab eventKey="alerts" title="Alert Thresholds">
          <div className="pt-4">
            <AlertThresholds />
          </div>
        </Tab>
        <Tab eventKey="prefs" title="Preferences">
          <div className="pt-4">
            <UserPreferences />
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
