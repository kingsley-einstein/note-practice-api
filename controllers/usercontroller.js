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
        if (req.headers['token'] === require('./../secrets').token) {
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
                                        isVerified: require('moment')().diff(new Date(req.body.dob), 'years') > 13
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
                                            
                                            res.status(302).send("You are underaged and are unallowed to access certain features of this app. Enter a parent's email to send them a verification link with which to provide consent.");
                                        }
                                        req.session.userId = incomingdata._id;
    
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
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    login: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            if (req.body.userOrEmail.match(/([a-zA-Z]+|[a-zA-Z0-9]+)(@)(\w+)(.com|.co.uk|.net)/)) {
                User.findOne({email: req.body.userOrEmail}, (err, user) => {
                    if (user) {
                        if (user.checkPassword(req.body.password)) {
                            res.status(200).json(user);
                            //req.session.userEmail = user.email;
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
                            //req.session.userName = user.username;
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
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    sendVerification: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
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
                                html: `Hello from the Note App Team. <br/> <br/> A certain user with the name ${user.firstname} ${user.lastname} registered to use a music practice app and is underaged to access certain features and as such needs your consent to use the app. Click on the link below to give consent. <br/> <br/> <a href="http://localhost:5000/${user._id}/${Date.now()}/verify">Give Consent</a>`
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
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    verifyUser: (req, res) => {
        User.findOne({_id: req.params.id}, (err, user) => {
            if (require('moment')().diff(new Date(req.params.date), 'days') > 7) {
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
        if (req.headers['token'] === require('./../secrets').token) {
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
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    deleteGoal: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                Goal.findByIdAndRemove(req.params.goalid, (err, goal) => {
                    user.goals.splice(user.goals.indexOf(goal), 1);
                    user.save();
                    res.status(200).json(user);
                });
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
        
    },
    sendBuddyRequest: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                User.findOne({_id: req.params.buddyid}, (err, buddy) => {
                    buddy.requestedUsers.push(user._id);
                    req.session.message = user.username+' has requested to add you as a buddy';
                    buddy.message = req.session.message;
                    buddy.save();
                    delete req.session.message;
                    res.status(200).json(user);
                });
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    acceptBuddyRequest: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                User.findOne({_id: req.params.requestid}, (err, request) => {
                    user.requestedUsers.splice(user.requestedUsers.indexOf(request), 1);
                    user.permittedUsers.push(request._id);
                    user.message = '';
                    request.permittedUsers.push(user._id);
                    request.save();
                    user.save();
                    res.status(200).json(user);
                });
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    rejectBuddyRequest: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                User.findOne({_id: req.params.requestid}, (err, request) => {
                    user.requestedUsers.splice(user.requestedUsers.indexOf(request), 1);
                    user.message = '';
                    user.save();
                    res.status(200).json(user);
                });
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    shareProgress: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                User.findOne({_id: req.params.buddyid}, (err, buddy) => {
                    user.shareProgress(req, res, buddy, user.username+' has shared their progress with you');
                });
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    displayGlobalRecord: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.find({}, {}, {}, (err, users) => {
                res.status(200).json(users);
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    },
    displayProfile: (req, res) => {
        if (req.headers['token'] === require('./../secrets').token) {
            User.findOne({_id: req.params.id}, (err, user) => {
                res.status(200).json(user);
            });
        }
        else {
            res.status(500).send('Access denied! Invalid token');
        }
    }
}