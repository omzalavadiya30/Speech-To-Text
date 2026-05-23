const mongoose = require('mongoose');

const speechTranscriptionSchema = new mongoose.Schema({
    audioUrl: { type: String, required: true },
    transcription: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const SpeechTranscription = mongoose.model('SpeechTranscription', speechTranscriptionSchema);

module.exports = SpeechTranscription;