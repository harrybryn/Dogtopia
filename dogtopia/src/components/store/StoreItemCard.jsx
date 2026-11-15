import coinsImg from '../../assets/ui/coins.png'

// StoreItemCard – single purchasable item card
export default function StoreItemCard({ item, onBuy }) {
  return (
    <div className="bg-sand-50 border border-sand-200 rounded-xl p-3 flex flex-col items-center gap-2 w-36">
      <span className="text-xs font-semibold text-sand-700">{item?.name ?? 'Item'}</span>
      <span className="text-xs text-oasis-600 flex items-center gap-1.5 font-bold">
        <img src={coinsImg} alt="" className="w-4 h-4 object-contain drop-shadow" />
        {item?.price ?? 0}
      </span>
      <button onClick={() => onBuy?.(item)} className="bg-warm-500 text-white text-xs px-3 py-1 rounded-lg">Buy</button>
    </div>
  )
}
