// ===== USERS TABLE (from users.js – for login: id, email, password, name, role, etc.) =====
export let users = [
  // students
  { id: "mk25c001", email: "student1@example.com", password: "password123", name: "Батбаяр", class_id: "1-1", role: "student" },
  { id: "mk25c002", email: "student2@example.com", password: "password123", name: "Сараа", class_id: "1-1", role: "student" },
  { id: "mk25c003", email: "student3@example.com", password: "password123", name: "Энхбат", class_id: "1-1", role: "student" },
  { id: "mk25c004", email: "student4@example.com", password: "password123", name: "Мөнхбат", class_id: "1-1", role: "student" },

  // teachers
  { id: "mktch001", email: "teacher1@example.com", password: "password123", name: "Odonjargal", class_id: "1-1", role: "teacher" },
  { id: "mktch002", email: "teacher2@example.com", password: "password123", name: "Hishigt", class_id: "1-2", role: "teacher" },
  { id: "mktch003", email: "teacher3@example.com", password: "password123", name: "Sarah", class_id: "1-3", role: "teacher" },

  // admin
  { id: "mkadmin001", email: "admin@example.com", password: "admin123", name: "Админ", class_id: null, role: "admin" }
];
