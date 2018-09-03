/**
 * Migration script for creating users
 */

// Create users model
const Users = require('../app/models/users');
const logger = require('../app/logger')('migration:users');

// Create connection
// Connect to MongoDB
let mongoose = require('mongoose'),
    mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/propellerhead';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl, { keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true })
    .then(() => {
        logger.info('Successfully connected to MongoDB');
        // Insert user to Users collection
        Users.findOne({ email: 'admin@email.com' }, (err, user) => {
            if(err) {
                logger.error('An error occurs while obtaining user info');
            } else {
                if(!user) {
                    // Insert user to DB
                    const newUser = new Users({
                        name: 'Admin',
                        email: 'admin@email.com',
                        password: Users.generateHash('password')
                    });
                    newUser.save((err) => {
                        if(err) {
                            logger.error('Error occurs while adding "Admin" to DB');
                        } else {
                            logger.info('User "Admin" successfully added to DB');
                            mongoose.connection.close();
                        }
                    });
                }
                process.exit(0);
            }
        });
    })
    .catch((err) => {
        logger.error(err);
    });
