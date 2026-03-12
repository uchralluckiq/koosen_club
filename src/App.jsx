import { useState, useEffect } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import MainPage from './pages/MainPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { authService } from './services/authService'

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = authService.getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    setPage('main')
  }
  // used in: LoginPage (onLogin prop)

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setPage('login')
  }
  // used in: MainPage (onLogout prop)

  if (loading) {
    return (
      <div className="app flex items-center justify-center min-h-screen bg-main-background">
        <div className="text-sm sm:text-base text-text-heading">Уншиж байна...</div>
      </div>
    )
  }

  return (
    <div className="app">
      {page === 'home' && (
        <Home 
          onGoToMain={() => setPage('main')} 
          onGoToLogin={() => setPage('login')} 
          user={user}
        />
      )}
      {page === 'main' && (
        <MainPage
          onGoToHome={() => setPage('home')}
          onGoToLogin={() => setPage('login')}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {page === 'login' && (
        <LoginPage 
          onBack={() => setPage('main')} 
          onLogin={handleLogin}
        />
      )}
    </div>
  )
}

export default App 
