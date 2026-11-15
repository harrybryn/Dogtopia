// FriendList – lists a player's in-game friends
export default function FriendList({ friends = [] }) {
  return (
    <div>
      <h3 className="font-bold text-oasis-700 mb-2">Friends</h3>
      {friends.length === 0
        ? <p className="text-sandstone-400 text-sm">No friends added yet.</p>
        : friends.map((f) => <div key={f.id} className="text-sm text-sandstone-600">{f.name}</div>)
      }
    </div>
  )
}

