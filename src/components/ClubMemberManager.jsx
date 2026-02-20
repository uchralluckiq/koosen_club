import { useState, useEffect } from 'react'
import { clubService } from '../services/clubService'
import { clubJoinRequestService } from '../services/clubJoinRequestService'
import { users } from '../assets/mockdata/users'

function ClubMemberManager({ club, user, onMemberChange }) {
  const [members, setMembers] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    loadData()
  }, [club?.id])

  const loadData = async () => {
    if (!club?.id) return
    setLoading(true)
    try {
      const [memberData, requestData] = await Promise.all([
        clubService.getMembers(club.id),
        clubJoinRequestService.getByClubId(club.id),
      ])

      const enrichedMembers = memberData.map((m) => {
        const userData = users.find((u) => u.id === m.student_id)
        return {
          ...m,
          name: userData?.name || m.student_id,
          email: userData?.email || '',
          isLeader: club.leader_id === m.student_id,
        }
      })
      setMembers(enrichedMembers)

      const enrichedRequests = requestData.map((r) => {
        const userData = users.find((u) => u.id === r.student_id)
        return {
          ...r,
          name: userData?.name || r.student_id,
          email: userData?.email || '',
        }
      })
      setJoinRequests(enrichedRequests)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveRequest = async (requestId) => {
    setProcessing(requestId)
    try {
      await clubJoinRequestService.approveRequest(requestId, user?.id)
      await loadData()
      onMemberChange?.()
    } catch (err) {
      console.error('Failed to approve request:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectRequest = async (requestId) => {
    setProcessing(requestId)
    try {
      await clubJoinRequestService.rejectRequest(requestId, user?.id)
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId))
    } catch (err) {
      console.error('Failed to reject request:', err)
    } finally {
      setProcessing(null)
    }
  }

  const handleRemoveMember = async (studentId) => {
    if (club.leader_id === studentId) {
      alert('Клубын ахлагчийг хасах боломжгүй')
      return
    }

    setRemoving(studentId)
    try {
      await clubService.removeMember(club.id, studentId)
      setMembers((prev) => prev.filter((m) => m.student_id !== studentId))
      onMemberChange?.()
    } catch (err) {
      console.error('Failed to remove member:', err)
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-charcoal-blue-900/60 border border-charcoal-blue-800 p-6">
        <p className="text-charcoal-blue-300 text-center">Ачааллаж байна...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Join Requests Section */}
      {joinRequests.length > 0 && (
        <div className="rounded-2xl bg-charcoal-blue-900/60 border border-honeydew-600/50 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-charcoal-blue-800 bg-honeydew-900/20">
            <h3 className="text-lg font-semibold text-honeydew-100">
              Элсэх хүсэлтүүд ({joinRequests.length})
            </h3>
          </div>

          <div className="divide-y divide-charcoal-blue-800">
            {joinRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-honeydew-600 flex items-center justify-center text-white font-semibold shrink-0">
                    {request.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-frosted-blue-100 font-medium truncate">
                      {request.name}
                    </p>
                    {request.email && (
                      <p className="text-charcoal-blue-400 text-sm truncate">
                        {request.email}
                      </p>
                    )}
                    <p className="text-charcoal-blue-500 text-xs">
                      Огноо: {request.requested_at}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApproveRequest(request.id)}
                    disabled={processing === request.id}
                    className="px-3 py-2 rounded-lg bg-honeydew-600 text-honeydew-50 hover:bg-honeydew-500 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    {processing === request.id ? '...' : 'Зөвшөөрөх'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRejectRequest(request.id)}
                    disabled={processing === request.id}
                    className="px-3 py-2 rounded-lg bg-red-600/80 text-white hover:bg-red-500/80 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    {processing === request.id ? '...' : 'Татгалзах'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Section */}
      <div className="rounded-2xl bg-charcoal-blue-900/60 border border-charcoal-blue-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-charcoal-blue-800">
          <h3 className="text-lg font-semibold text-frosted-blue-100">
            Гишүүдийн жагсаалт ({members.length}/{club?.maximum_member || 0})
          </h3>
        </div>

        {members.length === 0 ? (
          <div className="p-6 text-center text-charcoal-blue-400">
            Гишүүн байхгүй байна
          </div>
        ) : (
          <div className="divide-y divide-charcoal-blue-800">
            {members.map((member) => (
              <div
                key={member.student_id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-light-cyan-600 flex items-center justify-center text-white font-semibold shrink-0">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-frosted-blue-100 font-medium truncate">
                      {member.name}
                      {member.isLeader && (
                        <span className="ml-2 text-xs bg-honeydew-600 text-honeydew-50 px-2 py-0.5 rounded-full">
                          Ахлагч
                        </span>
                      )}
                    </p>
                    {member.email && (
                      <p className="text-charcoal-blue-400 text-sm truncate">
                        {member.email}
                      </p>
                    )}
                    <p className="text-charcoal-blue-500 text-xs">
                      ID: {member.student_id}
                    </p>
                  </div>
                </div>

                {!member.isLeader && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.student_id)}
                    disabled={removing === member.student_id}
                    className="shrink-0 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {removing === member.student_id ? (
                      <span className="text-sm">...</span>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubMemberManager
