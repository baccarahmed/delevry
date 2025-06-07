const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: { type: { lat: Number, lng: Number }, default: null },
  available: Boolean,
  deliveryCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Driver', driverSchema);