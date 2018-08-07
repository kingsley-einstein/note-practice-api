const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Goal = require('./goal');
let crypto = require('crypto');

const User = new Schema({
    firstname: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 2
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 2
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        match: /([a-zA-Z]+|[0-9]+)(@)(\w+)(.com|.co.uk|.net)/,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    userId: Schema.Types.ObjectId,
    goals: [JSON],
    //pitches: [Object],
    permittedUsers: [JSON],
    hashedPasscode: String,
    isOfAge: {
        type: Object,
        default: {
            isVerified: true
        }
    },
    requestedUsers: [JSON],
    gravatar: String
    
});

User.methods.createPassword = (password) => {
    this.hashedPasscode = crypto.pbkdf2Sync(password, new Buffer('sh!', 'utf8'), 1000, 64, 'sha512').toString('hex');
};

User.methods.checkPassword = (password) => {
    var hash = crypto.pbkdf2Sync(password, new Buffer('sh!', 'utf8'), 1000, 64, 'sha512').toString('hex');

    return hash === this.hashedPasscode;
};

module.exports = mongoose.model('User', User);