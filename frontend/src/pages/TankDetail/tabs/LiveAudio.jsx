import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LiveWaveform from '../../../components/LiveWaveform'
import { useWebSocket } from '../../../hooks/useWebSocket'

/** TODO: connect to WebSocket for PCM frames */
export default function LiveAudio({ tank }) {
  useWebSocket()

  return (
    <div>
      <Row className="g-3 mb-3">
        <Col md={4}>
          <div className="surface-card rounded-3 p-3 h-100">
            <div className="small text-secondary">Live click estimate</div>
            <div className="display-6 font-mono-nums">{tank.clicksPerMinute}</div>
            <div className="small text-secondary">clicks / min (mock drift)</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="surface-card rounded-3 p-3 h-100">
            <div className="small text-secondary">Baseline</div>
            <div className="display-6 font-mono-nums">{tank.baselineClicks}</div>
            <div className="small text-secondary">clicks / min target</div>
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
