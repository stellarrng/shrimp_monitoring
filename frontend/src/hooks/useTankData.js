import { useTankStore } from '../store/tankStore'

export function useTankData(tankId) {
  const tanks = useTankStore((s) => s.tanks)
  if (tankId) {
    return tanks.find((t) => t.id === tankId) ?? null
  }
  return tanks
}
