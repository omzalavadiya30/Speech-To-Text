const mongoose = require('mongoose');

const speechTranscriptionSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    filename: { type: String, required: true },
    transcription: { type: String, required: true },
    audioUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const SpeechTranscription = mongoose.model('SpeechTranscription', speechTranscriptionSchema);

module.exports = SpeechTranscription;