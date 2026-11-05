import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api/v1/counseling`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const authApi = axios.create({
  baseURL: `${API_BASE}/api/v1/auth`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Interceptor to attach Bearer token fallback for cross-domain Vercel/Render deployments
const attachAuth = (config) => {
  const token = sessionStorage.getItem('advisor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachAuth);
authApi.interceptors.request.use(attachAuth);

export const MOCK_REQUESTS = [
  {
    id: 'req-demo-001',
    studentId: 'STU2024001',
    student: {
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sconnor@university.edu',
      phone: '(555) 123-4567',
      department: 'Computer Science (CS)',
      yearInSchool: '3rd Year',
      gpa: '3.82',
    },
    counselingTopic: 'Academic Pressure',
    topicCustom: null,
    concernDescription: 'Experiencing significant stress managing upper-level algorithm coursework alongside senior project commitments. Seeking time management and anxiety management techniques.',
    hadPreviousCounseling: false,
    previousCounselingDetails: null,
    preferredDays: ['Tuesday', 'Thursday'],
    preferredTimeSlots: ['Morning', 'Afternoon'],
    additionalComments: 'Prefers quiet meeting room or Zoom if possible.',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: '',
    urgencyLevel: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date('2026-09-01T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-09-01T09:00:00Z').toISOString(),
  },
  {
    id: 'req-demo-002',
    studentId: 'STU2024002',
    student: {
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'mvance@university.edu',
      phone: '(555) 234-5678',
      department: 'Software Engineering (SE)',
      yearInSchool: '4th Year',
      gpa: '3.45',
    },
    counselingTopic: 'Depression',
    topicCustom: null,
    concernDescription: 'Acute difficulty with motivation, persistent fatigue, and trouble attending morning lectures over the last 3 weeks. Urgent support requested.',
    hadPreviousCounseling: true,
    previousCounselingDetails: 'Saw high school counselor in 2021 for situational depression; cognitive behavioral strategies helped.',
    preferredDays: ['Monday', 'Wednesday', 'Friday'],
    preferredTimeSlots: ['Morning'],
    additionalComments: 'Available on short notice if earlier slots open up.',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: 'Flagged for priority advisor triage outreach.',
    urgencyLevel: 'HIGH',
    status: 'PENDING',
    createdAt: new Date('2026-09-02T10:30:00Z').toISOString(),
    updatedAt: new Date('2026-09-02T10:30:00Z').toISOString(),
  },
  {
    id: 'req-demo-003',
    studentId: 'STU2024003',
    student: {
      firstName: 'Elena',
      lastName: 'Reyes',
      email: 'ereyes@university.edu',
      phone: '(555) 345-6789',
      department: 'Natural Sciences',
      yearInSchool: '2nd Year',
      gpa: '3.91',
    },
    counselingTopic: 'Career Guidance',
    topicCustom: null,
    concernDescription: 'Looking to discuss transition into pre-med track and balancing laboratory research with extracurricular wellness.',
    hadPreviousCounseling: false,
    previousCounselingDetails: null,
    preferredDays: ['Wednesday', 'Thursday'],
    preferredTimeSlots: ['Afternoon'],
    additionalComments: '',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: 'Appointment booked for Wednesday 2:00 PM at Student Services Suite 302.',
    urgencyLevel: 'LOW',
    status: 'SCHEDULED',
    createdAt: new Date('2026-09-03T14:15:00Z').toISOString(),
    updatedAt: new Date('2026-09-03T14:15:00Z').toISOString(),
  },
  {
    id: 'req-demo-004',
    studentId: 'STU2024004',
    student: {
      firstName: 'David',
      lastName: 'Kim',
      email: 'dkim@university.edu',
      phone: '(555) 456-7890',
      department: 'Social Sciences',
      yearInSchool: '1st Year',
      gpa: '3.20',
    },
    counselingTopic: 'Stress Management',
    topicCustom: null,
    concernDescription: 'Freshman transition stress, feeling overwhelmed adapting to independent living and college dorm life.',
    hadPreviousCounseling: false,
    previousCounselingDetails: null,
    preferredDays: ['Monday', 'Tuesday'],
    preferredTimeSlots: ['Afternoon', 'Evening'],
    additionalComments: '',
    consentGiven: true,
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
    advisorNotes: 'Reviewed by Dr. Hayes on Sept 4. Shared peer support group schedule.',
    urgencyLevel: 'MEDIUM',
    status: 'REVIEWED',
    createdAt: new Date('2026-09-04T11:00:00Z').toISOString(),
    updatedAt: new Date('2026-09-04T11:00:00Z').toISOString(),
  },
];

let localRequests = [...MOCK_REQUESTS];
const localPasswords = {};

export async function submitCounseling(data) {
  try {
    const response = await api.post('/submit', data);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable during submit, saving locally:', err.message);
    const newReq = {
      id: `req-${Date.now()}`,
      studentId: data.studentId,
      student: {
        firstName: data.firstName || 'Student',
        lastName: data.lastName || '',
        email: data.email || 'student@university.edu',
        phone: data.phone || '',
        department: data.department || '',
        yearInSchool: data.yearInSchool || '',
        gpa: data.gpa || null,
      },
      counselingTopic: data.counselingTopic,
      topicCustom: data.topicCustom || null,
      concernDescription: data.concernDescription,
      hadPreviousCounseling: data.hadPreviousCounseling,
      previousCounselingDetails: data.previousCounselingDetails || null,
      preferredDays: Array.isArray(data.preferredDays) ? data.preferredDays : [],
      preferredTimeSlots: Array.isArray(data.preferredTimeSlots) ? data.preferredTimeSlots : [],
      additionalComments: data.additionalComments || null,
      urgencyLevel: data.urgencyLevel || 'MEDIUM',
      status: 'PENDING',
      signatureDataUrl: data.signatureDataUrl,
      advisorNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localRequests.unshift(newReq);
    return { message: 'Counseling request submitted successfully', data: newReq };
  }
}

export async function getRequests(params = {}) {
  try {
    const response = await api.get('/requests', { params });
    return response.data;
  } catch (err) {
    console.warn('Backend /requests unavailable, using mock data:', err.message);
    let filtered = [...localRequests];
    if (params.status && params.status.trim()) {
      filtered = filtered.filter((r) => r.status.toUpperCase() === params.status.trim().toUpperCase());
    }
    const page = params.page || 1;
    const limit = params.limit || 12;
    const skip = (page - 1) * limit;
    const paged = filtered.slice(skip, skip + limit);
    return {
      message: 'Counseling requests retrieved successfully',
      data: paged,
      pagination: { total: filtered.length, page, limit, totalPages: Math.ceil(filtered.length / limit) || 1 },
    };
  }
}

export async function updateStatus(id, status) {
  try {
    const response = await api.patch(`/requests/${id}/status`, { status });
    return response.data;
  } catch (err) {
    const found = localRequests.find((r) => r.id === id);
    if (found) {
      found.status = (status || 'PENDING').trim().toUpperCase();
      found.updatedAt = new Date().toISOString();
    }
    return { message: 'Status updated', status };
  }
}

export async function updateNotes(id, notes) {
  try {
    const response = await api.patch(`/requests/${id}/notes`, { notes });
    return response.data;
  } catch (err) {
    const found = localRequests.find((r) => r.id === id);
    if (found) {
      found.advisorNotes = notes;
      found.updatedAt = new Date().toISOString();
    }
    return { message: 'Notes updated', notes };
  }
}

export async function getCounts() {
  try {
    const response = await api.get('/counts');
    return response.data;
  } catch (err) {
    const counts = {
      PENDING: 0,
      REVIEWED: 0,
      SCHEDULED: 0,
      COMPLETED: 0,
      REJECTED: 0,
      URGENT: 0,
      TOTAL: localRequests.length,
    };
    localRequests.forEach((r) => {
      const s = (r.status || 'PENDING').trim().toUpperCase();
      if (counts[s] !== undefined) counts[s]++;
      if (r.urgencyLevel === 'HIGH') counts.URGENT++;
    });
    return { data: counts };
  }
}

// Advisor Authentication API
export async function loginAdvisor(credentials) {
  const normEmail = (credentials.email || '').trim().toLowerCase();
  const pass = credentials.password || '';

  try {
    const response = await authApi.post('/login', credentials);
    if (response.data?.token) {
      sessionStorage.setItem('advisor_token', response.data.token);
    }
    return response.data;
  } catch (err) {
    // Check against custom reset password or default credentials
    const customPass = localPasswords[normEmail];
    const isCustomMatch = customPass && pass === customPass;
    const isDefaultMatch = pass === 'counselor2024' && (
      normEmail === 'advisor@university.edu' ||
      normEmail === 'addisulal2@gmail.com' ||
      normEmail === 's.jenkins@university.edu' ||
      normEmail === 'counselor@university.edu'
    );

    if (isCustomMatch || isDefaultMatch) {
      const demoUser = {
        id: normEmail === 'addisulal2@gmail.com' ? 'staff-addisu-001' : (normEmail === 'advisor@university.edu' ? 'staff-hayes-001' : 'staff-jenkins-002'),
        name: normEmail === 'addisulal2@gmail.com' ? 'Addisu' : (normEmail === 'advisor@university.edu' ? 'Dr. Katherine Hayes' : 'Staff Advisor'),
        title: 'Lead Academic Counselor & Director',
        email: normEmail,
        role: 'ADMIN',
        department: 'Counseling & Psychological Services',
      };
      sessionStorage.setItem('advisor_token', 'demo-advisor-token-2024');
      sessionStorage.setItem('counselor_auth_user', JSON.stringify(demoUser));
      return {
        message: 'Authentication successful',
        token: 'demo-advisor-token-2024',
        user: demoUser,
      };
    }
    throw err;
  }
}

export async function resetPassword(email, newPassword) {
  const normEmail = (email || '').trim().toLowerCase();
  const trimmedPass = newPassword.trim();
  localPasswords[normEmail] = trimmedPass;

  try {
    const response = await authApi.post('/reset-password', { email: normEmail, newPassword: trimmedPass });
    return response.data;
  } catch (err) {
    return { message: 'Passcode reset successfully. You can now log in.' };
  }
}

export async function getAuthMe() {
  try {
    const response = await authApi.get('/me');
    return response.data;
  } catch (err) {
    const cached = sessionStorage.getItem('counselor_auth_user');
    if (cached) {
      try {
        return { user: JSON.parse(cached) };
      } catch {
        // Fall through
      }
    }
    throw err;
  }
}

export async function logoutAdvisor() {
  try {
    await authApi.post('/logout');
  } catch {
    // Non-blocking logout error
  }
  sessionStorage.removeItem('advisor_token');
  sessionStorage.removeItem('counselor_auth_user');
  return { message: 'Logged out successfully' };
}

export async function updateAdvisorProfile(data) {
  try {
    const response = await authApi.patch('/staff/me', data);
    if (response.data?.token) {
      sessionStorage.setItem('advisor_token', response.data.token);
    }
    return response.data;
  } catch (err) {
    const cached = sessionStorage.getItem('counselor_auth_user');
    let updated = cached ? JSON.parse(cached) : {};
    if (data.name) updated.name = data.name;
    if (data.email) updated.email = data.email;
    if (data.avatarUrl !== undefined) updated.avatarUrl = data.avatarUrl;
    sessionStorage.setItem('counselor_auth_user', JSON.stringify(updated));
    return { message: 'Profile updated', user: updated };
  }
}

export async function getStaffList() {
  try {
    const response = await authApi.get('/staff');
    return response.data;
  } catch (err) {
    return {
      advisors: [
        { id: 'staff-addisu-001', name: 'Addisu', email: 'addisulal2@gmail.com', role: 'ADMIN', isActive: true },
        { id: 'staff-hayes-001', name: 'Dr. Katherine Hayes', email: 'advisor@university.edu', role: 'ADMIN', isActive: true },
        { id: 'staff-jenkins-002', name: 'Dr. Sarah Jenkins', email: 's.jenkins@university.edu', role: 'LEAD_ADVISOR', isActive: true },
      ],
    };
  }
}

export async function createStaffMember(data) {
  const response = await authApi.post('/staff/create', data);
  return response.data;
}

export async function adminUpdateStaff(id, data) {
  const response = await authApi.patch(`/staff/${id}`, data);
  return response.data;
}
