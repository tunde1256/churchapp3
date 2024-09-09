const mongoose = require('mongoose');

const financialSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String }
});

const Financial = mongoose.model('Financial', financialSchema);
module.exports = Financial;
