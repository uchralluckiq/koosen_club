import { clubJoinRequests } from '../mockdata/clubsInfo/clubJoinRequests'
import { clubMembers } from '../mockdata/clubsInfo/clubMembers'
import { logTable } from '../utils/devLog'

const USE_BACKEND = false
const API_BASE_URL = '/api'

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

let nextId = Math.max(...clubJoinRequests.map((r) => r.id), 0) + 1

export const clubJoinRequestService = {
  async getByClubId(clubId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/join-requests`)
      if (!response.ok) throw new Error('Failed to fetch join requests')
      return response.json()
    }

    const requests = clubJoinRequests.filter(
      (r) => r.club_id === clubId && r.status === 1 // 1: pending
    )
    return delay([...requests])
  },

  async getByUserId(userId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/join-requests`)
      if (!response.ok) throw new Error('Failed to fetch user join requests')
      return response.json()
    }

    const requests = clubJoinRequests.filter((r) => r.student_id === userId)
    return delay([...requests])
  },

  hasPendingRequest(clubId, userId) {
    if (!clubId || !userId) return false
    return clubJoinRequests.some(
      (r) => r.club_id === clubId && r.student_id === userId && r.status === 1 // 1: pending
    )
  },

  async sendRequest(clubId, userId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/join-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!response.ok) throw new Error('Failed to send join request')
      return response.json()
    }

    if (clubJoinRequests.some(
      (r) => r.club_id === clubId && r.student_id === userId && r.status === 1 // 1: pending
    )) {
      throw new Error('Already has pending request')
    }

    const newRequest = {
      id: nextId++,
      club_id: clubId,
      student_id: userId,
      status: 1, // 1: pending
      requested_date: new Date().toISOString().split('T')[0],
      reviewed_by: null,
    }

    clubJoinRequests.push(newRequest)
    logTable('clubJoinRequests', clubJoinRequests)
    return delay({ ...newRequest })
  },

  async approveRequest(requestId, reviewerId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/join-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId }),
      })
      if (!response.ok) throw new Error('Failed to approve request')
      return response.json()
    }

    const request = clubJoinRequests.find((r) => r.id === requestId)
    if (!request) throw new Error('Request not found')

    request.status = 2 // 2: approved
    request.reviewed_by = reviewerId

    clubMembers.push({
      club_id: request.club_id,
      student_id: request.student_id,
      role: 2, // 2: member
    })
    logTable('clubJoinRequests', clubJoinRequests)
    logTable('clubMembers', clubMembers)

    return delay({ ...request })
  },

  async rejectRequest(requestId, reviewerId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/join-requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId }),
      })
      if (!response.ok) throw new Error('Failed to reject request')
      return response.json()
    }

    const request = clubJoinRequests.find((r) => r.id === requestId)
    if (!request) throw new Error('Request not found')

    request.status = 3 // 3: rejected
    request.reviewed_by = reviewerId
    logTable('clubJoinRequests', clubJoinRequests)

    return delay({ ...request })
  },
}
