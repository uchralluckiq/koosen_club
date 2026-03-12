import { useEffect, useState, useMemo } from 'react'
import { clubService } from '../services/clubService'
import { DAYS_MN } from '../utils/scheduleGenerator'

function ClubSchedules() {
  const [clubs, setClubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    clubService.getAll().then((data) => {
      if (!cancelled) {
        setClubs(data ?? [])
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  const byDay = useMemo(() => {
    return clubs.reduce((acc, club) => {
      ;(club.schedules || []).forEach((s) => {
        const day = s.day_of_week
        if (!acc[day]) acc[day] = []
        acc[day].push({ clubName: club.name, ...s })
      })
      return acc
    }, {})
  }, [clubs])

  const sortedDays = useMemo(() => {
    return Object.keys(byDay)
      .map((k) => (typeof k === 'string' && /^\d+$/.test(k) ? parseInt(k, 10) : k))
      .filter((n) => typeof n === 'number' && n >= 1 && n <= 5)
      .sort((a, b) => a - b)
  }, [byDay])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-xs sm:text-sm text-text-muted">
        Ачааллаж байна...
      </div>
    )
  }

  if (sortedDays.length === 0) {
    return (
      <p className="text-xs sm:text-sm text-text-muted">Клубын хуваарь байхгүй байна.</p>
    )
  }

  return (
    <div className="overflow-y-auto max-h-[70vh] space-y-6">
      {sortedDays.map((day) => (
        <section
          key={day}
          className="rounded-2xl border border-border-default bg-block-background-muted overflow-hidden"
        >
          <h2 className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base font-semibold text-text-heading-schedule bg-block-header-schedule border-b border-border-default">
            {DAYS_MN[day - 1] ?? day}
          </h2>
          <ul className="divide-y divide-border-default">
            {byDay[day].map((item, i) => (
              <li
                key={`${day}-${item.clubName}-${i}`}
                className="px-3 sm:px-4 py-2 sm:py-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-text-paragraph"
              >
                <span className="text-xs sm:text-sm font-medium text-text-heading">
                  {item.clubName}
                </span>
                <span className="text-[10px] sm:text-xs text-text-muted">
                  {item.start_time != null || item.end_time != null
                    ? `${item.start_time ?? '–'} – ${item.end_time ?? '–'}`
                    : 'тогтсон цаг байхгүй'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default ClubSchedules
