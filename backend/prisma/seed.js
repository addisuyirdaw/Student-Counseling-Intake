import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding to Neon PostgreSQL...');

  // ─── Seed Advisors ───────────────────────────────────────────────────────
  const SALT_ROUNDS = 12;

  const advisors = [
    {
      name: 'Dr. Katherine Hayes',
      email: 'advisor@university.edu',
      role: 'ADMIN',
      password: 'counselor2024',
    },
    {
      name: 'Dr. Sarah Jenkins',
      email: 's.jenkins@university.edu',
      role: 'LEAD_ADVISOR',
      password: 'counselor2024',
    },
    {
      name: 'Academic Advising Staff',
      email: 'counselor@university.edu',
      role: 'COUNSELOR',
      password: 'counselor2024',
    },
  ];

  for (const advisor of advisors) {
    const passwordHash = await bcrypt.hash(advisor.password, SALT_ROUNDS);
    await prisma.advisor.upsert({
      where: { email: advisor.email },
      update: { name: advisor.name, role: advisor.role, passwordHash },
      create: {
        name: advisor.name,
        email: advisor.email,
        role: advisor.role,
        passwordHash,
        isActive: true,
      },
    });
    console.log(`   ✔ Advisor seeded: ${advisor.name} (${advisor.role})`);
  }

  // ─── Seed Students & Counseling Requests ─────────────────────────────────


  // Sample student demo data
  const students = [
    {
      studentId: 'STU2024001',
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sconnor@university.edu',
      phone: '(555) 123-4567',
      department: 'Computer Science (CS)',
      yearInSchool: '3rd Year',
      gpa: 3.82,
      requests: [
        {
          counselingTopic: 'Academic Pressure',
          concernDescription: 'Experiencing significant stress managing upper-level algorithm coursework alongside senior project commitments. Seeking time management and anxiety management techniques.',
          hadPreviousCounseling: false,
          preferredDays: JSON.stringify(['Tuesday', 'Thursday']),
          preferredTimeSlots: JSON.stringify(['Morning', 'Afternoon']),
          additionalComments: 'Prefers quiet meeting room or Zoom if possible.',
          consentGiven: true,
          signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
          urgencyLevel: 'MEDIUM',
          status: 'PENDING',
          advisorNotes: '',
        },
      ],
    },
    {
      studentId: 'STU2024002',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'mvance@university.edu',
      phone: '(555) 234-5678',
      department: 'Software Engineering (SE)',
      yearInSchool: '4th Year',
      gpa: 3.45,
      requests: [
        {
          counselingTopic: 'Depression',
          concernDescription: 'Acute difficulty with motivation, persistent fatigue, and trouble attending morning lectures over the last 3 weeks. Urgent support requested.',
          hadPreviousCounseling: true,
          previousCounselingDetails: 'Saw high school counselor in 2021 for situational depression; cognitive behavioral strategies helped.',
          preferredDays: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
          preferredTimeSlots: JSON.stringify(['Morning']),
          additionalComments: 'Available on short notice if earlier slots open up.',
          consentGiven: true,
          signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
          urgencyLevel: 'HIGH',
          status: 'PENDING',
          advisorNotes: 'Flagged for priority advisor triage outreach.',
        },
      ],
    },
    {
      studentId: 'STU2024003',
      firstName: 'Elena',
      lastName: 'Reyes',
      email: 'ereyes@university.edu',
      phone: '(555) 345-6789',
      department: 'Natural Sciences',
      yearInSchool: '2nd Year',
      gpa: 3.91,
      requests: [
        {
          counselingTopic: 'Career Guidance',
          concernDescription: 'Looking to discuss transition into pre-med track and balancing laboratory research with extracurricular wellness.',
          hadPreviousCounseling: false,
          preferredDays: JSON.stringify(['Wednesday', 'Thursday']),
          preferredTimeSlots: JSON.stringify(['Afternoon']),
          additionalComments: '',
          consentGiven: true,
          signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
          urgencyLevel: 'LOW',
          status: 'SCHEDULED',
          advisorNotes: 'Appointment booked for Wednesday 2:00 PM at Student Services Suite 302.',
        },
      ],
    },
    {
      studentId: 'STU2024004',
      firstName: 'David',
      lastName: 'Kim',
      email: 'dkim@university.edu',
      phone: '(555) 456-7890',
      department: 'Social Sciences',
      yearInSchool: '1st Year',
      gpa: 3.20,
      requests: [
        {
          counselingTopic: 'Stress Management',
          concernDescription: 'Freshman transition stress, feeling overwhelmed adapting to independent living and college dorm life.',
          hadPreviousCounseling: false,
          preferredDays: JSON.stringify(['Monday', 'Tuesday']),
          preferredTimeSlots: JSON.stringify(['Afternoon', 'Evening']),
          additionalComments: '',
          consentGiven: true,
          signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAA',
          urgencyLevel: 'MEDIUM',
          status: 'REVIEWED',
          advisorNotes: 'Reviewed by Dr. Hayes on Sept 4. Shared peer support group schedule.',
        },
      ],
    },
  ];

  for (const s of students) {
    const { requests, ...studentData } = s;

    // Upsert student
    const student = await prisma.student.upsert({
      where: { email: studentData.email },
      update: studentData,
      create: studentData,
    });

    // Create counseling requests
    for (const req of requests) {
      const existing = await prisma.counselingRequest.findFirst({
        where: {
          studentId: student.id,
          counselingTopic: req.counselingTopic,
        },
      });

      if (!existing) {
        await prisma.counselingRequest.create({
          data: {
            ...req,
            studentId: student.id,
          },
        });
      }
    }
  }

  const studentCount = await prisma.student.count();
  const requestCount = await prisma.counselingRequest.count();

  console.log(`✅ Seed completed successfully!`);
  console.log(`   - Total Students: ${studentCount}`);
  console.log(`   - Total Counseling Requests: ${requestCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
