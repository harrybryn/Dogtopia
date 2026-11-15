// StoreModal – full-screen store overlay
export default function StoreModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-oasis-700">🛒 Store</h2>
          <button onClick={onClose} className="text-sandstone-400 hover:text-sandstone-700">✕</button>
        </div>
        <p className="text-sandstone-500">Store content goes here.</p>
      </div>
    </div>
  )
}

