import Card from 'react-bootstrap/Card'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import HealthBadge from '../../components/HealthBadge'
import StatusDot from '../../components/StatusDot'
import { getBaselineSignalLevel, getSignalLevel, mockSessionHistory } from '../../mockData'

function statusLabel(status) {
  if (status === 'healthy') return 'Healthy'
  if (status === 'warning') return 'Warning'
  return 'Critical'
}

function scoreTone(score) {
  if (score >= 75) return 'var(--color-healthy)'
  if (score >= 50) return 'var(--color-warning)'
  return 'var(--color-critical)'
}

export default function TankCard({ tank }) {
  const navigate = useNavigate()
  const history = mockSessionHistory[tank.id] ?? []
  const spark = history.slice(-7).map((row) => ({ h: row.healthScore }))
  const signalLevel = getSignalLevel(tank)
  const baselineSignal = getBaselineSignalLevel(tank)

  return (
    <Card
      role="button"
      className="surface-card h-100"
      onClick={() => navigate(`/tank/${tank.id}`)}
    >
      <Card.Body className="d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div>
            <div className="h5 mb-1">{tank.name}</div>
            <div className="text-secondary small">{tank.species}</div>
          </div>
          <StatusDot status={tank.device?.esp32 === 'online' ? 'online' : 'offline'} pulse />
        </div>

        <div className="d-flex align-items-end gap-3 flex-wrap">
          <div className="flex-grow-1" style={{ minWidth: 140 }}>
            <div className="small text-secondary mb-1">Health score</div>
            <div className="display-5 font-mono-nums mb-0 lh-1" style={{ color: scoreTone(tank.healthScore) }}>
              {tank.healthScore}
            </div>
          </div>
          <div>
            <HealthBadge score={tank.healthScore} status={tank.status} />
            <div className="small text-secondary mt-2">{statusLabel(tank.status)}</div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-baseline small border-top border-secondary-subtle pt-2">
          <span className="text-secondary">Signal strength</span>
          <span className="font-mono-nums">
            {signalLevel.toFixed(1)} / <span className="text-secondary">{baselineSignal.toFixed(1)} normal</span>
          </span>
        </div>

        <div className="sparkline-wrap" style={{ height: 72 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spark}>
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  color: 'var(--color-text)',
                }}
              />
              <Line type="monotone" dataKey="h" stroke="var(--color-peach)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="d-flex gap-3 flex-wrap small text-secondary border-top border-secondary-subtle pt-2">
          <span className="font-mono-nums">{tank.temperature.toFixed(1)} °C</span>
          <span>pH {tank.pH.toFixed(2)}</span>
          <span>DO {tank.dissolvedOxygen.toFixed(1)} mg/L</span>
        </div>

        <div className="small text-secondary mt-auto">Updated {tank.lastUpdated}</div>
      </Card.Body>
    </Card>
  )
}
