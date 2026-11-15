// DogStats – shows XP, happiness, hunger bars for a dog
export default function DogStats({ dog }) {
  return (
    <div className="text-sm text-sandstone-600">
      <p>XP: {dog?.xp ?? 0}</p>
      <p>Happiness: {dog?.happiness ?? 100}%</p>
      <p>Hunger: {dog?.hunger ?? 100}%</p>
    </div>
  )
}

