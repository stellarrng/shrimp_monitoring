import { tankStatusLabel } from '../lib/statusDisplay'

/** Title-case status chip — ramp 50 bg + 800 text for readability. */
export default function StatusPill({ status }) {
  const v = status === 'healthy' ? 'healthy' : status === 'warning' ? 'warning' : 'critical'
  return <span className={`status-pill status-pill--${v}`}>{tankStatusLabel(status)}</span>
}
