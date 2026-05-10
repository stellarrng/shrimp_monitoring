import { create } from 'zustand'
import { mockTanks } from '../mockData'

/** TODO: hydrate from API / WebSocket payloads instead of mocks */
export const useTankStore = create((set, get) => ({
  tanks: [...mockTanks],
  selectedTankId: null,

  setTanks: (next) =>
    set((state) => ({
      tanks: typeof next === 'function' ? next(state.tanks) : next,
    })),

  selectTank: (id) => set({ selectedTankId: id }),

  updateTank: (id, patch) =>
    set((state) => ({
      tanks: state.tanks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  addTank: (tank) =>
    set((state) => ({
      tanks: [...state.tanks, { ...tank, id: `tank-${Date.now()}` }],
    })),

  removeTank: (id) =>
    set((state) => ({
      tanks: state.tanks.filter((t) => t.id !== id),
      selectedTankId: state.selectedTankId === id ? null : state.selectedTankId,
    })),

  patchLiveTelemetry: (tankId, patch) =>
    set((state) => ({
      tanks: state.tanks.map((t) => (t.id === tankId ? { ...t, ...patch } : t)),
    })),

  getTankById: (id) => get().tanks.find((t) => t.id === id),
}))
