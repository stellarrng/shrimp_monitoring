import { useMemo } from 'react'
import { useAlertStore } from '../store/alertStore'

export function useAlerts(severityFilter) {
  const alerts = useAlertStore((s) => s.alerts)

  return useMemo(() => {
    if (!severityFilter || severityFilter === 'all') return alerts
    return alerts.filter((a) => a.severity === severityFilter)
  }, [alerts, severityFilter])
}
