import Analysis from "../models/textAnalysis.js";

export const saveAnalysis = async (req, res) => {
  try {
    const { textAnalysed, analysis, getUserID } = req.body;
    const newAnalysis = new Analysis({ textAnalysed, analysis, getUserID });
    await newAnalysis.save();
    res.status(201).json({
      message: "Text analysis has been succesfully saved",
      newAnalysis,
      getUserID,
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
