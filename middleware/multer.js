const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Import your Cloudinary configuration
const logger = require('../logger'); // Adjust the path as needed

// Initialize Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'events', // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed image formats
  },
});

logger.info('Cloudinary Storage initialized with folder: events and allowed formats: jpg, jpeg, png');

// Initialize Multer with Cloudinary Storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Set file size limit (5 MB here)
  fileFilter: (req, file, cb) => {
    logger.info('File Filter:', { file: file });

    // Check file format
    const allowedFormats = ['image/jpeg', 'image/png'];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      logger.error('Invalid file format:', { mimetype: file.mimetype });
      cb(new Error('Invalid file format'), false);
    }
  },
});

// Export multer upload middleware
module.exports = upload;
