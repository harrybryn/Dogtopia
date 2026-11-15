// StoreTabs – tab bar for switching store categories
export default function StoreTabs({ tabs = [], active, onSelect }) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect?.(tab)}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            active === tab ? 'bg-oasis-600 text-white' : 'bg-sand-200 text-sand-700 hover:bg-sand-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

