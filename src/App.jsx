import { useState } from 'react'
import './App.css'
import Home from './pages/Home.jsx'
import MainPage from './pages/MainPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  const [page, setPage] = useState('home')

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
        />
      )}
      {page === 'login' && <LoginPage onBack={() => setPage('home')} />}
    </div>
  )
}

export default App 
