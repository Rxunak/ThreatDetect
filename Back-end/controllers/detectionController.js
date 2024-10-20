// This file holds the logic for handling requests and responses for different routes

const Detection = require("../models/Detection");

exports.saveDetection = async (req, res) => {
  try {
    const { itemDetected } = req.body;
    const newDetection = new Detection({ itemDetected });
    await newDetection.save();
    res
      .status(201)
      .json({ message: "Detection succesfully saved", newDetection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDetections = async (req, res) => {
  try {
    const detections = await Detection.find();
    res.status(200).json(detections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDetectionsId = async (req, res) => {
  try {
    const { id } = req.params;
    const detections = await Detection.findById(id);
    if (!detections) {
      return res.status(404).json({ message: "Detection not found" });
    }
    res.status(200).json(detections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDetections = async (req, res) => {
  try {
    const { id } = req.params;
    const detections = await Detection.findByIdAndUpdate(id, req.body);
    if (!detections) {
      return res.status(404).json({ message: "Detection not found" });
    }
    const updatedDetection = await Detection.findById(id);
    res.status(200).json(updatedDetection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDetections = async (req, res) => {
  try {
    const { id } = req.params;
    const detections = await Detection.findByIdAndDelete(id);
    if (!detections) {
      return res.status(404).json({ message: "Detection not found" });
    }
    const deletedDetection = await Detection.findById(id);
    res.status(200).json(deletedDetection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
