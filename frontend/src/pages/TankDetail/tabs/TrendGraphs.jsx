import { useMemo, useState } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getBaselineSignalLevel, mockTankTrendExtended } from '../../../mockData'

/** TODO: replace with aggregated analytics API */
export default function TrendGraphs({ tank }) {
  const [range, setRange] = useState(14)

  const data = useMemo(() => {
    const src = mockTankTrendExtended[tank.id] ?? []
    return src.slice(-range).map((row) => ({
      ...row,
      signalRms: row.signalRms,
    }))
  }, [tank.id, range])

  const signalBaseline = useMemo(() => getBaselineSignalLevel(tank), [tank])

  const lineColor = useMemo(() => {
    const last = data[data.length - 1]?.signalRms ?? 0
    const pct = signalBaseline === 0 ? 1 : last / signalBaseline
    if (pct >= 0.85) return 'var(--color-healthy)'
    if (pct >= 0.6) return 'var(--color-warning)'
    return 'var(--color-critical)'
  }, [data, signalBaseline])

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="h6 mb-0">Activity & health trends</div>
        <ButtonGroup size="sm" aria-label="Range">
          <Button variant={range === 7 ? 'primary' : 'outline-secondary'} onClick={() => setRange(7)}>
            7 days
          </Button>
          <Button variant={range === 14 ? 'primary' : 'outline-secondary'} onClick={() => setRange(14)}>
            14 days
          </Button>
          <Button variant={range === 30 ? 'primary' : 'outline-secondary'} onClick={() => setRange(30)}>
            30 days
          </Button>
        </ButtonGroup>
      </div>

      <TrendPanel title="Signal strength trend" subtitle={`Normal level ${signalBaseline.toFixed(1)}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text)',
              }}
            />
            <ReferenceLine
              y={signalBaseline}
              stroke="rgba(255,240,190,0.35)"
              strokeDasharray="5 6"
              label={{
                position: 'right',
                value: 'baseline',
                fill: 'rgba(255,240,190,0.75)',
              }}
            />
            <Line type="monotone" dataKey="signalRms" stroke={lineColor} dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </TrendPanel>

      <TrendPanel title="Health score trend">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id={`health-${tank.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffb399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#ff9a86" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text)',
              }}
            />
            <Area type="monotone" dataKey="healthScore" stroke="#ffb399" fill={`url(#health-${tank.id})`} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </TrendPanel>

      <TrendPanel title="Noise level trend" subtitle="Average signal amplitude (mock dBFS)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text)',
              }}
            />
            <Line type="monotone" dataKey="noiseDb" stroke="var(--color-blue)" dot={false} strokeWidth={2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </TrendPanel>
    </div>
  )
}

function TrendPanel({ title, subtitle, children }) {
  return (
    <div className="surface-card rounded-3 p-3">
      <div className="mb-2">
        <div className="h6 mb-0">{title}</div>
        {subtitle && <div className="small text-secondary">{subtitle}</div>}
      </div>
      <div style={{ height: 260 }}>{children}</div>
    </div>
  )
}
