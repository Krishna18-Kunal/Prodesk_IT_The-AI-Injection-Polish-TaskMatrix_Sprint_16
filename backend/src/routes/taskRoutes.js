import { Router } from 'express';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/taskController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { taskSchema, taskUpdateSchema } from '../validators/schemas.js';

const router = Router();
router.use(requireAuth);
router.get('/', listTasks);
router.post('/', validateBody(taskSchema), createTask);
router.get('/:id', getTask);
router.patch('/:id', validateBody(taskUpdateSchema), updateTask);
router.delete('/:id', deleteTask);
export default router;
