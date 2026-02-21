import { useState, useEffect } from 'react'
import ClubSearchPage from '../mainPageComponents/ClubSearchPage'
import ClubDetailPage from '../mainPageComponents/ClubDetailPage'
import TimeSchedulePage from '../mainPageComponents/TimeSchedulePage'
import { siteAssetService } from '../services/siteAssetService'

function MainPage({ onGoToHome, onGoToLogin, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountPanelOpen, setAccountPanelOpen] = useState(false)
  const [secondaryPage, setSecondaryPage] = useState('clubs')
  const [selectedClubId, setSelectedClubId] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)

  useEffect(() => {
    siteAssetService.getLogoUrl().then(setLogoUrl)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const closeAccountPanel = () => setAccountPanelOpen(false)

  const handleClubSelect = (club) => {
    setSelectedClubId(club.id)
    setSecondaryPage('clubDetail')
  }

  const handleBackFromClubDetail = () => {
    setSelectedClubId(null)
    setSecondaryPage('clubs')
  }

  const NavLinks = (
    <>
      <button
        type="button"
        onClick={() => {
          onGoToHome?.()
          closeMenu()
        }}
        className="rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-text-paragraph hover:bg-input-background hover:text-text-heading transition-colors"
      >
        Нүүр
      </button>
      <button
        type="button"
        onClick={() => {
          setSecondaryPage('clubs')
          closeMenu()
        }}
        className={`rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors ${
          secondaryPage === 'clubs'
            ? 'text-text-label bg-nav-active'
            : 'text-text-paragraph hover:bg-input-background hover:text-text-heading'
        }`}
      >
        Клуб хайх
      </button>
      <button
        type="button"
        onClick={() => {
          setSecondaryPage('schedule')
          closeMenu()
        }}
        className={`rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors ${
          secondaryPage === 'schedule'
            ? 'text-text-label bg-nav-active'
            : 'text-text-paragraph hover:bg-input-background hover:text-text-heading'
        }`}
      >
        Цагийн хуваарь
      </button>
    </>
  )

  const loginButton = user ? (
    <button
      type="button"
      onClick={() => {
        setAccountPanelOpen((o) => !o)
        closeMenu()
      }}
      className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-text-paragraph hover:bg-input-background hover:text-text-heading transition-colors"
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-button-primary flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
        {user.name?.charAt(0).toUpperCase()}
      </div>
      <span>{user.name}</span>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => {
        onGoToLogin?.()
        closeMenu()
      }}
      className="rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-text-paragraph hover:bg-input-background hover:text-text-heading transition-colors"
    >
      Нэвтрэх
    </button>
  )

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-main-background">
      {/* Mobile menu overlay – on top when open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in menu – fixed on top, slides from right; hidden on desktop */}
      <nav
        className={`
          fixed top-0 right-0
          w-64 h-full
          p-4
          flex flex-col gap-2
          bg-nav-background
          z-50
          md:hidden
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
          shadow-xl
        `}
      >
        <div className="flex justify-between items-center border-b border-border-default pb-3 mb-2">
          <span className="text-sm sm:text-lg font-semibold text-text-heading">Цэс</span>
          <button
            type="button"
            onClick={closeMenu}
            className="p-2 rounded-lg text-text-paragraph hover:bg-input-background hover:text-text-heading transition-colors"
            aria-label="Цэс хаах"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {NavLinks}
        {loginButton}
      </nav>

      {/* Account panel overlay */}
      {accountPanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeAccountPanel}
          aria-hidden="true"
        />
      )}

      {/* Account panel – slides down from top */}
      <div
        className={`
          fixed top-0 left-0 right-0
          p-4
          bg-nav-background
          z-50
          transform transition-transform duration-300 ease-in-out
          ${accountPanelOpen ? 'translate-y-0' : '-translate-y-full'}
          shadow-xl
          border-b border-border-default
        `}
      >
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm sm:text-lg font-semibold text-text-heading">Хэрэглэгч</span>
            <button
              type="button"
              onClick={closeAccountPanel}
              className="p-2 rounded-lg text-text-paragraph hover:bg-input-background hover:text-text-heading transition-colors"
              aria-label="Хаах"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {user && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-block-background-muted border border-border-default">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-button-primary flex items-center justify-center text-white text-base sm:text-xl font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-text-heading text-sm sm:text-base font-medium">{user.name}</p>
                  <p className="text-text-placeholder text-xs sm:text-sm">{user.email}</p>
                  <p className="text-text-caption text-[10px] sm:text-xs capitalize">{user.role}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onLogout?.()
                  closeAccountPanel()
                }}
                className="w-full py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold bg-red-600/80 text-white hover:bg-red-500/80 transition-colors"
              >
                Гарах
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top navbar bar (logo + center nav + login right + hamburger) */}
      <header className="sticky top-0 z-30 shrink-0 border-b border-border-default bg-nav-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center w-full px-4 sm:px-6">
          <div className="flex items-center gap-2 flex-shrink-0">
            {logoUrl && <img src={logoUrl} alt="" className="h-5 sm:h-6 w-auto" aria-hidden="true" />}
            <span className="text-sm sm:text-lg font-semibold text-text-heading">Koosen Club</span>
          </div>

          {/* Mobile: spacer to push menu button to the right */}
          <div className="flex-1 md:hidden" aria-hidden="true" />

          {/* Desktop: center nav */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
            {NavLinks}
          </nav>

          {/* Desktop: login on the right */}
          <div className="hidden md:flex items-center flex-shrink-0 ml-auto">
            {loginButton}
          </div>

          {/* Mobile menu button – right side */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-text-heading hover:bg-input-background transition-colors"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main section – no overflow here; only the inner grid scrolls (ClubSearchPage) */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0">
        {secondaryPage === 'clubs' && (
          <ClubSearchPage 
            onClubSelect={handleClubSelect} 
            user={user}
            onGoToLogin={onGoToLogin}
          />
        )}
        {secondaryPage === 'clubDetail' && selectedClubId && (
          <ClubDetailPage
            clubId={selectedClubId}
            user={user}
            onBack={handleBackFromClubDetail}
            onGoToLogin={onGoToLogin}
          />
        )}
        {secondaryPage === 'schedule' && <TimeSchedulePage />}
      </main>
    </div>
  )
}

export default MainPage
