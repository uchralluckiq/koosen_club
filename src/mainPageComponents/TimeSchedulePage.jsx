import { useEffect, useState } from 'react'
import { clubService } from '../services/clubService'

const DAY_ORDER = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням']

function TimeSchedulePage() {
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

  const byDay = clubs.reduce((acc, club) => {
    (club.schedules || []).forEach((s) => {
      const day = s.day_of_week
      if (!acc[day]) acc[day] = []
      acc[day].push({ clubName: club.name, ...s })
    })
    return acc
  }, {})

  const sortedDays = Object.keys(byDay).sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-charcoal-blue-300">
        Ачааллаж байна...
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold text-frosted-blue-50 mb-6">
        Цагийн хуваарь
      </h1>
      <div className="space-y-6">
        {sortedDays.length === 0 ? (
          <p className="text-charcoal-blue-300">Цагийн хуваарь байхгүй байна.</p>
        ) : (
          sortedDays.map((day) => (
            <section
              key={day}
              className="rounded-2xl border border-charcoal-blue-800 bg-charcoal-blue-900/60 overflow-hidden"
            >
              <h2 className="px-4 py-3 text-lg font-semibold text-honeydew-200 bg-honeydew-900/40 border-b border-charcoal-blue-800">
                {day}
              </h2>
              <ul className="divide-y divide-charcoal-blue-800">
                {byDay[day].map((item, i) => (
                  <li
                    key={`${day}-${item.clubName}-${i}`}
                    className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-charcoal-blue-200"
                  >
                    <span className="font-medium text-frosted-blue-100">
                      {item.clubName}
                    </span>
                    <span className="text-sm text-charcoal-blue-300">
                      {item.start_time} – {item.end_time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

export default TimeSchedulePage
