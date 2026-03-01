import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import detectionRoutes from "./routes/detectionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import textAnalysisRoutes from "./routes/textAnalysisRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const requiredEnvVars = ["MONGO_URI"];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const emailConfigured =
  process.env.EMAIL_USERNAME &&
  process.env.EMAIL_PASSWORD &&
  process.env.EMAIL_USERNAME !== "your-email@gmail.com" &&
  process.env.EMAIL_PASSWORD !== "your-app-password";

if (!emailConfigured) {
  console.warn(
    "Email is not configured. Alert emails will be skipped until valid EMAIL_USERNAME and EMAIL_PASSWORD are set."
  );
}

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/detections", detectionRoutes);

app.use("/api/users", userRoutes);

app.use("/api/analysis", textAnalysisRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
