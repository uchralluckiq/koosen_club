import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 24, background: '#0b1519', color: '#dbe9f0', fontFamily: 'system-ui, sans-serif', textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: 8 }}>Алдаа гарлаа</h1>
          <p style={{ marginBottom: 16, maxWidth: 400 }}>{this.state.error?.message ?? 'Unknown error'}</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: 8 }}
          >
            Дахин оролдох
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
