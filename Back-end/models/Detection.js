// This file containes the schema and structure of my database collections.

const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema({
  itemDetected: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Detection = mongoose.model("Detection", detectionSchema);
module.exports = Detection;
