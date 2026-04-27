const AuthService = require('../services/AuthService');

exports.sendOTP = async (req, res, next) => {
  try {
    const { mobile, role } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: 'mobile is required' });
    const result = await AuthService.sendOTP(mobile, role || 'user');
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { mobile, otp, role } = req.body;
    if (!mobile || !otp) return res.status(400).json({ success: false, message: 'mobile and otp required' });
    const { entity, tokens } = await AuthService.verifyOTP(mobile, otp, role || 'user');
    res.status(200).json({ success: true, tokens, profile: entity });
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    // Logic to blacklist token in Redis for secure logout goes here
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) { next(err); }
};
