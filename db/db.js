require('dotenv').config()
const mongoose = require('mongoose');
const logger = require('../logger');

// Connect to MongoDB
const DBURL = process.env.MONGODB_URL;

const Connection = async () => {
    const MAX_RETRIES = 20;
    let retryCount = 0;
    
    while (retryCount < MAX_RETRIES) {
        try {
            await mongoose.connect(DBURL,);
            logger.info('Connected to MongoDB');
            break; // Connection successful, exit the loop
        } catch (error) {
            retryCount++;
            logger.error(`Failed to connect to MongoDB. Retrying... (${retryCount}/${MAX_RETRIES})`, error);

            if (retryCount >= MAX_RETRIES) {
                logger.error('Max retries reached. Exiting process.');
                process.exit(1); // Exit the process after max retries
            }
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

module.exports = Connection;
