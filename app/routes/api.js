/**
 * API route
 */

let express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    logger = require('../logger'),
    Customers = require('../models/customers'),
    Notes = require('../models/notes');

// Check logged In  User
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/login', (req, res, next) => {
    (passport.authenticate('local', (err, user, info) => {
        if(err) {
            logger('api:login').error(`Error occurred while processing with login: ${err}`);
            return next(err);
        } else if(user){
            req.login(user, (err) => {
                if (err) {
                    logger('api:login').error(`Error occurred while processing with login: ${err}`);
                    return next(err);
                }
                logger('api:login').info(`User ${user.name} successfully logged in`);
                res.json({_id: user._id, name: user.name});
            });
        } else {
            res.json({_id: 'error', message: info.message});
        }
    }))(req, res, next);
});

router.get('/customers', isLoggedIn, (req, res, next) => {
    Customers.find().sort([['createdAt', -1]]).exec((err, customers) => {
        if(err) {
            logger('api:customers').error(`Error occurred while getting customers: ${err}`);
            return next(err);
        }
        if(customers) {
            res.send(customers);
        }
    });
});

router.get('/customer/:id', isLoggedIn, (req, res, next) => {
    try {
        Customers.find({cid: parseInt(req.params.id)}).exec((err, customer) => {
            if(err) {
                logger('api:customer').error(`Error occurred while getting customer info: ${err}`);
                return next(err);
            }
            if(customer) {
                res.send(customer);
            }
        });
    } catch(err) {
        logger('api:customer').error(`Error occurred while getting customer info: ${err}`);
        return next(err);
    }
});

router.post('/savecustomername', isLoggedIn, (req, res, next) => {
    Customers.update({ cid: req.body.cid }, { $set: { name: req.body.name }}, {}, (err) => {
        if(err) {
            logger('api:savecustomername').error(`Error occurred while saving customer's name: ${err}`);
            res.send(false);
            return next(err);
        }
        res.send(true);
    });
});

router.post('/savecustomerstatus', isLoggedIn, (req, res, next) => {
    Customers.update({ cid: req.body.cid }, { $set: { status: req.body.status }}, {}, (err) => {
        if(err) {
            logger('api:savecustomerstatus').error(`Error occurred while saving customer's status: ${err}`);
            res.send(false);
            return next(err);
        }
        res.send(true);
    });
});

router.get('/notes/:id', isLoggedIn, (req, res, next) => {
    try {
        Notes.find({cid: parseInt(req.params.id)}).exec((err, notes) => {
            if(err) {
                logger('api:notes').error(`Error occurred while getting customer's notes: ${err}`);
                return next(err);
            }
            if(notes) {
                res.send(notes);
            }
        });
    } catch(err) {
        logger('api:notes').error(`Error occurred while getting customer's notes: ${err}`);
        return next(err);
    }
});

router.post('/savecustomernote', isLoggedIn, (req, res, next) => {
    const note = new Notes({
        cid: req.body.cid,
        note: req.body.note
    });
    note.save((err) => {
        if(err) {
            logger('api:savecustomernote').error(`Error occurred while saving customer's status: ${err}`);
            res.send(false);
            return next(err);
        }
        try {
            Notes.find({cid: parseInt(req.body.cid)}).exec((err, notes) => {
                if(err) {
                    logger('api:notes').error(`Error occurred while getting customer's notes: ${err}`);
                    return next(err);
                }
                if(notes) {
                    res.send(notes);
                }
            });
        } catch(err) {
            logger('api:notes').error(`Error occurred while getting customer's notes: ${err}`);
            return next(err);
        }
    });
});

module.exports = router;
