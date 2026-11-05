import prisma from '../config/database.js';

// In-memory fallback dataset for when database is not yet initialized or offline
let memoryRequests = [
  {
    id: 'req-demo-001',
    studentId: 'STU2024001',
    student: {
      id: 'stu-demo-001',
      studentId: 'STU2024001',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sconnor@university.edu',
      phone: '(555) 123-4567',
      department: 'Computer Science (CS)',
      yearInSchool: '3rd Year',
      gpa: 3.82,
    },
    counselingTopic: 'Academic Pressure',
    topicCustom: null,
    concernDescription: 'Experiencing significant stress managing upper-level algorithm coursework alongside senior project commitments. Seeking time management and anxiety management techniques.',
    hadPreviousCounseling: false,
    previousCounselingDetails: null,
    preferredDays: JSON.stringify(['Tuesday', 'Thursday']),
    preferredTimeSlots: JSON.stringify(['Morning', 'Afternoon']),
    additionalComments: 'Prefers quiet meeting room or Zoom if possible.',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: '',
    urgencyLevel: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date('2026-09-01T09:00:00Z'),
    updatedAt: new Date('2026-09-01T09:00:00Z'),
  },
  {
    id: 'req-demo-002',
    studentId: 'STU2024002',
    student: {
      id: 'stu-demo-002',
      studentId: 'STU2024002',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'mvance@university.edu',
      phone: '(555) 234-5678',
      department: 'Software Engineering (SE)',
      yearInSchool: '4th Year',
      gpa: 3.45,
    },
    counselingTopic: 'Depression',
    topicCustom: null,
    concernDescription: 'Acute difficulty with motivation, persistent fatigue, and trouble attending morning lectures over the last 3 weeks. Urgent support requested.',
    hadPreviousCounseling: true,
    previousCounselingDetails: 'Saw high school counselor in 2021 for situational depression; cognitive behavioral strategies helped.',
    preferredDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
    preferredTimeSlots: JSON.stringify(['Morning']),
    additionalComments: 'Available on short notice if earlier slots open up.',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: 'Flagged for priority advisor triage outreach.',
    urgencyLevel: 'HIGH',
    status: 'PENDING',
    createdAt: new Date('2026-09-02T10:30:00Z'),
    updatedAt: new Date('2026-09-02T10:30:00Z'),
  },
  {
    id: 'req-demo-003',
    studentId: 'STU2024003',
    student: {
      id: 'stu-demo-003',
      studentId: 'STU2024003',
      firstName: 'Elena',
      lastName: 'Reyes',
      email: 'ereyes@university.edu',
      phone: '(555) 345-6789',
      department: 'Natural Sciences',
      yearInSchool: '2nd Year',
      gpa: 3.91,
    },
    counselingTopic: 'Career Guidance',
    topicCustom: null,
    concernDescription: 'Looking to discuss transition into pre-med track and balancing laboratory research with extracurricular wellness.',
    hadPreviousCounseling: false,
    previousCounselingDetails: null,
    preferredDays: JSON.stringify(['Wednesday', 'Thursday']),
    preferredTimeSlots: JSON.stringify(['Afternoon']),
    additionalComments: '',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: 'Appointment booked for Wednesday 2:00 PM at Student Services Suite 302.',
    urgencyLevel: 'LOW',
    status: 'SCHEDULED',
    createdAt: new Date('2026-09-03T14:15:00Z'),
    updatedAt: new Date('2026-09-03T14:15:00Z'),
  },
  {
    id: 'req-demo-004',
    studentId: 'STU2024004',
    student: {
      id: 'stu-demo-004',
      studentId: 'STU2024004',
      firstName: 'David',
      lastName: 'Kim',
      email: 'dkim@university.edu',
      phone: '(555) 456-7890',
      department: 'Social Sciences',
      yearInSchool: '1st Year',
      gpa: 3.20,
    },
    counselingTopic: 'Stress Management',
    topicCustom: null,
    concernDescription: 'Freshman transition stress, feeling overwhelmed adapting to independent living and college dorm life.',
    hadPreviousCounseling: false,
    previousCounselingDetails: null,
    preferredDays: JSON.stringify(['Monday', 'Tuesday']),
    preferredTimeSlots: JSON.stringify(['Afternoon', 'Evening']),
    additionalComments: '',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: 'Reviewed by Dr. Hayes on Sept 4. Shared peer support group schedule.',
    urgencyLevel: 'MEDIUM',
    status: 'REVIEWED',
    createdAt: new Date('2026-09-04T11:00:00Z'),
    updatedAt: new Date('2026-09-04T11:00:00Z'),
  },
];

export async function createCounselingRequest(data) {
  try {
    return await prisma.counselingRequest.create({
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
  } catch (err) {
    console.warn('DB createCounselingRequest fallback to memory:', err.message || err);
    const newReq = {
      id: `req-${Date.now()}`,
      studentId: data.studentId,
      student: data.student || {
        id: data.studentId,
        studentId: data.studentId,
        firstName: data.firstName || 'Student',
        lastName: data.lastName || '',
        email: data.email || 'student@university.edu',
        phone: data.phone || '',
        department: data.department || '',
        yearInSchool: data.yearInSchool || '',
        gpa: data.gpa || null,
      },
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryRequests.unshift(newReq);
    return newReq;
  }
}

export async function findRequestById(id) {
  try {
    const req = await prisma.counselingRequest.findUnique({
      where: { id },
      include: { student: true },
    });
    if (req) return req;
  } catch (err) {
    console.warn('DB findRequestById fallback to memory:', err.message || err);
  }
  return memoryRequests.find((r) => r.id === id) || null;
}

export async function updateRequestStatus(id, status) {
  const normalizedStatus = (status || 'PENDING').trim().toUpperCase();
  try {
    return await prisma.counselingRequest.update({
      where: { id },
      data: { status: normalizedStatus, updatedAt: new Date() },
      include: { student: true },
    });
  } catch (err) {
    console.warn('DB updateRequestStatus fallback to memory:', err.message || err);
    const found = memoryRequests.find((r) => r.id === id);
    if (found) {
      found.status = normalizedStatus;
      found.updatedAt = new Date();
      return found;
    }
    throw err;
  }
}

export async function updateRequestNotes(id, advisorNotes) {
  try {
    return await prisma.counselingRequest.update({
      where: { id },
      data: { advisorNotes, updatedAt: new Date() },
      include: { student: true },
    });
  } catch (err) {
    console.warn('DB updateRequestNotes fallback to memory:', err.message || err);
    const found = memoryRequests.find((r) => r.id === id);
    if (found) {
      found.advisorNotes = advisorNotes;
      found.updatedAt = new Date();
      return found;
    }
    throw err;
  }
}

export async function findRequests(filters = {}) {
  const { status, page = 1, limit = 10 } = filters;
  const where = {};
  if (status && status.trim() !== '') {
    where.status = status.trim().toUpperCase();
  }

  const skip = (page - 1) * limit;

  try {
    const requests = await prisma.counselingRequest.findMany({
      where,
      include: { student: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.counselingRequest.count({ where });

    if (total > 0 || (requests && requests.length > 0)) {
      return { requests, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
  } catch (err) {
    console.warn('DB findRequests fallback to memory:', err.message || err);
  }

  // Memory fallback
  let filtered = [...memoryRequests];
  if (status && status.trim() !== '') {
    filtered = filtered.filter((r) => r.status.toUpperCase() === status.trim().toUpperCase());
  }

  const total = filtered.length;
  const paged = filtered.slice(skip, skip + limit);
  return { requests: paged, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
}

export async function countByStatus() {
  try {
    const statuses = await prisma.counselingRequest.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    const urgentCount = await prisma.counselingRequest.count({
      where: { urgencyLevel: 'HIGH' },
    });
    const totalCount = await prisma.counselingRequest.count();

    if (totalCount > 0) {
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
  } catch (err) {
    console.warn('DB countByStatus fallback to memory:', err.message || err);
  }

  // Memory fallback counts
  const counts = {
    PENDING: 0,
    REVIEWED: 0,
    SCHEDULED: 0,
    COMPLETED: 0,
    REJECTED: 0,
    URGENT: 0,
    TOTAL: memoryRequests.length,
  };

  memoryRequests.forEach((r) => {
    const st = (r.status || 'PENDING').trim().toUpperCase();
    if (counts[st] !== undefined) counts[st]++;
    if (r.urgencyLevel === 'HIGH') counts.URGENT++;
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
    createdAt: request.createdAt instanceof Date ? request.createdAt.toISOString() : (request.createdAt || new Date().toISOString()),
    updatedAt: request.updatedAt instanceof Date ? request.updatedAt.toISOString() : (request.updatedAt || new Date().toISOString()),
  };
}
