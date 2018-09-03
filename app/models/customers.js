/**
 * MongoDB Model for Customers Collection
 * Created by Alexey S. Kiselev.
 */

let mongoose = require('mongoose');

let customersSchema = new mongoose.Schema({
    cid: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['prospective', 'current', 'non-active'],
        default: 'current'
    },
    contacts: {
        phone: {
            type: String
        },
        address: {
            type: String
        }
    }
}, { collection: 'customers' });

module.exports = mongoose.model('Customers', customersSchema);
