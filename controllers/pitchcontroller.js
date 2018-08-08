const Goal = require('./../models/goal');
const User = require('./../models/user');
const Pitch = require('./../models/pitch');
const _ = require('underscore');

module.exports = {
    setSpeed: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            Goal.findOne({_id: req.params.goalid}, (err, goal) => {
                Pitch.findOne({_id: req.params.pitchid}, (err, pitch) => {
                    pitch.setSpeed(Number.parseFloat(req.body.speed));
                    pitch.save();
                    goal.pitches.splice(goal.pitches.indexOf(pitch), 1, pitch);
                    goal.save();
                    user.goals.splice(user.goals.indexOf(goal), 1, goal);
                    user.save();
                    res.status(200).json(pitch)
                });
            });
        });
    },
    displayPitches: (req, res) => {
        Pitch.find({userid: req.params.id}, {}, (err, pitches) => {
            res.status(200).json(pitches);
        });
    }
}