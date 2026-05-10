import { useMemo } from 'react'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LiveWaveform from '../../../components/LiveWaveform'
import { mockAudioSessions } from '../../../mockData'

/** TODO: Stream signed URLs from storage */
export default function AudioPlayback({ tank }) {
  const sessions = useMemo(() => mockAudioSessions[tank.id] ?? [], [tank.id])

  const pick = sessions[0]

  return (
    <div className="d-flex flex-column gap-3">
      <div className="surface-card rounded-3 p-3">
        <div className="h6 mb-2">Recorded sessions</div>
        <ListGroup variant="flush">
          {sessions.map((s) => (
            <ListGroup.Item className="bg-transparent px-0 d-flex flex-wrap align-items-center justify-content-between gap-2 border-secondary">
              <div>
                <div className="fw-semibold font-mono-nums">{s.date}</div>
                <div className="small text-secondary">
                  Duration {s.duration} · {s.clicks} clicks · health {s.healthScore}
                </div>
              </div>
              <Button size="sm" variant="outline-primary">
                Play (mock)
              </Button>
            </ListGroup.Item>
          ))}
          {!sessions.length && <div className="text-secondary small">No archived sessions.</div>}
        </ListGroup>
      </div>

      {pick && (
        <Row className="g-3">
          <Col lg={6}>
            <div className="surface-card rounded-3 p-3">
              <div className="fw-semibold mb-2">Healthy session (reference)</div>
              <LiveWaveform label={`Session ${pick.date} · filtered preview`} color="var(--color-healthy)" filtered />
            </div>
          </Col>
          <Col lg={6}>
            <div className="surface-card rounded-3 p-3">
              <div className="fw-semibold mb-2">Abnormal session (contrast)</div>
              <LiveWaveform label="Synthetic low-activity profile" color="var(--color-coral)" filtered />
            </div>
          </Col>
        </Row>
      )}

    </div>
  )
}
