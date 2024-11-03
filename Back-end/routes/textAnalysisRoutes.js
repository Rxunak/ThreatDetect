import express from "express";
import {
  saveAnalysis,
  getAnalysis,
} from "../controllers/textAnalysisController.js";

const router = express.Router();

router.post("/", saveAnalysis);
router.get("/", getAnalysis);

export default router;
