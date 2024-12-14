import express from "express";
import {
  saveAnalysis,
  getAnalysis,
  updateAnalysis,
  getAnalysisById,
} from "../controllers/textAnalysisController.js";

const router = express.Router();

router.post("/", saveAnalysis);
router.get("/", getAnalysis);
router.get("/:id", getAnalysisById);
router.put("/:id", updateAnalysis);

export default router;
