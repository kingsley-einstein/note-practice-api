const Goal = require('./../models/goal');
const User = require('./../models/user');
const Pitch = require('./../models/pitch');
const _ = require('underscore');

module.exports = {
    setSpeed: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                Goal.findOne({_id: req.params.goalid}, (err, goal) => {
                
                    _.each(req.body.pitches, (item, index) => {
                        Pitch.findOne({userid: user._id, pitchid: item.id, goalid: goal._id}, (err, pitch) => {
                            pitch.setSpeed(req.body, index, goal, user);
                            pitch.save();
                            
                            //goal.save();
                            //goal.pitches.splice(goal.pitches.indexOf(pitch), 1, pitch);
                            //goal.save();
                           // console.log(goal.pitches.splice(goal.pitches.indexOf(pitch), 1, pitch));
                            //user.goals.splice(user.goals.indexOf(goal), 1, goal);
                            //user.save();
                        });
                    });
                    goal.save();
                    user.save();
                    
                });
                res.status(200).json(user);
            });
        }
        else{
            res.status(500).send('Access denied! Invalid token');
        }
    },
    displayPitches: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            Pitch.find({userid: req.params.id}, {}, (err, pitches) => {
                res.status(200).json(pitches);
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    calculateAverage: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            Pitch.find({}, {}, {}, (err, pitches) => {
                _.each(pitches, (pitch) => {
                    pitch.calculateAverage(req.body);
                    pitch.save();
                });
                res.status(200).json(pitches);
            });
        }
    }
}