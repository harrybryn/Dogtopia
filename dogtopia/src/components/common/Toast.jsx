// Toast – brief notification message stub
export default function Toast({ message, type = 'info' }) {
  const colors = {
    info: 'bg-oasis-500',
    success: 'bg-palm-500',
    error: 'bg-warm-600',
  }
  return (
    <div className={`${colors[type]} text-white px-4 py-2 rounded-xl shadow-lg text-sm`}>
      {message}
    </div>
  )
}

