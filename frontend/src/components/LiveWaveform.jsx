import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

/** Oscilloscope-style scrolling LineChart — TODO: connect to WebSocket audio frames */
export default function LiveWaveform({ label, color, filtered }) {
  const [data, setData] = useState(() => {
    const pts = 64
    return Array.from({ length: pts }, (_, i) => ({
      t: i,
      v: filtered ? Math.sin(i / 4) * 0.4 + (Math.random() - 0.5) * 0.15 : (Math.random() - 0.5) * 2.2,
    }))
  })

  const domain = useMemo(() => {
    if (filtered) return [-1.2, 1.2]
    return [-3, 3]
  }, [filtered])

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const next = prev.slice(1)
        const lastT = prev[prev.length - 1].t + 1
        const noise = (Math.random() - 0.5) * (filtered ? 0.12 : 1.1)
        const clickSpike = filtered && Math.random() > 0.82 ? 0.55 + Math.random() * 0.35 : 0
        const wave = filtered ? Math.sin(lastT / 3.2) * 0.35 + noise + clickSpike : noise * 2 + Math.sin(lastT / 2.1) * 0.4
        next.push({ t: lastT, v: wave })
        return next
      })
    }, 100)

    return () => clearInterval(id)
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
