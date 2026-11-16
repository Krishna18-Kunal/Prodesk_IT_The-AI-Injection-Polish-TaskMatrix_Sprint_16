import { Router } from 'express';
import { suggestSubtasks } from '../controllers/aiController.js';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiters.js';
import { validateBody } from '../middleware/validate.js';
import { aiSchema } from '../validators/schemas.js';
const router = Router();
router.post('/suggest', requireAuth, aiLimiter, validateBody(aiSchema), suggestSubtasks);
export default router;
