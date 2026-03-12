import { useState, useEffect } from 'react'
import { createClubRequestService } from '../services/createClubRequestService'
import { clubService, CLUB_TYPE_LABELS } from '../services/clubService'
import ConfirmModal from '../components/ConfirmModal'

const STATUS_LABELS = { 1: 'Хүлээгдэж буй', 2: 'Зөвшөөрсөн', 3: 'Татгалзсан' }

function CreateClub({ user, onGoToLogin }) {
  const [name, setName] = useState('')
  const [type, setType] = useState('education')
  const [goal, setGoal] = useState('')
  const [maximum_member, setMaximumMember] = useState(20)
  const [requests, setRequests] = useState([])
  const [adminRequests, setAdminRequests] = useState([])
  const [adminLoading, setAdminLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmState, setConfirmState] = useState(null) // { type: 'approve'|'reject', requestId }
  const isAdmin = user?.role === 1

  const loadRequests = async () => {
    if (!user?.id) {
      setRequests([])
      return
    }
    setLoading(true)
    try {
      const data = await createClubRequestService.getByUserId(user.id)
      setRequests(data ?? [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }
  // used in: useEffect, after submit

  const loadAdminRequests = async () => {
    setAdminLoading(true)
    try {
      const data = await createClubRequestService.getAll()
      setAdminRequests(data ?? [])
    } catch {
      setAdminRequests([])
    } finally {
      setAdminLoading(false)
    }
  }
  // used in: useEffect (admin), after approve/reject

  useEffect(() => {
    loadRequests()
    if (user?.role === 1) loadAdminRequests()
  }, [user?.id, user?.role])

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
      if (isAdmin) {
        await clubService.createClubWithPlaceholders(
          { name, type, goal, maximum_member: Number(maximum_member) || 20 },
          user.id
        )
        setSuccess('Клуб амжилттай үүслээ.')
        setName('')
        setGoal('')
        setMaximumMember(20)
        setType('education')
        loadAdminRequests()
      } else {
        await createClubRequestService.create({
          requester_id: user.id,
          name,
          type,
          goal,
          maximum_member: Number(maximum_member) || 20,
        })
        setSuccess('Клуб үүсгэх хүсэлт амжилттай илгээгдлээ.')
        setName('')
        setGoal('')
        setMaximumMember(20)
        setType('education')
        loadRequests()
      }
    } catch (err) {
      setError(err.message ?? 'Алдаа гарлаа')
    } finally {
      setSubmitLoading(false)
    }
  }
  // used in: form onSubmit

  const handleConfirmApprove = async () => {
    if (!confirmState || confirmState.type !== 'approve') return
    const requestId = confirmState.requestId
    setConfirmState(null)
    try {
      await createClubRequestService.approve(requestId, user.id)
      loadAdminRequests()
      loadRequests()
    } catch (err) {
      setError(err.message ?? 'Зөвшөөрөхөд алдаа гарлаа')
    }
  }

  const handleConfirmReject = async () => {
    if (!confirmState || confirmState.type !== 'reject') return
    const requestId = confirmState.requestId
    setConfirmState(null)
    try {
      await createClubRequestService.reject(requestId, user.id)
      loadAdminRequests()
      loadRequests()
    } catch (err) {
      setError(err.message ?? 'Татгалзахдаа алдаа гарлаа')
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-lg sm:text-xl font-bold text-text-heading">
          Клуб үүсгэх хүсэлт
        </h1>

        {!user ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Хүсэлт илгээхийн тулд нэвтэрнэ үү.
            <button
              type="button"
              onClick={onGoToLogin}
              className="ml-2 underline font-medium hover:no-underline"
            >
              Нэвтрэх
            </button>
          </div>
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
                <label htmlFor="create-club-name" className="block text-sm font-semibold text-text-label mb-1">
                  Клубын нэр <span className="text-red-400">*</span>
                </label>
                <input
                  id="create-club-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-input-background px-3 py-2 text-sm text-text-heading placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-button-primary/50"
                  placeholder="Жишээ: Шатрын клуб"
                  required
                />
              </div>

              <div>
                <label htmlFor="create-club-type" className="block text-sm font-semibold text-text-label mb-1">
                  Төрөл
                </label>
                <select
                  id="create-club-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-input-background px-3 py-2 text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-button-primary/50"
                >
                  {Object.entries(CLUB_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="create-club-goal" className="block text-sm font-semibold text-text-label mb-1">
                  Зорилго
                </label>
                <textarea
                  id="create-club-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border-default bg-input-background px-3 py-2 text-sm text-text-heading placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-button-primary/50 resize-none"
                  placeholder="Клубын зорилго, үйл ажиллагааны тайлбар"
                />
              </div>

              <div>
                <label htmlFor="create-club-max" className="block text-sm font-semibold text-text-label mb-1">
                  Гишүүдийн дээд тоо
                </label>
                <input
                  id="create-club-max"
                  type="number"
                  min={1}
                  max={200}
                  value={maximum_member}
                  onChange={(e) => setMaximumMember(e.target.value || 20)}
                  className="w-full rounded-lg border border-border-default bg-input-background px-3 py-2 text-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-button-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading || !name?.trim()}
                className="w-full py-2.5 sm:py-3 rounded-xl text-sm font-semibold bg-button-primary text-button-primary-text hover:bg-button-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitLoading
                  ? (isAdmin ? 'Үүсгэж байна...' : 'Илгээж байна...')
                  : isAdmin
                    ? 'Клуб үүсгэх'
                    : 'Хүсэлт илгээх'}
              </button>
              {isAdmin && (
                <p className="text-xs text-text-muted">
                  Та админ тул клуб шууд үүснэ. Хүсэлт илгээх шаардлагагүй.
                </p>
              )}
            </form>

            {isAdmin && (
              <section>
                <h2 className="text-base font-semibold text-text-heading mb-3">
                  Клуб нээх хүсэлтүүд (засвар)
                </h2>
                {adminLoading ? (
                  <p className="text-sm text-text-muted">Ачааллаж байна...</p>
                ) : (() => {
                  const pending = adminRequests.filter((r) => r.status === 1)
                  return pending.length === 0 ? (
                    <p className="text-sm text-text-muted rounded-xl border border-border-default bg-block-background-muted p-4">
                      Хүлээгдэж буй хүсэлт байхгүй.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {pending.map((r) => (
                        <li
                          key={r.id}
                          className="rounded-xl border border-border-default bg-block-background-muted p-3 sm:p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-text-heading text-sm sm:text-base">
                                {r.name}
                              </p>
                              <p className="text-xs text-text-muted mt-0.5">
                                {CLUB_TYPE_LABELS[r.type] ?? r.type} · {r.requested_date} · ID: {r.requester_id}
                              </p>
                              {r.goal && (
                                <p className="text-xs text-text-paragraph mt-1 line-clamp-2">
                                  {r.goal}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setConfirmState({ type: 'approve', requestId: r.id })}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-button-green text-button-green-text hover:bg-button-green-hover transition-colors"
                              >
                                Зөвшөөрөх
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmState({ type: 'reject', requestId: r.id })}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/80 text-white hover:bg-red-500/80 transition-colors"
                              >
                                Татгалзах
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </section>
            )}

            <section>
              <h2 className="text-base font-semibold text-text-heading mb-3">
                Миний хүсэлтүүд
              </h2>
              {loading ? (
                <p className="text-sm text-text-muted">Ачааллаж байна...</p>
              ) : requests.length === 0 ? (
                <p className="text-sm text-text-muted rounded-xl border border-border-default bg-block-background-muted p-4">
                  Одоогоор хүсэлт илгээгээгүй байна.
                </p>
              ) : (
                <ul className="space-y-2">
                  {requests.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-xl border border-border-default bg-block-background-muted p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-medium text-text-heading text-sm sm:text-base">
                          {r.name}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {CLUB_TYPE_LABELS[r.type] ?? r.type} · {r.requested_date}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-lg shrink-0 ${
                          r.status === 1
                            ? 'bg-amber-500/20 text-amber-300'
                            : r.status === 2
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {STATUS_LABELS[r.status] ?? r.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>

      <ConfirmModal
        open={confirmState?.type === 'approve'}
        title="Клуб нээх хүсэлтийг зөвшөөрөх үү?"
        message="Зөвшөөрсөн тохиолдолд клуб үүсч, хүсэлт гаргагч удирдагч болно."
        confirmLabel="Зөвшөөрөх"
        cancelLabel="Цуцлах"
        onConfirm={handleConfirmApprove}
        onCancel={() => setConfirmState(null)}
      />
      <ConfirmModal
        open={confirmState?.type === 'reject'}
        title="Клуб нээх хүсэлтийг татгалзах уу?"
        message="Татгалзсан хүсэлт буцаагдах боломжгүй."
        confirmLabel="Татгалзах"
        cancelLabel="Цуцлах"
        variant="danger"
        onConfirm={handleConfirmReject}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  )
}

export default CreateClub
