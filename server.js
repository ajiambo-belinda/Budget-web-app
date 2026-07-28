import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '5mb' })); 
app.use(
  cors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.json({ status: 'Fedha API is running.' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });