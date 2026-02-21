import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { siteAssetService } from '../services/siteAssetService'

function LoginPage({ onBack, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backgroundUrl, setBackgroundUrl] = useState(null)

  useEffect(() => {
    siteAssetService.getLoginBackgroundUrl().then(setBackgroundUrl)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!email || !password) {
      setError('Бүх талбарыг бөглөнө үү')
      setLoading(false)
      return
    }

    try {
      const user = await authService.login(email, password)
      onLogin?.(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full p-4 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative bg-main-background"
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
    >
      <div className="absolute inset-0 bg-main-background-overlay" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-title mb-6 text-center">
          Нэвтрэх
        </h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border-default bg-block-background-muted p-6 sm:p-8 shadow-lg"
        >
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 text-xs sm:text-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              И-мэйл
            </label>
            <input
              type="email"
              placeholder="И-мэйл хаягаа оруулна уу"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent placeholder-text-placeholder"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              Нууц үг
            </label>
            <input
              type="password"
              placeholder="Нууц үгээ оруулна уу"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent placeholder-text-placeholder"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold bg-button-primary-subtle text-button-primary-text hover:bg-button-primary-hover-subtle transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold border-2 border-button-outline-border text-button-outline-text hover:bg-button-outline-hover transition-colors"
            >
              Буцах
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
