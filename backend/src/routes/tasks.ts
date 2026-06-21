import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import Task from '../models/Task';
import Project from '../models/Project';

const router = Router();
router.use(authMiddleware);

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, title } = req.body as { projectId: string; title: string };
    if (!projectId || !title) {
      res.status(400).json({ message: 'projectId and title are required' });
      return;
    }

    const project = await Project.findOne({ _id: projectId, user: req.userId });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const task = await Task.create({ project: projectId, user: req.userId, title });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.patch('/:id/toggle', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    task.done = !task.done;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
