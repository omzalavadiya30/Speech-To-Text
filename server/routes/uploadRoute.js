const express = require('express');
const multer = require('multer');
const { transcribeAudio } = require('../controllers/transcriptionController');
const SpeechTranscription = require('../models/speechTranscription');

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

router.get('/history', async (req, res) => {
    try {
        const history = await SpeechTranscription.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

module.exports = router;