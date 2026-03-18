import { createClubRequests } from '../mockdata/clubsInfo/createClubRequests'
import { clubs } from '../mockdata/clubsInfo/clubs'
import { clubMembers } from '../mockdata/clubsInfo/clubMembers'
import { clubAllowedCollegeYears } from '../mockdata/clubsInfo/clubAllowedCollegeYears'
import { clubAllowedEngineerClasses } from '../mockdata/clubsInfo/clubAllowedEngineerClasses'
import { clubScheduleDays } from '../mockdata/clubsInfo/clubScheduleDay'
import { clubScheduleTimes } from '../mockdata/clubsInfo/clubScheduleTime'
import { logTable } from '../utils/devLog'

const USE_BACKEND = false
const API_BASE_URL = '/api'

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

let nextId = Math.max(0, ...createClubRequests.map((r) => r.id)) + 1

export const createClubRequestService = {
  async create({ requester_id, name, type = 'education', goal = '', maximum_member = 20 }) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/create-club-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requester_id, name, type, goal, maximum_member }),
      })
      if (!response.ok) throw new Error('Failed to create request')
      return response.json()
    }

    if (!requester_id || !name?.trim()) {
      throw new Error('Нэр болон хүсэлт гаргагч заавал байна')
    }

    const newRequest = {
      id: nextId++,
      requester_id,
      name: name.trim(),
      type: type || 'education',
      goal: goal?.trim() ?? '',
      maximum_member: maximum_member ?? 20,
      status: 1, // 1: pending
      requested_date: new Date().toISOString().split('T')[0],
      reviewed_by: null,
    }

    createClubRequests.push(newRequest)
    logTable('createClubRequests', createClubRequests)
    return delay({ ...newRequest })
  },

  async getByUserId(userId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/create-club-requests`)
      if (!response.ok) throw new Error('Failed to fetch requests')
      return response.json()
    }

    const list = createClubRequests.filter((r) => r.requester_id === userId)
    return delay(list.map((r) => ({ ...r })))
  },

  async getById(requestId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/create-club-requests/${requestId}`)
      if (!response.ok) throw new Error('Request not found')
      return response.json()
    }

    const request = createClubRequests.find((r) => r.id === requestId)
    return delay(request ? { ...request } : undefined)
  },

  async getAll() {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/create-club-requests`)
      if (!response.ok) throw new Error('Failed to fetch requests')
      return response.json()
    }

    return delay(createClubRequests.map((r) => ({ ...r })))
  },

  async approve(requestId, reviewerId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/create-club-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId }),
      })
      if (!response.ok) throw new Error('Failed to approve request')
      return response.json()
    }

    const request = createClubRequests.find((r) => r.id === requestId)
    if (!request) throw new Error('Хүсэлт олдсонгүй')
    if (request.status !== 1) throw new Error('Энэ хүсэлтийг шийдсэн байна')

    const nextClubId = Math.max(0, ...clubs.map((c) => c.id)) + 1
    const newClub = {
      id: nextClubId,
      type: request.type || 'education',
      name: request.name,
      maximum_member: request.maximum_member ?? 20,
      main_media_url: null,
      room_id: null,
    }
    clubs.push(newClub)
    clubMembers.push({
      club_id: nextClubId,
      student_id: request.requester_id,
      role: 1, // 1: leader
    })

    // Placeholder rows so club appears in lists; leader can fill details later
    clubAllowedCollegeYears.push({ club_id: nextClubId, college_year: 'Бүх курс' })
    clubAllowedEngineerClasses.push({ club_id: nextClubId, engineer_class: 'Бүх бүлэг' })
    clubScheduleDays.push({ club_id: nextClubId, day_of_week: null })
    clubScheduleTimes.push({ club_id: nextClubId, start_time: null, end_time: null })

    request.status = 2 // 2: approved
    request.reviewed_by = reviewerId

    logTable('createClubRequests', createClubRequests)
    logTable('clubs', clubs)
    logTable('clubMembers', clubMembers)
    logTable('clubAllowedCollegeYears', clubAllowedCollegeYears)
    logTable('clubAllowedEngineerClasses', clubAllowedEngineerClasses)
    logTable('clubScheduleDays', clubScheduleDays)
    logTable('clubScheduleTimes', clubScheduleTimes)

    return delay({ ...request, created_club_id: nextClubId })
  },

  async reject(requestId, reviewerId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/create-club-requests/${requestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId }),
      })
      if (!response.ok) throw new Error('Failed to reject request')
      return response.json()
    }

    const request = createClubRequests.find((r) => r.id === requestId)
    if (!request) throw new Error('Хүсэлт олдсонгүй')
    if (request.status !== 1) throw new Error('Энэ хүсэлтийг шийдсэн байна')

    request.status = 3 // 3: rejected
    request.reviewed_by = reviewerId
    logTable('createClubRequests', createClubRequests)

    return delay({ ...request })
  },
}
