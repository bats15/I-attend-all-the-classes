const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    studentEmail: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    attended: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance; 