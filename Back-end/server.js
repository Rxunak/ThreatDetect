import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import textAnalysisRoutes from "./routes/textAnalysisRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/detections", detectionRoutes);

app.use("/api/users", userRoutes);

app.use("/api/analysis", textAnalysisRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("EMAIL_USERNAME:", process.env.EMAIL_USERNAME);
console.log(
  "EMAIL_PASSWORD:",
  process.env.EMAIL_PASSWORD ? "Loaded" : "Not Loaded"
);
