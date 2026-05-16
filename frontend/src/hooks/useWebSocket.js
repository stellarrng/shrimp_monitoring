import { useEffect } from 'react'
import { useTankStore } from '../store/tankStore'

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
        const base = typeof t.signalRms === 'number' ? t.signalRms : 1.5
        const next = Number(Math.max(0.2, Math.min(4, base + delta * 0.04)).toFixed(2))
        patchLiveTelemetry(tankId, { signalRms: next })
      })
    }, 2000)

    return () => clearInterval(id)
  }, [patchLiveTelemetry])

  return { connected: true }
}
