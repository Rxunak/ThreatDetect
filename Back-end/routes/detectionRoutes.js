// This file defines the endpoint UTLS that trigger the actions like Save data
// get data from my controller

const express = require("express");
const router = express.Router();
const {
  saveDetection,
  getDetections,
  getDetectionsId,
  updateDetections,
  deleteDetections,
} = require("../controllers/detectionController");

router.post("/", saveDetection);

router.get("/", getDetections);

router.get("/:id", getDetectionsId);

router.put("/:id", updateDetections);

router.delete("/:id", deleteDetections);

module.exports = router;
