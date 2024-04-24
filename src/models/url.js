let mongoose = require('mongoose');

let urlSechma = new mongoose.Schema({
    original_url: {
        type: String,
        requied: true
    },
    short_url: {
        type: Number,
        required: true,
        unique: true
    }
});

const ShortnedURl = new mongoose.model('shortendUrl', urlSechma);
module.exports = ShortnedURl;

