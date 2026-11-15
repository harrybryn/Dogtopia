// DogSprite – renders an animated dog sprite (CSS/canvas implementation later)
export default function DogSprite({ breed, size = 64 }) {
  return <div style={{ width: size, height: size }} className="flex items-center justify-center text-5xl">🐕</div>
}

