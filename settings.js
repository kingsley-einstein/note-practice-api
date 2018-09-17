const session = require('express-session');
const Mongostore = require('connect-mongo')(session);
const hbs = require('express-handlebars');

module.exports = {
    config: (app) => {
        app.engine('hbs', hbs({
            layoutsDir: require('path').join(app.get('views'), 'layouts'),
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        app.set('view engine', 'hbs');
        app.use(require('body-parser')({extended: true}));
        app.use(require('body-parser').json());
        app.use(require('morgan')('dev'));
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
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