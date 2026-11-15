// WaterStation – interactive water/food station in the habitat
export default function WaterStation({ onRefill }) {
  return (
    <button onClick={onRefill} className="bg-oasis-100 hover:bg-oasis-200 text-oasis-700 px-3 py-2 rounded-xl text-sm transition-colors">
      💧 Water Station
    </button>
  )
}

