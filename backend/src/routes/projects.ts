import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import Project, { ProjectStatus } from '../models/Project';
import Task from '../models/Task';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body as { title: string; description?: string };
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }
    const project = await Project.create({ user: req.userId, title, description });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.userId });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    const tasks = await Task.find({ project: req.params.id }).sort({ createdAt: 1 });
    res.json({ ...project.toObject(), tasks });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status } = req.body as {
      title: string;
      description?: string;
      status: ProjectStatus;
    };
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, description, status },
      { new: true, runValidators: true }
    );
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.patch('/:id/ship', async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { shipped: true, shippedAt: new Date(), status: 'completed' },
      { new: true }
    );
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
