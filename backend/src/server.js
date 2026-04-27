require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const SocketManager = require('./services/SocketManager');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

// ── Create HTTP Server ────────────────────────────────
const server = http.createServer(app);

// ── Initialize Socket.io ─────────────────────────────
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});

SocketManager.init(io);

// ── Boot Sequence ────────────────────────────────────
const boot = async () => {
  try {
    // Connect DB & Cache
    await connectDB();
    connectRedis();

    // Ensure logs directory exists
    const fs = require('fs');
    const path = require('path');
    const logsDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    server.listen(PORT, () => {
      logger.info(`🚀 Cablo Brain running on http://localhost:${PORT}`);
      logger.info(`📡 Socket.io ready`);
      logger.info(`🤖 AI Agents: CEO | COO | CFO | CTO | Manager`);
    });

  } catch (err) {
    logger.error(`❌ Boot failed: ${err.message}`);
    process.exit(1);
  }
};

// ── Graceful Shutdown ────────────────────────────────
process.on('SIGTERM', () => {
  logger.warn('SIGTERM received. Graceful shutdown...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

boot();
