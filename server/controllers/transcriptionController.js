const fs= require('fs');
const { DeepgramClient } = require('@deepgram/sdk');
const SpeechTranscription = require('../models/speechTranscription');

exports.transcribeAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }
        const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });
        const result= await deepgram.listen.v1.media.transcribeFile(fs.createReadStream(req.file.path), { model: 'nova-2', smart_format: true });
        const transcript = result.results.channels[0].alternatives[0].transcript;
        if (!transcript) {
            return res.status(400).json({ error: 'Could not detect speech' });
        }
        const saved= await SpeechTranscription.create({
            filename: req.file.originalname,
            transcription: transcript,
            audioUrl: req.file.path
        });
        res.json({ transcription: saved.transcription, audioUrl: saved.audioUrl });
    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
};