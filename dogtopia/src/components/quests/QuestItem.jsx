// QuestItem – single quest row with progress and claim button
export default function QuestItem({ quest, onClaim }) {
  return (
    <div className="flex justify-between items-center bg-sand-50 rounded-xl px-4 py-2">
      <div>
        <p className="font-semibold text-sand-700 text-sm">{quest?.title ?? 'Quest'}</p>
        <p className="text-xs text-sandstone-400">{quest?.description ?? ''}</p>
      </div>
      {quest?.completed && (
        <button onClick={() => onClaim?.(quest)} className="bg-palm-500 text-white text-xs px-3 py-1 rounded-lg">Claim</button>
      )}
    </div>
  )
}

