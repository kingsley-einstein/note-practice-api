module.exports.wire = (app) => {
    app.post('/register', require('./controllers/usercontroller').register);
    app.post('/login', require('./controllers/usercontroller').login);
    app.post('/:id/newgoal', require('./controllers/usercontroller').setGoal);
    app.get('/:id/:goalid/deletegoal', require('./controllers/usercontroller').deleteGoal);

    //...........................................................................//

    console.log('App routed');
}