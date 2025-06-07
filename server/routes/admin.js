const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const Driver = require('../models/Driver');

// Middleware d'authentification admin
const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Accès interdit' });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// GET /api/admin/users
router.get('/users', authAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// GET /api/admin/orders
router.get('/orders', authAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email')
      .populate('driverId', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// GET /api/admin/drivers
router.get('/drivers', authAdmin, async (req, res) => {
  try {
    const drivers = await Driver.find({}, '-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

// GET /api/admin/order-stats
router.get('/order-stats', authAdmin, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthly = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const productsByCategory = await Order.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    const categories = {};
    productsByCategory.forEach(cat => {
      categories[cat._id] = cat.count;
    });

    res.json({
      daily: [],
      monthly,
      categories
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
});

module.exports = router;