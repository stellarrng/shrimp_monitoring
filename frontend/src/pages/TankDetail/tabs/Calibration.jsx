import { useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ProgressBar from 'react-bootstrap/ProgressBar'
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import {
  getBaselineSignalLevel,
  getCalibrationSessionsForTank,
  getSignalLevel,
  mockCalibrationEvents,
  mockTankTrendExtended,
} from '../../../mockData'
import { useTankStore } from '../../../store/tankStore'

function signalStatus(value, average) {
  if (!average) return { label: 'No baseline', bg: 'secondary' }
  const ratio = value / average
  if (ratio >= 0.85) return { label: 'Good', bg: 'success' }
  if (ratio >= 0.65) return { label: 'Watch', bg: 'warning' }
  return { label: 'Bad', bg: 'danger' }
}

function formatPct(value) {
  if (!Number.isFinite(value)) return '0%'
  return `${value > 0 ? '+' : ''}${Math.round(value)}%`
}

function formatLevel(value) {
  return `${value.toFixed(1)} level`
}

/** TODO: POST calibration milestones to backend */
export default function Calibration({ tank }) {
  const updateTank = useTankStore((s) => s.updateTank)
  const [events, setEvents] = useState(() => [...(mockCalibrationEvents[tank.id] ?? [])])
  const [showModal, setShowModal] = useState(false)
  const [note, setNote] = useState('')

  const progress = useMemo(() => Math.round(((tank.calibrationDay ?? 0) / 14) * 100), [tank])

  const sessions = useMemo(() => getCalibrationSessionsForTank(tank), [tank])

  const currentSignal = getSignalLevel(tank)
  const baselineValue = tank.calibrationComplete ? getBaselineSignalLevel(tank) : null
  const monthlyComparison = useMemo(() => {
    const rows = (mockTankTrendExtended[tank.id] ?? []).map((row) => ({
      day: row.day,
      signalRms: row.signalRms,
    }))
    const monthAverage = rows.length
      ? Number((rows.reduce((sum, row) => sum + row.signalRms, 0) / rows.length).toFixed(1))
      : 0
    const recent = rows.slice(-7)
    return {
      monthAverage,
      recent,
      status: signalStatus(currentSignal, monthAverage),
      deltaPct: monthAverage ? ((currentSignal - monthAverage) / monthAverage) * 100 : 0,
    }
  }, [currentSignal, tank.id])

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
                ? 'Normal sound pattern saved - monitoring is active'
                : `Day ${tank.calibrationDay} of 14 - learning normal sound pattern`}
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
        <ProgressBar now={progress} className="mt-3" variant={tank.calibrationComplete ? 'success' : 'warning'} />
      </div>

      <div className="surface-card rounded-3 p-3">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
          <div>
            <div className="h6 mb-1">Monthly signal strength</div>
            <div className="text-secondary small">Current sound level compared with this tank's monthly average.</div>
          </div>
          <Badge bg={monthlyComparison.status.bg} text={monthlyComparison.status.bg === 'warning' ? 'dark' : undefined}>
            {monthlyComparison.status.label}
          </Badge>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="border border-secondary-subtle rounded-3 p-3 h-100">
              <div className="small text-secondary">Current strength</div>
              <div className="h3 font-mono-nums mb-0">{formatLevel(currentSignal)}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border border-secondary-subtle rounded-3 p-3 h-100">
              <div className="small text-secondary">Month average</div>
              <div className="h3 font-mono-nums mb-0">{formatLevel(monthlyComparison.monthAverage)}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border border-secondary-subtle rounded-3 p-3 h-100">
              <div className="small text-secondary">Difference</div>
              <div className="h3 font-mono-nums mb-0">{formatPct(monthlyComparison.deltaPct)}</div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <Table hover size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Day</th>
                <th className="text-end">Signal strength</th>
                <th className="text-end">Vs avg</th>
                <th className="text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlyComparison.recent.map((row) => {
                const delta = monthlyComparison.monthAverage
                  ? ((row.signalRms - monthlyComparison.monthAverage) / monthlyComparison.monthAverage) * 100
                  : 0
                const status = signalStatus(row.signalRms, monthlyComparison.monthAverage)
                return (
                  <tr key={row.day}>
                    <td>{row.day}</td>
                    <td className="text-end font-mono-nums">{formatLevel(row.signalRms)}</td>
                    <td className="text-end font-mono-nums">{formatPct(delta)}</td>
                    <td className="text-end">
                      <Badge bg={status.bg} text={status.bg === 'warning' ? 'dark' : undefined}>
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="surface-card rounded-3 p-3">
        <div className="h6 mb-3">Calibration samples</div>
        <div className="table-responsive">
          <Table hover size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Sample</th>
                <th className="text-end">Signal strength</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((row) => (
                <tr key={row.session}>
                  <td>{row.session}</td>
                  <td className="text-end font-mono-nums">{formatLevel(row.signalRms)}</td>
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
          <div className="h4 font-mono-nums mb-0">{formatLevel(baselineValue)}</div>
          <div className="small text-secondary">Normal signal strength saved for comparison</div>
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
