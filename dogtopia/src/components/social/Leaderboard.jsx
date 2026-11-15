// Leaderboard – top players ranked by XP
export default function Leaderboard({ entries = [] }) {
  return (
    <div>
      <h3 className="font-bold text-oasis-700 mb-2">Leaderboard</h3>
      {entries.length === 0
        ? <p className="text-sandstone-400 text-sm">No data yet.</p>
        : entries.map((e, i) => (
          <div key={e.id} className="flex justify-between text-sm py-1 border-b border-sand-100">
            <span className="text-sandstone-500">#{i + 1} {e.name}</span>
            <span className="text-sand-700 font-semibold">{e.xp} XP</span>
          </div>
        ))
      }
    </div>
  )
}

