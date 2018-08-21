const Schema = require('mongoose').Schema;

const Pitch = new Schema({
    pitchid: String,
    userid: String,
    goalid: String,
    speed: Number
});

Pitch.methods.setSpeed = function(theSpeed) {
    this.speed = theSpeed;
};

module.exports = require('mongoose').model('Pitche', Pitch);