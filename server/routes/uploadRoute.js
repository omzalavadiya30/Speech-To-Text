const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('../controllers/transcriptionController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('audio'), transcribeAudio);

module.exports = router;