import { create } from 'zustand'
import { mockAlerts } from '../mockData'

export const useAlertStore = create((set, get) => ({
  alerts: [...mockAlerts],

  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  resetMockAlerts: () => set({ alerts: [...mockAlerts] }),

  activeCount: () => get().alerts.filter((a) => !a.resolved).length,
}))
