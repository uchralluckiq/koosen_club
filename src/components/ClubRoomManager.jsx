import { useState } from 'react'
import { rooms } from '../mockdata/rooms'
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
  // used in: room list buttons (Боломжтой өрөөнүүд)

  return (
    <div className="space-y-6">
      {/* Available rooms */}
      <div className="rounded-2xl bg-block-background-muted border border-border-default overflow-hidden">
        <div className="p-3 sm:p-5 border-b border-border-default">
          <h3 className="text-sm sm:text-lg font-semibold text-text-heading">
            Боломжтой өрөөнүүд
          </h3>
        </div>
        {availableRooms.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-text-placeholder text-xs sm:text-sm">
            Боломжтой өрөө байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-border-default">
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
                      ? 'bg-block-selected-bg text-text-selected'
                      : 'hover:bg-block-hover text-text-paragraph'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{room.id}</span>
                  {saving === room.id ? (
                    <span className="text-xs text-text-placeholder">...</span>
                  ) : isSelected ? (
                    <span className="text-[10px] sm:text-xs bg-button-primary text-white px-2 py-0.5 rounded-full">
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
      <div className="rounded-2xl bg-block-background-muted border border-border-default overflow-hidden opacity-75">
        <div className="p-3 sm:p-5 border-b border-border-default">
          <h3 className="text-sm sm:text-lg font-semibold text-text-placeholder">
            Боломжгүй өрөөнүүд
          </h3>
        </div>
        {notAvailableRooms.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-text-caption text-xs sm:text-sm">
            Боломжгүй өрөө байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-border-default">
            {notAvailableRooms.map((room) => (
              <div
                key={room.id}
                className="p-3 sm:p-5 flex items-center justify-between gap-3 text-text-caption"
              >
                <span className="text-xs sm:text-sm">{room.id}</span>
                <span className="text-[10px] sm:text-xs text-text-caption-muted">Боломжгүй</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubRoomManager
