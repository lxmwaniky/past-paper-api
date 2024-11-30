const mongoose = require('mongoose');

const paperSchema = mongoose.Schema({
    unitCode: {
        type: String,
        required: true
    },
    yearTaken: {
        type: String,
        required: true
    },
    unitTitle: {
        type: String,
        required: true
    },
    fileLocation: {
        type: String,
        required: true
    },
    classOfStudy: {
        type: String,
        required: true
    }
});

exports.Paper = mongoose.model('Paper', paperSchema);