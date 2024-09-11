const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/jwt');
const { verifyAdmin } = require('../middleware/verifyAdmin');
const logger = require('../logger');
const { default: mongoose } = require('mongoose');
const authenticateUser = require('../middleware/authenticateUser');
const jwt = require('jsonwebtoken');

// Register user
exports.registerUser = async (req, res) => {
    try {
        const { username, email, department, churchbranch, phoneNumber, address, country, password, confirmPassword, role } = req.body;

        if (!username || !email || !password || !role) {
            logger.warn('Validation failed: missing fields', { username, email, password, role });
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn('Email already exists:', email);
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (password !== confirmPassword) {
            logger.warn('Passwords do not match');
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, department, churchbranch, phoneNumber, address, country, password: hashedPassword, role });
        await newUser.save();

        const token = generateToken(newUser);
        logger.info('User registered successfully', { userId: newUser._id, email: newUser.email });
        res.status(201).json({ message: 'User registered successfully', newUser, token });
    } catch (e) {
        logger.error('Error during registration:', e);
        return res.status(500).json({ message: e.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logger.warn('Validation failed: missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            logger.warn('Invalid email or password:', { email });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.warn('Invalid email or password:', { email });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token upon successful authentication
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        logger.info('User logged in successfully', { userId: user._id, email: user.email });
        res.json({ token });
    } catch (error) {
        logger.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error while logging in user' });
    }
};
// Update existing user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password, confirmPassword, role } = req.body;

        if (!username || !role) {
            logger.warn('Validation failed: missing username or role', { username, role });
            return res.status(400).json({ message: 'Username and role are required' });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) {
            logger.warn('User not found:', id);
            return res.status(404).json({ message: 'User not found' });
        }

        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                logger.warn('Passwords do not match');
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            existingUser.password = hashedPassword;
        }

        existingUser.username = username;
        existingUser.role = role;

        await existingUser.save();

        logger.info('User updated successfully', { userId: existingUser._id });
        res.json({ message: 'User updated successfully', user: existingUser });
    } catch (e) {
        logger.error('Error during update:', e);
        return res.status(500).json({ message: e.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            logger.warn('User not found:', id);
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info('User deleted successfully', { userId: deletedUser._id });
        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (e) {
        logger.error('Error during deletion:', e);
        return res.status(500).json({ message: e.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id.trim())) {
            logger.warn('Invalid ID format:', id);
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const user = await User.findById(id.trim());
        if (!user) {
            logger.warn('User not found for ID:', id);
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info('Fetched user by ID', { userId: user._id });
        res.json(user);
    } catch (e) {
        logger.error('Error fetching user by ID:', e);
        return res.status(500).json({ message: e.message });
    }
};

// Get all users with pagination and search
exports.getUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
            logger.warn('Invalid page or limit values', { pageNumber, limitNumber });
            return res.status(400).json({ message: 'Invalid page or limit values' });
        }

        const skip = (pageNumber - 1) * limitNumber;

        const users = await User.find().skip(skip).limit(limitNumber);
        const totalUsers = await User.countDocuments();

        logger.info('Users fetched successfully', { page: pageNumber, limit: limitNumber, totalUsers });
        res.json({
            page: pageNumber,
            limit: limitNumber,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / limitNumber),
            users
        });
    } catch (e) {
        logger.error('Error fetching users:', e);
        res.status(500).json({ message: e.message });
    }
};
