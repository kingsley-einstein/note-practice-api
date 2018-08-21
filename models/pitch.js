const Schema = require('mongoose').Schema;

const Pitch = new Schema({
    pitchid: String,
    userid: String,
    goalid: String,
    speeds: [JSON]
});

Pitch.methods.setSpeed = function(body) {
    const {userdate, speed} = body;
    this.speeds.push({date: userdate, userspeed: speed});
};

module.exports = require('mongoose').model('Pitche', Pitch);