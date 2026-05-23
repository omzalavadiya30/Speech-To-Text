const fs= require('fs');
const { DeepgramClient } = require('@deepgram/sdk');

exports.transcribeAudio = async (req, res) => {
    try {
        const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });
        const result= await deepgram.listen.v1.media.transcribeFile(fs.createReadStream(req.file.path), { model: 'nova-2', smart_format: true });
        fs.unlinkSync(req.file.path);
        const transcript = result.results.channels[0].alternatives[0].transcript;
        res.json({ transcription: transcript });
    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Failed to transcribe audio' });
    }
};