import { useState, useEffect } from 'react'
import { feedbackService } from '../services/feedbackService'
import { users } from '../mockdata/users'
import ConfirmModal from '../components/ConfirmModal'

const STATUS_LABELS = { 1: 'Шинэ', 2: 'Уншсан' }

function FeedbackPage({ user, onGoToLogin }) {
  const [content, setContent] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const isAdmin = user?.role === 1

  const loadItems = async () => {
    if (!user?.id) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const data = isAdmin
        ? await feedbackService.getAll()
        : await feedbackService.getByUserId(user.id)
      setItems(data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [user?.id, isAdmin])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!user) {
      onGoToLogin?.()
      return
    }

    setSubmitLoading(true)
    try {
      await feedbackService.create({
        user_id: user.id,
        content,
      })
      setSuccess('Санал хүсэлт амжилттай илгээгдлээ.')
      setContent('')
      loadItems()
    } catch (err) {
      setError(err.message ?? 'Алдаа гарлаа')
    } finally {
      setSubmitLoading(false)
    }
  }

  const getSenderName = (userId) => users.find((u) => u.id === userId)?.name ?? userId

  const handleOpenFeedback = async (item) => {
    setSelectedFeedback(item)
    if (item.status === 1) {
      try {
        await feedbackService.markRead(item.id)
        loadItems()
      } catch {
        loadItems()
      }
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedFeedback) return
    const id = selectedFeedback.id
    setShowDeleteConfirm(false)
    try {
      await feedbackService.delete(id)
      setSelectedFeedback(null)
      loadItems()
    } catch (err) {
      setError(err.message ?? 'Устгахад алдаа гарлаа')
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-lg sm:text-xl font-bold text-text-heading">
          Санал хүсэлт
        </h1>

        {!user ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Санал илгээхийн тулд нэвтэрнэ үү.
            <button
              type="button"
              onClick={onGoToLogin}
              className="ml-2 underline font-medium hover:no-underline"
            >
              Нэвтрэх
            </button>
          </div>
        ) : isAdmin ? (
          <section>
            <h2 className="text-base font-semibold text-text-heading mb-3">
              Ирсэн санал хүслүүд
            </h2>
            {loading ? (
              <p className="text-sm text-text-muted">Ачааллаж байна...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-text-muted rounded-xl border border-border-default bg-block-background-muted p-4">
                Санал хүсэлт ирээгүй байна.
              </p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenFeedback(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleOpenFeedback(item)
                      }
                    }}
                    className="rounded-xl border border-border-default bg-block-background-muted p-3 sm:p-4 flex items-center justify-between gap-2 cursor-pointer hover:bg-block-background-strong transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-heading">
                        {getSenderName(item.user_id)}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {item.requested_date}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${
                        item.status === 1
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {STATUS_LABELS[item.status] ?? item.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border-default bg-block-background-muted p-4 sm:p-6 space-y-4"
            >
              {error && (
                <div className="rounded-lg bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-green-500/20 border border-green-500 text-green-300 px-4 py-2 text-sm">
                  {success}
                </div>
              )}

              <div>
                <label htmlFor="feedback-content" className="block text-sm font-semibold text-text-label mb-1">
                  Санал, хүсэлт <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="feedback-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-border-default bg-input-background px-3 py-2 text-sm text-text-heading placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-button-primary/50 resize-none"
                  placeholder="Санал, санал хүсэлтээ энд бичнэ үү..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading || !content?.trim()}
                className="w-full py-2.5 sm:py-3 rounded-xl text-sm font-semibold bg-button-primary text-button-primary-text hover:bg-button-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitLoading ? 'Илгээж байна...' : 'Илгээх'}
              </button>
            </form>

            <section>
              <h2 className="text-base font-semibold text-text-heading mb-3">
                Миний илгээсэн санал хүслүүд
              </h2>
              {loading ? (
                <p className="text-sm text-text-muted">Ачааллаж байна...</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-text-muted rounded-xl border border-border-default bg-block-background-muted p-4">
                  Одоогоор санал илгээгээгүй байна.
                </p>
              ) : (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-border-default bg-block-background-muted p-3 sm:p-4"
                    >
                      <p className="text-sm text-text-paragraph whitespace-pre-wrap">
                        {item.content}
                      </p>
                      <p className="text-xs text-text-muted mt-2 flex items-center justify-between gap-2">
                        <span>{item.requested_date}</span>
                        <span
                          className={`font-medium px-2 py-0.5 rounded ${
                            item.status === 1
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}
                        >
                          {STATUS_LABELS[item.status] ?? item.status}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>

      {selectedFeedback && (
        <div
          className="fixed inset-0 z-\[100\] flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-detail-title"
          onClick={() => setSelectedFeedback(null)}
        >
          <div
            className="rounded-2xl border border-border-default bg-block-background-muted shadow-xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 id="feedback-detail-title" className="text-base sm:text-lg font-semibold text-text-heading">
                Санал хүсэлтийн дэлгэрэнгүй
              </h2>
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="p-1.5 rounded-lg text-text-paragraph hover:bg-input-background hover:text-text-heading transition-colors"
                aria-label="Хаах"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-text-muted">
              {getSenderName(selectedFeedback.user_id)} · {selectedFeedback.requested_date}
            </p>
            <div className="flex-1 min-h-0 overflow-auto rounded-lg border border-border-default bg-input-background p-3 text-sm text-text-paragraph whitespace-pre-wrap">
              {selectedFeedback.content}
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-600/80 text-white hover:bg-red-500/80 transition-colors"
                >
                  Устгах
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-input-background text-text-paragraph hover:text-text-heading transition-colors"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showDeleteConfirm}
        title="Санал хүсэлтийг устгах уу?"
        message="Та энэ санал хүсэлтийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцааж болохгүй."
        confirmLabel="Устгах"
        cancelLabel="Цуцлах"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}

export default FeedbackPage
