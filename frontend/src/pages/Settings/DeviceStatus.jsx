import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useTankStore } from '../../store/tankStore'
import StatusDot from '../../components/StatusDot'

function wifiPct(db) {
  if (db === null || db === undefined || Number.isNaN(db)) return 0
  const worst = -90
  const best = -40
  const clamped = Math.max(worst, Math.min(best, db))
  return Math.round(((clamped - worst) / (best - worst)) * 100)
}

/** TODO: ingest device telemetry from fleet API */
export default function DeviceStatus() {
  const tanks = useTankStore((s) => s.tanks)
  const [tick, setTick] = useState(0)

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="h6 mb-0">Edge devices</div>
        <Button size="sm" variant="outline-primary" type="button" onClick={() => setTick((t) => t + 1)}>
          Refresh
        </Button>
      </div>

      <div className="surface-card rounded-3 p-3">
        <div className="table-responsive">
          <Table hover size="sm" key={tick} className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Tank</th>
                <th className="text-center">ESP32</th>
                <th className="text-center">Mic</th>
                <th>WiFi</th>
                <th className="text-end">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {tanks.map((t) => (
                <tr key={t.id}>
                  <td className="fw-semibold">{t.name}</td>
                  <td className="text-center">
                    <div className="d-inline-flex justify-content-center">
                      <StatusDot status={t.device?.esp32 === 'offline' ? 'offline' : 'online'} pulse={t.device?.esp32 !== 'offline'} />
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="d-inline-flex justify-content-center">
                      <StatusDot
                        pulse={false}
                        status={t.device?.mic === 'warning' ? 'warning' : t.device?.mic === 'offline' ? 'offline' : 'online'}
                      />
                    </div>
                  </td>
                  <td style={{ minWidth: 220 }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small font-mono-nums">{t.device?.wifi ?? '—'} dBm</span>
                      <div className="flex-grow-1">
                        <ProgressBar now={wifiPct(t.device?.wifi)} variant="warning" visuallyHidden />
                      </div>
                    </div>
                  </td>
                  <td className="text-end font-mono-nums">{t.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}
