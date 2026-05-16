import { useMemo } from 'react'

export default function StatusDot({ status, pulse = false }) {
  const cfg = useMemo(() => {
    if (status === 'online') return { color: 'var(--color-healthy)', border: 'transparent' }
    if (status === 'warning') return { color: 'var(--color-warning)', border: 'rgba(255,214,166,0.45)' }
    return { color: '#b85c52', border: 'rgba(255,154,134,0.45)' }
  }, [status])

  const size = 11
  const className = pulse && status === 'online' ? 'status-pulse rounded-circle' : 'rounded-circle'

  return (
    <span
      className={className}
      title={status}
      role="img"
      aria-label={`status ${status}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        background: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    />
  )
}
