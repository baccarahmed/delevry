const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

router.get('/', async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

router.get('/:id', async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  res.json(driver);
});

router.put('/:id', async (req, res) => {
  const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;