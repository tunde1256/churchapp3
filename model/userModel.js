const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    age: { type: Number, min: 18 },
    department: { type: String },
    phoneNumber: { type: String, },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String }
    },
    churchBranch: { type: String },  // New field for church branch
    country: { type: String }        // New field for country
});


const User = mongoose.model('User', userSchema);



module.exports = User;
