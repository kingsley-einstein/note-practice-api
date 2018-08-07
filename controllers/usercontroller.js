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
    sendVerification: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (req.body.email) {
                if (req.body.email.match(/([a-zA-Z]+|[a-zA-Z0-9]+)(@)(\w+)(.com|.co.uk|.net)/)) {
                    if (req.body.email === user.email) {
                        res.status(500).send('That is your email, enter a distinct email');
                    }
                    else {
                        transport.sendMail({
                            from: '<The Note App Team> '+require('./../secrets').user,
                            to: req.body.email,
                            html: 'Hello from the Note App Team. <br/> <br/> A certain user with the name '+user.firstname+' '+user.lastname+' registered to use a music practice app and is underaged to access certain features and as such needs your consent to use the app. Click on the link below to give consent. <br/> <br/>'
                        }, (err, info) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(info);
                                res.status(200).json(info);
                            }
                        });
                    }
                }
                else {
                    res.status(500).send('Invalid email');
                }
            }
            else {
                res.status(500).send('Email field cannot be empty');
            }
        });
    },
    verifyUser: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (require('moment')().diff(req.params.date, 'days') > 7) {
                res.status(500).send('Verification link has expired');
            }
            else {
                user.isOfAge.isVerified = true;
                user.save();
                res.status(200).send('User has been verified');
            }
        });
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
        
    },
    sendBuddyRequest: (req, res) => {

    },
    acceptBuddyRequest: (req, res) => {

    },
    rejectBuddyRequest: (req, res) => {

    },
    shareProgress: (req, res) => {

    },
    acceptProgressShare: (req, res) => {

    },
    rejectProgressShare: (req, res) => {

    },
    displayGlobalRecord: (req, res) => {

    },
    displayProfile: (req, res) => {

    }
}