import {
  ENGINEER_CLASS_LABELS,
  CLUB_TYPE_LABELS,
  clubService,
} from '../services/clubService'
import { clubScheduleDays } from '../mockdata/clubsInfo/clubScheduleDay'
import { clubScheduleTimes } from '../mockdata/clubsInfo/clubScheduleTime'

function ClubBlocks({ club, user, onSeeMore, onJoinClick }) {
  const canJoin = clubService.canJoinClub(club, user)
  const hasPendingRequest = user && clubService.hasPendingRequest(club.id, user.id)
  const showJoinButton = canJoin || hasPendingRequest
  const {
    name,
    type,
    maximum_member,
    main_media_url,
    room_id,
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
  const DAYS_MN = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан']
  const scheduleDaysForClub = clubScheduleDays
    .filter((d) => d.club_id === club.id && d.day_of_week != null)
    .map((d) => (typeof d.day_of_week === 'number' && d.day_of_week >= 1 && d.day_of_week <= 5
      ? DAYS_MN[d.day_of_week - 1]
      : d.day_of_week))
  const engineerLabels = engineerClasses.map((c) =>
    ENGINEER_CLASS_LABELS[Number(c)] != null ? ENGINEER_CLASS_LABELS[Number(c)] : c
  ).filter(Boolean)
  const collegeYearsDisplay = collegeYears.map((y) =>
    y === 'Бүх курс' || (typeof y === 'string' && isNaN(Number(y))) ? y : `${y}-р`
  ).join(', ')
  const imageUrl = main_media_url ?? image

  return (
    <div className="p-4 sm:p-5 rounded-2xl flex flex-col justify-between bg-block-background-muted border border-border-default hover:border-border-hover transition-colors shadow-lg">
      <div className="flex flex-col gap-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="h-32 sm:h-40 w-full object-cover rounded-xl"
          />
        )}
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-sm sm:text-base font-bold text-text-title">{name}</h2>
          {maxMember != null && (
            <span className="text-[10px] sm:text-xs text-text-muted shrink-0">
              {count}/{maxMember}
            </span>
          )}
        </div>
        {typeLabel && (
          <span className="text-[10px] sm:text-xs font-medium text-badge-type-text bg-badge-type-bg px-1.5 py-0.5 rounded-lg w-fit">
            {typeLabel}
          </span>
        )}
        {goal && (
          <p className="text-[10px] sm:text-xs text-text-paragraph">
            <span className="font-semibold text-text-label">Зорилго:</span>{' '}
            {goal}
          </p>
        )}
        {collegeYears.length > 0 && (
          <p className="text-[10px] sm:text-xs text-text-muted">
            <span className="font-semibold text-text-label">Курс:</span>{' '}
            {collegeYearsDisplay}
          </p>
        )}
        {engineerLabels.length > 0 && (
          <p className="text-[10px] sm:text-xs text-text-muted">
            <span className="font-semibold text-text-label">Мэргэжил:</span>{' '}
            {engineerLabels.join(', ')}
          </p>
        )}
        {room_id && (
          <p className="text-[10px] sm:text-xs text-text-muted">
            <span className="font-semibold text-text-label">Өрөө:</span>{' '}
            {room_id}
          </p>
        )}
        <div className="text-[10px] sm:text-xs text-text-muted space-y-0.5">
          {(() => {
            const daysFromSchedules = schedules.length > 0
              ? [...new Set(schedules.map((s) => s.day_of_week))].filter((d) => d != null).sort((a, b) => (a ?? 0) - (b ?? 0))
              : []
            const hasDaysFromSchedules = daysFromSchedules.length > 0
            const hasDaysFromClub = scheduleDaysForClub.length > 0
            const hasDaysFromLegacy = whatDayOfWeek?.length > 0
            const hasDays = hasDaysFromSchedules || hasDaysFromClub || hasDaysFromLegacy
            const dayLabels = hasDays
              ? (hasDaysFromSchedules
                  ? daysFromSchedules.map((d) => (typeof d === 'number' && d >= 1 && d <= 5 ? DAYS_MN[d - 1] : d))
                  : hasDaysFromClub
                    ? scheduleDaysForClub
                    : whatDayOfWeek
                ).join(', ')
              : 'тогтсон өдөр байхгүй'
            const timeFromSchedules = schedules[0]
            const timeFromTimes = club?.id ? clubScheduleTimes.find((t) => t.club_id === club.id) : null
            const startTime = timeFromSchedules?.start_time ?? timeFromTimes?.start_time ?? (fromWhatTime != null ? formatTime(fromWhatTime) : null)
            const endTime = timeFromSchedules?.end_time ?? timeFromTimes?.end_time ?? (untilWhatTime != null ? formatTime(untilWhatTime) : null)
            const noTime = (v) => v == null || v === '' || v === '–'
            const hasTime = !noTime(startTime) || !noTime(endTime)
            const timeText = hasTime ? `${startTime ?? '–'}–${endTime ?? '–'}` : 'тогтсон цаг байхгүй'
            return (
              <>
                <p>
                  <span className="font-semibold text-text-label">Хичээллэх өдөр:</span>{' '}
                  {dayLabels}
                </p>
                <p>
                  <span className="font-semibold text-text-label">Хичээллэх цаг:</span>{' '}
                  {timeText}
                </p>
              </>
            )
          })()}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onSeeMore?.(club)}
          className={`py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-button-primary-subtle text-button-primary-text hover:bg-button-primary-hover-subtle transition-colors shadow-sm ${showJoinButton ? 'flex-1' : 'w-full'}`}
        >
          Дэлгэрэнгүй
        </button>
        {hasPendingRequest ? (
          <button
            type="button"
            disabled
            className="flex-1 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-button-disabled text-text-placeholder cursor-not-allowed shadow-sm"
          >
            Хүсэлт илгээсэн
          </button>
        ) : canJoin && (
          <button
            type="button"
            onClick={() => onJoinClick?.(club)}
            className="flex-1 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-button-green text-button-green-text hover:bg-button-green-hover transition-colors shadow-sm"
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
// used in: ClubBlocks (schedule fromWhatTime/untilWhatTime display)

export default ClubBlocks
