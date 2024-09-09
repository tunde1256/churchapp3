const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
    console.log('authenticateAdmin middleware called');
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.Admin = { _id: decoded._id, role: decoded.role }; // Ensure _id is set
        console.log('Admin authenticated:', req.Admin);
        next();
    } catch (error) {
        console.log('Invalid token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticateAdmin };
