import iconCrown from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'

// BreedingDen – UI for selecting two dogs to breed
export default function BreedingDen({ onBreed }) {
  return (
    <div className="bg-sand-50 rounded-2xl p-6 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold text-sandstone-700 flex items-center gap-2">
        <img src={iconCrown} alt="" className="w-5 h-5 object-contain" />
        Breeding Den
      </h2>
      <div className="flex gap-8 items-center">
        <span className="text-base font-bold text-sandstone-600">Parent 1</span>
        <span className="text-2xl text-sandstone-400">+</span>
        <span className="text-base font-bold text-sandstone-600">Parent 2</span>
      </div>
      <button onClick={onBreed} className="bg-warm-500 text-white px-6 py-2 rounded-xl">Start Breeding</button>
    </div>
  )
}

