// ProgressBar – displays a value/max as a filled bar
export default function ProgressBar({ value = 0, max = 100, color = 'bg-palm-500' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="w-full bg-sand-200 rounded-full h-3 overflow-hidden">
      <div className={`${color} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

