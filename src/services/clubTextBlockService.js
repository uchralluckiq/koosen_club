import { clubTextBlocks } from '../mockdata/clubsInfo/clubTextBlocks'
import { logTable } from '../utils/devLog'

const USE_BACKEND = false
const API_BASE_URL = '/api'

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

let nextId = Math.max(...clubTextBlocks.map((b) => b.id), 0) + 1

export const clubTextBlockService = {
  async getByClubId(clubId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/textblocks`)
      if (!response.ok) throw new Error('Failed to fetch text blocks')
      return response.json()
    }

    const blocks = clubTextBlocks
      .filter((b) => b.club_id === clubId)
      .sort((a, b) => a.order_index - b.order_index)
    return delay([...blocks])
  },

  async create(clubId, blockData) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/textblocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockData),
      })
      if (!response.ok) throw new Error('Failed to create text block')
      return response.json()
    }

    const maxOrder = Math.max(
      ...clubTextBlocks.filter((b) => b.club_id === clubId).map((b) => b.order_index),
      0
    )

    const newBlock = {
      id: nextId++,
      club_id: clubId,
      title: blockData.title || 'Шинэ блок',
      content: blockData.content || '',
      media_url: blockData.media_url || null,
      media_type: blockData.media_type || null,
      order_index: maxOrder + 1,
    }

    clubTextBlocks.push(newBlock)
    logTable('clubTextBlocks', clubTextBlocks)
    return delay({ ...newBlock })
  },

  async update(blockId, updates) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/textblocks/${blockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update text block')
      return response.json()
    }

    const index = clubTextBlocks.findIndex((b) => b.id === blockId)
    if (index === -1) throw new Error('Text block not found')

    clubTextBlocks[index] = { ...clubTextBlocks[index], ...updates }
    logTable('clubTextBlocks', clubTextBlocks)
    return delay({ ...clubTextBlocks[index] })
  },

  async delete(blockId) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/textblocks/${blockId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete text block')
      return response.json()
    }

    const index = clubTextBlocks.findIndex((b) => b.id === blockId)
    if (index === -1) throw new Error('Text block not found')

    clubTextBlocks.splice(index, 1)
    logTable('clubTextBlocks', clubTextBlocks)
    return delay({ success: true })
  },

  async reorder(clubId, blockIds) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/textblocks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockIds }),
      })
      if (!response.ok) throw new Error('Failed to reorder text blocks')
      return response.json()
    }

    blockIds.forEach((id, index) => {
      const block = clubTextBlocks.find((b) => b.id === id)
      if (block) block.order_index = index + 1
    })
    logTable('clubTextBlocks', clubTextBlocks)
    return delay({ success: true })
  },
}
