const mongoose = require("mongoose");

const transactionSchema =
  new mongoose.Schema({
    sender: String,
    receiver: String,
    amount: Number,

    packetHash: {
      type: String,
      unique: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  });

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);