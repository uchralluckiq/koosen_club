import { useState, useEffect } from 'react'
import { clubService, CLUB_TYPE_LABELS } from '../services/clubService'
import { clubScheduleDays } from '../assets/mockdata/clubsInfo/clubScheduleDay'
import { clubScheduleTimes } from '../assets/mockdata/clubsInfo/clubScheduleTime'

const SCHEDULE_DAYS = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан']

function ClubCustomizer({ club, onUpdate, onClose, onSaved }) {
  const [name, setName] = useState(club?.name || '')
  const [type, setType] = useState(club?.type || 'education')
  const [maxMember, setMaxMember] = useState(club?.maximum_member || 20)
  const [mainMediaUrl, setMainMediaUrl] = useState(club?.main_media_url || '')
  const [mainMediaType, setMainMediaType] = useState(club?.main_media_type || 'image')
  const [scheduleDays, setScheduleDays] = useState([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!club?.id) return
    const days = clubScheduleDays
      .filter((d) => d.club_id === club.id && d.day_of_week != null)
      .map((d) => d.day_of_week)
    setScheduleDays(days)
    const time = clubScheduleTimes.find((t) => t.club_id === club.id)
    setStartTime(time?.start_time || '')
    setEndTime(time?.end_time || '')
  }, [club?.id])

  const toggleDay = (day) => {
    setScheduleDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await clubService.update(club.id, {
        name,
        type,
        maximum_member: maxMember,
        main_media_url: mainMediaUrl || null,
        main_media_type: mainMediaUrl ? mainMediaType : 'image',
      })
      const oldDays = clubScheduleDays.filter((d) => d.club_id !== club.id)
      const newDays = scheduleDays.map((day) => ({ club_id: club.id, day_of_week: day }))
      clubScheduleDays.length = 0
      clubScheduleDays.push(...oldDays, ...newDays)
      const timeRow = clubScheduleTimes.find((t) => t.club_id === club.id)
      const st = startTime || null
      const et = endTime || null
      if (timeRow) {
        timeRow.start_time = st
        timeRow.end_time = et
      } else {
        clubScheduleTimes.push({ club_id: club.id, start_time: st, end_time: et })
      }
      onUpdate?.(updated)
      onSaved?.()
      onClose?.()
    } catch (err) {
      console.error('Failed to update club:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-nav-background rounded-2xl border border-border-default p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-xl font-semibold text-text-heading">
            Клубын мэдээлэл засах
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-paragraph hover:bg-input-background hover:text-text-heading transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              Клубын нэр
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring placeholder-text-placeholder"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              Төрөл
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              {Object.entries(CLUB_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              Хамгийн их гишүүн
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxMember}
              onChange={(e) => setMaxMember(Number(e.target.value))}
              className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              Үндсэн зураг/видео URL
            </label>
            <input
              type="text"
              value={mainMediaUrl}
              onChange={(e) => setMainMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring placeholder-text-placeholder"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              Медиа төрөл
            </label>
            <select
              value={mainMediaType}
              onChange={(e) => setMainMediaType(e.target.value)}
              className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring"
            >
              <option value="image">Зураг</option>
              <option value="video">Видео</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
              Цагийн хуваарь – өдрүүд
            </label>
            <div className="flex flex-wrap gap-2">
              {SCHEDULE_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    scheduleDays.includes(day)
                      ? 'bg-button-primary text-button-primary-text'
                      : 'bg-input-background text-text-muted hover:text-text-paragraph'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
                Эхлэх цаг
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-label mb-2">
                Дуусах цаг
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
            </div>
          </div>

          {mainMediaUrl && (
            <div className="rounded-xl overflow-hidden border border-border-input">
              {mainMediaType === 'video' ? (
                <video src={mainMediaUrl} controls className="w-full max-h-48 object-cover" />
              ) : (
                <img src={mainMediaUrl} alt="Preview" className="w-full max-h-48 object-cover" />
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-button-primary-subtle text-button-primary-text hover:bg-button-primary-hover-subtle transition-colors disabled:opacity-50"
          >
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border-2 border-border-secondary text-text-paragraph hover:bg-input-background transition-colors"
          >
            Цуцлах
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClubCustomizer
