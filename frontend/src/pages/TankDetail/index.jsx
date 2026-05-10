import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Button from 'react-bootstrap/Button'
import { ArrowLeft } from 'lucide-react'
import { useTankData } from '../../hooks/useTankData'
import HealthBadge from '../../components/HealthBadge'
import LiveAudio from './tabs/LiveAudio'
import FFTAnalysis from './tabs/FFTAnalysis'
import TrendGraphs from './tabs/TrendGraphs'
import Calibration from './tabs/Calibration'
import AudioPlayback from './tabs/AudioPlayback'
import Environmental from './tabs/Environmental'

function statusLabel(status) {
  if (status === 'healthy') return 'Healthy'
  if (status === 'warning') return 'Warning'
  return 'Critical'
}

export default function TankDetail() {
  const { id } = useParams()
  const tank = useTankData(id)

  const tabItems = useMemo(
    () => [
      { key: 'live', title: 'Live Audio', Comp: LiveAudio },
      { key: 'fft', title: 'FFT Analysis', Comp: FFTAnalysis },
      { key: 'trends', title: 'Trends', Comp: TrendGraphs },
      { key: 'cal', title: 'Calibration', Comp: Calibration },
      { key: 'play', title: 'Playback', Comp: AudioPlayback },
      { key: 'env', title: 'Environment', Comp: Environmental },
    ],
    [],
  )

  if (!tank) {
    return (
      <div className="p-4">
        <p className="text-secondary">Tank not found.</p>
        <Button as={Link} to="/" variant="primary">
          Back to dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="p-3 p-md-4">
      <div className="small text-secondary mb-2">
        <Link className="text-decoration-none text-secondary" to="/">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>{tank.name}</span>
      </div>

      <div className="d-flex flex-column flex-md-row gap-3 align-items-md-start justify-content-md-between mb-3">
        <div>
          <Button as={Link} to="/" variant="outline-secondary" size="sm" className="mb-2 d-inline-flex align-items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 className="h3 mb-1">{tank.name}</h1>
          <div className="text-secondary">{tank.species}</div>
        </div>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <div className="small text-secondary">Health</div>
            <div className="d-flex align-items-center gap-2">
              <span className="display-6 font-mono-nums mb-0">{tank.healthScore}</span>
              <HealthBadge score={tank.healthScore} status={tank.status} />
            </div>
            <div className="small text-secondary mt-1">{statusLabel(tank.status)}</div>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="live" id="tank-detail-tabs" className="mb-3" justify variant="tabs">
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
