// BreedingTimer – countdown timer for an active breed
export default function BreedingTimer({ endsAt }) {
  return (
    <div className="text-oasis-600 font-mono text-lg">
      ⏱ {endsAt ? 'Timer active' : 'No active breeding'}
    </div>
  )
}

