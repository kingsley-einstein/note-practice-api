describe('Route Test', () => {
    const app = {
        post: sinon.spy(),
        use: sinon.spy(),
        get: sinon.spy(),
        put: sinon.spy(),
       // post: sinon.spy(),
        delete: sinon.spy()
    };
    require('./../../settings').config(app);
    require('./../../settings').route(app);
    beforeEach(() => {
        console.log('Entering suite');
    });
    afterEach(() => {
        console.log('Test carried out successfully at this point')
    });
    describe('Post Calls', () => {
        it('should call /register', () => {
            expect(app.post).to.be.calledWith('/register', require('./../../controllers/usercontroller').register);
        });
        it('should call /login', () => {
            expect(app.post).to.be.calledWith('/login', require('./../../controllers/usercontroller').login);
        });
        it('should call /:id/newgoal', () => {
            expect(app.post).to.be.calledWith('/:id/newgoal', require('./../../controllers/usercontroller').setGoal);
        });
        it('should call /:id/sendverify', () => {
            expect(app.post).to.be.calledWith('/:id/sendverify', require('./../../controllers/usercontroller').sendVerification);
        });
    });
    describe('Get Calls', () => {
        it('should call /:id/:date/:verify', () => {
            expect(app.get).to.be.calledWith('/:id/:date/verify', require('./../../controllers/usercontroller').verifyUser);
        });
        it('should call /:id/pitches', () => {
            expect(app.get).to.be.calledWith('/:id/pitches', require('./../../controllers/pitchcontroller').displayPitches);
        });
        it('should call /:id/:buddyid/share', () => {
            expect(app.get).to.be.calledWith('/:id/:buddyid/share', require('./../../controllers/usercontroller').shareProgress);
        });
        it('should call /global', () => {
            expect(app.get).to.be.calledWith('/global', require('./../../controllers/usercontroller').displayGlobalRecord);
        });
        it('should call /:id', () => {
            expect(app.get).to.be.calledWith('/:id', require('./../../controllers/usercontroller').displayProfile);
        });
        it('should call /:id/:buddyid/request', () => {
            expect(app.get).to.be.calledWith('/:id/:buddyid/request', require('./../../controllers/usercontroller').sendBuddyRequest);
        });
        it('should call /:id/:requestid/accept', () => {
            expect(app.get).to.be.calledWith('/:id/:requestid/accept', require('./../../controllers/usercontroller').acceptBuddyRequest);
        });
        it('should call /:id/:requestid/reject', () => {
            expect(app.get).to.be.calledWith('/:id/:requestid/reject', require('./../../controllers/usercontroller').rejectBuddyRequest);
        });
    });
    describe('Put Calls', () => {
        it('should call /:goalid/:id/setprogress', () => {
            expect(app.put).to.be.calledWith('/:goalid/:id/setprogress', require('./../../controllers/goalcontroller').setProgress);
        });
        it('should call /:id/:goalid/speedup', () => {
            expect(app.put).to.be.calledWith('/:id/:goalid/speedup', require('./../../controllers/pitchcontroller').setSpeed);
        });
        it('should call /average', () => {
            expect(app.put).to.be.calledWith('/average', require('./../../controllers/pitchcontroller').calculateAverage);
        });
    });
    describe('Delete Calls', () => {
        it('should call /:id/:goalid/deletegoal', () => {
            expect(app.delete).to.be.calledWith('/:id/:goalid/deletegoal', require('./../../controllers/usercontroller').deleteGoal);
        });
        it('should call /:id/deleteall', () => {
            expect(app.delete).to.be.calledWith('/:id/deleteall', require('./../../controllers/goalcontroller').deleteEntireGoalRecord);
        });
    });
});