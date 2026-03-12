/**
 * Centered confirmation modal. Used for: approve/reject create-club request, delete club, save/discard edit.
 */
function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Тийм',
  cancelLabel = 'Цуцлах',
  onConfirm,
  onCancel,
  variant = 'primary',
}) {
  if (!open) return null

  const isDanger = variant === 'danger'
  const confirmClass = isDanger
    ? 'bg-red-600 hover:bg-red-500 text-white'
    : 'bg-button-primary text-button-primary-text hover:bg-button-primary-hover'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      role="dialog"
      onClick={onCancel}
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div
        className="rounded-2xl border border-border-default bg-block-background-muted shadow-xl max-w-md w-full p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-base sm:text-lg font-semibold text-text-heading">
          {title}
        </h2>
        <p id="confirm-modal-desc" className="text-sm text-text-paragraph">
          {message}
        </p>
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-input-background text-text-paragraph hover:text-text-heading transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
