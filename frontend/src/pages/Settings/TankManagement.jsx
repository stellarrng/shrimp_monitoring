import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'
import { useTankStore } from '../../store/tankStore'

/** TODO: sync tank CRUD via API */
export default function TankManagement() {
  const tanks = useTankStore((s) => s.tanks)
  const updateTank = useTankStore((s) => s.updateTank)
  const removeTank = useTankStore((s) => s.removeTank)
  const addTank = useTankStore((s) => s.addTank)

  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ name: '', species: '', colonySize: 0 })
  const [showAdd, setShowAdd] = useState(false)
  const [newTank, setNewTank] = useState({ name: '', species: '', colonySize: 30 })

  const startEdit = (t) => {
    setEditingId(t.id)
    setDraft({
      name: t.name,
      species: t.species,
      colonySize: t.colonySize,
    })
  }

  const saveEdit = () => {
    if (!editingId) return
    updateTank(editingId, {
      name: draft.name,
      species: draft.species,
      colonySize: Number(draft.colonySize),
    })
    setEditingId(null)
  }

  const destroy = (id) => {
    const ok = window.confirm('Delete tank? Removes from dashboard (mock-only).')
    if (!ok) return
    removeTank(id)
  }

  const add = () => {
    addTank({
      name: newTank.name || 'New Tank',
      species: newTank.species || 'Unknown species',
      colonySize: Number(newTank.colonySize) || 0,
      healthScore: 70,
      status: 'warning',
      clicksPerMinute: 12,
      baselineClicks: 18,
      temperature: 25,
      pH: 7.0,
      dissolvedOxygen: 6.2,
      device: { esp32: 'online', mic: 'online', wifi: -55 },
      lastUpdated: 'just now',
      calibrationDay: 1,
      calibrationComplete: false,
    })
    setShowAdd(false)
    setNewTank({ name: '', species: '', colonySize: 30 })
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="h6 mb-0">Fleet composition</div>
        <Button size="sm" variant="primary" onClick={() => setShowAdd(true)}>
          Add tank
        </Button>
      </div>

      <div className="surface-card rounded-3 p-3">
        <div className="table-responsive">
          <Table hover size="sm" className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th className="text-end">Colony</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tanks.map((t) =>
                editingId === t.id ? (
                  <tr key={t.id}>
                    <td>
                      <Form.Control size="sm" value={draft.name} onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
                    </td>
                    <td>
                      <Form.Control size="sm" value={draft.species} onChange={(e) => setDraft((p) => ({ ...p, species: e.target.value }))} />
                    </td>
                    <td className="text-end" style={{ maxWidth: 120 }}>
                      <Form.Control
                        size="sm"
                        className="text-end"
                        value={draft.colonySize}
                        type="number"
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            colonySize: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td className="text-end text-nowrap">
                      <Button size="sm" variant="success" className="me-2" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline-secondary" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={t.id}>
                    <td className="align-middle">{t.name}</td>
                    <td className="align-middle">{t.species}</td>
                    <td className="align-middle text-end font-mono-nums">{t.colonySize}</td>
                    <td className="align-middle text-end text-nowrap">
                      <Button size="sm" variant="outline-primary" className="me-2" onClick={() => startEdit(t)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => destroy(t.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add tank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={newTank.name} onChange={(e) => setNewTank((p) => ({ ...p, name: e.target.value }))} placeholder="Tank G" />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Species</Form.Label>
            <Form.Control
              value={newTank.species}
              onChange={(e) => setNewTank((p) => ({ ...p, species: e.target.value }))}
              placeholder="Neocaridina spp."
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Colony size</Form.Label>
            <Form.Control
              type="number"
              value={newTank.colonySize}
              onChange={(e) => setNewTank((p) => ({ ...p, colonySize: e.target.value }))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={add}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
