import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getEnvironmental24hForTank } from '../../../mockData'

function bandColor(state) {
  if (state === 'ok') return 'var(--color-healthy)'
  if (state === 'warn') return 'var(--color-warning)'
  return 'var(--color-critical)'
}

function evalTemp(v) {
  if (v >= 20 && v <= 26) return 'ok'
  if ((v >= 18 && v < 20) || (v > 26 && v <= 28)) return 'warn'
  return 'bad'
}

function evalPh(v) {
  if (v >= 6.5 && v <= 7.5) return 'ok'
  if ((v >= 6.35 && v < 6.5) || (v > 7.5 && v <= 7.7)) return 'warn'
  return 'bad'
}

function evalDo(v) {
  if (v > 5) return 'ok'
  if (v >= 4.5 && v <= 5) return 'warn'
  return 'bad'
}

/** TODO: query environmental telemetry series */
export default function Environmental({ tank }) {
  const series = useMemo(() => getEnvironmental24hForTank(tank), [tank])

  const tState = evalTemp(tank.temperature)
  const pState = evalPh(tank.pH)
  const dState = evalDo(tank.dissolvedOxygen)

  return (
    <div className="d-flex flex-column gap-4">
      <Row className="g-3">
        <Col md={4}>
          <StatCard title="Temperature" unit="°C" value={tank.temperature.toFixed(1)} tone={bandColor(tState)} range="Safe: 20–26°C" />
        </Col>
        <Col md={4}>
          <StatCard title="pH" unit="" value={tank.pH.toFixed(2)} tone={bandColor(pState)} range="Safe: 6.5–7.5" />
        </Col>
        <Col md={4}>
          <StatCard title="Dissolved oxygen" unit="mg/L" value={tank.dissolvedOxygen.toFixed(1)} tone={bandColor(dState)} range="Safe: above 5.0 mg/L" />
        </Col>
      </Row>

      <MiniEnv title="Temperature (24h)" series={series} dataKey="temperature" ymin={18} ymax={31} bandMin={20} bandMax={26} color="var(--color-peach)" />
      <MiniEnv title="pH (24h)" series={series} dataKey="pH" ymin={6.15} ymax={8.05} bandMin={6.5} bandMax={7.5} color="var(--color-teal)" />
      <MiniEnv title="Dissolved oxygen (24h)" series={series} dataKey="dissolvedOxygen" ymin={2} ymax={8.8} bandMin={5} bandMax={8} color="var(--color-blue)" invertBand />
    </div>
  )
}

function StatCard({ title, value, unit, tone, range }) {
  return (
    <div className="surface-card rounded-3 p-3 h-100" style={{ borderLeft: `4px solid ${tone}` }}>
      <div className="small text-secondary">{title}</div>
      <div className="display-6 font-mono-nums mb-1">
        {value}
        {unit && <span className="small ms-1">{unit}</span>}
      </div>
      <div className="small text-secondary">{range}</div>
    </div>
  )
}

function MiniEnv({ title, series, dataKey, ymin, ymax, bandMin, bandMax, color, invertBand }) {
  return (
    <div className="surface-card rounded-3 p-3">
      <div className="d-flex justify-content-between align-items-baseline mb-2">
        <div className="h6 mb-0">{title}</div>
        <span className="small text-secondary">Shaded band = acceptable range</span>
      </div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={3} />
            <YAxis domain={[ymin, ymax]} />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text)',
              }}
            />

            {!invertBand && (
              <>
                <ReferenceArea y1={ymin} y2={bandMin} fill="rgba(255,154,134,0.08)" />
                <ReferenceArea y1={bandMin} y2={bandMax} fill="rgba(126,200,164,0.15)" />
                <ReferenceArea y1={bandMax} y2={ymax} fill="rgba(255,154,134,0.08)" />
              </>
            )}
            {invertBand && (
              <>
                <ReferenceArea y1={ymin} y2={bandMin} fill="rgba(126,200,164,0.15)" />
                <ReferenceArea y1={bandMin} y2={ymax} fill="rgba(255,154,134,0.08)" />
              </>
            )}
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.18} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
