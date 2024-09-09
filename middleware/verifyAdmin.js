function verifyAdmin(req, res, next) {
    console.log('verifyAdmin called');
    console.log('Request Admin:', req.user);

    if (req.user && req.user.role === 'admin') {
        console.log('Admin verified:', req.user);
        next();
    } else {
        console.error('Admin verification failed');
        res.status(403).json({ message: 'You do not have permission to access this resource' });
    }
}

module.exports = { verifyAdmin };
