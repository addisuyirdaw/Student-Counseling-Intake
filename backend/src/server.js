import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import counselingRoutes from './routes/counselingRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Configured allowed origins for local dev and production deployments
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server, curl, or mobile apps)
      if (!origin) return callback(null, true);

      try {
        const url = new URL(origin);
        const isVercel = /\.vercel\.app$/.test(url.hostname);
        const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
        const isExplicitAllowed = allowedOrigins.includes(origin);

        if (isVercel || isLocalhost || isExplicitAllowed) {
          return callback(null, true);
        }
      } catch {
        // Fallback if URL parsing fails
      }

      // Default reflection allows custom production domains with credentials
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use((req, res, next) => { console.log('PATH:', req.path, 'BODY:', JSON.stringify(req.body)); next(); });

app.get(['/health', '/api/health'], (req, res) => {
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

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Counseling Intake API running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API base URL: http://localhost:${PORT}/api/v1/counseling`);
  });
}

export default app;