/**
 * Customer route
 */

let express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    logger = require('../logger')('customerpage');

// Check logged In  User
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

router.get('/', isLoggedIn, (req, res) => {
    res.redirect('/');
});

router.get('/:id', isLoggedIn, (req, res) => {
    try {
        res.render('customer', {
            title: 'Customer Page - Propellerhead',
            name: req.user.name,
            cid: parseInt(req.params.id)});
    } catch(err) {
        logger.error(`Error occurred while parsing customer page: ${err}`);
    }
});

module.exports = router;
