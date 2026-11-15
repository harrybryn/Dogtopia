// DogCard – compact card showing a dog's name, breed, and level
export default function DogCard({ dog }) {
  if (!dog) return null
  return (
    <div className="bg-sand-50 border border-sand-200 rounded-xl p-3 flex flex-col items-center gap-2 w-28">
      <div className="text-4xl">🐕</div>
      <span className="text-xs font-semibold text-sand-700">{dog.name ?? 'Dog'}</span>
      <span className="text-xs text-sandstone-400">Lv {dog.level ?? 1}</span>
    </div>
  )
}

