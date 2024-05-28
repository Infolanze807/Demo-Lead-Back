const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { adminAuth } = require("../middleware/auth");

const RemoteLeadsdatabaseController = require("../controllers/remoteLeadsDatabaseController");

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp');  // Use /tmp for temporary storage in Vercel
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// CSV upload route
router.post('/importUser', adminAuth, upload.single('file'), RemoteLeadsdatabaseController.importUser);

// Route to delete all lead data
router.delete('/deleteAllLeadData', adminAuth, RemoteLeadsdatabaseController.deleteAllLeadData);

module.exports = router;

