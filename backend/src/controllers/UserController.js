const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, user });
  } catch (err) { next(err); }
};

exports.getWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance loyaltyPoints loyaltyTier');
    res.status(200).json({ success: true, wallet: user });
  } catch (err) { next(err); }
};
