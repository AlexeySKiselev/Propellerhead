/**
 * Migration script for populating customers collection
 */

// Create users model
const Customers = require('../app/models/customers');
const logger = require('../app/logger')('migration:customers');

// Connect to MongoDB
let mongoose = require('mongoose'),
    mongodbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/propellerhead';

let customersList = [
        { cid: 1, name: 'Customer 1', contacts: { phone: '1234', address: 'Wellington' }},
        { cid: 2, name: 'Customer 2', contacts: { phone: '1234', address: 'Wellington' }},
        { cid: 3, name: 'Customer 3', contacts: { phone: '1234', address: 'Wellington' }},
        { cid: 4, name: 'Customer 4', contacts: { phone: '1234', address: 'Wellington' }},
        { cid: 5, name: 'Customer 5', contacts: { phone: '1234', address: 'Wellington' }}
    ],
    customersAdded = 0;

mongoose.Promise = global.Promise;
mongoose.connect(mongodbUrl, { keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true })
    .then(() => {
        logger.info('Successfully connected to MongoDB');
        // Insert user to Users collection
        for(let customer of customersList) {
            Customers.findOne({ cid: customer.cid }, (err, _customer) => {
                if(err) {
                    logger.error(`An error occurs while obtaining user info: ${err}`);
                } else if(!_customer) {
                    // Insert to DB
                    const newCustomer = new Customers({
                        cid: customer.cid,
                        name: customer.name,
                        contacts: customer.contacts
                    });
                    newCustomer.save((err) => {
                        if(err) {
                            logger.error(`Error occurs while adding customer ${customer.cid} to DB: ${err}`);
                        } else {
                            customersAdded += 1;
                            logger.info(`Customer ${customer.cid} successfully added to DB`);
                        }
                    });
                }
            });
        }
        if(customersAdded === customersList.length){
            mongoose.connection.close();
            process.exit(0);
        }
    })
    .catch((err) => {
        logger.error(err);
    });
