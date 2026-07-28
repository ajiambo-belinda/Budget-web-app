import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense', 'savings', 'investment'], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true }, // stored as 'YYYY-MM-DD' to match frontend format
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);