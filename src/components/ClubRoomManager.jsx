import { useState } from 'react'
import { rooms } from '../assets/mockdata/rooms'
import { clubService } from '../services/clubService'

function ClubRoomManager({ club, onRoomChange }) {
  const [saving, setSaving] = useState(null)

  const availableRooms = rooms.filter((r) => r.allowed_for_club === true)
  const notAvailableRooms = rooms.filter((r) => r.allowed_for_club === false)

  const handleSelectRoom = async (roomId) => {
    const newRoomId = club.room_id === roomId ? null : roomId
    setSaving(roomId)
    try {
      await clubService.update(club.id, { room_id: newRoomId })
      onRoomChange?.()
    } catch (err) {
      console.error('Failed to update room:', err)
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Available rooms */}
      <div className="rounded-2xl bg-charcoal-blue-900/60 border border-charcoal-blue-800 overflow-hidden">
        <div className="p-3 sm:p-5 border-b border-charcoal-blue-800">
          <h3 className="text-sm sm:text-lg font-semibold text-frosted-blue-100">
            Боломжтой өрөөнүүд
          </h3>
        </div>
        {availableRooms.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-charcoal-blue-400 text-xs sm:text-sm">
            Боломжтой өрөө байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-charcoal-blue-800">
            {availableRooms.map((room) => {
              const isSelected = club.room_id === room.id
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleSelectRoom(room.id)}
                  disabled={saving !== null}
                  className={`w-full p-3 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors disabled:opacity-50 ${
                    isSelected
                      ? 'bg-light-cyan-900/40 text-light-cyan-100'
                      : 'hover:bg-charcoal-blue-800/60 text-charcoal-blue-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{room.room_name}</span>
                  {saving === room.id ? (
                    <span className="text-xs text-charcoal-blue-400">...</span>
                  ) : isSelected ? (
                    <span className="text-[10px] sm:text-xs bg-light-cyan-600 text-white px-2 py-0.5 rounded-full">
                      Сонгосон
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Not available rooms */}
      <div className="rounded-2xl bg-charcoal-blue-900/60 border border-charcoal-blue-800 overflow-hidden opacity-75">
        <div className="p-3 sm:p-5 border-b border-charcoal-blue-800">
          <h3 className="text-sm sm:text-lg font-semibold text-charcoal-blue-400">
            Боломжгүй өрөөнүүд
          </h3>
        </div>
        {notAvailableRooms.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-charcoal-blue-500 text-xs sm:text-sm">
            Боломжгүй өрөө байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-charcoal-blue-800">
            {notAvailableRooms.map((room) => (
              <div
                key={room.id}
                className="p-3 sm:p-5 flex items-center justify-between gap-3 text-charcoal-blue-500"
              >
                <span className="text-xs sm:text-sm">{room.room_name}</span>
                <span className="text-[10px] sm:text-xs text-charcoal-blue-600">Боломжгүй</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubRoomManager
