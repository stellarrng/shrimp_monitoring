import { useMemo } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { LayoutGrid, Grid3x3 } from 'lucide-react'
import { useTankStore } from '../../store/tankStore'
import TankCard from './TankCard'
import MatrixView from './MatrixView'
import { useAlerts } from '../../hooks/useAlerts'

export default function Dashboard() {
  const tanks = useTankStore((s) => s.tanks)
  const viewMode = useTankStore((s) => s.viewMode)
  const setViewMode = useTankStore((s) => s.setViewMode)

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
        <ButtonGroup aria-label="View mode">
          <Button
            variant={viewMode === 'card' ? 'primary' : 'outline-secondary'}
            onClick={() => setViewMode('card')}
            className="d-flex align-items-center gap-2"
          >
            <LayoutGrid size={18} />
            Card view
          </Button>
          <Button
            variant={viewMode === 'matrix' ? 'primary' : 'outline-secondary'}
            onClick={() => setViewMode('matrix')}
            className="d-flex align-items-center gap-2"
          >
            <Grid3x3 size={18} />
            Matrix view
          </Button>
        </ButtonGroup>
      </div>

      {viewMode === 'matrix' ? (
        <MatrixView tanks={tanks} />
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
