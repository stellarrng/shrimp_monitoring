import { useMemo, useState } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import { Link } from 'react-router-dom'
import { useAlerts } from '../../hooks/useAlerts'

function severityRank(s) {
  if (s === 'critical') return 0
  if (s === 'medium') return 1
  return 2
}

function severityBorder(s) {
  if (s === 'critical') return '#ff9a86'
  if (s === 'medium') return '#ffd6a6'
  return '#fff0be'
}

function severityBadgeBg(s) {
  if (s === 'critical') return 'danger'
  if (s === 'medium') return 'warning'
  return 'light'
}

function formatDetected(iso) {
  try {
    const d = new Date(iso)
    const now = new Date()
    const sameDay =
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()

    const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' })
    if (sameDay) return `Today ${timeFmt.format(d)}`
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d)
  } catch {
    return iso
  }
}

/** TODO: wire acknowledge endpoint */
export default function Alerts() {
  const [tab, setTab] = useState('all')

  const all = useAlerts('all')
  const filtered = useAlerts(tab === 'all' ? undefined : tab)

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const sr = severityRank(a.severity) - severityRank(b.severity)
        if (sr !== 0) return sr
        return new Date(b.timeDetected) - new Date(a.timeDetected)
      }),
    [filtered],
  )

  return (
    <div className="page-root py-3">
      <div className="d-flex flex-column flex-lg-row gap-3 justify-content-lg-between align-items-lg-center mb-3">
        <div>
          <h1 className="h3 mb-1">Active Alerts</h1>
          <div className="text-secondary small">{all.filter((x) => !x.resolved).length} unresolved</div>
        </div>
        <ButtonGroup size="sm" aria-label="Filter">
          {['all', 'critical', 'medium', 'low'].map((key) => (
            <Button
              key={key}
              variant={tab === key ? 'primary' : 'outline-secondary'}
              onClick={() => setTab(key)}
              className="text-capitalize"
            >
              {key === 'all' ? 'All' : key}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="d-flex flex-column gap-3">
        {sorted.map((a) => (
          <div
            key={a.id}
            className="surface-card rounded-3 p-3"
            style={{
              borderLeft: `8px solid ${severityBorder(a.severity)}`,
            }}
          >
            <div className="d-flex flex-wrap justify-content-between gap-2 align-items-start">
              <div>
                <Link className="text-decoration-none" to={`/tank/${a.tankId}`}>
                  <span className="fw-semibold text-primary">{a.tankName}</span>
                </Link>
                <Badge bg={severityBadgeBg(a.severity)} text="dark" className="ms-2 text-uppercase">
                  {a.severity}
                </Badge>
              </div>
              <div className="small text-secondary font-mono-nums">{formatDetected(a.timeDetected)}</div>
            </div>

            <div className="mt-2 fw-semibold">{a.message}</div>
            <div className="text-secondary small mt-1">{a.detail}</div>

            <div className="alert-action-box px-3 py-2 mt-3">
              <div className="small text-secondary mb-1">Suggested action</div>
              <div className="small">{a.suggestedAction}</div>
            </div>

          </div>
        ))}

        {!sorted.length && <div className="text-secondary">No alerts match this filter.</div>}
      </div>
    </div>
  )
}
