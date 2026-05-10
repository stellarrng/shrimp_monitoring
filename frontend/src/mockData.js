/** Central mock dataset — UI reads from stores hydrated from here. */

const MAY_LAST_14 = Array.from({ length: 14 }, (_, i) => `May ${i + 1}`)

const MONTH_30_DAYS = [
  ...Array.from({ length: 10 }, (_, i) => `Apr ${21 + i}`),
  ...Array.from({ length: 20 }, (_, i) => `May ${i + 1}`),
]

function buildTrendSegment(labels, startClicks, endClicks, startHealth, endHealth, startNoise, endNoise) {
  const days = labels.length
  const out = []
  for (let i = 0; i < days; i++) {
    const t = days === 1 ? 0 : i / (days - 1)
    const jitter = Math.sin(i * 1.7) * 6
    out.push({
      day: labels[i],
      clicks: Math.round(startClicks + (endClicks - startClicks) * t + jitter),
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
    colonySize: 80,
    healthScore: 87,
    status: 'healthy',
    clicksPerMinute: 24,
    baselineClicks: 26,
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
    colonySize: 45,
    healthScore: 42,
    status: 'critical',
    clicksPerMinute: 8,
    baselineClicks: 22,
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
    colonySize: 30,
    healthScore: 65,
    status: 'warning',
    clicksPerMinute: 14,
    baselineClicks: 20,
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
    colonySize: 60,
    healthScore: 91,
    status: 'healthy',
    clicksPerMinute: 28,
    baselineClicks: 27,
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
    colonySize: 55,
    healthScore: 78,
    status: 'healthy',
    clicksPerMinute: 19,
    baselineClicks: 21,
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
    colonySize: 35,
    healthScore: 55,
    status: 'warning',
    clicksPerMinute: 11,
    baselineClicks: 19,
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
    { day: 'May 1', clicks: 410, healthScore: 89 },
    { day: 'May 2', clicks: 398, healthScore: 87 },
    { day: 'May 3', clicks: 420, healthScore: 91 },
    { day: 'May 4', clicks: 405, healthScore: 88 },
    { day: 'May 5', clicks: 390, healthScore: 85 },
    { day: 'May 6', clicks: 415, healthScore: 90 },
    { day: 'May 7', clicks: 408, healthScore: 88 },
    { day: 'May 8', clicks: 422, healthScore: 92 },
    { day: 'May 9', clicks: 401, healthScore: 87 },
    { day: 'May 10', clicks: 418, healthScore: 90 },
    { day: 'May 11', clicks: 395, healthScore: 86 },
    { day: 'May 12', clicks: 412, healthScore: 89 },
    { day: 'May 13', clicks: 407, healthScore: 88 },
    { day: 'May 14', clicks: 424, healthScore: 87 },
  ],
  'tank-002': [
    { day: 'May 1', clicks: 380, healthScore: 82 },
    { day: 'May 2', clicks: 360, healthScore: 78 },
    { day: 'May 3', clicks: 340, healthScore: 74 },
    { day: 'May 4', clicks: 300, healthScore: 65 },
    { day: 'May 5', clicks: 260, healthScore: 57 },
    { day: 'May 6', clicks: 210, healthScore: 46 },
    { day: 'May 7', clicks: 180, healthScore: 39 },
    { day: 'May 8', clicks: 160, healthScore: 35 },
    { day: 'May 9', clicks: 140, healthScore: 31 },
    { day: 'May 10', clicks: 120, healthScore: 28 },
    { day: 'May 11', clicks: 110, healthScore: 25 },
    { day: 'May 12', clicks: 100, healthScore: 23 },
    { day: 'May 13', clicks: 95, healthScore: 22 },
    { day: 'May 14', clicks: 90, healthScore: 42 },
  ],
  'tank-003': buildTrendSegment(MAY_LAST_14, 320, 210, 78, 65, -38, -29),
  'tank-004': buildTrendSegment(MAY_LAST_14, 280, 360, 70, 91, -42, -36),
  'tank-005': buildTrendSegment(MAY_LAST_14, 380, 200, 82, 55, -35, -42),
  'tank-006': buildTrendSegment(MAY_LAST_14, 300, 195, 72, 55, -40, -32),
}

/** 30-day series including clicks/session equivalent, health, noise amplitude index */
export const mockTankTrendExtended = {
  'tank-001': buildTrendSegment(MONTH_30_DAYS, 400, 430, 85, 88, -36, -32),
  'tank-002': buildTrendSegment(MONTH_30_DAYS, 420, 95, 82, 42, -30, -45),
  'tank-003': buildTrendSegment(MONTH_30_DAYS, 330, 210, 78, 65, -38, -30),
  'tank-004': buildTrendSegment(MONTH_30_DAYS, 250, 360, 65, 91, -44, -36),
  'tank-005': buildTrendSegment(MONTH_30_DAYS, 400, 180, 80, 48, -36, -44),
  'tank-006': buildTrendSegment(MONTH_30_DAYS, 320, 200, 72, 55, -40, -32),
}

export const mockAlerts = [
  {
    id: 'alert-001',
    tankId: 'tank-002',
    tankName: 'Tank B',
    severity: 'critical',
    message: 'Click rate dropped 63% below baseline',
    detail: 'Current: 8 clicks/min — Baseline: 22 clicks/min',
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
    message: 'Click rate dropped 30% below baseline',
    detail: 'Current: 14 clicks/min — Baseline: 20 clicks/min',
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
      event: 'Calibration complete — baseline set at 401 clicks/session',
      type: 'system',
    },
  ],
  'tank-002': [
    { date: 'Apr 28', event: 'Calibration started', type: 'system' },
    { date: 'May 2', event: 'Filter maintenance', type: 'user' },
    { date: 'May 10', event: 'Auto-flag: anomaly in click clustering', type: 'system' },
    { date: 'May 14', event: 'Calibration complete — baseline set at 315 clicks/session', type: 'system' },
  ],
  'tank-003': [
    { date: 'May 1', event: 'Calibration started', type: 'system' },
    { date: 'May 6', event: 'Added leaf litter', type: 'user' },
    { date: 'May 14', event: 'Calibration complete — baseline set at 290 clicks/session', type: 'system' },
  ],
  'tank-004': [
    { date: 'May 4', event: 'Calibration started', type: 'system' },
    { date: 'May 9', event: 'Adjusted hydrophone depth', type: 'user' },
  ],
  'tank-005': [
    { date: 'Apr 20', event: 'Calibration started', type: 'system' },
    { date: 'May 1', event: 'Calibration complete — baseline set at 385 clicks/session', type: 'system' },
    { date: 'May 11', event: 'Device heartbeat lost — investigating power', type: 'system' },
  ],
  'tank-006': [
    { date: 'May 2', event: 'Calibration started', type: 'system' },
    { date: 'May 8', event: 'Aerator cleaned', type: 'user' },
    { date: 'May 14', event: 'Calibration complete — baseline set at 275 clicks/session', type: 'system' },
  ],
}

/** Full 14-day calibration session click totals (sessions per day mock) */
export function getCalibrationSessionsForTank(tank) {
  const day = tank?.calibrationDay ?? 0
  const totalDays = 14
  const targetBase = tank?.baselineClicks ? tank.baselineClicks * 14 : 300
  return Array.from({ length: Math.min(day, totalDays) }, (_, i) => ({
    session: `Day ${i + 1}`,
    clicksRecorded: Math.round(targetBase / 14 + Math.sin(i * 1.2) * 12 + (i + 1) * 3),
  }))
}

export const mockAudioSessions = {
  'tank-001': [
    { id: 's1', date: '2026-05-11', duration: '12m 04s', clicks: 312, healthScore: 87 },
    { id: 's2', date: '2026-05-10', duration: '11m 58s', clicks: 305, healthScore: 88 },
    { id: 's3', date: '2026-05-09', duration: '12m 11s', clicks: 318, healthScore: 86 },
  ],
  'tank-002': [
    { id: 's1', date: '2026-05-11', duration: '10m 22s', clicks: 84, healthScore: 42 },
    { id: 's2', date: '2026-05-10', duration: '11m 01s', clicks: 102, healthScore: 45 },
  ],
  'tank-003': [
    { id: 's1', date: '2026-05-11', duration: '11m 40s', clicks: 198, healthScore: 65 },
  ],
  'tank-004': [
    { id: 's1', date: '2026-05-11', duration: '12m 00s', clicks: 340, healthScore: 91 },
  ],
  'tank-005': [
    { id: 's1', date: '2026-05-10', duration: '11m 50s', clicks: 280, healthScore: 78 },
  ],
  'tank-006': [
    { id: 's1', date: '2026-05-11', duration: '10m 55s', clicks: 152, healthScore: 55 },
  ],
}

/** 24 hourly points for environmental charts */
export function getEnvironmental24hForTank(tank) {
  const t = tank
  if (!t) return []
  const hours = Array.from({ length: 24 }, (_, h) => {
    const label = `${h.toString().padStart(2, '0')}:00`
    const phase = (h / 24) * Math.PI * 2
    return {
      hour: label,
      temperature: Number((t.temperature + Math.sin(phase) * 0.8 + (h - 12) * 0.02).toFixed(1)),
      pH: Number((t.pH + Math.cos(phase * 0.7) * 0.06).toFixed(2)),
      dissolvedOxygen: Number((t.dissolvedOxygen + Math.sin(phase * 1.3) * 0.35).toFixed(2)),
    }
  })
  return hours
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
