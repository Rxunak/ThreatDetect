// This file containes the entry point of the application that initialise the
// server and connects all the parts such as config, routes etc.

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const detectionRoutes = require("./routes/detectionRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/detections", detectionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
