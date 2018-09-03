/**
 * Index route
 */

let express = require('express'),
    router = express.Router(),
    passport = require('passport');

// Check logged In  User
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

router.get('/', isLoggedIn, (req, res) => {
    res.render('index', { title: 'Customer Page - Propellerhead', name: req.user.name });
});

module.exports = router;
