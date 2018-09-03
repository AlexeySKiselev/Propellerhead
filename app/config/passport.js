/**
 * Passport Authentication Configuration
 * Created by Alexey S. Kiselev
 */

let LocalStrategy = require('passport-local').Strategy,
    Users = require('../models/users'),
    logger = require('../logger')('passport');


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        Users.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        Users.findOne({ email: username }, (err, user) => {
            if(err) {
                logger.error(`An error occured while authenticate user ${username}`);
                return done(null, false, {message: 'An error occurred'});
            }
            if (user && user.validPassword(password, user.password)) {
                return done(null, user);
            }
            return done(null, false, {message: 'Username or Password is incorrect'});
        });
    }));
};
