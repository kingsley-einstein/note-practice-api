const User = require('./../models/user');
const Goal = require('./../models/goal');

let transport = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
        user: require('./../secrets').user,
        pass: require('./../secrets').pass
    }
});

module.exports = {
    register: (req, res) => {
        if (req.body.email.match(/([a-zA-Z]+|[a-zA-Z0-9]+)(@)(\w+)(.com|.co.uk|.net)/)) {
            User.findOne({email: req.body.email}, (err, user) => {
                if (user) {
                    res.status(500).send('User with given e-mail exists');
                }
                else {
                    User.findOne({username: req.body.username}, (err, user) => {
                        if (user) {
                            res.status(500).send('User with the given username exists');
                        }
                        else {
                            let incomingdata = new User({
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                dob: new Date(req.body.dob),
                                email: req.body.email,
                                username: req.body.username,
                                isOfAge : {
                                    isVerified: require('moment')().diff(req.body.dob, 'years') > 13
                                },
                                gravatar: require('md5')(req.body.email)
                            });
                            incomingdata.createPassword(req.body.password);
                            incomingdata.validate((err) => {
                                if (err) {
                                    res.status(500).send('An error occured');
                                }
                                else {
                                    
                                    incomingdata.save();
                                    if (incomingdata.isOfAge.isVerified) {
                                    
                                        res.status(200).json(incomingdata);
                                    }
                                    else {
                                        
                                        res.status(304).send("You are underaged and are unallowed to access certain features of this app. Enter a parent's email to send them a verification link with which to provide consent.");
                                    }

                                }
                            });
                        }
                        
                    });
                }
            });
        }
        else {
          res.status(500).send('Invalid e-mail');  
        }
    },
    login: (req, res) => {
        if (req.body.userOrEmail.match(/([a-zA-Z]+|[a-zA-Z0-9]+)(@)(\w+)(.com|.co.uk|.net)/)) {
            User.findOne({email: req.body.userOrEmail}, (err, user) => {
                if (user) {
                    if (user.checkPassword(req.body.password)) {
                        res.status(200).json(user);
                    }
                    else {
                        res.status(500).send('Incorrect password');
                    }
                }
                else {
                    res.status(500).send('User with specified email not found');
                }
            });
        }
        else {
            User.findOne({username: req.body.userOrEmail}, (err, user) => {
                if (user) {
                    if (user.checkPassword(req.body.password)) {
                        res.status(200).json(user);
                    }
                    else {
                        res.status(500).send('Incorrect password');
                    }
                }
                else {
                    res.status(500).send('User with specified username not found');
                }
            });
        }
    },
    setGoal: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            let goal = new Goal({
                title: req.body.goaltitle,
                userId: user._id,
                targetProgress: Number.parseFloat(req.body.targetprogress),
                currentProgress: 0,
                dateSet: Date.now()
            });
            goal.validate((err) => {
                if (err) {
                    res.status(500).send('An error occured while trying to set goal');
                }
                else {
                    goal.save();
                    //user.setGoal('Hello');
                    //user.goals.push(goal);
                    user.goals.push(goal);
                    user.save();
                    res.status(200).json(user);
                }
            });
        });
    },
    deleteGoal: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            Goal.findByIdAndRemove(req.params.goalid, (err, goal) => {
                user.goals.splice(user.goals.indexOf(goal), 1);
                user.save();
                res.status(200).json(user);
            });
        });
        
    }
}