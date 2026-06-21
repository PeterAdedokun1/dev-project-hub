import mongoose, { Document, Model, Types } from 'mongoose';

export interface ITask extends Document {
  project: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  done: boolean;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default Task;
