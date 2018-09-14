module.exports.wire = (app) => {
    app.post('/register', require('./controllers/usercontroller').register);
    app.post('/login', require('./controllers/usercontroller').login);
    app.post('/:id/newgoal', require('./controllers/usercontroller').setGoal);
    app.delete('/:id/:goalid/deletegoal', require('./controllers/usercontroller').deleteGoal);
    app.post('/:id/sendverify', require('./controllers/usercontroller').sendVerification);
    app.get('/:id/:date/verify', require('./controllers/usercontroller').verifyUser);
    app.put('/:goalid/:id/setprogress', require('./controllers/goalcontroller').setProgress);
    app.delete('/:id/deleteall', require('./controllers/goalcontroller').deleteEntireGoalRecord);
    app.put('/:id/:goalid/speedup', require('./controllers/pitchcontroller').setSpeed);
    app.get('/:id/pitches', require('./controllers/pitchcontroller').displayPitches);
    app.get('/:id/:buddyid/share', require('./controllers/usercontroller').shareProgress);
    app.get('/global', require('./controllers/usercontroller').displayGlobalRecord);
    app.get('/:id', require('./controllers/usercontroller').displayProfile);
    app.get('/:id/goals', require('./controllers/goalcontroller').displayGoals);
    app.get('/:id/:buddyid/request', require('./controllers/usercontroller').sendBuddyRequest);
    app.get('/:id/:requestid/accept', require('./controllers/usercontroller').acceptBuddyRequest);
    app.get('/:id/:requestid/reject', require('./controllers/usercontroller').rejectBuddyRequest);
    app.put('/average', require('./controllers/pitchcontroller').calculateAverage);

    //...........................................................................//

    //console.log('App routed');
}