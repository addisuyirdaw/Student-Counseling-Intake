import express from 'express';
import { submitCounseling, getCounselingRequests, updateRequestStatus, updateRequestNotes, getRequestCounts } from '../controllers/counselingController.js';
import { validate } from '../middleware/validate.js';
import { submitCounselingSchema, updateStatusSchema, getRequestsQuerySchema } from '../validators/counseling.js';

const router = express.Router();

router.post('/submit', validate(submitCounselingSchema), submitCounseling);
router.get('/requests', getCounselingRequests);
router.patch('/requests/:id/status', validate(updateStatusSchema), updateRequestStatus);
router.patch('/requests/:id/notes', updateRequestNotes);
router.get('/counts', getRequestCounts);

export default router;