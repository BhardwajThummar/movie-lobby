import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import cacheMiddleware from './middleware/cache';
import { errorHandler, errorNotFoundHandler } from "./middleware/errorhandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI || "");

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());

// Cache 
app.use(cacheMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Error handling middleware
app.use(errorHandler);
app.use(errorNotFoundHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;