import { useEffect, useState, useMemo } from 'react'
import { classes as classesData, subjects as subjectsData, classSubjects as classSubjectsData, subjectSchedules as initialSubjectSchedules } from '../mockdata'
import {
  createSchedule,
  scheduleGridToTable,
  checkDistributionAcrossDays,
  DAYS_MN,
  PERIOD_COUNT,
} from '../utils/scheduleGenerator'

function SubjectSchedules() {
  const [subjectSchedules, setSubjectSchedules] = useState([])
  const [scheduleKey, setScheduleKey] = useState(0)

  useEffect(() => {
    setSubjectSchedules(initialSubjectSchedules.map((s) => ({ ...s })))
  }, [])

  const scheduleGrid = useMemo(() => {
    return createSchedule(classesData, subjectsData, classSubjectsData, subjectSchedules)
  }, [subjectSchedules, scheduleKey])

  const { rows, classIds } = useMemo(
    () => scheduleGridToTable(scheduleGrid, classesData),
    [scheduleGrid, classesData]
  )

  const distribution = useMemo(
    () => checkDistributionAcrossDays(scheduleGrid, classSubjectsData, subjectsData),
    [scheduleGrid]
  )

  const fixSlot = (classId, dayIdx, period, cell) => {
    if (!cell || cell.fixed) return
    const dayOfWeek = dayIdx + 1
    const existingFixed = subjectSchedules.find(
      (s) => s.class_id === classId && s.subject_id === cell.subject_id && s.fixed
    )
    const existingNonFixed = subjectSchedules.find(
      (s) => s.class_id === classId && s.subject_id === cell.subject_id && !s.fixed
    )
    const maxId = Math.max(0, ...subjectSchedules.map((s) => s.id))
    if (existingFixed) {
      setSubjectSchedules((prev) =>
        prev.map((s) =>
          s.id === existingFixed.id
            ? { ...s, day_of_week: dayOfWeek, start_period: period, fixed: true }
            : s
        )
      )
    } else if (existingNonFixed) {
      setSubjectSchedules((prev) =>
        prev.map((s) =>
          s.id === existingNonFixed.id
            ? { ...s, day_of_week: dayOfWeek, start_period: period, fixed: true }
            : s
        )
      )
    } else {
      setSubjectSchedules((prev) => [
        ...prev,
        {
          id: maxId + 1,
          subject_id: cell.subject_id,
          class_id: classId,
          fixed: true,
          day_of_week: dayOfWeek,
          start_period: period,
        },
      ])
    }
    setScheduleKey((k) => k + 1)
  }
  // used in: table cell CellContent (onFix)

  const submitSchedule = () => {
    const nextSchedules = []
    let id = 1
    for (const classId of classIds) {
      const grid = scheduleGrid[classId]
      if (!grid) continue
      for (let dayIdx = 0; dayIdx < 5; dayIdx++) {
        for (let period = 0; period < PERIOD_COUNT; period++) {
          const cell = grid[dayIdx]?.[period]
          if (cell) {
            nextSchedules.push({
              id: id++,
              subject_id: cell.subject_id,
              class_id: classId,
              fixed: true,
              day_of_week: dayIdx + 1,
              start_period: period,
            })
          }
        }
      }
    }
    setSubjectSchedules(nextSchedules)
    setScheduleKey((k) => k + 1)
  }
  // used in: Хадгалах (бүгдийг тогтоох) button

  const classLabel = (c) => {
    const cls = classesData.find((x) => x.id === c)
    return cls ? String(cls.id) : String(c)
  }
  // used in: table header (class column labels)

  return (
    <div className="space-y-4">
      {!distribution.ok && distribution.issues?.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs sm:text-sm text-amber-200">
          <span className="font-medium">Тайлбар: </span>
          Зарим хичээл өдрүүд дээр тархаагүй байна.
        </div>
      )}
      <div className="max-h-[70vh] overflow-auto rounded-2xl border border-border-default bg-block-background-muted">
        <table className="w-full min-w-[600px] border-collapse text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-[21] w-24 sm:w-28 py-2 px-2 bg-block-header-schedule border border-border-default text-left text-text-heading-schedule font-semibold">
                Өдөр
              </th>
              <th className="sticky top-0 left-24 sm:left-28 z-[21] w-10 py-2 px-1 bg-block-header-schedule border border-border-default text-text-heading-schedule font-semibold">
                Цаг
              </th>
              {classIds.map((cid) => (
                <th
                  key={cid}
                  className="sticky top-0 z-20 py-2 px-2 bg-block-header-schedule border border-border-default text-text-heading-schedule font-semibold"
                >
                  {classLabel(cid)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS_MN.map((dayName, dayIdx) => {
              const dayRows = rows.filter((r) => r.dayIdx === dayIdx)
              return dayRows.map((row, periodIdx) => (
                <tr key={`${dayName}-${row.period}`}>
                  {periodIdx === 0 ? (
                    <td
                      rowSpan={PERIOD_COUNT}
                      className="sticky left-0 z-10 w-24 sm:w-28 py-1 px-2 bg-block-background-strong border border-border-default text-text-heading align-top font-medium"
                    >
                      {dayName}
                    </td>
                  ) : null}
                  <td className="sticky left-24 sm:left-28 z-10 w-10 py-1 px-1 bg-block-background-muted border border-border-default text-text-muted text-[10px] sm:text-xs align-top">
                    {row.period + 1}
                  </td>
                  {classIds.map((cid) => (
                    <td
                      key={cid}
                      className="p-1 sm:p-2 border border-border-default align-top"
                    >
                      <CellContent
                        cell={row.cells[cid]}
                        onFix={() => fixSlot(cid, dayIdx, row.period, row.cells[cid])}
                      />
                    </td>
                  ))}
                </tr>
              ))
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] sm:text-xs text-text-muted">
        Тогтсон эсэхийг өөрчлөхийн тулд нүд дээр дарна уу. Сайн болсон бол &quot;Хадгалах&quot; дарна уу.
      </p>
      <button
        type="button"
        onClick={submitSchedule}
        className="px-4 py-2 rounded-xl bg-button-green text-button-green-text text-sm font-medium hover:bg-button-green-hover transition-colors"
      >
        Хадгалах (бүгдийг тогтоох)
      </button>
    </div>
  )
}

function CellContent({ cell, onFix }) {
  if (!cell) {
    return <span className="text-text-muted">—</span>
  }
  return (
    <button
      type="button"
      onClick={() => onFix()}
      className={`w-full text-left p-1 rounded-lg transition-colors hover:bg-block-background-filter ${
        cell.fixed ? 'ring-1 ring-button-primary/50 bg-block-background-filter' : ''
      }`}
      title={cell.fixed ? 'Тогтсон' : 'Энд дарж тогтоох'}
    >
      <span className="font-medium text-text-heading block">{cell.subject_name}</span>
      <span className="text-[10px] sm:text-xs text-text-muted">
        {cell.teacher_id}
        {cell.room ? ` · ${cell.room}` : ''}
      </span>
    </button>
  )
}

export default SubjectSchedules
