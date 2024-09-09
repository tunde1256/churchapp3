const { body, validationResult } = require('express-validator');
const logger = require('../logger'); // Adjust the path as needed

// Login validation
const validateLogin = [
    body('email').isEmail().notEmpty().withMessage('Please input an email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

// Registration validation
const validateRegister = [
    body('username').isString().notEmpty().withMessage('Please input a username'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }).withMessage('Please confirm your password'),
];

// Middleware to handle validation result
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors:', { errors: errors.array() });
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed to the next middleware or route handler if validation passes
};

module.exports = {
    validateLogin,
    validateRegister,
    handleValidationErrors
};
