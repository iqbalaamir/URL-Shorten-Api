const mongoose = require('mongoose');
const nanoid = require('nanoid');

const urlSchema = new mongoose.Schema({
    originalURL: {
        type: String,
        required: true
    },
    shortURL: {
        type: String,
        required: true,
        default: () => nanoid(7)
    },
    userId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    clicks: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('URL', urlSchema);


