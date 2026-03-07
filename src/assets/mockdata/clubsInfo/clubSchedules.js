import { clubScheduleDays } from "./clubScheduleDay";
import { clubScheduleTimes } from "./clubScheduleTime";

export const clubSchedules = clubScheduleDays
  .filter((d) => d.day_of_week != null)
  .map((d) => {
    const time = clubScheduleTimes.find((t) => t.club_id === d.club_id);
    return {
      club_id: d.club_id,
      day_of_week: d.day_of_week,
      start_time: time?.start_time ?? null,
      end_time: time?.end_time ?? null,
    };
  });
