import { useState, useEffect } from 'react'
import { siteAssetService } from '../services/siteAssetService'

function Home({ onGoToMain, onGoToLogin, user }) {
  const [backgroundUrl, setBackgroundUrl] = useState(null)

  useEffect(() => {
    siteAssetService.getHomeBackgroundUrl().then(setBackgroundUrl)
  }, [])

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative bg-main-background"
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
    >
      <div className="absolute inset-0 bg-main-background-overlay" aria-hidden="true" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4 text-text-title drop-shadow-lg">
          КООСЭН КЛУБ
        </h1>
        <p className="text-xs sm:text-sm md:text-base mb-8 text-text-paragraph-light leading-relaxed">
          Коосэн клубийн вэб сайтад тавтай морилно уу. Энд та клубүүдийн мэдээлэл хайж, нэгдэж, шинэ клуб үүсгэх боломжтой.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={onGoToMain}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-button-primary-subtle hover:bg-button-primary-hover-subtle text-button-primary-text transition-colors shadow-sm"
          >
            Клуб хайх
          </button>
          {!user && (
            <button
              type="button"
              onClick={onGoToLogin}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border-2 border-button-outline-border text-button-outline-text hover:bg-button-outline-hover transition-colors"
            >
              Нэвтрэх
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
