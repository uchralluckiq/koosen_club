import { clubs } from "../mockdata/clubsInfo/clubs";
import { clubMembers } from "../mockdata/clubsInfo/clubMembers";
import { clubAllowedEngineerClasses } from "../mockdata/clubsInfo/clubAllowedEngineerClasses";
import { clubAllowedCollegeYears } from "../mockdata/clubsInfo/clubAllowedCollegeYears";
import { clubSchedules } from "../mockdata/clubsInfo/clubSchedules";
import { clubJoinRequests } from "../mockdata/clubsInfo/clubJoinRequests";
import { clubScheduleDays } from "../mockdata/clubsInfo/clubScheduleDay";
import { clubScheduleTimes } from "../mockdata/clubsInfo/clubScheduleTime";
import { clubTextBlocks } from "../mockdata/clubsInfo/clubTextBlocks";
import { logTable } from "../utils/devLog";

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
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs`);
      if (!response.ok) throw new Error("Failed to fetch clubs");
      return response.json();
    }

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

    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}`);
      if (!response.ok) {
        if (response.status === 404) return undefined;
        throw new Error("Failed to fetch club");
      }
      return response.json();
    }

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
      main_media_url: clubData.main_media_url || null,
      room_id: clubData.room_id ?? null,
    };

    clubs.push(newClub);
    logTable("clubs", clubs);
    return delay({ ...newClub });
  },

  /**
   * Create a club with placeholder rows and set the given user as leader (e.g. admin direct create).
   */
  createClubWithPlaceholders: async (clubData, leaderId) => {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/create-with-leader`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...clubData, leaderId }),
      });
      if (!response.ok) throw new Error("Failed to create club");
      return response.json();
    }

    const newClub = {
      id: nextClubId++,
      type: clubData.type || "education",
      name: clubData.name || "Шинэ клуб",
      maximum_member: clubData.maximum_member ?? 20,
      main_media_url: null,
      room_id: null,
    };
    clubs.push(newClub);
    clubMembers.push({ club_id: newClub.id, student_id: leaderId, role: 1 });
    clubAllowedCollegeYears.push({ club_id: newClub.id, college_year: "Бүх курс" });
    clubAllowedEngineerClasses.push({ club_id: newClub.id, engineer_class: "Бүх бүлэг" });
    clubScheduleDays.push({ club_id: newClub.id, day_of_week: null });
    clubScheduleTimes.push({ club_id: newClub.id, start_time: null, end_time: null });

    logTable("clubs", clubs);
    logTable("clubMembers", clubMembers);
    logTable("clubAllowedCollegeYears", clubAllowedCollegeYears);
    logTable("clubAllowedEngineerClasses", clubAllowedEngineerClasses);
    logTable("clubScheduleDays", clubScheduleDays);
    logTable("clubScheduleTimes", clubScheduleTimes);
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
    logTable("clubs", clubs);
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
    for (let i = clubMembers.length - 1; i >= 0; i--) {
      if (clubMembers[i].club_id === id) clubMembers.splice(i, 1);
    }
    for (let i = clubAllowedCollegeYears.length - 1; i >= 0; i--) {
      if (clubAllowedCollegeYears[i].club_id === id) clubAllowedCollegeYears.splice(i, 1);
    }
    for (let i = clubAllowedEngineerClasses.length - 1; i >= 0; i--) {
      if (clubAllowedEngineerClasses[i].club_id === id) clubAllowedEngineerClasses.splice(i, 1);
    }
    for (let i = clubJoinRequests.length - 1; i >= 0; i--) {
      if (clubJoinRequests[i].club_id === id) clubJoinRequests.splice(i, 1);
    }
    for (let i = clubScheduleDays.length - 1; i >= 0; i--) {
      if (clubScheduleDays[i].club_id === id) clubScheduleDays.splice(i, 1);
    }
    for (let i = clubScheduleTimes.length - 1; i >= 0; i--) {
      if (clubScheduleTimes[i].club_id === id) clubScheduleTimes.splice(i, 1);
    }
    for (let i = clubTextBlocks.length - 1; i >= 0; i--) {
      if (clubTextBlocks[i].club_id === id) clubTextBlocks.splice(i, 1);
    }

    logTable("clubs", clubs);
    logTable("clubMembers", clubMembers);
    logTable("clubAllowedCollegeYears", clubAllowedCollegeYears);
    logTable("clubAllowedEngineerClasses", clubAllowedEngineerClasses);
    logTable("clubJoinRequests", clubJoinRequests);
    logTable("clubScheduleDays", clubScheduleDays);
    logTable("clubScheduleTimes", clubScheduleTimes);
    logTable("clubTextBlocks", clubTextBlocks);
    return delay({ success: true });
  },

  canEditClub: (club, user) => {
    if (!user || !club) return false;
    if (user.role === 1) return true; // 1: admin
    if (clubService.isLeader(club, user.id)) return true;
    return false;
  },

  canDeleteClub: (club, user) => {
    if (!user || !club) return false;
    return user.role === 1; // only admin can delete
  },

  isMember: (clubId, userId) => {
    if (!clubId || !userId) return false;
    return clubMembers.some(
      (m) => m.club_id === clubId && m.student_id === userId
    );
  },

  isLeader: (club, userId) => {
    if (!club || !userId) return false;
    return clubMembers.some(
      (m) => m.club_id === club.id && m.student_id === userId && m.role === 1 // 1: leader
    );
  },

  canJoinClub: (club, user) => {
    if (!club) return false;
    if (!user) return true;
    if (user.role === 1 || user.role === 2) return false; // 1: admin, 2: teacher
    if (clubService.isLeader(club, user.id)) return false;
    if (clubService.isMember(club.id, user.id)) return false;
    if (clubService.hasPendingRequest(club.id, user.id)) return false;
    return true;
  },

  hasPendingRequest: (clubId, userId) => {
    if (!clubId || !userId) return false;
    return clubJoinRequests.some(
      (r) => r.club_id === clubId && r.student_id === userId && r.status === 1 // 1: pending
    );
  },

  joinClub: async (clubId, userId) => {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error("Failed to join club");
      return response.json();
    }

    if (clubMembers.some((m) => m.club_id === clubId && m.student_id === userId)) {
      throw new Error("Already a member");
    }

    clubMembers.push({ club_id: clubId, student_id: userId, role: 2 }); // 2: member
    logTable("clubMembers", clubMembers);
    return delay({ success: true });
  },

  getMembers: async (clubId) => {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/members`);
      if (!response.ok) throw new Error("Failed to get members");
      return response.json();
    }

    const members = clubMembers.filter((m) => m.club_id === clubId);
    return delay(members.map((m) => ({ ...m })));
  },

  removeMember: async (clubId, userId) => {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/members/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove member");
      return response.json();
    }

    const index = clubMembers.findIndex(
      (m) => m.club_id === clubId && m.student_id === userId
    );
    if (index === -1) throw new Error("Member not found");

    clubMembers.splice(index, 1);
    logTable("clubMembers", clubMembers);
    return delay({ success: true });
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

