import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/** TODO: replace with WebSocket FFT bins */
export default function FFTAnalysis() {
  const [series, setSeries] = useState(() => buildSeries(0))

  useEffect(() => {
    let tick = 0
    const id = setInterval(() => {
      tick += 1
      setSeries(buildSeries(tick))
    }, 2000)
    return () => clearInterval(id)
  }, [])

  const peaks = useMemo(
    () => [
      { name: '6.2 kHz', x: 6.2 },
      { name: '18.4 kHz', x: 18.4 },
      { name: '31.1 kHz', x: 31.1 },
    ],
    [],
  )

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
        <div>
          <div className="h5 mb-1">Frequency spectrum</div>
          <div className="text-secondary small">Shrimp click range: 3–48 kHz</div>
        </div>
        <div className="small font-mono-nums text-secondary">Live refresh · 2s</div>
      </div>

      <div className="surface-card rounded-3 p-3" style={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series} margin={{ top: 12, right: 12, left: 8, bottom: 24 }}>
            <defs>
              <linearGradient id="fftGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff9a86" />
                <stop offset="35%" stopColor="#ffb399" />
                <stop offset="70%" stopColor="#ffd6a6" />
                <stop offset="100%" stopColor="#fff0be" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kHz" tick={{ fontSize: 11 }}>
              <Label value="Frequency (kHz)" offset={-10} position="insideBottom" />
            </XAxis>
            <YAxis tick={{ fontSize: 11 }}>
              <Label value="Amplitude (a.u.)" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 8,
                color: 'var(--color-text)',
              }}
            />
            <ReferenceArea x1={3} x2={48} fill="rgba(126, 200, 164, 0.12)" />
            <Bar dataKey="amp" fill="url(#fftGrad)" isAnimationActive maxBarSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-2 mt-3">
        {peaks.map((p) => (
          <div key={p.name} className="col">
            <div className="surface-card rounded-3 p-3">
              <div className="small text-secondary">Detected peak</div>
              <div className="font-mono-nums">{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function buildSeries(seed) {
  return Array.from({ length: 48 }, (_, i) => {
    const kHz = i + 1
    const bandGain = kHz < 3 ? 0.15 : kHz > 48 ? 0.05 : 1
    const ripple = Math.sin((kHz / 48) * Math.PI * 6 + seed) * 3
    const spikes =
      Math.abs(kHz - 6.2) < 1 ? 22 : Math.abs(kHz - 18.4) < 1 ? 18 : Math.abs(kHz - 31.1) < 1 ? 16 : 0
    const noise = Math.random() * 4
    const amp = Math.max(0, (ripple + spikes + noise + 6) * bandGain)
    return { kHz, amp: Number(amp.toFixed(2)) }
  })
}
