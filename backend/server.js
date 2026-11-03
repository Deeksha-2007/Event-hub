const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check & Root
const healthHandler = (req, res) => {
  const data = {
    status: 'ok',
    service: 'EventNest API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    frontendUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  };

  if (req.accepts('html')) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>EventNest API - Online</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
          .card { background: #1e293b; padding: 2rem 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 480px; width: 100%; text-align: center; }
          .badge { display: inline-block; background: #10b981; color: #fff; font-size: 0.85rem; font-weight: 600; padding: 0.35rem 0.85rem; border-radius: 9999px; margin-bottom: 1rem; }
          h1 { margin: 0 0 0.5rem; font-size: 1.6rem; }
          p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 1.5rem; }
          .btn { display: inline-block; background: #6366f1; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; transition: background 0.2s; }
          .btn:hover { background: #4f46e5; }
          pre { background: #0f172a; padding: 1rem; border-radius: 0.5rem; text-align: left; font-size: 0.85rem; color: #38bdf8; overflow-x: auto; margin-top: 1.5rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">● Online</span>
          <h1>EventNest Backend API</h1>
          <p>The backend server is running successfully on port ${PORT}.</p>
          <a class="btn" href="${process.env.CLIENT_URL || 'http://localhost:5173'}">Open Frontend App (Port 5173) →</a>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </div>
      </body>
      </html>
    `);
  }

  res.status(200).json(data);
};

app.get(['/', '/health', '/health\\)'], healthHandler);

// API Routes
app.use('/api/v1', routes);

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EventNest server running on port ${PORT}`);
});

module.exports = app;
