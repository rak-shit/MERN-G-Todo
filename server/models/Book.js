var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  id: String,
  text: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', BookSchema);