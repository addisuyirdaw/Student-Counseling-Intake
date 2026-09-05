import express from 'express';
import cookieParser from 'cookie-parser';
import counselingRoutes from './routes/counselingRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001; // Reloaded for clean rate limit window

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use((req, res, next) => { console.log('PATH:', req.path, 'BODY:', JSON.stringify(req.body)); next(); });

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/counseling', counselingRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Counseling Intake API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API base URL: http://localhost:${PORT}/api/v1/counseling`);
});

export default app;