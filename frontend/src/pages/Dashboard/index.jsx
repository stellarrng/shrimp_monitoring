import { useMemo } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useTankStore } from '../../store/tankStore'
import TankCard from './TankCard'
import { useAlerts } from '../../hooks/useAlerts'

function tanksMatchingQuery(allTanks, rawQuery) {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return allTanks
  return allTanks.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.species.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q),
  )
}

export default function Dashboard() {
  const allTanks = useTankStore((s) => s.tanks)
  const searchQuery = useTankStore((s) => s.tankSearchQuery)
  const tanks = useMemo(() => tanksMatchingQuery(allTanks, searchQuery), [allTanks, searchQuery])
  const activeAlerts = useAlerts('all')

  const stats = useMemo(() => {
    const healthy = allTanks.filter((t) => t.status === 'healthy').length
    const warning = allTanks.filter((t) => t.status === 'warning').length
    const critical = allTanks.filter((t) => t.status === 'critical').length
    const avg =
      allTanks.length === 0 ? 0 : Math.round(allTanks.reduce((s, t) => s + (t.healthScore ?? 0), 0) / allTanks.length)
    return {
      tanks: allTanks.length,
      alerts: activeAlerts.filter((a) => !a.resolved).length,
      healthy,
      warning,
      critical,
      avg,
    }
  }, [allTanks, activeAlerts])

  return (
    <div className="page-root py-3">
      <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-lg-between mb-3">
        <div>
          <h1 className="h3 mb-1">Dashboard</h1>
          <div className="text-secondary small font-mono-nums">
            {stats.tanks} tanks · {stats.alerts} active alerts
            {searchQuery.trim() ? (
              <span className="ms-2">
                · showing {tanks.length} match{tanks.length === 1 ? '' : 'es'}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Row className="g-3 mb-4" xs={2} lg={4}>
        <Col>
          <div className="dash-stat-cell">
            <div className="dash-stat-label">Healthy</div>
            <div className="dash-stat-value font-mono-nums" style={{ color: '#166534' }}>
              {stats.healthy}
            </div>
          </div>
        </Col>
        <Col>
          <div className="dash-stat-cell">
            <div className="dash-stat-label">Warning</div>
            <div className="dash-stat-value font-mono-nums" style={{ color: '#92400e' }}>
              {stats.warning}
            </div>
          </div>
        </Col>
        <Col>
          <div className="dash-stat-cell">
            <div className="dash-stat-label">Critical</div>
            <div className="dash-stat-value font-mono-nums text-danger">{stats.critical}</div>
          </div>
        </Col>
        <Col>
          <div className="dash-stat-cell">
            <div className="dash-stat-label">Avg score</div>
            <div className="dash-stat-value font-mono-nums">{stats.avg}</div>
          </div>
        </Col>
      </Row>

      {tanks.length === 0 && searchQuery.trim() ? (
        <p className="text-secondary mb-0">
          No tanks match &quot;{searchQuery.trim()}&quot;. Try another name, species, or tank id.
        </p>
      ) : tanks.length === 0 ? (
        <p className="text-secondary mb-0">No tanks in this fleet.</p>
      ) : (
        <Row xs={1} md={2} xl={3} className="g-4">
          {tanks.map((tank) => (
            <Col key={tank.id}>
              <TankCard tank={tank} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
