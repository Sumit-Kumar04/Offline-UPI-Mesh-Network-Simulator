const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  balance: {
    type: Number,
    default: 10000
  }
});

module.exports = mongoose.model(
  "Account",
  accountSchema
);