/**
 * MongoDB Model for Users Collection
 * Created by Alexey S. Kiselev.
 */

let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'users' });

usersSchema.statics.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
usersSchema.methods.validPassword = (password, dbPass) => {
    return bcrypt.compareSync(password, dbPass);
};

module.exports = mongoose.model('Users', usersSchema);
