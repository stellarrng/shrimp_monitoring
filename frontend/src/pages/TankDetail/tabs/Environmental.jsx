import { useMemo, useState } from 'react'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  getOutdoorEnvironmentDailySeriesForTank,
  windDegreesToLabel,
} from '../../../mockData'

const tooltipStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 8,
  color: 'var(--color-text)',
}

function sliceLastDays(series, n) {
  if (!series?.length) return []
  return series.slice(-n)
}

function statsNumeric(rows, key, decimals = 1) {
  const vals = rows.map((r) => r[key]).filter((v) => typeof v === 'number' && !Number.isNaN(v))
  if (!vals.length) return null
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  const fmt = (x) => Number(x.toFixed(decimals))
  return { min: fmt(min), max: fmt(max), avg: fmt(avg) }
}

function lastRow(rows) {
  return rows[rows.length - 1] ?? null
}

function formatStatsLine(s, unit, { latestKey, latestFmt } = {}) {
  if (!s) return ''
  const parts = [`Low ${s.min}${unit}`, `Avg ${s.avg}${unit}`, `High ${s.max}${unit}`]
  if (latestKey != null && latestFmt) {
    parts.unshift(`Latest ${latestFmt}`)
  }
  return parts.join(' · ')
}

/** TODO: replace mock daily series with environmental / weather API */
export default function Environmental({ tank }) {
  const fullSeries = useMemo(() => getOutdoorEnvironmentDailySeriesForTank(tank), [tank])
  const [range, setRange] = useState(30)

  const data = useMemo(() => sliceLastDays(fullSeries, range), [fullSeries, range])

  const sTemp = useMemo(() => statsNumeric(data, 'tempC'), [data])
  const sRh = useMemo(() => statsNumeric(data, 'rhPct', 0), [data])
  const sRain = useMemo(() => statsNumeric(data, 'rainMm'), [data])
  const rainSum = useMemo(() => Number(data.reduce((a, r) => a + r.rainMm, 0).toFixed(1)), [data])
  const sWs = useMemo(() => statsNumeric(data, 'windSpeedKmh'), [data])
  const sGust = useMemo(() => statsNumeric(data, 'windGustKmh'), [data])
  const sDir = useMemo(() => statsNumeric(data, 'windDirDeg', 0), [data])
  const sLux = useMemo(() => statsNumeric(data, 'lux', 0), [data])
  const latest = useMemo(() => lastRow(data), [data])

  const WindDirTooltip = useMemo(
    () =>
      function WindDirTooltipInner({ active, payload }) {
        if (!active || !payload?.length) return null
        const p = payload[0]?.payload
        if (!p) return null
        return (
          <div style={tooltipStyle} className="px-2 py-1 small">
            <div className="text-secondary">{p.day}</div>
            <div>
              {p.windDirDeg}° ({windDegreesToLabel(p.windDirDeg)})
            </div>
          </div>
        )
      },
    [],
  )

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <div className="h6 mb-0">Environment</div>
          <div className="small text-secondary">Daily aggregates (mock). Last point matches station snapshot.</div>
        </div>
        <ButtonGroup size="sm" aria-label="Date range">
          <Button variant={range === 7 ? 'primary' : 'outline-secondary'} onClick={() => setRange(7)}>
            7 days
          </Button>
          <Button variant={range === 30 ? 'primary' : 'outline-secondary'} onClick={() => setRange(30)}>
            30 days
          </Button>
          <Button variant={range === 90 ? 'primary' : 'outline-secondary'} onClick={() => setRange(90)}>
            90 days
          </Button>
        </ButtonGroup>
      </div>

      <EnvChartCard
        title="Temp"
        subtitle={formatStatsLine(sTemp, ' °C', {
          latestKey: 'tempC',
          latestFmt: latest ? `${latest.tempC} °C` : '',
        })}
      >
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="tempC" stroke="var(--color-peach)" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </EnvChartCard>

      <EnvChartCard
        title="RH"
        subtitle={formatStatsLine(sRh, ' %', {
          latestKey: 'rhPct',
          latestFmt: latest ? `${Math.round(latest.rhPct)} %` : '',
        })}
      >
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="rhPct" stroke="var(--color-teal)" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </EnvChartCard>

      <EnvChartCard
        title="Rain fall"
        subtitle={
          sRain
            ? `Latest ${latest?.rainMm ?? '—'} mm · Low ${sRain.min} mm · Avg/day ${sRain.avg} mm · High ${sRain.max} mm · Σ ${rainSum} mm`
            : ''
        }
      >
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={[0, 'auto']} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="rainMm" stroke="var(--color-blue)" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </EnvChartCard>

      <EnvChartCard
        title="Wind speed & gust"
        subtitle={
          sWs && sGust
            ? `Speed: low ${sWs.min} · avg ${sWs.avg} · high ${sWs.max} km/h — Gust: low ${sGust.min} · avg ${sGust.avg} · high ${sGust.max} km/h`
            : ''
        }
      >
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={[0, 'auto']} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="windSpeedKmh" name="Wind speed" stroke="var(--color-healthy)" dot={false} strokeWidth={2} isAnimationActive={false} />
          <Line type="monotone" dataKey="windGustKmh" name="Wind gust" stroke="var(--color-warning)" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </EnvChartCard>

      <EnvChartCard
        title="Wind direction"
        subtitle={
          sDir && latest
            ? `Latest ${windDegreesToLabel(latest.windDirDeg)} (${latest.windDirDeg}°) · Low ${sDir.min}° (${windDegreesToLabel(sDir.min)}) · High ${sDir.max}° (${windDegreesToLabel(sDir.max)}) · Avg ${sDir.avg}° (linear; not circular)`
            : ''
        }
      >
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={[0, 360]} tickFormatter={(v) => windDegreesToLabel(v)} ticks={[0, 90, 180, 270, 360]} />
          <Tooltip content={WindDirTooltip} />
          <Line type="monotone" dataKey="windDirDeg" stroke="var(--color-coral)" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </EnvChartCard>

      <EnvChartCard
        title="Lux"
        subtitle={formatStatsLine(sLux, ' lx', {
          latestKey: 'lux',
          latestFmt: latest ? `${latest.lux.toLocaleString()} lx` : '',
        })}
      >
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis domain={[0, 'auto']} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toLocaleString()} lx`, 'Lux']} />
          <Line type="monotone" dataKey="lux" stroke="#e8c96a" dot={false} strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </EnvChartCard>
    </div>
  )
}

function EnvChartCard({ title, subtitle, children }) {
  return (
    <div className="surface-card rounded-3 p-3">
      <div className="mb-2">
        <div className="h6 mb-0">{title}</div>
        {subtitle && <div className="small text-secondary text-break">{subtitle}</div>}
      </div>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  )
}
