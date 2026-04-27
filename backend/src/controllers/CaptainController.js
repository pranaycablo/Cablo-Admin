const Captain = require('../models/Captain');

exports.goOnline = async (req, res, next) => {
  try {
    const { coordinates } = req.body; // [lng, lat]
    const captain = await Captain.findByIdAndUpdate(
      req.user._id,
      {
        status: 'online',
        location: { type: 'Point', coordinates }
      },
      { new: true }
    );
    res.status(200).json({ success: true, captain });
  } catch (err) { next(err); }
};

exports.goOffline = async (req, res, next) => {
  try {
    const captain = await Captain.findByIdAndUpdate(
      req.user._id,
      { status: 'offline' },
      { new: true }
    );
    res.status(200).json({ success: true, captain });
  } catch (err) { next(err); }
};

exports.getEarnings = async (req, res, next) => {
  try {
    const captain = await Captain.findById(req.user._id).select('earnings walletBalance rating');
    res.status(200).json({ success: true, earnings: captain.earnings, wallet: captain.walletBalance, rating: captain.rating });
  } catch (err) { next(err); }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const { coordinates } = req.body;
    await Captain.findByIdAndUpdate(req.user._id, {
      location: { type: 'Point', coordinates }
    });
    res.status(200).json({ success: true });
  } catch (err) { next(err); }
};
