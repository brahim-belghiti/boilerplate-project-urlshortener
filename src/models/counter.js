let mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
    count: {
        type: Number,
        required: true,
        unique: true
    }
})

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;