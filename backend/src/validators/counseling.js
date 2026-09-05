import { z } from 'zod';

export const submitCounselingSchema = z.object({
  studentId: z.string().trim().min(1, 'Student ID is required'),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Invalid email format'),
  phone: z.string().trim().min(1, 'Phone is required'),
  department: z.string().trim().min(1, 'Department is required'),
  departmentCustom: z.string().optional().nullable(),
  yearInSchool: z.string().trim().min(1, 'Year in school is required'),
  yearCustom: z.string().optional().nullable(),
  gpa: z.union([z.string(), z.number()]).optional().nullable().transform((v) => (v !== undefined && v !== null && v !== '' ? parseFloat(v) : undefined)),
  counselingTopic: z.string().trim().min(1, 'Counseling topic is required'),
  topicCustom: z.string().optional().nullable(),
  concernDescription: z.string().trim().min(1, 'Concern description is required'),
  hadPreviousCounseling: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]),
  previousCounselingDetails: z.string().optional().nullable(),
  preferredDays: z.array(z.string()).min(1, 'At least one preferred day is required'),
  preferredTimeSlots: z.array(z.string()).min(1, 'At least one preferred time slot is required'),
  additionalComments: z.string().optional().nullable(),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'Low', 'Medium', 'High']).default('MEDIUM').transform((v) => v.toUpperCase()),
  consentGiven: z.union([z.boolean(), z.enum(['true', 'false']).transform((v) => v === 'true')]),
  signatureDataUrl: z.string().min(1, 'Signature is required'),
}).superRefine((data, ctx) => {
  if (data.department === 'Other (Specify Custom Department)' && (!data.departmentCustom || !data.departmentCustom.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your custom department',
      path: ['departmentCustom'],
    });
  }
  if (data.yearInSchool === 'Other (Specify Custom Year)' && (!data.yearCustom || !data.yearCustom.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your custom year in school',
      path: ['yearCustom'],
    });
  }
  if (data.counselingTopic === 'Other' && (!data.topicCustom || !data.topicCustom.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your counseling topic',
      path: ['topicCustom'],
    });
  }
});

export const updateStatusSchema = z.object({
  status: z.string().transform((v) => v.trim().toUpperCase()).pipe(
    z.enum(['PENDING', 'REVIEWED', 'SCHEDULED', 'COMPLETED', 'REJECTED'])
  ),
});

export const getRequestsQuerySchema = z.object({
  status: z.string().optional().or(z.literal('')),
  page: z.coerce.number().int().default(1),
  limit: z.coerce.number().int().default(10),
});