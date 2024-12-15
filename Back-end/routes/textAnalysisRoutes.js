import express from "express";
import {
  saveAnalysis,
  getAnalysis,
  updateAnalysis,
  getAnalysisById,
  deleteAnalysis,
} from "../controllers/textAnalysisController.js";

const router = express.Router();

router.post("/", saveAnalysis);
router.get("/", getAnalysis);
router.get("/:id", getAnalysisById);
router.put("/:id", updateAnalysis);
router.delete("/:id", deleteAnalysis);

export default router;
