/**
 * MongoDB Model for Notes
 * Created by Alexey S. Kiselev.
 */

let mongoose = require('mongoose');

let notesSchema = new mongoose.Schema({
    cid: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        required: true
    }
}, { collection: 'notes' });

module.exports = mongoose.model('Notes', notesSchema);
