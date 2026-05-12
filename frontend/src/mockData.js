/** Central mock dataset — UI reads from stores hydrated from here. */

const MAY_LAST_14 = Array.from({ length: 14 }, (_, i) => `May ${i + 1}`)

const MONTH_30_DAYS = [
  ...Array.from({ length: 10 }, (_, i) => `Apr ${21 + i}`),
  ...Array.from({ length: 20 }, (_, i) => `May ${i + 1}`),
]

function signalFromActivity(value) {
  return Number(value.toFixed(2))
}

export function getSignalLevel(tank) {
  const source = typeof tank?.signalRms === 'number' ? tank.signalRms : 1.5
  return Number(source.toFixed(1))
}

export function getBaselineSignalLevel(tank) {
  const source = typeof tank?.baselineSignalRms === 'number' ? tank.baselineSignalRms : 1.5
  return Number(source.toFixed(1))
}

function buildTrendSegment(labels, startSignal, endSignal, startHealth, endHealth, startNoise, endNoise) {
  const days = labels.length
  const out = []
  for (let i = 0; i < days; i++) {
    const t = days === 1 ? 0 : i / (days - 1)
    const jitter = Math.sin(i * 1.7) * 0.05
    const signal = startSignal + (endSignal - startSignal) * t + jitter
    out.push({
      day: labels[i],
      signalRms: signalFromActivity(signal),
      healthScore: Math.round(
        Math.min(100, Math.max(15, startHealth + (endHealth - startHealth) * t + Math.sin(i) * 2)),
      ),
      noiseDb: Number(
        (startNoise + (endNoise - startNoise) * t + Math.cos(i * 0.9) * 1.5).toFixed(1),
      ),
    })
  }
  return out
}

export const mockTanks = [
  {
    id: 'tank-001',
    name: 'Tank A',
    species: 'Cherry Shrimp',
    healthScore: 87,
    status: 'healthy',
    signalRms: 2.0,
    baselineSignalRms: 2.2,
    temperature: 25.4,
    pH: 7.1,
    dissolvedOxygen: 6.8,
    device: { esp32: 'online', mic: 'online', wifi: -52 },
    lastUpdated: '2 min ago',
    calibrationDay: 14,
    calibrationComplete: true,
  },
  {
    id: 'tank-002',
    name: 'Tank B',
    species: 'Amano Shrimp',
    healthScore: 42,
    status: 'critical',
    signalRms: 0.7,
    baselineSignalRms: 1.8,
    temperature: 28.1,
    pH: 6.8,
    dissolvedOxygen: 3.2,
    device: { esp32: 'online', mic: 'online', wifi: -71 },
    lastUpdated: '1 min ago',
    calibrationDay: 14,
    calibrationComplete: true,
  },
  {
    id: 'tank-003',
    name: 'Tank C',
    species: 'Crystal Red Shrimp',
    healthScore: 65,
    status: 'warning',
    signalRms: 1.2,
    baselineSignalRms: 1.7,
    temperature: 23.8,
    pH: 6.5,
    dissolvedOxygen: 5.9,
    device: { esp32: 'online', mic: 'warning', wifi: -68 },
    lastUpdated: '3 min ago',
    calibrationDay: 14,
    calibrationComplete: true,
  },
  {
    id: 'tank-004',
    name: 'Tank D',
    species: 'Blue Velvet Shrimp',
    healthScore: 91,
    status: 'healthy',
    signalRms: 2.3,
    baselineSignalRms: 2.3,
    temperature: 24.5,
    pH: 7.0,
    dissolvedOxygen: 7.1,
    device: { esp32: 'online', mic: 'online', wifi: -48 },
    lastUpdated: '30 sec ago',
    calibrationDay: 7,
    calibrationComplete: false,
  },
  {
    id: 'tank-005',
    name: 'Tank E',
    species: 'Cherry Shrimp',
    healthScore: 78,
    status: 'healthy',
    signalRms: 1.6,
    baselineSignalRms: 1.8,
    temperature: 25.0,
    pH: 7.2,
    dissolvedOxygen: 6.5,
    device: { esp32: 'offline', mic: 'offline', wifi: null },
    lastUpdated: '45 min ago',
    calibrationDay: 14,
    calibrationComplete: true,
  },
  {
    id: 'tank-006',
    name: 'Tank F',
    species: 'Amano Shrimp',
    healthScore: 55,
    status: 'warning',
    signalRms: 0.9,
    baselineSignalRms: 1.6,
    temperature: 26.7,
    pH: 6.9,
    dissolvedOxygen: 4.8,
    device: { esp32: 'online', mic: 'online', wifi: -60 },
    lastUpdated: '5 min ago',
    calibrationDay: 14,
    calibrationComplete: true,
  },
]

export const mockSessionHistory = {
  'tank-001': [
    { day: 'May 1', signalRms: 2.12, healthScore: 89 },
    { day: 'May 2', signalRms: 2.05, healthScore: 87 },
    { day: 'May 3', signalRms: 2.2, healthScore: 91 },
    { day: 'May 4', signalRms: 2.1, healthScore: 88 },
    { day: 'May 5', signalRms: 2.03, healthScore: 85 },
    { day: 'May 6', signalRms: 2.17, healthScore: 90 },
    { day: 'May 7', signalRms: 2.11, healthScore: 88 },
    { day: 'May 8', signalRms: 2.22, healthScore: 92 },
    { day: 'May 9', signalRms: 2.08, healthScore: 87 },
    { day: 'May 10', signalRms: 2.18, healthScore: 90 },
    { day: 'May 11', signalRms: 2.04, healthScore: 86 },
    { day: 'May 12', signalRms: 2.14, healthScore: 89 },
    { day: 'May 13', signalRms: 2.1, healthScore: 88 },
    { day: 'May 14', signalRms: 2.21, healthScore: 87 },
  ],
  'tank-002': [
    { day: 'May 1', signalRms: 1.82, healthScore: 82 },
    { day: 'May 2', signalRms: 1.76, healthScore: 78 },
    { day: 'May 3', signalRms: 1.68, healthScore: 74 },
    { day: 'May 4', signalRms: 1.55, healthScore: 65 },
    { day: 'May 5', signalRms: 1.42, healthScore: 57 },
    { day: 'May 6', signalRms: 1.24, healthScore: 46 },
    { day: 'May 7', signalRms: 1.1, healthScore: 39 },
    { day: 'May 8', signalRms: 1.0, healthScore: 35 },
    { day: 'May 9', signalRms: 0.92, healthScore: 31 },
    { day: 'May 10', signalRms: 0.84, healthScore: 28 },
    { day: 'May 11', signalRms: 0.8, healthScore: 25 },
    { day: 'May 12', signalRms: 0.76, healthScore: 23 },
    { day: 'May 13', signalRms: 0.72, healthScore: 22 },
    { day: 'May 14', signalRms: 0.7, healthScore: 42 },
  ],
  'tank-003': buildTrendSegment(MAY_LAST_14, 1.7, 1.2, 78, 65, -38, -29),
  'tank-004': buildTrendSegment(MAY_LAST_14, 1.8, 2.3, 70, 91, -42, -36),
  'tank-005': buildTrendSegment(MAY_LAST_14, 1.9, 1.6, 82, 55, -35, -42),
  'tank-006': buildTrendSegment(MAY_LAST_14, 1.6, 0.9, 72, 55, -40, -32),
}

/** 30-day series including signal strength, health, noise amplitude index */
export const mockTankTrendExtended = {
  'tank-001': buildTrendSegment(MONTH_30_DAYS, 2.05, 2.18, 85, 88, -36, -32),
  'tank-002': buildTrendSegment(MONTH_30_DAYS, 1.85, 0.7, 82, 42, -30, -45),
  'tank-003': buildTrendSegment(MONTH_30_DAYS, 1.72, 1.2, 78, 65, -38, -30),
  'tank-004': buildTrendSegment(MONTH_30_DAYS, 1.75, 2.3, 65, 91, -44, -36),
  'tank-005': buildTrendSegment(MONTH_30_DAYS, 1.9, 1.6, 80, 48, -36, -44),
  'tank-006': buildTrendSegment(MONTH_30_DAYS, 1.62, 0.9, 72, 55, -40, -32),
}

export const mockAlerts = [
  {
    id: 'alert-001',
    tankId: 'tank-002',
    tankName: 'Tank B',
    severity: 'critical',
    message: 'Sound signal dropped 63% below baseline',
    detail: 'Current: 0.7 signal level - Normal: 1.8',
    suggestedAction:
      'Test ammonia and nitrite immediately. Check temperature. Inspect tank for dead shrimp.',
    timeDetected: '2026-05-11T06:32:00',
    resolved: false,
  },
  {
    id: 'alert-002',
    tankId: 'tank-003',
    tankName: 'Tank C',
    severity: 'medium',
    message: 'Sound signal dropped 30% below baseline',
    detail: 'Current: 1.2 signal level - Normal: 1.7',
    suggestedAction: 'Monitor closely. Consider testing water parameters.',
    timeDetected: '2026-05-11T05:10:00',
    resolved: false,
  },
  {
    id: 'alert-003',
    tankId: 'tank-006',
    tankName: 'Tank F',
    severity: 'medium',
    message: 'Dissolved oxygen below optimal range',
    detail: 'DO: 4.8 mg/L — Optimal: above 5.0 mg/L',
    suggestedAction: 'Check aeration system. Consider adding air stone.',
    timeDetected: '2026-05-11T04:55:00',
    resolved: false,
  },
  {
    id: 'alert-004',
    tankId: 'tank-005',
    tankName: 'Tank E',
    severity: 'low',
    message: 'Device offline — no data received',
    detail: 'Last seen: 45 minutes ago',
    suggestedAction: 'Check ESP32 power and WiFi connection.',
    timeDetected: '2026-05-11T07:15:00',
    resolved: false,
  },
]

export const mockCalibrationEvents = {
  'tank-001': [
    { date: 'May 1', event: 'Calibration started', type: 'system' },
    { date: 'May 3', event: 'Water change (20%)', type: 'user' },
    { date: 'May 7', event: 'Observed mass molt', type: 'user' },
    {
      date: 'May 14',
      event: 'Calibration complete - baseline sound profile locked',
      type: 'system',
    },
  ],
  'tank-002': [
    { date: 'Apr 28', event: 'Calibration started', type: 'system' },
    { date: 'May 2', event: 'Filter maintenance', type: 'user' },
    { date: 'May 10', event: 'Auto-flag: anomaly in sound waveform clustering', type: 'system' },
    { date: 'May 14', event: 'Calibration complete - baseline sound profile locked', type: 'system' },
  ],
  'tank-003': [
    { date: 'May 1', event: 'Calibration started', type: 'system' },
    { date: 'May 6', event: 'Added leaf litter', type: 'user' },
    { date: 'May 14', event: 'Calibration complete - baseline sound profile locked', type: 'system' },
  ],
  'tank-004': [
    { date: 'May 4', event: 'Calibration started', type: 'system' },
    { date: 'May 9', event: 'Adjusted hydrophone depth', type: 'user' },
  ],
  'tank-005': [
    { date: 'Apr 20', event: 'Calibration started', type: 'system' },
    { date: 'May 1', event: 'Calibration complete - baseline sound profile locked', type: 'system' },
    { date: 'May 11', event: 'Device heartbeat lost — investigating power', type: 'system' },
  ],
  'tank-006': [
    { date: 'May 2', event: 'Calibration started', type: 'system' },
    { date: 'May 8', event: 'Aerator cleaned', type: 'user' },
    { date: 'May 14', event: 'Calibration complete - baseline sound profile locked', type: 'system' },
  ],
}

/** Full 14-day calibration signal samples */
export function getCalibrationSessionsForTank(tank) {
  const day = tank?.calibrationDay ?? 0
  const totalDays = 14
  const targetBase = getBaselineSignalLevel(tank)
  return Array.from({ length: Math.min(day, totalDays) }, (_, i) => ({
    session: `Day ${i + 1}`,
    signalRms: Number((targetBase + Math.sin(i * 1.2) * 0.16 + (i + 1) * 0.02).toFixed(2)),
  }))
}

/** Outdoor / weather station snapshot (mock) — one row per tank */
export const mockOutdoorEnvironmentByTank = {
  'tank-001': {
    tempC: 28.4,
    rhPct: 72,
    rainMm: 0,
    windSpeedKmh: 11,
    windGustKmh: 21,
    windDir: 'NE',
    lux: 38_200,
  },
  'tank-002': {
    tempC: 31.2,
    rhPct: 84,
    rainMm: 4.2,
    windSpeedKmh: 18,
    windGustKmh: 34,
    windDir: 'E',
    lux: 12_400,
  },
  'tank-003': {
    tempC: 27.1,
    rhPct: 68,
    rainMm: 0,
    windSpeedKmh: 9,
    windGustKmh: 16,
    windDir: 'SSE',
    lux: 41_500,
  },
  'tank-004': {
    tempC: 26.5,
    rhPct: 65,
    rainMm: 0.2,
    windSpeedKmh: 7,
    windGustKmh: 14,
    windDir: 'NW',
    lux: 36_800,
  },
  'tank-005': {
    tempC: 25.8,
    rhPct: 70,
    rainMm: 0,
    windSpeedKmh: 6,
    windGustKmh: 11,
    windDir: 'S',
    lux: 0,
  },
  'tank-006': {
    tempC: 29.0,
    rhPct: 76,
    rainMm: 1.1,
    windSpeedKmh: 14,
    windGustKmh: 26,
    windDir: 'SW',
    lux: 22_100,
  },
}

export function getOutdoorEnvironmentSnapshotForTank(tank) {
  const fallback = {
    tempC: 27.0,
    rhPct: 70,
    rainMm: 0,
    windSpeedKmh: 10,
    windGustKmh: 18,
    windDir: 'N',
    lux: 30_000,
  }
  if (!tank?.id) return fallback
  return mockOutdoorEnvironmentByTank[tank.id] ?? fallback
}

const WIND_LABEL_TO_DEG = {
  N: 0,
  NNE: 22.5,
  NE: 45,
  ENE: 67.5,
  E: 90,
  ESE: 112.5,
  SE: 135,
  SSE: 157.5,
  S: 180,
  SSW: 202.5,
  SW: 225,
  WSW: 247.5,
  W: 270,
  WNW: 292.5,
  NW: 315,
  NNW: 337.5,
}

export function windLabelToDegrees(label) {
  if (label == null || label === '') return 0
  const key = String(label).toUpperCase()
  return WIND_LABEL_TO_DEG[key] ?? 0
}

export function windDegreesToLabel(deg) {
  const d = ((Number(deg) % 360) + 360) % 360
  const idx = Math.round(d / 22.5) % 16
  const labels = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return labels[idx]
}

function hashTankId(id) {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619)
  return h >>> 0
}

function prng(seed, i, salt) {
  const x = Math.sin((seed + i * 7919 + salt * 104729) * 0.00001) * 10000
  return x - Math.floor(x)
}

/** Mock daily outdoor readings for ~3 months (aggregate per day). Last row matches snapshot. */
export function getOutdoorEnvironmentDailySeriesForTank(tank) {
  const snap = getOutdoorEnvironmentSnapshotForTank(tank)
  const seed = hashTankId(tank?.id ?? '')
  const totalDays = 90
  const end = new Date('2026-05-12T12:00:00')

  const targetDir = windLabelToDegrees(snap.windDir)

  const out = []
  for (let i = 0; i < totalDays; i++) {
    const dayIndex = i
    const d = new Date(end)
    d.setDate(d.getDate() - (totalDays - 1 - dayIndex))
    const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    const wobble = (salt, mag = 1) => (prng(seed, dayIndex, salt) - 0.5) * 2 * mag
    const phase = (dayIndex / totalDays) * Math.PI * 2

    let tempC = snap.tempC + Math.sin(phase * 1.3 + seed * 0.001) * 2.8 + wobble(1, 0.35)
    let rhPct = snap.rhPct + Math.cos(phase * 0.9) * 8 + wobble(2, 3)
    rhPct = Math.min(96, Math.max(38, rhPct))

    let rainMm = 0
    if (prng(seed, dayIndex, 3) > 0.82) rainMm = Number((prng(seed, dayIndex, 4) ** 2 * 22).toFixed(1))
    if (prng(seed, dayIndex, 5) > 0.96) rainMm = Number((rainMm + prng(seed, dayIndex, 6) * 35).toFixed(1))

    let windSpeedKmh = Math.max(2, snap.windSpeedKmh + Math.sin(phase * 1.1) * 5 + wobble(7, 1.2))
    let windGustKmh = Math.max(windSpeedKmh + 4, snap.windGustKmh + Math.sin(phase * 0.8) * 8 + wobble(8, 2))

    let windDirDeg = targetDir + Math.sin(phase * 0.7 + seed * 0.002) * 55 + wobble(9, 12) * 8
    windDirDeg = ((windDirDeg % 360) + 360) % 360

    let lux = Math.max(
      0,
      snap.lux * (0.25 + 0.75 * (0.55 + 0.45 * Math.abs(Math.sin(phase * 1.4)))) + wobble(10, 2800) * 4000,
    )

    if (dayIndex === totalDays - 1) {
      tempC = snap.tempC
      rhPct = snap.rhPct
      rainMm = snap.rainMm
      windSpeedKmh = snap.windSpeedKmh
      windGustKmh = snap.windGustKmh
      windDirDeg = ((targetDir % 360) + 360) % 360
      lux = snap.lux
    }

    out.push({
      day,
      tempC: Number(tempC.toFixed(1)),
      rhPct: Number(rhPct.toFixed(1)),
      rainMm: Number(rainMm.toFixed(1)),
      windSpeedKmh: Number(windSpeedKmh.toFixed(1)),
      windGustKmh: Number(windGustKmh.toFixed(1)),
      windDirDeg: Number(windDirDeg.toFixed(1)),
      lux: Math.round(lux),
    })
  }

  return out
}

export const defaultThresholds = {
  lowPct: 20,
  mediumPct: 35,
  criticalPct: 50,
  tempMin: 20,
  tempMax: 26,
  phMin: 6.5,
  phMax: 7.5,
  doMin: 5,
}
