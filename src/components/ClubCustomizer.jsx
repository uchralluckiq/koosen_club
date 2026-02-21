import { useState } from 'react'
import { clubService, CLUB_TYPE_LABELS } from '../services/clubService'

function ClubCustomizer({ club, onUpdate, onClose }) {
  const [name, setName] = useState(club.name || '')
  const [type, setType] = useState(club.type || 'education')
  const [maxMember, setMaxMember] = useState(club.maximum_member || 20)
  const [mainMediaUrl, setMainMediaUrl] = useState(club.main_media_url || '')
  const [mainMediaType, setMainMediaType] = useState(club.main_media_type || 'image')
  const [saving, setSaving] = useState(false)

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
      onUpdate?.(updated)
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

      <div className="relative w-full max-w-lg bg-slate-blue-950 rounded-2xl border border-charcoal-blue-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-xl font-semibold text-frosted-blue-100">
            Клубын мэдээлэл засах
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-charcoal-blue-200 hover:bg-charcoal-blue-800 hover:text-frosted-blue-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-frosted-blue-200 mb-2">
              Клубын нэр
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-charcoal-blue-700 bg-charcoal-blue-800 text-frosted-blue-50 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-frosted-blue-500 placeholder-charcoal-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-frosted-blue-200 mb-2">
              Төрөл
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-charcoal-blue-700 bg-charcoal-blue-800 text-frosted-blue-50 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-frosted-blue-500"
            >
              {Object.entries(CLUB_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-frosted-blue-200 mb-2">
              Хамгийн их гишүүн
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxMember}
              onChange={(e) => setMaxMember(Number(e.target.value))}
              className="w-full rounded-xl border border-charcoal-blue-700 bg-charcoal-blue-800 text-frosted-blue-50 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-frosted-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-frosted-blue-200 mb-2">
              Үндсэн зураг/видео URL
            </label>
            <input
              type="text"
              value={mainMediaUrl}
              onChange={(e) => setMainMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-charcoal-blue-700 bg-charcoal-blue-800 text-frosted-blue-50 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-frosted-blue-500 placeholder-charcoal-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-frosted-blue-200 mb-2">
              Медиа төрөл
            </label>
            <select
              value={mainMediaType}
              onChange={(e) => setMainMediaType(e.target.value)}
              className="w-full rounded-xl border border-charcoal-blue-700 bg-charcoal-blue-800 text-frosted-blue-50 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-frosted-blue-500"
            >
              <option value="image">Зураг</option>
              <option value="video">Видео</option>
            </select>
          </div>

          {mainMediaUrl && (
            <div className="rounded-xl overflow-hidden border border-charcoal-blue-700">
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
            className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-light-cyan-600/90 text-light-cyan-50 hover:bg-light-cyan-500/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Хадгалж байна...' : 'Хадгалах'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border-2 border-charcoal-blue-600 text-charcoal-blue-200 hover:bg-charcoal-blue-800 transition-colors"
          >
            Цуцлах
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClubCustomizer
