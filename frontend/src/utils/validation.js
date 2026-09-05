import { z } from 'zod';

export const step1Schema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Please enter a valid university email'),
  phone: z.string().trim().min(7, 'Please enter a valid phone number'),
  studentId: z.string().trim().min(1, 'Student ID is required'),
  department: z.string().trim().min(1, 'Please select your department or program'),
  departmentCustom: z.string().optional().nullable(),
  yearInSchool: z.string().trim().min(1, 'Please select your academic year'),
  yearCustom: z.string().optional().nullable(),
  gpa: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.department === 'Other (Specify Custom Department)' && (!data.departmentCustom || !data.departmentCustom.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your department',
      path: ['departmentCustom'],
    });
  }
  if (data.yearInSchool === 'Other (Specify Custom Year)' && (!data.yearCustom || !data.yearCustom.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your year in school',
      path: ['yearCustom'],
    });
  }
});

export const step2Schema = z.object({
  counselingTopic: z.string().trim().min(1, 'Please select a primary counseling topic'),
  topicCustom: z.string().optional().nullable(),
  concernDescription: z.string().trim().min(5, 'Please provide a brief description of your concern (at least 5 characters)'),
  urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  hadPreviousCounseling: z.boolean().default(false),
  previousCounselingDetails: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.counselingTopic === 'Other' && (!data.topicCustom || !data.topicCustom.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your counseling topic',
      path: ['topicCustom'],
    });
  }
});

export const step3Schema = z.object({
  preferredDays: z.array(z.string()).min(1, 'Please select at least one preferred meeting day'),
  preferredTimeSlots: z.array(z.string()).min(1, 'Please select at least one preferred time slot'),
  additionalComments: z.string().optional().nullable(),
});

export const step4Schema = z.object({
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the confidentiality and care terms' }),
  }),
  signatureDataUrl: z.string().min(1, 'Please provide your digital signature'),
});

export const fullCounselingSchema = z.intersection(
  z.intersection(step1Schema, step2Schema),
  z.intersection(step3Schema, step4Schema)
);

export function validateStep(step, data) {
  let schema;
  if (step === 1) schema = step1Schema;
  else if (step === 2) schema = step2Schema;
  else if (step === 3) schema = step3Schema;
  else if (step === 4) schema = step4Schema;
  else return { success: true, errors: {} };

  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, errors: {} };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return { success: false, errors };
}
