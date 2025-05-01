const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB=require("./config/db");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
connectDB();
// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express server!");
});

app.post("/api/data", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  res.json({ message: "Data received", data });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
