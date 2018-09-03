/**
 * Propellerhead Customer Application
 * Created by Alexey S. Kiselev
 */

const express = require('express');
const session = require('express-session');
const queryLogger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('./logger')('app');

// Routes
let index = require('./routes/index');
let login = require('./routes/login');
let api = require('./routes/api');
let customerpage = require('./routes/customer');

// Connect to MongoDB
let mongoose = require('mongoose'),
    mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/propellerhead';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl, { keepAlive: 30000, connectTimeoutMS: 30000, useNewUrlParser: true })
    .then(() => {
        logger.info('Successfully connected to MongoDB');
    })
    .catch((err) => {
        logger.error(err);
    });
let MongoStore = require('connect-mongo')(session);

// Passport Authentication
let passport = require('passport');
require('./config/passport')(passport);

// App
let app = express();

// view engine setup
app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(queryLogger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname + '/../public'));
app.use(session({
    secret: 'propellerhead_secret',
    saveUninitialized: true,
    resave: false,
    cookie : { maxAge: 43200000, secure: false },
    store: new MongoStore({
        url: mongodbUrl,
        collection : 'sessions',
        ttl: 43200
    }),
    maxAge: new Date(Date.now() + 43200000)
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', index);
app.use('/login', login);
app.use('/api', api);
app.use('/customer', customerpage);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
