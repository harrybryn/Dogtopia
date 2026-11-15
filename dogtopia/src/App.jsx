import React, { useState, useCallback } from 'react'
import LoadingScreen from './components/common/LoadingScreen.jsx'
import { GameProvider } from './context/GameContext.jsx'
import { DogProvider } from './context/DogContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { QuestProvider } from './context/QuestContext.jsx'
import Navbar from './components/layout/Navbar.jsx'
import MobileNav from './components/layout/MobileNav.jsx'
import WorldView from './pages/WorldView.jsx'
import Home from './pages/Home.jsx'
import Habitat from './pages/Habitat.jsx'
import Store from './pages/Store.jsx'
import Breeding from './pages/Breeding.jsx'
import CollectionBook from './pages/CollectionBook.jsx'
import Quests from './pages/Quests.jsx'
import Social from './pages/Social.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'

const PAGES = {
  home: Home,
  habitat: Habitat,
  store: Store,
  breeding: Breeding,
  collection: CollectionBook,
  quests: Quests,
  social: Social,
  login: Login,
}

// Pages that render full-screen (no Navbar / MobileNav shell)
const FULLSCREEN_PAGES = new Set(['world', 'habitat'])

export default function App() {
  const [loading, setLoading] = useState(() => {
    // Only run fake-load on initial cold visit, prevent re-triggering loading screen during session
    return !sessionStorage.getItem('dogtopia_loaded')
  })
  const [currentPage, setCurrentPage] = useState('world')   // ← land surface first

  const handleLoadFinish = useCallback(() => {
    sessionStorage.setItem('dogtopia_loaded', '1')
    setLoading(false)
  }, [])

  const isWorld = currentPage === 'world'
  const isHabitatCare = currentPage === 'habitat'
  const PageComponent = isWorld ? null : (PAGES[currentPage] || NotFound)

  return (
    <GameProvider>
      <DogProvider>
        <StoreProvider>
          <QuestProvider>
            {/* Loading screen – sits on top until the fake-load finishes */}
            {loading && <LoadingScreen onFinish={handleLoadFinish} duration={2600} />}

            {/* ── World / Land surface (full-screen, own HUD) ── */}
            {!loading && isWorld && (
              <WorldView navigate={setCurrentPage} />
            )}

            {/* ── Dedicated Full-Screen Habitat Care (Zero website navbars/clutter!) ── */}
            {!loading && isHabitatCare && (
              <Habitat navigate={setCurrentPage} />
            )}

            {/* ── Normal game pages (rich wood & gold game shell, never white) ── */}
            {!loading && !isWorld && !isHabitatCare && (
              <div
                className="min-h-screen text-amber-100 flex flex-col relative overflow-x-hidden select-none"
                style={{
                  background: 'radial-gradient(ellipse 95% 85% at 50% 15%, #2a1106 0%, #120601 100%)',
                }}
              >
                {/* Desktop navbar */}
                <div className="hidden md:block">
                  <Navbar currentPage={currentPage} navigate={setCurrentPage} />
                </div>

                {/* Page content */}
                <main className="flex-1 p-2 sm:p-4 max-w-7xl w-full mx-auto pb-20 md:pb-6">
                  <PageComponent navigate={setCurrentPage} />
                </main>

                {/* Mobile bottom nav */}
                <div className="block md:hidden">
                  <MobileNav currentPage={currentPage} navigate={setCurrentPage} />
                </div>
              </div>
            )}
          </QuestProvider>
        </StoreProvider>
      </DogProvider>
    </GameProvider>
  )
}

