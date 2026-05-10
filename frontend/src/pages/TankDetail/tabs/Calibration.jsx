import { useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import { mockCalibrationEvents, getCalibrationSessionsForTank } from '../../../mockData'
import { useTankStore } from '../../../store/tankStore'

/** TODO: POST calibration milestones to backend */
export default function Calibration({ tank }) {
  const updateTank = useTankStore((s) => s.updateTank)
  const [events, setEvents] = useState(() => [...(mockCalibrationEvents[tank.id] ?? [])])
  const [showModal, setShowModal] = useState(false)
  const [note, setNote] = useState('')

  const progress = useMemo(() => Math.round(((tank.calibrationDay ?? 0) / 14) * 100), [tank])

  const sessions = useMemo(() => getCalibrationSessionsForTank(tank), [tank])

  const baselineValue = tank.calibrationComplete ? Math.round((tank.baselineClicks || 18) * 11.5 + 72) : null

  const addEvent = () => {
    if (!note.trim()) return
    setEvents((prev) => [...prev, { date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), event: note.trim(), type: 'user' }])
    setNote('')
    setShowModal(false)
  }

  const resetCalibration = () => {
    const ok = window.confirm('Reset calibration for this tank? This is a destructive mock action.')
    if (!ok) return
    updateTank(tank.id, { calibrationDay: 1, calibrationComplete: false })
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="surface-card rounded-3 p-3">
        <div className="d-flex flex-wrap justify-content-between gap-2 align-items-start">
          <div>
            <div className="h6 mb-1">Calibration status</div>
            <div className="text-secondary small">
              {tank.calibrationComplete
                ? 'Baseline locked — anomaly detection armed'
                : `Day ${tank.calibrationDay} of 14 — baseline building`}
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              Mark event
            </Button>
            <Button variant="outline-danger" size="sm" onClick={resetCalibration}>
              Reset calibration
            </Button>
          </div>
        </div>
        <ProgressBar now={progress} className="mt-3" variant={tank.calibrationComplete ? 'success' : 'warning'} animated={!tank.calibrationComplete} />
      </div>

      <div className="surface-card rounded-3 p-3">
        <div className="h6 mb-3">Sessions recorded</div>
        <div className="table-responsive">
          <Table hover size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Session</th>
                <th className="text-end">Click count</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((row) => (
                <tr key={row.session}>
                  <td>{row.session}</td>
                  <td className="text-end font-mono-nums">{row.clicksRecorded}</td>
                </tr>
              ))}
              {!sessions.length && (
                <tr>
                  <td colSpan={2} className="text-secondary">
                    No sessions logged yet for this calibration window (mock empty state).
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {baselineValue != null && (
        <div className="surface-card rounded-3 p-3">
          <div className="small text-secondary">Established baseline</div>
          <div className="h4 font-mono-nums mb-0">{baselineValue} clicks / session</div>
          <div className="small text-secondary">Derived mock value from telemetry profile</div>
        </div>
      )}

      <div className="surface-card rounded-3 p-3">
        <div className="h6 mb-3">Event log</div>
        <div className="d-flex flex-column gap-2">
          {events.map((e, idx) => (
            <div key={`${e.date}-${idx}`} className="d-flex flex-wrap gap-2 align-items-center border-bottom border-secondary pb-2">
              <Badge bg={e.type === 'system' ? 'secondary' : 'primary'} text="dark">
                {e.type}
              </Badge>
              <span className="small text-secondary font-mono-nums">{e.date}</span>
              <span className="flex-grow-1">{e.event}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mark calibration event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Observation</Form.Label>
            <Form.Control autoFocus value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="e.g., Water change, feeding change, livestock added" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addEvent}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
