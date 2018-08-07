const Schema = require('mongoose').Schema;

const Pitch = new Schema({
    goalid: String,
    frequency: String
});

Pitch.methods.setFrequency = function(frequency) {
    this.frequency = frequency+'hZ';
};

module.exports = require('mongoose').model('Pitche', Pitch);