import { useState, useEffect } from 'react'
import { clubService, CLUB_TYPE_LABELS, ENGINEER_CLASS_LABELS, COLLEGE_YEAR_LABELS } from '../services/clubService'
import { clubTextBlockService } from '../services/clubTextBlockService'
import ClubTextBlock from '../components/ClubTextBlock'
import ClubCustomizer from '../components/ClubCustomizer'

function ClubDetailPage({ clubId, user, onBack }) {
  const [club, setClub] = useState(null)
  const [textBlocks, setTextBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [showCustomizer, setShowCustomizer] = useState(false)

  const canEdit = clubService.canEditClub(club, user)

  useEffect(() => {
    loadClubData()
  }, [clubId])

  const loadClubData = async () => {
    setLoading(true)
    try {
      const [clubData, blocks] = await Promise.all([
        clubService.getById(clubId),
        clubTextBlockService.getByClubId(clubId),
      ])
      setClub(clubData)
      setTextBlocks(blocks)
    } catch (err) {
      console.error('Failed to load club:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClubUpdate = (updatedClub) => {
    setClub((prev) => ({ ...prev, ...updatedClub }))
  }

  const handleBlockUpdate = async (blockId, updates) => {
    try {
      const updated = await clubTextBlockService.update(blockId, updates)
      setTextBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? updated : b))
      )
    } catch (err) {
      console.error('Failed to update block:', err)
    }
  }

  const handleBlockDelete = async (blockId) => {
    try {
      await clubTextBlockService.delete(blockId)
      setTextBlocks((prev) => prev.filter((b) => b.id !== blockId))
    } catch (err) {
      console.error('Failed to delete block:', err)
    }
  }

  const handleAddBlock = async () => {
    try {
      const newBlock = await clubTextBlockService.create(clubId, {
        title: 'Шинэ блок',
        content: '',
      })
      setTextBlocks((prev) => [...prev, newBlock])
    } catch (err) {
      console.error('Failed to add block:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-charcoal-blue-300">Ачааллаж байна...</div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-charcoal-blue-300">Клуб олдсонгүй</div>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-xl font-semibold border-2 border-light-cyan-400/80 text-light-cyan-100 hover:bg-light-cyan-900/40 transition-colors"
        >
          Буцах
        </button>
      </div>
    )
  }

  const typeLabel = club.type ? CLUB_TYPE_LABELS[club.type] : null
  const engineerLabels = club.engineerClasses?.map((c) => ENGINEER_CLASS_LABELS[c]).filter(Boolean) || []
  const collegeYearLabels = club.collegeYears?.map((y) => COLLEGE_YEAR_LABELS[y]).filter(Boolean) || []

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-charcoal-blue-200 hover:text-frosted-blue-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Буцах</span>
            </button>

            {canEdit && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditMode(!editMode)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    editMode
                      ? 'bg-honeydew-600 text-honeydew-50'
                      : 'bg-charcoal-blue-800 text-charcoal-blue-200 hover:text-frosted-blue-100'
                  }`}
                >
                  {editMode ? 'Засах горимоос гарах' : 'Засах'}
                </button>
              </div>
            )}
          </div>

          {/* Club main info card */}
          <div className="rounded-2xl bg-charcoal-blue-900/60 border border-charcoal-blue-800 overflow-hidden">
            {club.main_media_url && (
              <div className="w-full h-48 sm:h-64">
                {club.main_media_type === 'video' ? (
                  <video
                    src={club.main_media_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={club.main_media_url}
                    alt={club.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-frosted-blue-50">
                    {club.name}
                  </h1>
                  {typeLabel && (
                    <span className="inline-block mt-2 text-xs font-medium text-honeydew-900 bg-honeydew-300/90 px-2 py-1 rounded-lg">
                      {typeLabel}
                    </span>
                  )}
                </div>

                {canEdit && editMode && (
                  <button
                    type="button"
                    onClick={() => setShowCustomizer(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal-blue-800 text-charcoal-blue-200 hover:text-frosted-blue-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Тохиргоо</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-charcoal-blue-300">
                    <span className="font-semibold text-frosted-blue-200">Гишүүд:</span>{' '}
                    {club.memberCount ?? 0}/{club.maximum_member}
                  </p>
                  {collegeYearLabels.length > 0 && (
                    <p className="text-charcoal-blue-300">
                      <span className="font-semibold text-frosted-blue-200">Курс:</span>{' '}
                      {collegeYearLabels.join(', ')}
                    </p>
                  )}
                  {engineerLabels.length > 0 && (
                    <p className="text-charcoal-blue-300">
                      <span className="font-semibold text-frosted-blue-200">Мэргэжил:</span>{' '}
                      {engineerLabels.join(', ')}
                    </p>
                  )}
                </div>

                {club.schedules?.length > 0 && (
                  <div>
                    <p className="font-semibold text-frosted-blue-200 mb-1">Цагийн хуваарь:</p>
                    <ul className="text-charcoal-blue-300 space-y-0.5">
                      {club.schedules.map((s, i) => (
                        <li key={i}>
                          {s.day_of_week} {s.start_time}–{s.end_time}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text blocks */}
          <div className="space-y-4">
            {textBlocks.map((block) => (
              <ClubTextBlock
                key={block.id}
                block={block}
                isEditing={editMode}
                onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
                onDelete={handleBlockDelete}
              />
            ))}

            {editMode && (
              <button
                type="button"
                onClick={handleAddBlock}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-charcoal-blue-700 text-charcoal-blue-400 hover:border-frosted-blue-600 hover:text-frosted-blue-300 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Шинэ блок нэмэх</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Club customizer modal */}
      {showCustomizer && (
        <ClubCustomizer
          club={club}
          onUpdate={handleClubUpdate}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  )
}

export default ClubDetailPage
