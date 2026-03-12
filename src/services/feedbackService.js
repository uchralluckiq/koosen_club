import { feedback } from '../mockdata/feedback'
import { logTable } from '../utils/devLog'

const USE_BACKEND = true
const API_BASE_URL = '/api'

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

let nextId = Math.max(0, ...feedback.map((f) => f.id)) + 1

export const feedbackService = {
  async create({ user_id, content }) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, content }),
      })
      if (!response.ok) throw new Error('Failed to submit feedback')
      return response.json()
    }

    if (!user_id || !content?.trim()) {
      throw new Error('Санал хүсэлтээ бичнэ үү')
    }

    const newEntry = {
      id: nextId++,
      user_id,
      content: content.trim(),
      requested_date: new Date().toISOString().split('T')[0],
      status: 1, // 1: new
    }

    feedback.push(newEntry)
    logTable('feedback', feedback)
    return delay({ ...newEntry })
  },

  async getByUserId(userId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/feedback`)
      if (!response.ok) throw new Error('Failed to fetch feedback')
      return response.json()
    }

    const list = feedback.filter((f) => f.user_id === userId)
    return delay(list.map((f) => ({ ...f })))
  },

  async getAll() {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/feedback`)
      if (!response.ok) throw new Error('Failed to fetch feedback')
      return response.json()
    }

    return delay(feedback.map((f) => ({ ...f })))
  },

  async markRead(id) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}/read`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to mark read')
      return response.json()
    }

    const entry = feedback.find((f) => f.id === id)
    if (!entry) throw new Error('Олдсонгүй')
    entry.status = 2 // 2: read
    logTable('feedback', feedback)
    return delay({ ...entry })
  },

  async delete(id) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete feedback')
      return response.json()
    }

    const index = feedback.findIndex((f) => f.id === id)
    if (index === -1) throw new Error('Олдсонгүй')
    feedback.splice(index, 1)
    logTable('feedback', feedback)
    return delay({ success: true })
  },
}
