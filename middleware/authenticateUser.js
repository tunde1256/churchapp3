const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const authenticateUser = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Decode the token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await User.findById(decoded.id);

        // If the user does not exist, return an authentication error
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Attach the user to the request object
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        return res.status(500).json({ message: 'Server error while authenticating user' });
    }
};

module.exports = authenticateUser;
