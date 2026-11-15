// Button – reusable styled button component
export default function Button({ children, onClick, variant = 'primary', className = '' }) {
  const base = 'font-semibold px-4 py-2 rounded-xl transition-colors'
  const variants = {
    primary: 'bg-warm-500 hover:bg-warm-600 text-white',
    secondary: 'bg-sand-200 hover:bg-sand-300 text-sand-800',
    ghost: 'bg-transparent hover:bg-sand-100 text-sand-700',
  }
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

