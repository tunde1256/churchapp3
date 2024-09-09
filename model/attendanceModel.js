const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    branch: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    attendees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User', // Assuming users represent church members
        }
    ],
    maleCount: {
        type: Number,
        default: 0, // Default to 0 if not set
    },
    femaleCount: {
        type: Number,
        default: 0, // Default to 0 if not set
    },
    childrenCount: {
        type: Number,
        default: 0, // Default to 0 if not set
    },
}, { timestamps: true });

attendanceSchema.pre('save', async function(next) {
    
        
});

module.exports = mongoose.model('Attendance', attendanceSchema);
