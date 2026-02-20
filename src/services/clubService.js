import { clubs } from "../assets/mockdata/clubsInfo/clubs";
import { clubMembers } from "../assets/mockdata/clubsInfo/clubMembers";
import { clubAllowedEngineerClasses } from "../assets/mockdata/clubsInfo/clubAllowedEngineerClasses";
import { clubAllowedCollegeYears } from "../assets/mockdata/clubsInfo/clubAllowedCollegeYears";
import { clubSchedules } from "../assets/mockdata/clubsInfo/clubSchedules";

const delay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 300));

/**
 * Mock club service. Joins CLUBS with allowed engineer classes, college years, and schedules.
 * Replace with real API when backend is ready.
 */
export const clubService = {
  /**
   * Returns all clubs with memberCount, engineerClasses, collegeYears, and schedules.
   * Clubs include main_media_url from mockdata when set.
   */
  getAll: async () => {
    const enriched = clubs.map((club) => {
      const memberCount = clubMembers.filter((m) => m.club_id === club.id).length;
      const engineerClasses = clubAllowedEngineerClasses
        .filter((c) => c.club_id === club.id)
        .map((c) => c.engineer_class);
      const collegeYears = clubAllowedCollegeYears
        .filter((c) => c.club_id === club.id)
        .map((c) => c.college_year);
      const schedules = clubSchedules
        .filter((s) => s.club_id === club.id)
        .map((s) => ({
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
        }));

      return {
        ...club,
        memberCount,
        engineerClasses,
        collegeYears,
        schedules,
      };
    });
    return delay(enriched.map((c) => ({ ...c })));
  },

  getById: async (id) => {
    if (id == null) return delay(undefined);
    const club = clubs.find((c) => c.id === id);
    if (!club) return delay(undefined);
    const memberCount = clubMembers.filter((m) => m.club_id === club.id).length;
    const engineerClasses = clubAllowedEngineerClasses
      .filter((c) => c.club_id === club.id)
      .map((c) => c.engineer_class);
    const collegeYears = clubAllowedCollegeYears
      .filter((c) => c.club_id === club.id)
      .map((c) => c.college_year);
    const schedules = clubSchedules
      .filter((s) => s.club_id === club.id)
      .map((s) => ({
        day_of_week: s.day_of_week,
        start_time: s.start_time,
        end_time: s.end_time,
      }));
    return delay({
      ...club,
      memberCount,
      engineerClasses,
      collegeYears,
      schedules,
    });
  },
};

/** Мэргэжил label for Filter / display (engineer_class number → name) */
export const ENGINEER_CLASS_LABELS = {
  1: "Барилга",
  2: "Механик",
  3: "Цахилгаан",
  4: "Био",
  5: "Компьютер",
};

/** Club type label for display */
export const CLUB_TYPE_LABELS = {
  contest: "Тэмцээн",
  sport: "Спорт",
  art: "Урлаг",
  education: "Боловсрол",
};

/** Курс label for Filter / display (college_year → name) */
export const COLLEGE_YEAR_LABELS = {
  1: "1-р",
  2: "2-р",
  3: "3-р",
  4: "4-р",
  5: "5-р",
};
