// EvolutionModal – modal shown when a dog is ready to evolve
export default function EvolutionModal({ dog, onEvolve, onClose }) {
  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold text-warm-600">Evolution Ready!</h2>
      <p className="text-sandstone-500 mt-2">{dog?.name} can evolve to the next stage.</p>
      <button onClick={onEvolve} className="mt-4 bg-warm-500 text-white px-6 py-2 rounded-xl">Evolve!</button>
    </div>
  )
}

