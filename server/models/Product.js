const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  restaurantId: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Product', productSchema);