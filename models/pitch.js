const Schema = require('mongoose').Schema;
const _ = require('underscore');

const Pitch = new Schema({
    pitchid: String,
    userid: String,
    goalid: String,
    speeds: [JSON],
    averageSpeed: [JSON]
});

Pitch.methods.setSpeed = function(body, i, goal, user) {
    const {userdate, pitches} = body;
    this.speeds.push({date: new Date(userdate), speed: pitches[i].speed});
    if (goal.pitches.indexOf(this) > -1) {
        goal.pitches.splice(goal.pitches.indexOf(this), 1, this);
    }
    else {
        goal.pitches.push(this);
    }
    user.goals.splice(user.goals.indexOf(goal), 1, goal);
    //goal.save();
    //user.save();
    console.log(pitches[i]);
    console.log(i);
    console.log(this);
};

Pitch.methods.calculateAverage = function(body) {
    let sum = 0;

    if (this.speeds.length > 0) {
        _.each(this.speeds, (item) => {
            sum += item.speed;
        });
        
    }
    if (sum > 0) {
        this.averageSpeed.push({avr: (sum/this.speeds.length), date: new Date(body.date)});
    }
};

module.exports = require('mongoose').model('Pitche', Pitch);