import { useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import MainPage from './pages/MainPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState(null)

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    setPage('main')
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className="app">
      {page === 'home' && (
        <Home onGoToMain={() => setPage('main')} onGoToLogin={() => setPage('login')} />
      )}
      {page === 'main' && (
        <MainPage
          onClubSelect={() => {}}
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
