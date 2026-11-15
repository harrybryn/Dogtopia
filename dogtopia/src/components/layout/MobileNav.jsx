import React from 'react'
import iconHome from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_home.svg'
import iconHeart from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_heart.svg'
import iconMap from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_map.svg'
import iconChest from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_chest.svg'
import iconStar from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_star.svg'
import iconCrown from '../../assets/TrioUIKit_FreeSample_v2.2/icons/icon_crown.svg'

const NAV_ITEMS = [
  { key: 'world', icon: iconHome, title: 'Island' },
  { key: 'habitat', icon: iconHeart, title: 'Habitat' },
  { key: 'breeding', icon: iconCrown, title: 'Breed' },
  { key: 'store', icon: iconChest, title: 'Store' },
  { key: 'collection', icon: iconMap, title: 'Book' },
  { key: 'quests', icon: iconStar, title: 'Quests' },
]

export default function MobileNav({ currentPage, navigate }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 text-white flex justify-around py-2 z-50 border-t border-amber-900/60"
      style={{
        background: 'linear-gradient(180deg, #381609 0%, #1a0802 100%)',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.7)',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          onClick={() => navigate(item.key)}
          className={`flex flex-col items-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl transition-all ${
            currentPage === item.key
              ? 'bg-amber-500 text-amber-950 font-black shadow-md border border-amber-300'
              : 'text-amber-200/80 hover:text-white'
          }`}
        >
          <img src={item.icon} alt="" className="w-5 h-5 object-contain" />
          <span>{item.title}</span>
        </button>
      ))}
    </nav>
  )
}
