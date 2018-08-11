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
    permittedUsers: [String],
    salt: String,
    hashedPasscode: String,
    isOfAge: {
        isVerified: Boolean
    },
    requestedUsers: [String],
    gravatar: String,
    message: String,
    sharedProgresses: [JSON]
    
});

User.methods.createPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('base64');
    this.hashedPasscode = crypto.pbkdf2Sync(password, new Buffer(this.salt, 'utf8'), 1000, 64, 'sha512').toString('hex');
};

User.methods.checkPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, new Buffer(this.salt, 'utf8'), 1000, 64, 'sha512').toString('hex');

    return hash === this.hashedPasscode;
};

User.methods.shareProgress = function(req, res, buddy, message){
    if (this.goals.length > 0) {
        for (var i = 0; i < this.goals.length; i++) {
            if (buddy.sharedProgresses.indexOf(this.goals[i]) === -1) {
                buddy.sharedProgresses.push(this.goals[i]);
            }
            else {
                buddy.sharedProgresses.splice(buddy.sharedProgresses.indexOf(this.goals[i]), 1, this.goals[i]);
            }
        }
        req.session.message = message;
        buddy.message = req.session.message;
        delete req.session.message;
        buddy.save();
        res.status.json(this.goals);
    }
    else {
        res.status(500).send('There is no progress to share');
    }
};

module.exports = mongoose.model('User', User);