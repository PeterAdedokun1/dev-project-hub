const mongoose = require('mongoose');

const STATUS = ['not_started', 'in_progress', 'completed'];

const projectSchema = new mongoose.Schema(
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

module.exports = mongoose.model('Project', projectSchema);
