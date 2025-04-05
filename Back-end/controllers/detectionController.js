import Detection from "../models/Detection.js";

import { sendEmailAlert } from "../Email/EmailRoute.js";
import User from "../models/User.js";

export const saveDetection = async (req, res) => {
  try {
    const { itemDetected, getUserID, confidenceScore, image } = req.body;
    const newDetection = new Detection({ itemDetected, getUserID, confidenceScore, image});
    await newDetection.save();

    await sendEmailAlert(
      "bandodcarraunak@gmail.com",
      "New Detection Alert",
      `A new detection has been identified: ${itemDetected} by user ${getUserID}`
    );
 
    let isBlocked = false;
    if (itemDetected.toLowerCase() === "bottle" && confidenceScore >='80%' 
    || itemDetected.toLowerCase() === "cell phone" && confidenceScore >='80%'){

      const user = await User.findByIdAndUpdate(
        getUserID,
        {isBlocked: true},
        {new: true}
      );

      if (user) {
        isBlocked = user.isBlocked;
        console.log(`user ${getUserID} has been blocked`)
      }else{
        console.log(`user ${getUserID} all good`)
      }
    }
    res
      .status(201)
      .json({ message: "Detection succesfully saved", newDetection, isBlocked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDetections = async (req, res) => {
  try {
    const detections = await Detection.find();
    res.status(200).json(detections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDetectionsId = async (req, res) => {
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

export const updateDetections = async (req, res) => {
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

export const deleteDetections = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received", id)
    const detections = await Detection.findByIdAndDelete(id);

    if (!detections) {
      return res.status(404).json({ message: "Detection not found" });
    }
    res.status(200).json({ message: "Detection deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDetections:", error);
    res.status(500).json({ message: error.message });
  }
};
