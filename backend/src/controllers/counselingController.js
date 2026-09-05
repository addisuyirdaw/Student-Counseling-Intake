import { submitCounselingSchema, updateStatusSchema } from '../validators/counseling.js';
import * as studentModel from '../models/student.js';
import * as requestModel from '../models/counselingRequest.js';

export async function submitCounseling(req, res) {
  try {
    const validated = submitCounselingSchema.parse(req.body);

    if (!validated.consentGiven) {
      return res.status(400).json({ error: 'Consent must be given to submit a counseling request' });
    }

    if (!validated.signatureDataUrl || validated.signatureDataUrl.trim() === '') {
      return res.status(400).json({ error: 'Electronic signature is required' });
    }

    const effectiveDepartment = (validated.department === 'Other (Specify Custom Department)' && validated.departmentCustom?.trim())
      ? validated.departmentCustom.trim()
      : validated.department;

    const effectiveYearInSchool = (validated.yearInSchool === 'Other (Specify Custom Year)' && validated.yearCustom?.trim())
      ? validated.yearCustom.trim()
      : validated.yearInSchool;

    const student = await studentModel.upsertStudent({
      studentId: validated.studentId,
      firstName: validated.firstName,
      lastName: validated.lastName,
      email: validated.email,
      phone: validated.phone,
      department: effectiveDepartment,
      yearInSchool: effectiveYearInSchool,
      gpa: validated.gpa,
    });

    const request = await requestModel.createCounselingRequest({
      studentId: student.id,
      counselingTopic: validated.counselingTopic,
      topicCustom: validated.topicCustom,
      concernDescription: validated.concernDescription,
      hadPreviousCounseling: validated.hadPreviousCounseling,
      previousCounselingDetails: validated.previousCounselingDetails,
      preferredDays: validated.preferredDays,
      preferredTimeSlots: validated.preferredTimeSlots,
      additionalComments: validated.additionalComments,
      urgencyLevel: validated.urgencyLevel,
      consentGiven: validated.consentGiven,
      signatureDataUrl: validated.signatureDataUrl,
      status: 'PENDING',
    });

    const formattedRequest = requestModel.formatRequest(request);

    res.status(201).json({
      message: 'Counseling request submitted successfully',
      data: formattedRequest,
    });
  } catch (error) {
    console.error('Submit counseling error:', error);
    if (error.name === 'ZodError') {
      const errors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: 'Failed to submit counseling request' });
  }
}

export async function getCounselingRequests(req, res) {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const result = await requestModel.findRequests({
      status,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    const formattedRequests = result.requests.map((r) => requestModel.formatRequest(r));

    res.status(200).json({
      message: 'Counseling requests retrieved successfully',
      data: formattedRequests,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Get requests error:', error);
    if (error.name === 'ZodError') {
      const errors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
    res.status(500).json({ error: 'Failed to retrieve counseling requests' });
  }
}

export async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const validated = updateStatusSchema.parse(req.body);

    const request = await requestModel.updateRequestStatus(id, validated.status);
    const formattedRequest = requestModel.formatRequest(request);

    res.status(200).json({
      message: `Request status updated to ${validated.status}`,
      data: formattedRequest,
    });
  } catch (error) {
    console.error('Update status error:', error);
    if (error.name === 'ZodError') {
      const errors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({ errors });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Counseling request not found' });
    }
    res.status(500).json({ error: 'Failed to update request status' });
  }
}

export async function updateRequestNotes(req, res) {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const request = await requestModel.updateRequestNotes(id, typeof notes === 'string' ? notes : '');
    const formattedRequest = requestModel.formatRequest(request);

    res.status(200).json({
      message: 'Counselor notes updated successfully',
      data: formattedRequest,
    });
  } catch (error) {
    console.error('Update notes error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Counseling request not found' });
    }
    res.status(500).json({ error: 'Failed to update counselor notes' });
  }
}

export async function getRequestCounts(req, res) {
  try {
    const counts = await requestModel.countByStatus();
    res.status(200).json({
      message: 'Request counts retrieved successfully',
      data: counts,
    });
  } catch (error) {
    console.error('Get counts error:', error);
    res.status(500).json({ error: 'Failed to retrieve request counts' });
  }
}