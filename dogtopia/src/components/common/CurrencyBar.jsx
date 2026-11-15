import coinsImg from '../../assets/ui/coins.png'
import diamondsImg from '../../assets/ui/diamonds.png'

// CurrencyBar – displays gold and gems at a glance
export default function CurrencyBar({ gold = 0, gems = 0 }) {
  return (
    <div className="flex gap-4 items-center">
      <span className="text-sand-700 font-semibold flex items-center gap-1.5">
        <img src={coinsImg} alt="Coins" className="w-5 h-5 object-contain" />
        {gold.toLocaleString()}
      </span>
      <span className="text-oasis-600 font-semibold flex items-center gap-1.5">
        <img src={diamondsImg} alt="Diamonds" className="w-5 h-5 object-contain" />
        {gems.toLocaleString()}
      </span>
    </div>
  )
}
