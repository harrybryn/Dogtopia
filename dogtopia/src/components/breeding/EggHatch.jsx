// EggHatch – animated egg reveal when breeding completes
export default function EggHatch({ onHatch }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <div className="text-7xl animate-bounce">🥚</div>
      <button onClick={onHatch} className="bg-palm-500 text-white px-6 py-2 rounded-xl">Hatch!</button>
    </div>
  )
}

