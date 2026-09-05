import prisma from '../config/database.js';

export async function findStudentByStudentId(studentId) {
  return prisma.student.findUnique({ where: { studentId } });
}

export async function findStudentByEmail(email) {
  return prisma.student.findUnique({ where: { email } });
}

export async function createStudent(data) {
  return prisma.student.create({
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
}

export async function upsertStudent(data) {
  return prisma.student.upsert({
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
}

export async function findStudentById(id) {
  return prisma.student.findUnique({ where: { id } });
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
    createdAt: student.createdAt.toISOString(),
  };
}