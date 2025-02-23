// This file containes the schema and structure of my database collections.

import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
  itemDetected: {
    type: String,
    required: true,
  },

  getUserID: {
    type: String,
    required: true,
  },

  confidenceScore: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Detection = mongoose.model("Detection", detectionSchema);

export default Detection;
