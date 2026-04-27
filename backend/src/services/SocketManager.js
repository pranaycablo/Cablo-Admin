const logger = require('../config/logger');
const Captain = require('../models/Captain');

/**
 * SocketManager.js
 * Central real-time event system for Cablo.
 */
class SocketManager {
  constructor() {
    this.io = null;
    this.connectedSockets = new Map(); // userId/captainId -> socket.id
  }

  init(io) {
    this.io = io;
    logger.info('✅ Socket.io Initialized');

    io.on('connection', (socket) => {
      const { userId, role } = socket.handshake.query;
      logger.info(`🔗 [Socket] Connected: ${role}:${userId}`);
      this.connectedSockets.set(`${role}:${userId}`, socket.id);

      // ── Captain Events ──────────────────────────────────
      socket.on('captain:location_update', async (data) => {
        try {
          await Captain.findByIdAndUpdate(userId, {
            location: { type: 'Point', coordinates: data.coordinates }
          });
          // Broadcast to user tracking this captain
          if (data.rideId) {
            socket.to(`ride:${data.rideId}`).emit('captain:location', data.coordinates);
          }
        } catch (err) {
          logger.error(`[Socket] Location update error: ${err.message}`);
        }
      });

      socket.on('captain:ride_accept', (data) => {
        logger.info(`[Socket] Captain ${userId} accepted ride ${data.rideId}`);
        this.emitToUser(data.userId, 'ride:captain_assigned', { captainId: userId, rideId: data.rideId });
      });

      socket.on('captain:ride_reject', (data) => {
        logger.info(`[Socket] Captain ${userId} rejected ride ${data.rideId}`);
        // Trigger re-matching
      });

      // ── User Events ──────────────────────────────────────
      socket.on('user:join_ride', (rideId) => {
        socket.join(`ride:${rideId}`);
      });

      // ── Disconnect ──────────────────────────────────────
      socket.on('disconnect', async () => {
        logger.info(`❌ [Socket] Disconnected: ${role}:${userId}`);
        this.connectedSockets.delete(`${role}:${userId}`);

        // Auto go-offline if captain disconnects
        if (role === 'captain') {
          await Captain.findByIdAndUpdate(userId, { status: 'offline' }).catch(() => {});
        }
      });
    });
  }

  // Emit to a specific user
  emitToUser(userId, event, data) {
    const socketId = this.connectedSockets.get(`user:${userId}`);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Emit to a specific captain
  emitToCaptain(captainId, event, data) {
    const socketId = this.connectedSockets.get(`captain:${captainId}`);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Broadcast new ride request to multiple captains
  broadcastRideRequest(captainIds, rideData) {
    captainIds.forEach(id => {
      this.emitToCaptain(id, 'ride:new_request', rideData);
    });
  }
}

module.exports = new SocketManager();
