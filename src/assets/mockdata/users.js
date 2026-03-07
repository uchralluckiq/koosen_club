export let users = [
  // roles: 1: admin, 2: teacher, 3: student
  // students
  { id: "mk25c001", email: "student1@example.com", password: "password123", name: "Батбаяр", class_id: "1-1", role: 3 },
  { id: "mk25c002", email: "student2@example.com", password: "password123", name: "Сараа", class_id: "1-1", role: 3 },
  { id: "mk25c003", email: "student3@example.com", password: "password123", name: "Энхбат", class_id: "1-1", role: 3 },
  { id: "mk25c004", email: "student4@example.com", password: "password123", name: "Мөнхбат", class_id: "1-1", role: 3 },

  // teachers
  { id: "mktch001", email: "teacher1@example.com", password: "password123", name: "Odonjargal", class_id: "1-1", role: 2 },
  { id: "mktch002", email: "teacher2@example.com", password: "password123", name: "Hishigt", class_id: "1-2", role: 2 },
  { id: "mktch003", email: "teacher3@example.com", password: "password123", name: "Sarah", class_id: "1-3", role: 2 },

  // admin
  { id: "mkadmin001", email: "admin@example.com", password: "admin123", name: "Админ", class_id: null, role: 1 }
];
