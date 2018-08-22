const Schema = require('mongoose').Schema;
const _ = require('underscore');

const Pitch = new Schema({
    pitchid: String,
    userid: String,
    goalid: String,
    speeds: [JSON],
    averageSpeed: [JSON]
});

Pitch.methods.setSpeed = function(body, i) {
    const {userdate, pitches} = body;
    this.speeds.push({date: userdate, userspeed: pitches[i].speed});
};

Pitch.methods.calculateAverage = function(body) {
    let sum = 0;

    if (this.speeds.length > 0) {
        _.each(this.speeds, (item) => {
            sum += item.userspeed;
        });
        
    }
    this.averageSpeed.push({avr: (sum/this.speeds.length), date: body.date});
};

module.exports = require('mongoose').model('Pitche', Pitch);