// Modal – generic overlay modal stub
export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-sand-700">{title}</h2>
          <button onClick={onClose} className="text-sandstone-400 hover:text-sandstone-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

