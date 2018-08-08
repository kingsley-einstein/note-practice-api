const Schema = require('mongoose').Schema;

const Pitch = new Schema({
    userid: String,
    goalid: String,
    speedInMillis: [JSON],
    avgSpeed: [JSON],
    targetTime: Number
});

Pitch.methods.setSpeed = function(theSpeed) {
    let context = {
        speed: theSpeed * 1000,
        date: new Date()
    };
    this.speedInMillis.push(context);
    var speed = 0;
    for (var i = 0; i < this.speedInMillis.length; i++) {
        speed += (this.speedInMillis[i].speed)/this.speedInMillis.length;
    }

    let avgContext = {
        avgSpeedInMillis: speed,
        date: new Date()
    };

    this.avgSpeed.push(avgContext);
};

module.exports = require('mongoose').model('Pitche', Pitch);