// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const postureController = require('../controllers/postureController');

// // Configure multer for uploads
// const storage = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });

// router.post('/analyze', upload.single('video'), postureController.analyzePosture);

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const postureController = require('../controllers/postureController');

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the destination to 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename); // Set the filename with a timestamp
  }
});

// Set file size limit (e.g., 50MB) and validate video type (MP4, WebM, or OGG)
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type, only video files are allowed'), false);
    }
    cb(null, true);
  }
});

// Post route for analyzing posture (video upload)
router.post('/analyze', upload.single('video'), postureController.analyzePosture);

// Error handler for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer-specific errors
    return res.status(400).send({ message: `Multer Error: ${err.message}` });
  } else if (err) {
    // Handle general errors
    return res.status(500).send({ message: `Server Error: ${err.message}` });
  }
  next();
});

module.exports = router;
