import React from 'react'
import genericModalBg from '../../assets/ui/GenericModal.png'

export default function GenericModal({
  title,
  onClose,
  children,
  maxWidth = 'max-w-4xl',
  titleExtra = null,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn select-none pointer-events-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} aspect-[558/447] max-h-[94vh] max-w-[calc(94vh*558/447)] flex flex-col select-none`}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `url(${genericModalBg})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'drop-shadow(0 25px 60px rgba(0,0,0,0.9))',
        }}
      >
        {/* Title placed directly inside the top wooden banner */}
        <div className="absolute left-[20%] right-[20%] top-[6.5%] h-[14.5%] flex items-center justify-center pointer-events-none px-4">
          <span
            className="font-black text-base sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-center leading-none truncate"
            style={{
              fontFamily: "'Lilita One', 'Fredoka', 'Arial Rounded MT Bold', sans-serif",
              color: '#3b1404',
              textShadow: '0 1.5px 0 rgba(255,255,255,0.95), 0 -0.5px 0 rgba(0,0,0,0.25)',
              letterSpacing: '0.06em',
            }}
          >
            {title}
          </span>
          {titleExtra}
        </div>

        {/* Top-Right Red (X) Close Button Overlay (over illustrated button) */}
        <button
          type="button"
          onClick={onClose}
          title="Close"
          className="absolute left-[83%] top-[13.5%] w-[8%] h-[10%] rounded-full cursor-pointer z-30 transition-transform active:scale-90 hover:scale-110 flex items-center justify-center bg-transparent border-0 p-0"
        >
          <span className="sr-only">Close</span>
        </button>

        {/* Inner Parchment Scrollable Content Area */}
        <div className="absolute left-[12.5%] right-[12.5%] top-[23%] bottom-[9.5%] flex flex-col overflow-hidden px-2 py-1.5 sm:px-4 sm:py-3">
          <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
