import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Button from 'react-bootstrap/Button'
import { ArrowLeft } from 'lucide-react'
import { useTankData } from '../../hooks/useTankData'
import StatusPill from '../../components/StatusPill'
import TrendGraphs from './tabs/TrendGraphs'
import Calibration from './tabs/Calibration'
import Environmental from './tabs/Environmental'

export default function TankDetail() {
  const { id } = useParams()
  const tank = useTankData(id)

  const tabItems = useMemo(
    () => [
      { key: 'trends', title: 'Trends', Comp: TrendGraphs },
      { key: 'env', title: 'Environment', Comp: Environmental },
      { key: 'cal', title: 'Calibration', Comp: Calibration },
    ],
    [],
  )

  if (!tank) {
    return (
      <div className="py-5 text-center">
        <p className="text-secondary">Tank not found.</p>
        <Button as={Link} to="/" variant="primary">
          Back to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="page-root py-3">
      <nav className="tank-detail-crumb mb-3" aria-label="Breadcrumb">
        <div className="d-flex align-items-center flex-wrap gap-1 gap-sm-2 small">
          <Link to="/" className="tank-detail-crumb-back d-inline-flex align-items-center gap-1 text-decoration-none">
            <ArrowLeft size={16} strokeWidth={2} aria-hidden />
            <span>Dashboard</span>
          </Link>
          <span className="text-secondary opacity-75" aria-hidden>
            &gt;
          </span>
          <span className="text-body fw-semibold">{tank.name}</span>
        </div>
      </nav>

      <div className="d-flex flex-column flex-md-row gap-3 align-items-md-start justify-content-md-between mb-3">
        <div>
          <h1 className="h3 mb-1">{tank.name}</h1>
          <div className="text-secondary">{tank.species}</div>
        </div>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <div className="small text-secondary mb-1">Health score</div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="display-6 font-mono-nums mb-0 fw-bold">{tank.healthScore}</span>
              <span className="fs-4 text-secondary">/ 100</span>
              <StatusPill status={tank.status} />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="trends" id="tank-detail-tabs" className="mb-3" justify variant="tabs">
        {tabItems.map(({ key, title, Comp }) => (
          <Tab key={key} eventKey={key} title={title}>
            <div className="pt-3">
              <Comp tank={tank} key={`${key}-${tank.id}`} />
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  )
}
