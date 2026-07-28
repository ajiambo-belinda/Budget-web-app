import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    target: { type: Number, required: true },
    saved: { type: Number, default: 0 },
    targetDate: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Goal', goalSchema);