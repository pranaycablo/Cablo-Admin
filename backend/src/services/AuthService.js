const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Captain = require('../models/Captain');
const logger = require('../config/logger');

class AuthService {

  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  generateJWT(id, role) {
    const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
    const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
    });
    return { accessToken, refreshToken };
  }

  async sendOTP(mobile, role = 'user') {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const Model = role === 'captain' ? Captain : User;
    let entity = await Model.findOne({ mobile });

    if (!entity) {
      entity = await Model.create({ name: 'New User', mobile });
    }

    entity.otp = { code: otp, expiresAt };
    await entity.save();

    // SMS Gateway integration (Twilio / 2Factor) would go here
    logger.info(`OTP for ${mobile}: ${otp}`);
    return { message: 'OTP sent successfully', expiresAt };
  }

  async verifyOTP(mobile, code, role = 'user') {
    const Model = role === 'captain' ? Captain : User;
    const entity = await Model.findOne({ mobile }).select('+otp.code +otp.expiresAt');

    if (!entity) throw new Error('Mobile not registered');
    if (!entity.otp || entity.otp.code !== code) throw new Error('Invalid OTP');
    if (new Date() > entity.otp.expiresAt) throw new Error('OTP has expired');

    // Clear OTP after use
    entity.otp = undefined;
    await entity.save();

    const tokens = this.generateJWT(entity._id, role === 'captain' ? 'captain' : 'user');
    logger.info(`Auth success for mobile: ${mobile}, role: ${role}`);

    return { entity, tokens };
  }
}

module.exports = new AuthService();
