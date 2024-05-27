const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { adminAuth } = require("../middleware/auth");

const databaseController = require("../controllers/databaseController");

// Determine upload directory based on environment
const uploadDir = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, '../uploads');

// Ensure the upload directory exists
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// CSV upload route
router.post('/importUser', adminAuth, upload.single('file'), databaseController.importUser);

// Route to delete all lead data
router.delete('/deleteAllLeadData', adminAuth, databaseController.deleteAllLeadData);

module.exports = router;
