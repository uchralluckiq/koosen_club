import { useEffect, useState } from 'react'
import Filter from '../components/Filter'
import ClubBlocks from '../components/ClubBlocks'
import { clubService } from '../services/clubService'
import { clubJoinRequestService } from '../services/clubJoinRequestService'

function ClubSearchPage({ onClubSelect, user, onGoToLogin }) {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestSent, setRequestSent] = useState(false)
  const [filters, setFilters] = useState({
    year: '',
    class: '',
    type: '',
  })

  const loadClubs = async () => {
    setLoading(true)
    const data = await clubService.getAll()
    setClubs(data ?? [])
    setLoading(false)
  }
  // used in: useEffect (initial load), handleJoinClick (after send)

  const handleJoinClick = async (club) => {
    if (!user) {
      onGoToLogin?.()
      return
    }

    try {
      await clubJoinRequestService.sendRequest(club.id, user.id)
      setRequestSent(true)
      setTimeout(() => setRequestSent(false), 3000)
      loadClubs()
    } catch (err) {
      console.error('Failed to send join request:', err)
    }
  }
  // used in: ClubBlocks (onJoinClick prop)

  useEffect(() => {
    loadClubs()
  }, [])

  const filteredClubs = clubs.filter((club) => {
    if (filters.type && club.type !== filters.type) return false
    if (filters.year) {
      const year = Number(filters.year)
      const matchYear = club.collegeYears?.some(
        (y) => y === 'Бүх курс' || y === year || Number(y) === year
      )
      if (!matchYear) return false
    }
    if (filters.class) {
      const engineerClass = filters.class
      const matchClass = club.engineerClasses?.some(
        (c) => c === 'Бүх бүлэг' || String(c) === engineerClass || Number(c) === Number(engineerClass)
      )
      if (!matchClass) return false
    }
    return true
  })

  return (
    <div className="flex-1 min-h-0 flex flex-col relative">
      {requestSent && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm bg-button-green text-button-green-text font-medium shadow-lg animate-fade-in">
          Хүсэлт амжилттай илгээгдлээ!
        </div>
      )}

      <Filter filters={filters} setFilters={setFilters} />
      <section className="flex-1 min-h-0 flex flex-col py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12 text-xs sm:text-sm text-text-muted px-4 sm:px-6">
            Ачааллаж байна...
          </div>
        ) : (
          <div className="club-grid-scroll scrollbar-track-transparent flex-1 min-h-0 overflow-y-auto">
            <div className="px-4 sm:px-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 content-start">
              {filteredClubs.map((club) => (
                <ClubBlocks
                  key={club.id}
                  club={club}
                  user={user}
                  onSeeMore={() => onClubSelect?.(club)}
                  onJoinClick={handleJoinClick}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default ClubSearchPage
