import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a value of at least 32 characters');
  }
  await connectDB();
  app.listen(PORT, () => console.log(`TaskMatrix API listening on port ${PORT}`));
} catch (error) {
  console.error('Server startup failed:', error.message);
  process.exit(1);
}
