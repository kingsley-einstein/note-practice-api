const Schema = require('mongoose').Schema;

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
    goals: [Object],
    //pitches: [Object],
    permittedUsers: [Object],
    hashedPasscode: String,
    isOfAge: {
        type: Object,
        default: {
            isVerified: true
        }
    },
    requestedUsers: [Object]
    
});

User.methods.createPassword = (password) => {
    this.hashedPasscode = require('crypto').pbkdf2Sync(password, new Buffer('sh!', 'utf8'), 1000, 64, 'sha512').toString('hex');
};

User.methods.checkPassword = (password) => {
    var hash = require('crypto').pbkdf2Sync(password, new Buffer('sh!', 'utf8'), 1000, 64, 'sha512').toString('hex');

    return hash === this.hashedPasscode;
};

User.methods.setGoal = (goal) => {
    this.goals.push(goal);
};

User.methods.deleteGoal = (goal) => {
    this.goals.splice(this.goals.indexOf(goal), 1);
};
module.exports = require('mongoose').model('User', User);