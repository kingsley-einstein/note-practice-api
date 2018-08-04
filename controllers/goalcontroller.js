const Goal = require('./../models/goal');
const User = require('./../models/user');
const Pitch = require('./../models/pitch');
const _ = require('underscore');

module.exports = {
    setProgress: (req, res) => {
        Goal.findOne({_id: req.params.id}, (err, goal) => {
            goal.setProgress(req.body.currentprogress);
        });
    },
    setPitch: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            Goal.findOne({_id: req.params.goalid}, (err, goal) => {
                let newpitch = new Pitch({
                    goalid: goal._id
                });
                newpitch.save();
                goal.pitches.push(newpitch);
                goal.save();
                _.each(user.goals, (g, i) => {
                    if (g._id === goal._id) {
                        g.pitches.push(newpitch);
                        user.save();
                    }
                });
            });
        });
    }
}