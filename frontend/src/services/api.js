import { mockTanks, mockAlerts, mockSessionHistory } from '../mockData'

export async function fetchTanks() {
  return [...mockTanks]
}

export async function fetchAlerts() {
  return [...mockAlerts]
}

export async function fetchTankHistory(/* tankId */) {
  return { ...mockSessionHistory }
}

export async function postCalibrationEvent(/* tankId, body */) {
  return { ok: true }
}
