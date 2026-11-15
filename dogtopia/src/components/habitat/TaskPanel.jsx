// TaskPanel – lists active habitat tasks for the player
export default function TaskPanel({ tasks = [] }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h3 className="font-bold text-sand-700 mb-2">Tasks</h3>
      {tasks.length === 0 && <p className="text-sandstone-400 text-sm">No active tasks.</p>}
    </div>
  )
}

