/**
 * School schedule table generator.
 * - Initial state: schedule conditions can be null.
 * - Build table: place fixed conditions first, then fill with non-fixed.
 * - Same subject cannot be taught on the same day for the same class (one session per subject per day per class).
 * - Conflict protection: teacher and room conflicts across classes.
 * - Admin can fix a slot -> it becomes fixed; table recalculates. Submit -> all become fixed.
 */

export const DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
export const DAYS_MN = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан']
export const PERIOD_COUNT = 6

const DAY_EN_TO_INDEX = Object.fromEntries(DAYS_EN.map((d, i) => [d, i]))

/**
 * Check that each subject is distributed across days (not all on one day).
 * Returns true if distribution is ok; optionally returns issues.
 */
export function checkDistributionAcrossDays(scheduleGrid, classSubjects, subjects) {
  const issues = []
  const subjectById = new Map(subjects.map((s) => [s.id, s]))
  for (const className of Object.keys(scheduleGrid)) {
    const grid = scheduleGrid[className]
    const classId = className
    const subjectIds = (classSubjects || [])
      .filter((cs) => String(cs.class_id) === classId)
      .map((cs) => cs.subject_id)
    for (const subjectId of subjectIds) {
      const subject = subjectById.get(subjectId)
      const repitition = subject?.repitition ?? 1
      const daysUsed = new Set()
      for (let dayIdx = 0; dayIdx < DAYS_EN.length; dayIdx++) {
        for (let p = 0; p < PERIOD_COUNT; p++) {
          const cell = grid[dayIdx]?.[p]
          if (cell?.subject_id === subjectId) daysUsed.add(dayIdx)
        }
      }
      if (daysUsed.size < repitition && repitition > 1) {
        issues.push({ classId, subjectId, subjectName: subject?.subject_name, daysUsed: daysUsed.size, required: repitition })
      }
    }
  }
  return { ok: issues.length === 0, issues }
}

/**
 * Check teacher conflict: same teacher, same day, same period, different classes.
 */
function hasTeacherConflict(scheduleGrid, dayIdx, period, teacherId, excludeClassId) {
  for (const [classKey, grid] of Object.entries(scheduleGrid)) {
    if (classKey === String(excludeClassId)) continue
    const cell = grid[dayIdx]?.[period]
    if (cell?.teacher_id === teacherId) return true
  }
  return false
}

/**
 * Check room conflict: same room, same day, same period (if we track room per slot).
 */
function hasRoomConflict(scheduleGrid, dayIdx, period, room, excludeClassId) {
  for (const [classKey, grid] of Object.entries(scheduleGrid)) {
    if (classKey === String(excludeClassId)) continue
    const cell = grid[dayIdx]?.[period]
    if (cell?.room === room) return true
  }
  return false
}

/**
 * Check if this class already has this subject on this day (same subject not twice same day same class).
 */
function hasSubjectOnDay(grid, dayIdx, subjectId) {
  for (let p = 0; p < PERIOD_COUNT; p++) {
    if (grid[dayIdx]?.[p]?.subject_id === subjectId) return true
  }
  return false
}

/**
 * Build empty grid: classes x days x periods -> null
 */
function createEmptyGrid(classes) {
  const scheduleGrid = {}
  for (const c of classes) {
    scheduleGrid[c.id] = DAYS_EN.map(() => Array(PERIOD_COUNT).fill(null))
  }
  return scheduleGrid
}

/**
 * Place fixed subject schedules into the grid. Each fixed schedule has day_of_week, start_period, subject_id, class_id.
 * oneSessionLength periods are filled for that subject.
 */
function placeFixedSchedules(scheduleGrid, subjectSchedules, subjects) {
  const subjectById = new Map(subjects.map((s) => [s.id, s]))
  const fixed = (subjectSchedules || []).filter((s) => s.fixed && s.day_of_week != null && s.start_period != null)
  for (const s of fixed) {
    const dayIdx = typeof s.day_of_week === 'number' && s.day_of_week >= 1 && s.day_of_week <= 5
      ? s.day_of_week - 1
      : DAY_EN_TO_INDEX[s.day_of_week]
    if (dayIdx == null || dayIdx < 0) continue
    const classId = s.class_id
    const grid = scheduleGrid[classId]
    if (!grid) continue
    const subject = subjectById.get(s.subject_id)
    const startP = typeof s.start_period === 'number' ? (s.start_period >= 1 ? s.start_period - 1 : s.start_period) : 0 // support 0- or 1-based
    const len = Math.min(subject?.oneSessionLength ?? 1, PERIOD_COUNT - startP)
    for (let i = 0; i < len; i++) {
      const p = startP + i
      if (p < PERIOD_COUNT && !grid[dayIdx][p]) {
        grid[dayIdx][p] = {
          subject_id: s.subject_id,
          subject_name: subject?.subject_name ?? '',
          teacher_id: subject?.teacher_id ?? '',
          room: subject?.room_id ?? '',
          fixed: true,
          scheduleId: s.id,
        }
      }
    }
  }
}

/**
 * Build list of (classId, subjectId) that need to be placed: from classSubjects + subjects (repitition, oneSessionLength).
 * Returns array of { classId, subjectId, sessionsNeeded } where sessionsNeeded = repitition (number of days per week).
 */
function getSlotsToFill(classes, classSubjects, subjects, scheduleGrid) {
  const subjectById = new Map(subjects.map((s) => [s.id, s]))
  const toFill = []
  for (const c of classes) {
    const subjectIds = (classSubjects || []).filter((cs) => cs.class_id === c.id).map((cs) => cs.subject_id)
    for (const subjectId of subjectIds) {
      const subject = subjectById.get(subjectId)
      const repitition = subject?.repitition ?? 1
      const sessionLength = subject?.oneSessionLength ?? 1
      const grid = scheduleGrid[c.id]
      let placedSessions = 0
      for (let dayIdx = 0; dayIdx < DAYS_EN.length; dayIdx++) {
        if (hasSubjectOnDay(grid, dayIdx, subjectId)) placedSessions++
      }
      const needed = repitition - placedSessions
      if (needed > 0) {
        toFill.push({ classId: c.id, subjectId, sessionLength, sessionsNeeded: needed })
      }
    }
  }
  return toFill
}

/**
 * Fill one session (sessionLength consecutive periods) for a class/subject. Prefer spreading across days.
 */
function tryPlaceSession(scheduleGrid, classId, subjectId, sessionLength, subjects, classSubjects) {
  const subject = subjects.find((s) => s.id === subjectId)
  if (!subject) return false
  const grid = scheduleGrid[classId]
  const teacherId = subject.teacher_id
  const room = subject.room_id || ''
  // Try each day, then each starting period
  for (let dayIdx = 0; dayIdx < DAYS_EN.length; dayIdx++) {
    if (hasSubjectOnDay(grid, dayIdx, subjectId)) continue
    for (let startP = 0; startP <= PERIOD_COUNT - sessionLength; startP++) {
      let ok = true
      for (let i = 0; i < sessionLength; i++) {
        const p = startP + i
        if (grid[dayIdx][p] != null) {
          ok = false
          break
        }
        if (hasTeacherConflict(scheduleGrid, dayIdx, p, teacherId, classId)) {
          ok = false
          break
        }
        if (room && hasRoomConflict(scheduleGrid, dayIdx, p, room, classId)) {
          ok = false
          break
        }
      }
      if (ok) {
        for (let i = 0; i < sessionLength; i++) {
          grid[dayIdx][startP + i] = {
            subject_id: subjectId,
            subject_name: subject.subject_name,
            teacher_id: teacherId,
            room,
            fixed: false,
            scheduleId: null,
          }
        }
        return true
      }
    }
  }
  return false
}

/**
 * Create full schedule: fixed first, then fill non-fixed with conflict protection.
 */
export function createSchedule(classes, subjects, classSubjects, subjectSchedules) {
  const scheduleGrid = createEmptyGrid(classes)
  placeFixedSchedules(scheduleGrid, subjectSchedules, subjects)
  const toFill = getSlotsToFill(classes, classSubjects, subjects, scheduleGrid)
  // Sort by sessionsNeeded desc so we place the most constrained first
  toFill.sort((a, b) => b.sessionsNeeded - a.sessionsNeeded)
  for (const slot of toFill) {
    for (let i = 0; i < slot.sessionsNeeded; i++) {
      tryPlaceSession(scheduleGrid, slot.classId, slot.subjectId, slot.sessionLength, subjects, classSubjects)
    }
  }
  return scheduleGrid
}

/**
 * Convert grid to flat structure for table: rows = (dayIdx, period), cols = classId.
 * Returns { rows: [{ day, period, cells: { [classId]: cell } }], classIds }.
 */
export function scheduleGridToTable(scheduleGrid, classes) {
  const classIds = (classes || []).map((c) => c.id)
  const rows = []
  for (let dayIdx = 0; dayIdx < DAYS_EN.length; dayIdx++) {
    for (let period = 0; period < PERIOD_COUNT; period++) {
      const cells = {}
      for (const classId of classIds) {
        const grid = scheduleGrid[classId]
        cells[classId] = grid?.[dayIdx]?.[period] ?? null
      }
      rows.push({
        dayIdx,
        day: DAYS_MN[dayIdx],
        period,
        cells,
      })
    }
  }
  return { rows, classIds }
}
