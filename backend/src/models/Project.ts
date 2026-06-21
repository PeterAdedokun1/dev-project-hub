import mongoose, { Document, Model, Types } from 'mongoose';

export type ProjectStatus = 'not_started' | 'in_progress' | 'completed';

const STATUS: ProjectStatus[] = ['not_started', 'in_progress', 'completed'];

export interface IProject extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  status: ProjectStatus;
  shipped: boolean;
  shippedAt?: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    status: { type: String, enum: STATUS, default: 'not_started' },
    shipped: { type: Boolean, default: false },
    shippedAt: { type: Date },
  },
  { timestamps: true }
);

const Project: Model<IProject> = mongoose.model<IProject>('Project', projectSchema);
export default Project;
