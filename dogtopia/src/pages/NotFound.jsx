import React from 'react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-3xl font-bold text-warm-600">404 – Page Not Found</h1>
      <p className="text-sandstone-500">That page doesn't exist in Dogtopia.</p>
    </div>
  )
}

