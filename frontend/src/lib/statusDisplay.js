/** Single vocabulary for tank health (UI copy). */
export function tankStatusLabel(status) {
  if (status === 'healthy') return 'Healthy'
  if (status === 'warning') return 'Warning'
  return 'Critical'
}

/** Map stored alert severity to display — align with three health tones (Critical / Warning / advisory). */
export function alertSeverityLabel(severity) {
  if (severity === 'critical') return 'Critical'
  if (severity === 'medium') return 'Warning'
  return 'Advisory'
}

export function alertSeverityVariant(severity) {
  if (severity === 'critical') return 'critical'
  if (severity === 'medium') return 'warning'
  return 'advisory'
}
