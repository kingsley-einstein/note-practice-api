const express = require('express');
const app = express();
const mongoose = require('mongoose');

let mongooseOptions = {
    server: {
        socketOptions: {
            keepAlive: 1 
        }
    }
};

app.set('port', process.env.PORT || 5000);
app.set('env', 'production');
app.set('views', require('path').join(__dirname, 'views'));
app.use(express.static(require('path').join(__dirname, 'statics')));

require('./settings').config(app);
require('./settings').route(app);

app.listen(app.get('port'), () => {
    console.log('Express server listening on port %d', app.get('port'));
    switch (app.get('env')) {
        case 'development' : 
                    mongoose.connect(require('./secrets').local, mongooseOptions, (err) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log('Mongoose connected to local db');
                        }
                    });
                    break;
        case 'production' :
                    mongoose.connect(require('./secrets').cloud, mongooseOptions, (err) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            console.log('Mongoose connected to cloud db');
                        }
                    });
                    break;

    }
});