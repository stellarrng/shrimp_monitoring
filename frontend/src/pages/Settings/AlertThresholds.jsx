import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { defaultThresholds as initial } from '../../mockData'

export default function AlertThresholds() {
  const [draft, setDraft] = useState(initial)
  const [saved, setSaved] = useState(false)

  return (
    <div className="d-flex flex-column gap-4">
      <div className="surface-card rounded-3 p-3">
        <div className="h6 mb-3">Acoustic deviations</div>
        <Row className="g-3">
          <Col md={4}>
            <Form.Label className="small text-secondary">Low alert threshold (% vs baseline)</Form.Label>
            <Form.Control
              type="number"
              value={draft.lowPct}
              onChange={(e) => setDraft((p) => ({ ...p, lowPct: Number(e.target.value) }))}
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small text-secondary">Medium alert threshold (% vs baseline)</Form.Label>
            <Form.Control
              type="number"
              value={draft.mediumPct}
              onChange={(e) => setDraft((p) => ({ ...p, mediumPct: Number(e.target.value) }))}
            />
          </Col>
          <Col md={4}>
            <Form.Label className="small text-secondary">Critical alert threshold (% vs baseline)</Form.Label>
            <Form.Control
              type="number"
              value={draft.criticalPct}
              onChange={(e) => setDraft((p) => ({ ...p, criticalPct: Number(e.target.value) }))}
            />
          </Col>
        </Row>
      </div>

      <div className="surface-card rounded-3 p-3">
        <div className="h6 mb-3">Environmental envelopes</div>
        <Row className="g-3">
          <Col md={3}>
            <Form.Label className="small text-secondary">Temp min °C</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={draft.tempMin}
              onChange={(e) => setDraft((p) => ({ ...p, tempMin: Number(e.target.value) }))}
            />
          </Col>
          <Col md={3}>
            <Form.Label className="small text-secondary">Temp max °C</Form.Label>
            <Form.Control
              type="number"
              step="0.1"
              value={draft.tempMax}
              onChange={(e) => setDraft((p) => ({ ...p, tempMax: Number(e.target.value) }))}
            />
          </Col>
          <Col md={3}>
            <Form.Label className="small text-secondary">pH min</Form.Label>
            <Form.Control type="number" step="0.01" value={draft.phMin} onChange={(e) => setDraft((p) => ({ ...p, phMin: Number(e.target.value) }))} />
          </Col>
          <Col md={3}>
            <Form.Label className="small text-secondary">pH max</Form.Label>
            <Form.Control type="number" step="0.01" value={draft.phMax} onChange={(e) => setDraft((p) => ({ ...p, phMax: Number(e.target.value) }))} />
          </Col>
          <Col md={6}>
            <Form.Label className="small text-secondary">Dissolved oxygen minimum (mg/L)</Form.Label>
            <Form.Control type="number" step="0.1" value={draft.doMin} onChange={(e) => setDraft((p) => ({ ...p, doMin: Number(e.target.value) }))} />
          </Col>
        </Row>
      </div>

      <Button
        variant="primary"
        type="button"
        onClick={() => {
          setSaved(true)
          window.setTimeout(() => setSaved(false), 2500)
        }}
      >
        Save
      </Button>

      {saved && (
        <Alert variant="success" className="mt-3 mb-0">
          Thresholds stored locally (mock). Summary: {draft.lowPct}/{draft.mediumPct}/{draft.criticalPct}% · Temp {draft.tempMin}–{draft.tempMax} °C · pH {draft.phMin}–{draft.phMax} · DO &gt;{' '}
          {draft.doMin}
        </Alert>
      )}
    </div>
  )
}
