import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LiveWaveform from '../../../components/LiveWaveform'
import { useWebSocket } from '../../../hooks/useWebSocket'
import { getBaselineSignalLevel, getSignalLevel } from '../../../mockData'

/** TODO: connect to WebSocket for PCM frames */
export default function LiveAudio({ tank }) {
  useWebSocket()
  const signalLevel = getSignalLevel(tank)
  const baselineSignal = getBaselineSignalLevel(tank)

  return (
    <div>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <div className="surface-card rounded-3 p-3 h-100">
            <div className="small text-secondary">Live sound signal</div>
            <div className="display-6 font-mono-nums">{signalLevel.toFixed(1)}</div>
            <div className="small text-secondary">signal strength</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="surface-card rounded-3 p-3 h-100">
            <div className="small text-secondary">Baseline</div>
            <div className="display-6 font-mono-nums">{baselineSignal.toFixed(1)}</div>
            <div className="small text-secondary">normal signal strength</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="surface-card rounded-3 p-3 h-100">
            <div className="small text-secondary">Device</div>
            <div className="h4 font-mono-nums text-capitalize">{tank.device?.mic}</div>
            <div className="small text-secondary">microphone path</div>
          </div>
        </Col>
      </Row>

      <div className="d-flex flex-column gap-3">
        <LiveWaveform label="Raw Signal" color="var(--color-coral)" filtered={false} />
        <LiveWaveform
          label="Filtered Signal (1kHz–48kHz bandpass)"
          color="var(--color-peach)"
          filtered
        />
      </div>
    </div>
  )
}
