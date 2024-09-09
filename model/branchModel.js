const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const branchSchema = new Schema({
    branchName: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: true,
    },
    leadPastor: {
        type: String,
        required: false,
    },
    contactNumber: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Branch', branchSchema);
