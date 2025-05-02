const express = require("express");
const multer = require("multer");
const path = require("path");
const { sendAudioToFlask } = require("../controllers/audioController");

const router = express.Router();

// Save uploaded audio to /uploads directory
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/analyze-audio", upload.single("audio"), sendAudioToFlask);

module.exports = router;
