// QuestList – renders a list of quest items
export default function QuestList({ quests = [] }) {
  if (quests.length === 0) return <p className="text-sandstone-400 text-sm">No quests available.</p>
  return (
    <ul className="flex flex-col gap-2">
      {quests.map((q) => (
        <li key={q.id} className="bg-sand-50 rounded-xl px-4 py-2 text-sm text-sand-700">{q.title}</li>
      ))}
    </ul>
  )
}

