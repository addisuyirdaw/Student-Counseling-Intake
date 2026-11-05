import prisma from '../config/database.js';

const memoryStudents = new Map();

export async function findStudentByStudentId(studentId) {
  try {
    const student = await prisma.student.findUnique({ where: { studentId } });
    if (student) return student;
  } catch (err) {
    console.warn('DB findStudentByStudentId fallback:', err.message || err);
  }
  return memoryStudents.get(studentId) || null;
}

export async function findStudentByEmail(email) {
  try {
    const student = await prisma.student.findUnique({ where: { email } });
    if (student) return student;
  } catch (err) {
    console.warn('DB findStudentByEmail fallback:', err.message || err);
  }
  for (const s of memoryStudents.values()) {
    if (s.email === email) return s;
  }
  return null;
}

export async function createStudent(data) {
  try {
    return await prisma.student.create({
      data: {
        studentId: data.studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        yearInSchool: data.yearInSchool,
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
      },
    });
  } catch (err) {
    console.warn('DB createStudent fallback:', err.message || err);
    const student = {
      id: `stu-${Date.now()}`,
      studentId: data.studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      yearInSchool: data.yearInSchool,
      gpa: data.gpa ? parseFloat(data.gpa) : null,
      createdAt: new Date(),
    };
    memoryStudents.set(data.studentId, student);
    return student;
  }
}

export async function upsertStudent(data) {
  try {
    return await prisma.student.upsert({
      where: { studentId: data.studentId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        yearInSchool: data.yearInSchool,
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
      },
      create: {
        studentId: data.studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        yearInSchool: data.yearInSchool,
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
      },
    });
  } catch (err) {
    console.warn('DB upsertStudent fallback:', err.message || err);
    const existing = memoryStudents.get(data.studentId);
    const student = {
      id: existing ? existing.id : `stu-${Date.now()}`,
      studentId: data.studentId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      department: data.department,
      yearInSchool: data.yearInSchool,
      gpa: data.gpa ? parseFloat(data.gpa) : null,
      createdAt: existing ? existing.createdAt : new Date(),
    };
    memoryStudents.set(data.studentId, student);
    return student;
  }
}

export async function findStudentById(id) {
  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (student) return student;
  } catch (err) {
    console.warn('DB findStudentById fallback:', err.message || err);
  }
  for (const s of memoryStudents.values()) {
    if (s.id === id) return s;
  }
  return null;
}

export function formatStudent(student) {
  return {
    id: student.id,
    studentId: student.studentId,
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone,
    department: student.department,
    yearInSchool: student.yearInSchool,
    gpa: student.gpa?.toString() ?? null,
    createdAt: student.createdAt instanceof Date ? student.createdAt.toISOString() : (student.createdAt || new Date().toISOString()),
  };
}
