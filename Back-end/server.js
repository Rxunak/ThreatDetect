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

const requiredEnvVars = ["MONGO_URI", "EMAIL_USERNAME", "EMAIL_PASSWORD"];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
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
