import { useEffect } from 'react'
import { useTankStore } from '../store/tankStore'

/** TODO: connect to WebSocket — currently simulates live click drift */
export function useWebSocket() {
  const patchLiveTelemetry = useTankStore((s) => s.patchLiveTelemetry)

  useEffect(() => {
    const id = setInterval(() => {
      const onlineTankIds = useTankStore
        .getState()
        .tanks.filter((t) => t.device?.esp32 === 'online')
        .map((t) => t.id)

      onlineTankIds.forEach((tankId) => {
        const delta = Math.round((Math.random() - 0.45) * 2)
        const t = useTankStore.getState().getTankById(tankId)
        if (!t) return
        const base = typeof t.clicksPerMinute === 'number' ? t.clicksPerMinute : 18
        const next = Math.max(2, Math.min(60, base + delta))
        patchLiveTelemetry(tankId, { clicksPerMinute: next })
      })
    }, 2000)

    return () => clearInterval(id)
  }, [patchLiveTelemetry])

  return { connected: true }
}
