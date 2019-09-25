// TODO: implement babel version
import moment from 'moment';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var expressJWT = require('express-jwt');

var {
    applicationSecretKey
} = require('./server/knot/knot-types');

var dataset = require('./server/knot/routes/dataset');
var dashboards = require('./server/knot/routes/dashboards');

var app = express();

app.use(cors());
app.use(require('express-promise')());

const reviver = (key, value) => {
    if (typeof value === 'string' && moment(value, moment.ISO_8601).isValid()) {
        // console.log('#date: ', value);
        return new Date(value);
    }

    return value;
};


app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb', reviver}));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, parameterLimit:100000 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use(expressJWT({ secret: applicationSecretKey() }).unless(
    {
        path: [
            /\/favicon.ico/,
            /^(?!\/api\/.*$).*/g
        ]
    }
));

app.use('/dataset', dataset);
app.use('/dashboards', dashboards);

app.get('*', (req, res) => {
    // res.json({message: 'welcome to knot!'});
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    res.json({
        message: err.message,
        error: err
    });
});

module.exports = app;