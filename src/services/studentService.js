import { students } from "../assets/mockdata/students";

const delay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 400));

/**
 * Mock student service. Replace this file with real API calls when backend is ready.
 * React components should only use this API so they don't need to change.
 */
export const studentService = {
  getAll: async () => {
    return delay(students.map((s) => ({ ...s })));
  },

  getById: async (id) => {
    if (id == null) return delay(undefined);
    const student = students.find((s) => s.id === id);
    return delay(student ? { ...student } : undefined);
  },

  create: async (newStudent) => {
    const toAdd = {
      ...newStudent,
      id: newStudent.id ?? String(Date.now()),
    };
    students.push(toAdd);
    return delay({ ...toAdd });
  },

  update: async (id, updatedData) => {
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");
    students[index] = { ...students[index], ...updatedData };
    return delay({ ...students[index] });
  },

  remove: async (id) => {
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");
    students.splice(index, 1);
    return delay(true);
  },
};