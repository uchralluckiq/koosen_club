import { useState, useEffect } from 'react'
import { clubService, CLUB_TYPE_LABELS, ENGINEER_CLASS_LABELS } from '../services/clubService'
import { clubTextBlockService } from '../services/clubTextBlockService'
import { clubJoinRequestService } from '../services/clubJoinRequestService'
import { clubScheduleDays } from '../mockdata/clubsInfo/clubScheduleDay'
import { clubScheduleTimes } from '../mockdata/clubsInfo/clubScheduleTime'
import ClubTextBlock from '../components/ClubTextBlock'
import ClubCustomizer from '../components/ClubCustomizer'
import ClubMemberManager from '../components/ClubMemberManager'
import ClubRoomManager from '../components/ClubRoomManager'
import ConfirmModal from '../components/ConfirmModal'

function ClubDetailPage({ clubId, user, onBack, onGoToLogin }) {
  const [club, setClub] = useState(null)
  const [textBlocks, setTextBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editTab, setEditTab] = useState('info')
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [joining, setJoining] = useState(false)
  const [userHasPendingRequest, setUserHasPendingRequest] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showExitEditConfirm, setShowExitEditConfirm] = useState(false)

  const canEdit = clubService.canEditClub(club, user)
  const canDelete = clubService.canDeleteClub(club, user)
  const canJoin = clubService.canJoinClub(club, user)
  const hasPendingRequest = user && club && (userHasPendingRequest || clubService.hasPendingRequest(club.id, user.id))

  useEffect(() => {
    loadClubData()
  }, [clubId])

  useEffect(() => {
    if (!user?.id || !clubId) {
      setUserHasPendingRequest(false)
      return
    }
    clubJoinRequestService.getByUserId(user.id).then((requests) => {
      const pending = requests.some(
        (r) => r.club_id === clubId && r.status === 1 // 1: pending
      )
      setUserHasPendingRequest(pending)
    })
  }, [user?.id, clubId])

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
  // used in: useEffect([clubId]), handleJoinClub, ClubCustomizer/ClubMemberManager/ClubRoomManager (onSaved/onMemberChange/onRoomChange)

  const handleClubUpdate = (updatedClub) => {
    setClub((prev) => ({ ...prev, ...updatedClub }))
  }
  // used in: ClubCustomizer (onUpdate prop)

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
  // used in: ClubTextBlock (onDelete prop)

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
  // used in: "Шинэ блок нэмэх" button

  const handleDeleteClubClick = () => {
    if (club && canDelete) setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!club) return
    setShowDeleteConfirm(false)
    try {
      await clubService.delete(club.id)
      onBack?.()
    } catch (err) {
      console.error('Failed to delete club:', err)
    }
  }

  const handleExitEditClick = () => {
    setShowExitEditConfirm(true)
  }

  const handleConfirmSaveAndExit = () => {
    setShowExitEditConfirm(false)
    loadClubData()
    setEditMode(false)
  }

  const handleConfirmDiscardExit = () => {
    setShowExitEditConfirm(false)
    setEditMode(false)
  }

  const handleJoinClub = async () => {
    if (!user) {
      onGoToLogin?.()
      return
    }

    setJoining(true)
    try {
      await clubJoinRequestService.sendRequest(clubId, user.id)
      setUserHasPendingRequest(true)
      await loadClubData()
    } catch (err) {
      console.error('Failed to send join request:', err)
    } finally {
      setJoining(false)
    }
  }
  // used in: Элсэх button

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xs sm:text-sm text-text-muted">Ачааллаж байна...</div>
      </div>
    )
  }

  if (!club) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-xs sm:text-sm text-text-muted">Клуб олдсонгүй</div>
        <button
          type="button"
          onClick={onBack}
          className="px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold border-2 border-button-outline-border text-button-outline-text hover:bg-button-outline-hover transition-colors"
        >
          Буцах
        </button>
      </div>
    )
  }

  const typeLabel = club.type ? CLUB_TYPE_LABELS[club.type] : null
  const engineerLabels = club.engineerClasses?.map((c) =>
    ENGINEER_CLASS_LABELS[Number(c)] != null ? ENGINEER_CLASS_LABELS[Number(c)] : c
  ).filter(Boolean) || []
  const collegeYearsDisplay = club.collegeYears?.map((y) =>
    y === 'Бүх курс' || (typeof y === 'string' && isNaN(Number(y))) ? y : `${y}-р`
  ).join(', ') || ''

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-text-paragraph hover:text-text-heading transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs sm:text-sm">Буцах</span>
            </button>

            <div className="flex items-center gap-2">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    if (editMode) {
                      handleExitEditClick()
                    } else {
                      setEditMode(true)
                      setEditTab('info')
                    }
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    editMode
                      ? 'bg-button-green text-button-green-text'
                      : 'bg-input-background text-text-paragraph hover:text-text-heading'
                  }`}
                >
                  {editMode ? 'Засах горимоос гарах' : 'Засах'}
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDeleteClubClick}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-red-600/80 text-white hover:bg-red-500/80 transition-colors"
                >
                  Клубыг устгах
                </button>
              )}
            </div>
          </div>

          {/* Edit mode tabs navbar */}
          {editMode && (
            <div className="rounded-xl bg-block-background-strong border border-border-default p-1 flex gap-1">
              <button
                type="button"
                onClick={() => setEditTab('info')}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  editTab === 'info'
                    ? 'bg-button-primary text-white'
                    : 'text-text-muted hover:text-text-heading hover:bg-input-background'
                }`}
              >
                Клубын мэдээлэл
              </button>
              <button
                type="button"
                onClick={() => setEditTab('members')}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  editTab === 'members'
                    ? 'bg-button-primary text-white'
                    : 'text-text-muted hover:text-text-heading hover:bg-input-background'
                }`}
              >
                Гишүүд удирдах
              </button>
              <button
                type="button"
                onClick={() => setEditTab('room')}
                className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  editTab === 'room'
                    ? 'bg-button-primary text-white'
                    : 'text-text-muted hover:text-text-heading hover:bg-input-background'
                }`}
              >
                Хичээллэх анги
              </button>
            </div>
          )}

          {/* Member management tab content */}
          {editMode && editTab === 'members' && (
            <ClubMemberManager club={club} user={user} onMemberChange={loadClubData} />
          )}

          {/* Room tab content */}
          {editMode && editTab === 'room' && (
            <ClubRoomManager club={club} onRoomChange={loadClubData} />
          )}

          {/* Club info tab content (default view) */}
          {(!editMode || editTab === 'info') && (
            <>
          {/* Club main info card */}
          <div className="rounded-2xl bg-block-background-muted border border-border-default overflow-hidden">
            {club.main_media_url && (
              <div className="w-full h-48 sm:h-64">
                <img
                  src={club.main_media_url}
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-title">
                    {club.name}
                  </h1>
                  {typeLabel && (
                    <span className="inline-block mt-2 text-[10px] sm:text-xs font-medium text-badge-type-text bg-badge-type-bg px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                      {typeLabel}
                    </span>
                  )}
                </div>

                {canEdit && editMode && (
                  <button
                    type="button"
                    onClick={() => setShowCustomizer(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-button-primary/60 bg-button-primary/15 text-button-primary hover:bg-button-primary/25 hover:border-button-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold">Клубийн мэдээлэл засах</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <p className="text-text-muted">
                    <span className="font-semibold text-text-label">Гишүүд:</span>{' '}
                    {club.memberCount ?? 0}/{club.maximum_member}
                  </p>
                  {collegeYearsDisplay && (
                    <p className="text-text-muted">
                      <span className="font-semibold text-text-label">Курс:</span>{' '}
                      {collegeYearsDisplay}
                    </p>
                  )}
                  {engineerLabels.length > 0 && (
                    <p className="text-text-muted">
                      <span className="font-semibold text-text-label">Мэргэжил:</span>{' '}
                      {engineerLabels.join(', ')}
                    </p>
                  )}
                  {club.room_id && (
                    <p className="text-text-muted">
                      <span className="font-semibold text-text-label">Өрөө:</span>{' '}
                      {club.room_id}
                    </p>
                  )}
                </div>

                <div className="text-text-muted space-y-0.5">
                  {(() => {
                    const daysFromSchedules = club.schedules?.length > 0
                      ? [...new Set(club.schedules.map((s) => s.day_of_week))].filter((d) => d != null).sort((a, b) => a - b)
                      : []
                    const daysFromDays = club?.id
                      ? clubScheduleDays.filter((d) => d.club_id === club.id && d.day_of_week != null).map((d) => d.day_of_week)
                      : []
                    const hasDays = daysFromSchedules.length > 0 || daysFromDays.length > 0
                    const dayLabels = hasDays
                      ? (daysFromSchedules.length > 0 ? daysFromSchedules : daysFromDays)
                        .map((d) => (typeof d === 'number' && d >= 1 && d <= 5 ? ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан'][d - 1] : d))
                        .join(', ')
                      : 'тогтсон өдөр байхгүй'
                    const timeFromSchedules = club.schedules?.[0]
                    const timeFromTimes = club?.id ? clubScheduleTimes.find((t) => t.club_id === club.id) : null
                    const startTime = timeFromSchedules?.start_time ?? timeFromTimes?.start_time ?? null
                    const endTime = timeFromSchedules?.end_time ?? timeFromTimes?.end_time ?? null
                    const hasTime = startTime != null || endTime != null
                    const timeText = hasTime ? `${startTime || '–'}–${endTime || '–'}` : 'тогтсон цаг байхгүй'
                    return (
                      <>
                        <p>
                          <span className="font-semibold text-text-label">Хичээллэх өдөр:</span>{' '}
                          {dayLabels}
                        </p>
                        <p>
                          <span className="font-semibold text-text-label">Хичээллэх цаг:</span>{' '}
                          {timeText}
                        </p>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Join club button */}
              {hasPendingRequest ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-button-disabled text-text-placeholder cursor-not-allowed mt-4"
                >
                  Хүсэлт илгээсэн
                </button>
              ) : canJoin && (
                <button
                  type="button"
                  onClick={handleJoinClub}
                  disabled={joining}
                  className="w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-button-green text-button-green-text hover:bg-button-green-hover transition-colors disabled:opacity-50 mt-4"
                >
                  {joining ? 'Илгээж байна...' : 'Элсэх'}
                </button>
              )}
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

            {editMode && editTab === 'info' && (
              <button
                type="button"
                onClick={handleAddBlock}
                className="w-full py-3 sm:py-4 rounded-2xl border-2 border-dashed border-border-add-block text-text-add-block hover:border-border-add-block-hover hover:text-text-add-block-hover transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Шинэ блок нэмэх</span>
              </button>
            )}
          </div>
            </>
          )}
        </div>
      </div>

      {/* Club customizer modal */}
      {showCustomizer && (
        <ClubCustomizer
          club={club}
          onUpdate={handleClubUpdate}
          onClose={() => setShowCustomizer(false)}
          onSaved={loadClubData}
        />
      )}

      <ConfirmModal
        open={showDeleteConfirm}
        title="Клубыг устгах уу?"
        message={club ? `"${club.name}" клубыг бүрмөсөн устгана. Энэ үйлдлийг буцааж болохгүй.` : ''}
        confirmLabel="Устгах"
        cancelLabel="Цуцлах"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ConfirmModal
        open={showExitEditConfirm}
        title="Өөрчлөлтийг хадгалах уу?"
        message="Хадгалах дарвал одоогийн өөрчлөлтүүд хадгалагдана. Цуцлах дарвал засах горимоос гарна."
        confirmLabel="Хадгалах"
        cancelLabel="Цуцлах"
        onConfirm={handleConfirmSaveAndExit}
        onCancel={handleConfirmDiscardExit}
      />
    </div>
  )
}

export default ClubDetailPage
