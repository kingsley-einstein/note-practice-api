module.exports = {
    config: (app) => {
        app.use(require('body-parser')({extended: true}))
        app.use(require('morgan')('dev'));
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
            next();
        });

        //...................................................................//
        console.log('App configured');
    },

    route: (app) => {
        require('./routes').wire(app);
    }
}