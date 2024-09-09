const cloudinary = require('cloudinary').v2;
const logger = require('../logger'); // Adjust the path as needed

// Configure Cloudinary
try {
    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
    });

    logger.info('Cloudinary configuration set successfully');
} catch (error) {
    logger.error('Error configuring Cloudinary:', error);
    // Optionally, you might want to throw the error to stop the application if critical
    throw error;
}

module.exports = cloudinary;
