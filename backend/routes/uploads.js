const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });


router.post('/', upload.array('images', 10), (req, res) => {
  try {
    const files = req.files || [];
    const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5001}`;
    const urls = files.map(f => `${baseUrl}/uploads/${f.filename}`);
    res.status(201).json({ success: true, data: urls });
  } catch (err) {
    console.error('Upload error', err.message);
    res.status(500).json({ success: false, error: 'File upload failed' });
  }
});

module.exports = router;
