import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import StatusPill from '../../components/StatusPill'
import StatusDot from '../../components/StatusDot'
import { getBaselineSignalLevel, getSignalLevel, mockSessionHistory } from '../../mockData'

function scoreTone(score) {
  if (score >= 75) return 'var(--color-healthy)'
  if (score >= 50) return 'var(--color-warning)'
  return 'var(--color-critical)'
}

function footerStripClass(status) {
  if (status === 'healthy') return 'tank-card-footer-strip tank-card-footer-strip--healthy'
  if (status === 'warning') return 'tank-card-footer-strip tank-card-footer-strip--warning'
  return 'tank-card-footer-strip tank-card-footer-strip--critical'
}

export default function TankCard({ tank }) {
  const navigate = useNavigate()
  const history = mockSessionHistory[tank.id] ?? []
  const spark = history.slice(-7).map((row) => ({ h: row.healthScore }))
  const signalLevel = getSignalLevel(tank)
  const baselineSignal = getBaselineSignalLevel(tank)
  const online = tank.device?.esp32 === 'online'

  return (
    <Card role="button" className="surface-card h-100 overflow-hidden" onClick={() => navigate(`/tank/${tank.id}`)}>
      <Card.Body className="d-flex flex-column gap-3 pb-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <div className="min-w-0">
            <div className="h5 mb-1">{tank.name}</div>
            <div className="text-secondary small">{tank.species}</div>
          </div>
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <StatusPill status={tank.status} />
            <StatusDot status={online ? 'online' : 'offline'} pulse={online} />
          </div>
        </div>

        <div>
          <div className="small text-secondary mb-1">Health score</div>
          <div className="d-flex flex-wrap align-items-baseline gap-1 font-mono-nums">
            <span className="display-5 fw-bold mb-0 lh-1" style={{ color: scoreTone(tank.healthScore) }}>
              {tank.healthScore}
            </span>
            <span className="fs-4 text-secondary fw-normal">/ 100</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-baseline small border-top border-secondary-subtle pt-2">
          <span className="text-secondary">Signal strength</span>
          <span className="font-mono-nums">
            {signalLevel.toFixed(1)} / <span className="text-secondary">{baselineSignal.toFixed(1)} normal</span>
          </span>
        </div>

        <div className="sparkline-wrap" style={{ height: 80 }}>
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

        <div className="small text-secondary mt-auto">Updated {tank.lastUpdated}</div>
      </Card.Body>

      <div className={footerStripClass(tank.status)}>
        <Row className="g-0 text-center small tank-card-footer-row">
          <Col xs={4} className="tank-card-footer-cell">
            <div className="tank-card-footer-label">Temp</div>
            <div className="tank-card-footer-value font-mono-nums">{tank.temperature.toFixed(1)}°C</div>
          </Col>
          <Col xs={4} className="tank-card-footer-cell">
            <div className="tank-card-footer-label">pH</div>
            <div className="tank-card-footer-value font-mono-nums">{tank.pH.toFixed(2)}</div>
          </Col>
          <Col xs={4} className="tank-card-footer-cell">
            <div className="tank-card-footer-label">DO</div>
            <div className="tank-card-footer-value font-mono-nums">{tank.dissolvedOxygen.toFixed(1)} mg/L</div>
          </Col>
        </Row>
      </div>
    </Card>
  )
}
