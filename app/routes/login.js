/**
 * Login route
 */

let express = require('express'),
    router = express.Router();

// Check logged In  User
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        res.redirect('/');
        return;
    }
    return next();
};

router.get('/', isLoggedIn, (req, res) => {
    res.render('login', { title: 'Login Page - Propellerhead' });
});

module.exports = router;
