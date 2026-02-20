import { clubs } from "../assets/mockdata/clubsInfo/clubs";
import { clubMembers } from "../assets/mockdata/clubsInfo/clubMembers";
import { clubAllowedEngineerClasses } from "../assets/mockdata/clubsInfo/clubAllowedEngineerClasses";
import { clubAllowedCollegeYears } from "../assets/mockdata/clubsInfo/clubAllowedCollegeYears";
import { clubSchedules } from "../assets/mockdata/clubsInfo/clubSchedules";

const USE_BACKEND = false;
const API_BASE_URL = "/api";

const delay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

let nextClubId = Math.max(...clubs.map((c) => c.id), 0) + 1;

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

  create: async (clubData) => {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clubData),
      });
      if (!response.ok) throw new Error("Failed to create club");
      return response.json();
    }

    const newClub = {
      id: nextClubId++,
      type: clubData.type || "education",
      name: clubData.name || "Шинэ клуб",
      maximum_member: clubData.maximum_member || 20,
      leader_id: clubData.leader_id,
      main_media_url: clubData.main_media_url || null,
      main_media_type: clubData.main_media_type || "image",
    };

    clubs.push(newClub);
    return delay({ ...newClub });
  },

  update: async (id, updates) => {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update club");
      return response.json();
    }

    const index = clubs.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Club not found");

    clubs[index] = { ...clubs[index], ...updates };
    return delay({ ...clubs[index] });
  },

  delete: async (id) => {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete club");
      return response.json();
    }

    const index = clubs.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Club not found");

    clubs.splice(index, 1);
    return delay({ success: true });
  },

  canEditClub: (club, user) => {
    if (!user || !club) return false;
    if (user.role === "admin") return true;
    if (club.leader_id === user.id) return true;
    return false;
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
