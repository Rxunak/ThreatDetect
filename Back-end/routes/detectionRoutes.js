import express from "express";
import {
  saveDetection,
  getDetections,
  getDetectionsId,
  updateDetections,
  deleteDetections,
} from "../controllers/detectionController.js";

const router = express.Router();
router.post("/", saveDetection);
 
router.get("/", getDetections);

router.get("/:id", getDetectionsId);

router.put("/:id", updateDetections);

router.delete("/:id", deleteDetections);

export default router;
