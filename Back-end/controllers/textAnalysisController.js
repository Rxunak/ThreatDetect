import Analysis from "../models/textAnalysis.js";
import { sendEmailAlert } from "../Email/EmailRoute.js";
import User from "../models/User.js";

export const saveAnalysis = async (req, res) => {
  try {
    const { textAnalysed, analysis, getUserID } = req.body;
    const newAnalysis = new Analysis({ textAnalysed, analysis, getUserID });
    await newAnalysis.save();

    let isBlocked = false;
    if (analysis.length >= 1) {
      const user = await User.findByIdAndUpdate(
        getUserID,
        { isBlocked: true },
        { new: true }
      );

      if (user) {
        isBlocked = user.isBlocked;
        console.log(`user ${getUserID} has been blocked`);
      } else {
        console.log(`user ${getUserID} all good`);
      }

      const subject = "Account Blocked Alert";
      const text = `Dear Admin, the user ${newAnalysis.getUserID} has been blocked due to a violation detected in the text analysis and the detected text is ${newAnalysis.textAnalysed}.`;

      try {
        await sendEmailAlert(user.email, subject, text); 
        console.log("Block notification email sent successfully.");
      } catch (error) {
        console.error("Failed to send block notification email:", error);
      }
    }
    res.status(201).json({
      message: "Text analysis has been succesfully saved",
      newAnalysis,
      getUserID,
      isBlocked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.find();
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findById(id);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.log("Here not working");
    res.status(500).json({ message: error.message });
  }
};

export const updateAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findByIdAndUpdate(id, req.body);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    const updatedAnalysis = await Analysis.findById(id);
    res.status(200).json(updatedAnalysis);
  } catch (error) {
    console.log("Here not working");
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await Analysis.findByIdAndDelete(id, req.body);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.status(200).json({ message: "Detection deleted successfully" });
  } catch (error) {
    console.log("Here not working");
    res.status(500).json({ message: error.message });
  }
};
