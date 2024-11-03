// This file containes the schema and structure of my database collections.
import mongoose from "mongoose";

const textAnalysisSchema = new mongoose.Schema({
  textAnalysed: {
    type: String,
    required: true,
  },

  analysis: {
    type: Array,
    required: true,
  },

  getUserID: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Analysis = mongoose.model("analysis", textAnalysisSchema);
export default Analysis;
