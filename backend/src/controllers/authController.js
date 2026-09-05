import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'advisor-counseling-secure-jwt-secret-key-2024';

// Authorized university advising staff credentials
const AUTHORIZED_STAFF = [
  {
    id: 'staff-hayes-001',
    email: 'advisor@university.edu',
    password: 'counselor2024',
    name: 'Dr. Katherine Hayes',
    title: 'Lead Academic Counselor & Director',
    department: 'Counseling & Psychological Services',
  },
  {
    id: 'staff-jenkins-002',
    email: 's.jenkins@university.edu',
    password: 'counselor2024',
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Academic Counselor',
    department: 'Division of Student Affairs',
  },
  {
    id: 'staff-general-003',
    email: 'counselor@university.edu',
    password: 'counselor2024',
    name: 'Academic Advising Staff',
    title: 'Staff Counselor',
    department: 'Student Care Center',
  },
];

export async function login(req, res) {
  const { email, password } = req.body;

  // Case-insensitive normalized email lookup
  const normalizedEmail = (email || '').trim().toLowerCase();
  const staff = AUTHORIZED_STAFF.find(
    (s) => s.email.toLowerCase() === normalizedEmail && s.password === password
  );

  if (!staff) {
    // Generic sanitized error message to prevent user enumeration
    return res.status(401).json({ error: 'Invalid email or staff passcode' });
  }

  const tokenPayload = {
    id: staff.id,
    name: staff.name,
    title: staff.title,
    email: staff.email,
    department: staff.department,
    role: 'ADVISOR',
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

  // Set HttpOnly, SameSite=Strict cookie
  res.cookie('advisor_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });

  return res.status(200).json({
    message: 'Authentication successful',
    user: {
      name: staff.name,
      title: staff.title,
      email: staff.email,
      department: staff.department,
    },
  });
}

export function getMe(req, res) {
  if (!req.advisor) {
    return res.status(401).json({ error: 'Unauthorized: No active advisor session found' });
  }

  return res.status(200).json({
    user: {
      name: req.advisor.name,
      title: req.advisor.title,
      email: req.advisor.email,
      department: req.advisor.department,
    },
  });
}

export function logout(req, res) {
  res.clearCookie('advisor_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return res.status(200).json({ message: 'Logged out successfully' });
}
