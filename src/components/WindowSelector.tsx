'use client'

interface Option {
  label: string
  points: number
}

const OPTIONS: Option[] = [
  { label: '5m', points: 60 },
  { label: '15m', points: 180 },
  { label: '30m', points: 360 },
  { label: '1h', points: 720 },
  { label: '3h', points: 2160 },
]

interface Props {
  value: number
  onChange: (points: number) => void
}

export default function WindowSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-neutral-400">Window:</span>
      <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
        {OPTIONS.map((o) => (
          <button
            key={o.label}
            onClick={() => onChange(o.points)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              value === o.points
                ? 'bg-white text-neutral-800 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
