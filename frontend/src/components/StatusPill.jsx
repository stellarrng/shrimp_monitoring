import { tankStatusLabel } from '../lib/statusDisplay'

export default function StatusPill({ status }) {
  const v = status === 'healthy' ? 'healthy' : status === 'warning' ? 'warning' : 'critical'
  return <span className={`status-pill status-pill--${v}`}>{tankStatusLabel(status)}</span>
}
