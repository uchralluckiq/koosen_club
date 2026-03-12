import { useState } from 'react'

function ClubTextBlock({ block, isEditing, onUpdate, onDelete }) {
  const [localTitle, setLocalTitle] = useState(block.title || '')
  const [localContent, setLocalContent] = useState(block.content || '')
  const [localMediaUrl, setLocalMediaUrl] = useState(block.media_url || '')
  const [localMediaType, setLocalMediaType] = useState(block.media_type || 'image')

  const handleSave = () => {
    onUpdate?.({
      title: localTitle,
      content: localContent,
      media_url: localMediaUrl || null,
      media_type: localMediaUrl ? localMediaType : null,
    })
  }
  // used in: Хадгалах button (edit mode)

  const renderMedia = () => {
    if (!block.media_url) return null

    if (block.media_type === 'video') {
      return (
        <video
          src={block.media_url}
          controls
          className="w-full max-h-64 rounded-xl object-cover"
        />
      )
    }

    return (
      <img
        src={block.media_url}
        alt={block.title}
        className="w-full max-h-64 rounded-xl object-cover"
      />
    )
  }
  // used in: view mode (block display)

  if (isEditing) {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-block-background-muted border border-border-input space-y-4">
        <div className="flex justify-between items-center gap-2">
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            placeholder="Блокны гарчиг"
            className="flex-1 rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-focus-ring placeholder-text-placeholder"
          />
          <button
            type="button"
            onClick={() => onDelete?.(block.id)}
            className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
            title="Устгах"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <textarea
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          placeholder="Агуулга бичих..."
          rows={4}
          className="w-full rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-focus-ring placeholder-text-placeholder resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={localMediaUrl}
            onChange={(e) => setLocalMediaUrl(e.target.value)}
            placeholder="Медиа URL (зураг/видео)"
            className="flex-1 rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-focus-ring placeholder-text-placeholder"
          />
          <select
            value={localMediaType}
            onChange={(e) => setLocalMediaType(e.target.value)}
            className="rounded-xl border border-border-input bg-input-background text-text-title text-sm sm:text-base px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-focus-ring"
          >
            <option value="image">Зураг</option>
            <option value="video">Видео</option>
          </select>
        </div>

        {localMediaUrl && (
          <div className="rounded-xl overflow-hidden border border-border-input">
            {localMediaType === 'video' ? (
              <video src={localMediaUrl} controls className="w-full max-h-48 object-cover" />
            ) : (
              <img src={localMediaUrl} alt="Preview" className="w-full max-h-48 object-cover" />
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="w-full py-2 rounded-xl text-xs sm:text-sm font-semibold bg-button-primary-subtle text-button-primary-text hover:bg-button-primary-hover-subtle transition-colors"
        >
          Хадгалах
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-block-background-muted border border-border-default space-y-3">
      {block.title && (
        <h3 className="text-sm sm:text-lg font-semibold text-text-heading">{block.title}</h3>
      )}
      {renderMedia()}
      {block.content && (
        <p className="text-xs sm:text-sm text-text-paragraph whitespace-pre-wrap">{block.content}</p>
      )}
    </div>
  )
}

export default ClubTextBlock
