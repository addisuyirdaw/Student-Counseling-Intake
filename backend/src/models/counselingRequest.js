import prisma from '../config/database.js';

export async function createCounselingRequest(data) {
  return prisma.counselingRequest.create({
    data: {
      studentId: data.studentId,
      counselingTopic: data.counselingTopic,
      topicCustom: data.topicCustom ?? null,
      concernDescription: data.concernDescription,
      hadPreviousCounseling: data.hadPreviousCounseling,
      previousCounselingDetails: data.previousCounselingDetails ?? null,
      preferredDays: Array.isArray(data.preferredDays) ? JSON.stringify(data.preferredDays) : (data.preferredDays || '[]'),
      preferredTimeSlots: Array.isArray(data.preferredTimeSlots) ? JSON.stringify(data.preferredTimeSlots) : (data.preferredTimeSlots || '[]'),
      additionalComments: data.additionalComments ?? null,
      urgencyLevel: data.urgencyLevel ? data.urgencyLevel.toUpperCase() : 'MEDIUM',
      consentGiven: data.consentGiven,
      signatureDataUrl: data.signatureDataUrl,
      status: data.status ?? 'PENDING',
    },
    include: { student: true },
  });
}

export async function findRequestById(id) {
  return prisma.counselingRequest.findUnique({
    where: { id },
    include: { student: true },
  });
}

export async function updateRequestStatus(id, status) {
  const normalizedStatus = (status || 'PENDING').trim().toUpperCase();
  return prisma.counselingRequest.update({
    where: { id },
    data: { status: normalizedStatus, updatedAt: new Date() },
    include: { student: true },
  });
}

export async function updateRequestNotes(id, advisorNotes) {
  return prisma.counselingRequest.update({
    where: { id },
    data: { advisorNotes, updatedAt: new Date() },
    include: { student: true },
  });
}

export async function findRequests(filters = {}) {
  const { status, page = 1, limit = 10 } = filters;
  const where = {};
  if (status && status.trim() !== '') {
    where.status = status.trim().toUpperCase();
  }

  const skip = (page - 1) * limit;

  const requests = await prisma.counselingRequest.findMany({
    where,
    include: { student: true },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.counselingRequest.count({ where });

  return { requests, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function countByStatus() {
  const statuses = await prisma.counselingRequest.groupBy({
    by: ['status'],
    _count: { status: true },
  });
  const urgentCount = await prisma.counselingRequest.count({
    where: { urgencyLevel: 'HIGH' },
  });
  const totalCount = await prisma.counselingRequest.count();

  const counts = {
    PENDING: 0,
    REVIEWED: 0,
    SCHEDULED: 0,
    COMPLETED: 0,
    REJECTED: 0,
    URGENT: urgentCount,
    TOTAL: totalCount,
  };

  statuses.forEach((s) => {
    if (s.status) {
      counts[s.status.trim().toUpperCase()] = s._count.status;
    }
  });

  return counts;
}

export function formatRequest(request) {
  const parseJsonArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return val.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  return {
    id: request.id,
    studentId: request.student?.studentId ?? request.studentId,
    student: request.student ? {
      firstName: request.student.firstName,
      lastName: request.student.lastName,
      email: request.student.email,
      phone: request.student.phone,
      department: request.student.department,
      yearInSchool: request.student.yearInSchool,
      gpa: request.student.gpa?.toString() ?? null,
    } : null,
    counselingTopic: request.counselingTopic,
    topicCustom: request.topicCustom,
    concernDescription: request.concernDescription,
    hadPreviousCounseling: Boolean(request.hadPreviousCounseling),
    previousCounselingDetails: request.previousCounselingDetails,
    preferredDays: parseJsonArray(request.preferredDays),
    preferredTimeSlots: parseJsonArray(request.preferredTimeSlots),
    additionalComments: request.additionalComments,
    consentGiven: Boolean(request.consentGiven),
    signatureDataUrl: request.signatureDataUrl,
    advisorNotes: request.advisorNotes ?? '',
    urgencyLevel: request.urgencyLevel ?? 'MEDIUM',
    status: (request.status || 'PENDING').trim().toUpperCase(),
    createdAt: request.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: request.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}