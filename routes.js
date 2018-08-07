module.exports.wire = (app) => {
    app.post('/register', require('./controllers/usercontroller').register);
    app.post('/login', require('./controllers/usercontroller').login);
    app.post('/:id/newgoal', require('./controllers/usercontroller').setGoal);
    app.delete('/:id/:goalid/deletegoal', require('./controllers/usercontroller').deleteGoal);
    app.post('/:id/sendverify', require('./controllers/usercontroller').sendVerification);
    app.get('/:id/:date/verify', require('./controllers/usercontroller').verifyUser);

    //...........................................................................//

    console.log('App routed');
}