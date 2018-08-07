const Goal = require('./../models/goal');
const User = require('./../models/user');
const Pitch = require('./../models/pitch');
const _ = require('underscore');

module.exports = {
    setProgress: (req, res) => {
        Goal.findOne({_id: req.params.goalid}, (err, goal) => {
            goal.setCurrentProgress(req.body.currentprogress);
            goal.save();
            User.findOne({_id: req.params.id}, (err, user) => {
                user.goals.splice(user.goals.indexOf(goal), 1, goal);
                user.save();
                res.status(200).json(user);
            });
        });
    },
    setPitch: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            Goal.findOne({_id: req.params.goalid}, (err, goal) => {
                let newpitch = new Pitch({
                    goalid: goal._id
                });
                newpitch.setFrequency(Number.parseFloat(req.body.frequency));
                newpitch.save();
                goal.pitches.push(newpitch);
                goal.save();
                user.goals.splice(user.goals.indexOf(goal), 1, goal);
                user.save();
                res.status(200).json(user);
            });
        });
    },
    deleteEntireGoalRecord: (req, res) => {
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
}