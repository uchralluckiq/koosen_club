import { users } from '../assets/mockdata/users'

const AUTH_STORAGE_KEY = 'koosen_auth_user'

// Set to true when connecting to real backend
const USE_BACKEND = false
const API_BASE_URL = '/api'

export const authService = {
  async login(email, password) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Нэвтрэхэд алдаа гарлаа')
      }

      const data = await response.json()
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user))
      return data.user
    }

    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 300))

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    )

    if (!foundUser) {
      throw new Error('И-мэйл эсвэл нууц үг буруу байна')
    }

    const { password: _, ...userWithoutPassword } = foundUser
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  },

  async logout() {
    if (USE_BACKEND) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' })
      } catch (e) {
        console.error('Logout error:', e)
      }
    }

    localStorage.removeItem(AUTH_STORAGE_KEY)
  },

  getCurrentUser() {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null

    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return null
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null
  },

  async validateSession() {
    if (!USE_BACKEND) {
      return this.getCurrentUser()
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`)
      if (!response.ok) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        return null
      }

      const data = await response.json()
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user))
      return data.user
    } catch {
      return this.getCurrentUser()
    }
  },
}
