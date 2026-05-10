import { useMemo } from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

/** Oscilloscope-style waveform snapshot — TODO: connect to WebSocket audio frames */
export default function LiveWaveform({ label, color, filtered }) {
  const data = useMemo(() => buildWaveform(filtered), [filtered])

  const domain = useMemo(() => {
    if (filtered) return [-1.2, 1.2]
    return [-3, 3]
  }, [filtered])

  return (
    <div className="surface-card rounded-3 p-3">
      <div className="text-secondary small text-uppercase letter-spacing-1 mb-2">{label}</div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="t" hide />
            <YAxis domain={domain} hide />
            <Line type="monotone" dataKey="v" stroke={color} dot={false} strokeWidth={filtered ? 2 : 1.2} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function buildWaveform(filtered) {
  const pts = 96
  return Array.from({ length: pts }, (_, i) => {
    const base = filtered ? Math.sin(i / 4.5) * 0.35 : Math.sin(i / 2.3) * 0.55
    const overtone = Math.sin(i / 1.7 + 1.8) * (filtered ? 0.08 : 0.32)
    const deterministicNoise = Math.sin(i * 12.9898) * (filtered ? 0.05 : 0.65)
    const pulse = filtered && i % 24 >= 9 && i % 24 <= 11 ? 0.35 : 0
    return { t: i, v: Number((base + overtone + deterministicNoise + pulse).toFixed(3)) }
  })
}
