import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import { AlertTriangle } from 'lucide-react'
import { useAlerts } from '../hooks/useAlerts'

export default function AlertBanner() {
  const critical = useAlerts('critical')
  const message = useMemo(() => {
    if (!critical.length) return null
    return critical[0]?.message
  }, [critical])

  const [dismissed, setDismissed] = useState(false)

  if (!message || dismissed) return null

  return (
    <Alert variant="danger" dismissible onClose={() => setDismissed(true)} className="rounded-0 border-0 mb-0">
      <div className="d-flex align-items-center gap-3">
        <AlertTriangle size={20} />
        <div className="flex-grow-1">
          <strong className="me-2">Critical acoustic alert</strong>
          <span>{message}</span>
        </div>
        <Link className="btn btn-sm btn-outline-light" to="/alerts">
          Open alerts
        </Link>
      </div>
    </Alert>
  )
}
