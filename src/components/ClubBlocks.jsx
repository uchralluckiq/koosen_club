import {
  ENGINEER_CLASS_LABELS,
  CLUB_TYPE_LABELS,
  COLLEGE_YEAR_LABELS,
  clubService,
} from '../services/clubService'

function ClubBlocks({ club, user, onSeeMore, onJoinClick }) {
  const canJoin = clubService.canJoinClub(club, user)
  const hasPendingRequest = user && clubService.hasPendingRequest(club.id, user.id)
  const showJoinButton = canJoin || hasPendingRequest
  const {
    name,
    type,
    maximum_member,
    main_media_url,
    // enriched by clubService
    memberCount = 0,
    engineerClasses = [],
    collegeYears = [],
    schedules = [],
    // legacy / optional
    image,
    goal,
    memberIds,
    whatDayOfWeek,
    fromWhatTime,
    untilWhatTime,
  } = club

  const maxMember = maximum_member ?? club.maximumMember
  const count = memberCount ?? (memberIds?.length ?? 0)
  const typeLabel = type ? (CLUB_TYPE_LABELS[type] ?? type) : null
  const engineerLabels = engineerClasses.map((c) => ENGINEER_CLASS_LABELS[c]).filter(Boolean)
  const collegeYearLabels = collegeYears.map((y) => COLLEGE_YEAR_LABELS[y]).filter(Boolean)
  const imageUrl = main_media_url ?? image

  return (
    <div className="p-4 sm:p-5 rounded-2xl flex flex-col justify-between bg-charcoal-blue-900/60 border border-charcoal-blue-800 hover:border-frosted-blue-800/50 transition-colors shadow-lg">
      <div className="flex flex-col gap-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="h-32 sm:h-40 w-full object-cover rounded-xl"
          />
        )}
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-xl font-bold text-frosted-blue-50">{name}</h2>
          {maxMember != null && (
            <span className="text-sm text-charcoal-blue-300 shrink-0">
              {count}/{maxMember}
            </span>
          )}
        </div>
        {typeLabel && (
          <span className="text-xs font-medium text-honeydew-900 bg-honeydew-300/90 px-2 py-1 rounded-lg w-fit">
            {typeLabel}
          </span>
        )}
        {goal && (
          <p className="text-charcoal-blue-200">
            <span className="font-semibold text-frosted-blue-200">Зорилго:</span>{' '}
            {goal}
          </p>
        )}
        {collegeYearLabels.length > 0 && (
          <p className="text-sm text-charcoal-blue-300">
            <span className="font-semibold text-frosted-blue-200">Курс:</span>{' '}
            {collegeYearLabels.join(', ')}
          </p>
        )}
        {engineerLabels.length > 0 && (
          <p className="text-sm text-charcoal-blue-300">
            <span className="font-semibold text-frosted-blue-200">Мэргэжил:</span>{' '}
            {engineerLabels.join(', ')}
          </p>
        )}
        {(schedules.length > 0 || (whatDayOfWeek?.length > 0 || fromWhatTime)) && (
          <div className="text-sm text-charcoal-blue-300">
            <span className="font-semibold text-frosted-blue-200">Цагийн хуваарь:</span>
            {schedules.length > 0 ? (
              <ul className="mt-1 space-y-0.5">
                {schedules.map((s, i) => (
                  <li key={i}>
                    {s.day_of_week} {s.start_time}–{s.end_time}
                  </li>
                ))}
              </ul>
            ) : (
              <>
                {whatDayOfWeek?.length > 0 && (
                  <p className="mt-1">{whatDayOfWeek.join(', ')}</p>
                )}
                {(fromWhatTime || untilWhatTime) && (
                  <p className="mt-1">
                    {formatTime(fromWhatTime)} – {formatTime(untilWhatTime)}
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onSeeMore?.(club)}
          className={`py-2 rounded-xl font-semibold bg-light-cyan-600/90 text-light-cyan-50 hover:bg-light-cyan-500/90 transition-colors shadow-sm ${showJoinButton ? 'flex-1' : 'w-full'}`}
        >
          Дэлгэрэнгүй
        </button>
        {hasPendingRequest ? (
          <button
            type="button"
            disabled
            className="flex-1 py-2 rounded-xl font-semibold bg-charcoal-blue-700 text-charcoal-blue-400 cursor-not-allowed shadow-sm"
          >
            Хүсэлт илгээсэн
          </button>
        ) : canJoin && (
          <button
            type="button"
            onClick={() => onJoinClick?.(club)}
            className="flex-1 py-2 rounded-xl font-semibold bg-honeydew-600 text-honeydew-50 hover:bg-honeydew-500 transition-colors shadow-sm"
          >
            Элсэх
          </button>
        )}
      </div>
    </div>
  )
}

function formatTime(arr) {
  if (!arr || !Array.isArray(arr)) return '–'
  const [hour, minute] = arr
  return `${hour}:${String(minute ?? 0).padStart(2, '0')}`
}

export default ClubBlocks
