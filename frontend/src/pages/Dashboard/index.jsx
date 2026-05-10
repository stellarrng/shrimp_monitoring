import { useMemo } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useTankStore } from '../../store/tankStore'
import TankCard from './TankCard'
import { useAlerts } from '../../hooks/useAlerts'

export default function Dashboard() {
  const tanks = useTankStore((s) => s.tanks)

  const activeAlerts = useAlerts('all')

  const stats = useMemo(
    () => ({
      tanks: tanks.length,
      alerts: activeAlerts.filter((a) => !a.resolved).length,
    }),
    [tanks.length, activeAlerts],
  )

  return (
    <div className="p-3 p-md-4">
      <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-center justify-content-lg-between mb-4">
        <div>
          <h1 className="h3 mb-1">Farm Dashboard</h1>
          <div className="text-secondary small font-mono-nums">
            {stats.tanks} tanks · <span>{stats.alerts}</span> active alerts
          </div>
        </div>
      </div>

      <Row xs={1} md={2} xl={3} className="g-4">
        {tanks.map((tank) => (
          <Col key={tank.id}>
            <TankCard tank={tank} />
          </Col>
        ))}
      </Row>
    </div>
  )
}
