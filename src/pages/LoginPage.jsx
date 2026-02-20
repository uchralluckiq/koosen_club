import { useState } from 'react'
import koosenImg from '../assets/usedForWeb/koosen.jpg'
import { users } from '../assets/mockdata/users'

function LoginPage({ onBack, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!email || !password) {
      setError('Бүх талбарыг бөглөнө үү')
      setLoading(false)
      return
    }

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      onLogin?.(foundUser)
    } else {
      setError('И-мэйл эсвэл нууц үг буруу байна')
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full p-4 flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative bg-charcoal-blue-950"
      style={{ backgroundImage: `url(${koosenImg})` }}
    >
      {/* Dark overlay – palette dark */}
      <div className="absolute inset-0 bg-charcoal-blue-950/80" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-frosted-blue-50 mb-6 text-center">
          Нэвтрэх
        </h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-charcoal-blue-800 bg-charcoal-blue-900/60 p-6 sm:p-8 shadow-lg"
        >
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-frosted-blue-200 mb-2">
              И-мэйл
            </label>
            <input
              type="email"
              placeholder="И-мэйл хаягаа оруулна уу"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-charcoal-blue-700 bg-charcoal-blue-800 text-frosted-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-frosted-blue-500 focus:border-transparent placeholder-charcoal-blue-400"
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-frosted-blue-200 mb-2">
              Нууц үг
            </label>
            <input
              type="password"
              placeholder="Нууц үгээ оруулна уу"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-charcoal-blue-700 bg-charcoal-blue-800 text-frosted-blue-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-frosted-blue-500 focus:border-transparent placeholder-charcoal-blue-400"
              disabled={loading}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold bg-light-cyan-600/90 text-light-cyan-50 hover:bg-light-cyan-500/90 transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-light-cyan-400/80 text-light-cyan-100 hover:bg-light-cyan-900/40 transition-colors"
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
