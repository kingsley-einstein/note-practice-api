const session = require('express-session');
const Mongostore = require('connect-mongo')(session);

module.exports = {
    config: (app) => {
        app.use(require('body-parser')({extended: true}))
        app.use(require('morgan')('dev'));
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
            next();
        });
        app.use(session({
            cookie: {
                signed: true,
                secure: false,
                maxAge: 90000000,
            },
            resave: true,
            saveUninitialized: true,
            secret: require('./secrets').secret,
            store: new Mongostore({
                db: app.get('env') === 'development' ? 'notetestdb' : 'noteclouddb',
                mongooseConnection: require('mongoose').connection
            })
        }));

        //...................................................................//
        console.log('App configured');
    },

    route: (app) => {
        require('./routes').wire(app);

        //...................................................................//
        console.log('App routed');
    }
}