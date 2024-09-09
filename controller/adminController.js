require('dotenv').config();
const Admin = require('../model/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger'); // Ensure this path is correct
const { generateToken } = require('../middleware/jwt');
// Register new admin
exports.RegisterAdmin = async (req, res) => {
    try {
        const { username, email, password, confirmPassword, role } = req.body;
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            logger.warn('Registration attempt failed: Email already exists', { email });
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (password !== confirmPassword) {
            logger.warn('Registration attempt failed: Passwords do not match', { email });
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ username, email, password: hashedPassword, role });
        await newAdmin.save();

        logger.info('Admin registered successfully', { email });
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (e) {
        logger.error('Error registering admin:', e);
        res.status(400).json({ message: e.message });
    }
};

// Login admin

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            logger.warn('Login attempt failed: Admin not found', { email });
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            logger.warn('Login attempt failed: Invalid credentials', { email });
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        // Generate JWT token
        // const token = generateToken(admin);

        logger.info('Admin login successful', { email });
        res.json({ message: 'Login successful', token });
    } catch (e) {
        logger.error('Error logging in admin:', e);
        res.status(500).json({ message: e.message });
    }
};

// Update admin details
exports.updateAdmin = async (req, res) => {
    const { email, password, role } = req.body;

    // Ensure req.user is defined
    if (!req.user || !req.user.id) {
        logger.warn('Update attempt failed: User ID not found in request', { headers: req.headers });
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if the role is attempting to be changed to 'admin'
    if (role && role !== 'admin') {
        logger.warn('Update attempt failed: Not authorized to update admin role', { id: req.user.id });
        return res.status(403).json({ message: 'Not authorized to update admin role' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.user.id, 
            { email, password: hashedPassword }, 
            { new: true }
        );

        if (!updatedAdmin) {
            logger.warn('Update attempt failed: Admin not found', { id: req.user.id });
            return res.status(404).json({ message: 'Admin not found' });
        }

        logger.info('Admin updated successfully', { id: req.user.id });
        res.json(updatedAdmin);
    } catch (e) {
        logger.error('Error updating admin:', { error: e.message, stack: e.stack });
        res.status(400).json({ message: e.message });
    }
};


// Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByIdAndDelete(id);
        if (!admin) {
            logger.warn('Delete attempt failed: Admin not found', { id });
            return res.status(404).json({ message: 'Admin not found' });
        }

        logger.info('Admin deleted successfully', { id });
        res.json({ message: 'Admin deleted successfully' });
    } catch (e) {
        logger.error('Error deleting admin:', e);
        res.status(400).json({ message: e.message });
    }
};

// Get all admins
exports.getAdmins = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10

    try {
        // Convert page and limit to integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Validate page and limit values
        if (isNaN(pageNumber) || pageNumber < 1 || isNaN(limitNumber) || limitNumber < 1) {
            return res.status(400).json({ message: 'Invalid page or limit values' });
        }

        // Calculate skip and limit for pagination
        const skip = (pageNumber - 1) * limitNumber;

        // Fetch paginated results
        const admins = await Admin.find().skip(skip).limit(limitNumber);
        const totalAdmins = await Admin.countDocuments(); // Get total count for pagination info

        logger.info('Fetched admins successfully', { page: pageNumber, limit: limitNumber });

        res.json({
            page: pageNumber,
            limit: limitNumber,
            total: totalAdmins,
            totalPages: Math.ceil(totalAdmins / limitNumber),
            admins
        });
    } catch (e) {
        logger.error('Error fetching admins:', e);
        res.status(500).json({ message: e.message });
    }
};

// Get admin by id
exports.getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id);
        if (!admin) {
            logger.warn('Fetch attempt failed: Admin not found', { id });
            return res.status(404).json({ message: 'Admin not found' });
        }
        logger.info('Fetched admin successfully', { id });
        res.json(admin);
    } catch (e) {
        logger.error('Error fetching admin by ID:', e);
        res.status(500).json({ message: e.message });
    }
};

