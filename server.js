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

app.listen(app.get('port'), () => {
    console.log('Express server listening on port %d', app.get('port'));
    mongoose.connect('mongodb://localhost:27017/notetestdb', mongooseOptions, (err) => {
        if (err) {
            throw err;
        }
        else {
            console.log('Mongoose connected');
        }
    });
});