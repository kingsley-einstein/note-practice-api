const Goal = require('./../models/goal');
const User = require('./../models/user');
const Pitch = require('./../models/pitch');
const _ = require('underscore');

module.exports = {
    setProgress: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            Goal.findOne({_id: req.params.goalid}, (err, goal) => {
                goal.setCurrentProgress(req.body.currentprogress);
                goal.save();
                User.findOne({_id: req.params.id}, (err, user) => {
                    user.goals.splice(user.goals.indexOf(goal), 1, goal);
                    user.save();
                    res.status(200).json(user);
                });
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    deleteEntireGoalRecord: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                Goal.find({userId: user._id}, {}, (err, goals) => {
                    _.each(goals, (g, i) => {
                        Goal.findByIdAndRemove(g._id, (err, item) => {
                            user.goals.splice(user.goals.indexOf(item), 1);
                            user.save();
                        });
                    });
                });
                res.status(200).json(user);
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    displayGoals: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                Goal.find({userId: user._id}, {}, (err, goals) => {
                    if (goals.length > 0) {
                        res.status(200).json(goals);
                    }
                    else {
                        res.json({placeholder: "No Goal Items"});
                    }
                });
            });
        }
    }
}