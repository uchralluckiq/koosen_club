import express from 'express';
import cors from 'cors';

// Import mock "tables" from the frontend mockdata (now in src/mockdata).
// These are used here as an in-memory database.
import { clubs } from '../src/mockdata/clubsInfo/clubs.js';
import { clubMembers } from '../src/mockdata/clubsInfo/clubMembers.js';
import { clubAllowedEngineerClasses } from '../src/mockdata/clubsInfo/clubAllowedEngineerClasses.js';
import { clubAllowedCollegeYears } from '../src/mockdata/clubsInfo/clubAllowedCollegeYears.js';
import { clubSchedules } from '../src/mockdata/clubsInfo/clubSchedules.js';
import { clubJoinRequests } from '../src/mockdata/clubsInfo/clubJoinRequests.js';
import { clubScheduleDays } from '../src/mockdata/clubsInfo/clubScheduleDay.js';
import { clubScheduleTimes } from '../src/mockdata/clubsInfo/clubScheduleTime.js';
import { clubTextBlocks } from '../src/mockdata/clubsInfo/clubTextBlocks.js';
import { createClubRequests } from '../src/mockdata/clubsInfo/createClubRequests.js';
import { feedback } from '../src/mockdata/feedback.js';

const app = express();
const PORT = process.env.PORT || 4000;
const API_BASE = '/api';

app.use(cors());
app.use(express.json());

// ---------- Helper functions ----------

function nextIdFrom(table, key = 'id') {
  if (!Array.isArray(table) || table.length === 0) return 1;
  return Math.max(...table.map((row) => row[key] ?? 0), 0) + 1;
}

// ---------- Clubs ----------

// List clubs with derived fields, mirroring clubService.getAll
app.get(`${API_BASE}/clubs`, (req, res) => {
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
  res.json(enriched);
});

// Get club by id
app.get(`${API_BASE}/clubs/:id`, (req, res) => {
  const id = Number(req.params.id);
  const club = clubs.find((c) => c.id === id);
  if (!club) return res.status(404).json({ error: 'Club not found' });

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

  res.json({
    ...club,
    memberCount,
    engineerClasses,
    collegeYears,
    schedules,
  });
});

// Create club
app.post(`${API_BASE}/clubs`, (req, res) => {
  const { type = 'education', name = 'Шинэ клуб', maximum_member = 20, main_media_url = null, room_id = null } = req.body || {};

  const id = nextIdFrom(clubs);
  const newClub = { id, type, name, maximum_member, main_media_url, room_id };
  clubs.push(newClub);
  res.status(201).json(newClub);
});

// Create club with placeholders and leader
app.post(`${API_BASE}/clubs/create-with-leader`, (req, res) => {
  const { type = 'education', name = 'Шинэ клуб', maximum_member = 20, leaderId } = req.body || {};

  if (!leaderId) {
    return res.status(400).json({ error: 'leaderId is required' });
  }

  const id = nextIdFrom(clubs);
  const newClub = {
    id,
    type,
    name,
    maximum_member,
    main_media_url: null,
    room_id: null,
  };
  clubs.push(newClub);

  clubMembers.push({ club_id: id, student_id: leaderId, role: 1 });
  clubAllowedCollegeYears.push({ club_id: id, college_year: 'Бүх курс' });
  clubAllowedEngineerClasses.push({ club_id: id, engineer_class: 'Бүх бүлэг' });
  clubScheduleDays.push({ club_id: id, day_of_week: null });
  clubScheduleTimes.push({ club_id: id, start_time: null, end_time: null });

  res.status(201).json(newClub);
});

// Update club
app.put(`${API_BASE}/clubs/:id`, (req, res) => {
  const id = Number(req.params.id);
  const index = clubs.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Club not found' });

  clubs[index] = { ...clubs[index], ...req.body };
  res.json(clubs[index]);
});

// Delete club and related rows
app.delete(`${API_BASE}/clubs/:id`, (req, res) => {
  const id = Number(req.params.id);
  const index = clubs.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Club not found' });

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

  res.json({ success: true });
});

// Join club
app.post(`${API_BASE}/clubs/:id/join`, (req, res) => {
  const clubId = Number(req.params.id);
  const { userId } = req.body || {};
  if (!clubId || !userId) {
    return res.status(400).json({ error: 'clubId and userId are required' });
  }

  if (clubMembers.some((m) => m.club_id === clubId && m.student_id === userId)) {
    return res.status(400).json({ error: 'Already a member' });
  }

  clubMembers.push({ club_id: clubId, student_id: userId, role: 2 });
  res.status(201).json({ success: true });
});

// Get club members
app.get(`${API_BASE}/clubs/:id/members`, (req, res) => {
  const clubId = Number(req.params.id);
  const members = clubMembers.filter((m) => m.club_id === clubId);
  res.json(members);
});

// Remove member
app.delete(`${API_BASE}/clubs/:clubId/members/:userId`, (req, res) => {
  const clubId = Number(req.params.clubId);
  const userId = req.params.userId;

  const index = clubMembers.findIndex(
    (m) => m.club_id === clubId && m.student_id === userId
  );
  if (index === -1) return res.status(404).json({ error: 'Member not found' });

  clubMembers.splice(index, 1);
  res.json({ success: true });
});

// ---------- Club join requests ----------

app.get(`${API_BASE}/clubs/:clubId/join-requests`, (req, res) => {
  const clubId = Number(req.params.clubId);
  const requests = clubJoinRequests.filter(
    (r) => r.club_id === clubId && r.status === 1
  );
  res.json(requests);
});

app.get(`${API_BASE}/users/:userId/join-requests`, (req, res) => {
  const { userId } = req.params;
  const requests = clubJoinRequests.filter((r) => r.student_id === userId);
  res.json(requests);
});

app.post(`${API_BASE}/clubs/:clubId/join-requests`, (req, res) => {
  const clubId = Number(req.params.clubId);
  const { userId } = req.body || {};
  if (!clubId || !userId) {
    return res.status(400).json({ error: 'clubId and userId are required' });
  }

  if (
    clubJoinRequests.some(
      (r) => r.club_id === clubId && r.student_id === userId && r.status === 1
    )
  ) {
    return res.status(400).json({ error: 'Already has pending request' });
  }

  const id = nextIdFrom(clubJoinRequests);
  const newRequest = {
    id,
    club_id: clubId,
    student_id: userId,
    status: 1,
    requested_date: new Date().toISOString().split('T')[0],
    reviewed_by: null,
  };

  clubJoinRequests.push(newRequest);
  res.status(201).json(newRequest);
});

app.post(`${API_BASE}/join-requests/:requestId/approve`, (req, res) => {
  const requestId = Number(req.params.requestId);
  const { reviewerId } = req.body || {};

  const request = clubJoinRequests.find((r) => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  request.status = 2;
  request.reviewed_by = reviewerId ?? null;

  clubMembers.push({
    club_id: request.club_id,
    student_id: request.student_id,
    role: 2,
  });

  res.json(request);
});

app.post(`${API_BASE}/join-requests/:requestId/reject`, (req, res) => {
  const requestId = Number(req.params.requestId);
  const { reviewerId } = req.body || {};

  const request = clubJoinRequests.find((r) => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });

  request.status = 3;
  request.reviewed_by = reviewerId ?? null;

  res.json(request);
});

// ---------- Club text blocks ----------

app.get(`${API_BASE}/clubs/:clubId/textblocks`, (req, res) => {
  const clubId = Number(req.params.clubId);
  const blocks = clubTextBlocks
    .filter((b) => b.club_id === clubId)
    .sort((a, b) => a.order_index - b.order_index);
  res.json(blocks);
});

app.post(`${API_BASE}/clubs/:clubId/textblocks`, (req, res) => {
  const clubId = Number(req.params.clubId);
  const { title = 'Шинэ блок', content = '', media_url = null, media_type = null } = req.body || {};

  const maxOrder = Math.max(
    0,
    ...clubTextBlocks
      .filter((b) => b.club_id === clubId)
      .map((b) => b.order_index ?? 0)
  );

  const id = nextIdFrom(clubTextBlocks);
  const newBlock = {
    id,
    club_id: clubId,
    title,
    content,
    media_url,
    media_type,
    order_index: maxOrder + 1,
  };

  clubTextBlocks.push(newBlock);
  res.status(201).json(newBlock);
});

app.put(`${API_BASE}/textblocks/:blockId`, (req, res) => {
  const blockId = Number(req.params.blockId);
  const index = clubTextBlocks.findIndex((b) => b.id === blockId);
  if (index === -1) return res.status(404).json({ error: 'Text block not found' });

  clubTextBlocks[index] = { ...clubTextBlocks[index], ...req.body };
  res.json(clubTextBlocks[index]);
});

app.delete(`${API_BASE}/textblocks/:blockId`, (req, res) => {
  const blockId = Number(req.params.blockId);
  const index = clubTextBlocks.findIndex((b) => b.id === blockId);
  if (index === -1) return res.status(404).json({ error: 'Text block not found' });

  clubTextBlocks.splice(index, 1);
  res.json({ success: true });
});

app.put(`${API_BASE}/clubs/:clubId/textblocks/reorder`, (req, res) => {
  const clubId = Number(req.params.clubId);
  const { blockIds } = req.body || {};

  if (!Array.isArray(blockIds)) {
    return res.status(400).json({ error: 'blockIds must be an array' });
  }

  blockIds.forEach((id, index) => {
    const block = clubTextBlocks.find(
      (b) => b.id === id && b.club_id === clubId
    );
    if (block) block.order_index = index + 1;
  });

  res.json({ success: true });
});

// ---------- Create club requests ----------

app.post(`${API_BASE}/create-club-requests`, (req, res) => {
  const {
    requester_id,
    name,
    type = 'education',
    goal = '',
    maximum_member = 20,
  } = req.body || {};

  if (!requester_id || !name?.trim()) {
    return res.status(400).json({ error: 'Нэр болон хүсэлт гаргагч заавал байна' });
  }

  const id = nextIdFrom(createClubRequests);
  const newRequest = {
    id,
    requester_id,
    name: name.trim(),
    type: type || 'education',
    goal: goal?.trim() ?? '',
    maximum_member: maximum_member ?? 20,
    status: 1,
    requested_date: new Date().toISOString().split('T')[0],
    reviewed_by: null,
  };

  createClubRequests.push(newRequest);
  res.status(201).json(newRequest);
});

app.get(`${API_BASE}/users/:userId/create-club-requests`, (req, res) => {
  const { userId } = req.params;
  const list = createClubRequests.filter((r) => r.requester_id === userId);
  res.json(list);
});

app.get(`${API_BASE}/create-club-requests/:requestId`, (req, res) => {
  const requestId = Number(req.params.requestId);
  const request = createClubRequests.find((r) => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(request);
});

app.get(`${API_BASE}/create-club-requests`, (req, res) => {
  res.json(createClubRequests);
});

app.post(`${API_BASE}/create-club-requests/:requestId/approve`, (req, res) => {
  const requestId = Number(req.params.requestId);
  const { reviewerId } = req.body || {};

  const request = createClubRequests.find((r) => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Хүсэлт олдсонгүй' });
  if (request.status !== 1)
    return res.status(400).json({ error: 'Энэ хүсэлтийг шийдсэн байна' });

  const newClubId = nextIdFrom(clubs);
  const newClub = {
    id: newClubId,
    type: request.type || 'education',
    name: request.name,
    maximum_member: request.maximum_member ?? 20,
    main_media_url: null,
    room_id: null,
  };
  clubs.push(newClub);

  clubMembers.push({
    club_id: newClubId,
    student_id: request.requester_id,
    role: 1,
  });

  clubAllowedCollegeYears.push({ club_id: newClubId, college_year: 'Бүх курс' });
  clubAllowedEngineerClasses.push({ club_id: newClubId, engineer_class: 'Бүх бүлэг' });
  clubScheduleDays.push({ club_id: newClubId, day_of_week: null });
  clubScheduleTimes.push({ club_id: newClubId, start_time: null, end_time: null });

  request.status = 2;
  request.reviewed_by = reviewerId ?? null;

  res.json({ ...request, created_club_id: newClubId });
});

app.post(`${API_BASE}/create-club-requests/:requestId/reject`, (req, res) => {
  const requestId = Number(req.params.requestId);
  const { reviewerId } = req.body || {};

  const request = createClubRequests.find((r) => r.id === requestId);
  if (!request) return res.status(404).json({ error: 'Хүсэлт олдсонгүй' });
  if (request.status !== 1)
    return res.status(400).json({ error: 'Энэ хүсэлтийг шийдсэн байна' });

  request.status = 3;
  request.reviewed_by = reviewerId ?? null;

  res.json(request);
});

// ---------- Feedback ----------

app.post(`${API_BASE}/feedback`, (req, res) => {
  const { user_id, content } = req.body || {};
  if (!user_id || !content?.trim()) {
    return res.status(400).json({ error: 'Санал хүсэлтээ бичнэ үү' });
  }

  const id = nextIdFrom(feedback);
  const newEntry = {
    id,
    user_id,
    content: content.trim(),
    requested_date: new Date().toISOString().split('T')[0],
    status: 1,
  };

  feedback.push(newEntry);
  res.status(201).json(newEntry);
});

app.get(`${API_BASE}/users/:userId/feedback`, (req, res) => {
  const { userId } = req.params;
  const list = feedback.filter((f) => f.user_id === userId);
  res.json(list);
});

app.get(`${API_BASE}/feedback`, (req, res) => {
  res.json(feedback);
});

app.patch(`${API_BASE}/feedback/:id/read`, (req, res) => {
  const id = Number(req.params.id);
  const entry = feedback.find((f) => f.id === id);
  if (!entry) return res.status(404).json({ error: 'Олдсонгүй' });

  entry.status = 2;
  res.json(entry);
});

app.delete(`${API_BASE}/feedback/:id`, (req, res) => {
  const id = Number(req.params.id);
  const index = feedback.findIndex((f) => f.id === id);
  if (index === -1) return res.status(404).json({ error: 'Олдсонгүй' });

  feedback.splice(index, 1);
  res.json({ success: true });
});

// ---------- Health check ----------

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Koosen Clubs API listening on port ${PORT}`);
});

