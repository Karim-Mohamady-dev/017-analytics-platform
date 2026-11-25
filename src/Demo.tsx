import { useState } from 'react'
import en from '../locales/en/common.json'

type DemoStrings = (typeof en)['demo']
type Metric = 'visitors' | 'signups' | 'revenue'

export default function Demo({ d }: { d: DemoStrings }) {
  const [metric, setMetric] = useState<Metric>('visitors')
  const [range, setRange] = useState<7 | 30>(30)
  const [hovered, setHovered] = useState<number | null>(null)
  const data = d.datasets[metric].slice(-range)
  const labels = d.months.slice(-range)
  const max = Math.max(...data)
  const metrics: { key: Metric; label: string }[] = [
    { key: 'visitors', label: d.metrics.visitors },
    { key: 'signups', label: d.metrics.signups },
    { key: 'revenue', label: d.metrics.revenue },
  ]
  return (
    <div className="rounded-2xl border border-line bg-surface p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="title-1 font-semibold">{d.title}</h2>
          <p className="caption-2 text-muted">{d.subtitle}</p>
        </div>
        <span className="caption-3 rounded-full bg-accent-soft px-4 py-2 text-accent">{d.sampleLabel}</span>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {d.kpi.map((k) => (
          <div key={k.label} className="rounded-xl border border-line bg-bg p-4">
            <p className="caption-4 text-muted">{k.label}</p>
            <p className="heading-6 mt-2">{k.value}</p>
            <p className="caption-4 mt-2 text-accent">{k.change}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex gap-2 rounded-full border border-line bg-bg p-1" role="tablist" aria-label={d.metricLabel}>
          {metrics.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={metric === m.key}
              onClick={() => setMetric(m.key)}
              className={`button-sm rounded-full px-3 py-1 transition-colors duration-300 ${metric === m.key ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 rounded-full border border-line bg-bg p-1" role="group" aria-label={d.rangeLabel}>
          {([7, 30] as const).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={range === r}
              onClick={() => setRange(r)}
              className={`button-sm rounded-full px-3 py-1 transition-colors duration-300 ${range === r ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'}`}
            >
              {r === 7 ? d.range7 : d.range30}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 flex h-64 items-end gap-2" role="img" aria-label={d.chartLabel}>
        {data.map((v, i) => (
          <div
            key={`${labels[i]}-${i}`}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
          >
            <span className={`caption-3 ${hovered === i ? 'text-ink' : 'text-transparent'}`}>{v.toLocaleString()}</span>
            <div
              className={`w-full rounded-t-lg transition-all duration-500 ${hovered === i ? 'bg-accent opacity-100' : 'bg-accent opacity-70'}`}
              style={{ height: `${Math.max(4, (v / max) * 100)}%` }}
            />
            <span className="caption-4 text-center text-muted">{range === 30 && i % 3 !== 0 ? '' : labels[i]}</span>
          </div>
        ))}
      </div>
      <p className="caption-2 mt-8 text-muted">{d.hint}</p>
    </div>
  )
}
