const logger = require('../logger');  // Import Winston logger
const Branch = require('../model/branchModel');
const mongoose = require('mongoose');

// Get all branches
exports.getBranches = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;

        if (page < 1 || limit < 1) {
            logger.warn('Invalid pagination parameters');
            return res.status(400).json({ message: 'Page and limit must be positive integers' });
        }

        const skip = (page - 1) * limit;

        const branches = await Branch.find({})
            .skip(skip)
            .limit(limit);

        const totalBranches = await Branch.countDocuments({});

        logger.info('Fetched branches', { page, limit, totalBranches });
        res.json({
            totalBranches,
            page,
            limit,
            totalPages: Math.ceil(totalBranches / limit),
            branches
        });
    } catch (error) {
        logger.error('Error fetching branches', error);
        res.status(500).json({ message: 'Server error while fetching branches' });
    }
};

// Get a branch by ID
exports.getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            logger.warn(`Branch not found with ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Branch not found' });
        }
        logger.info('Fetched branch by ID', { branchId: req.params.id });
        res.json(branch);
    } catch (error) {
        logger.error('Error fetching branch by ID', error);
        res.status(500).json({ message: 'Server error while fetching branch' });
    }
};

// Add a new branch
exports.addBranch = async (req, res) => {
    try {
        logger.info('Adding new branch', { userId: req.user?.id });

        const { branchName, address, city, state, country, leadPastor, contactNumber, email, phone } = req.body;

        if (!branchName || !address || !city || !phone || !state || !country || !email) {
            logger.warn('Missing required fields');
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const createdBy = req.user ? req.user._id : null;

        if (!createdBy) {
            logger.warn('User information is missing');
            return res.status(400).json({ message: 'User information is missing' });
        }

        const existingBranch = await Branch.findOne({ branchName });
        if (existingBranch) {
            logger.warn('Branch with this name already exists', { branchName });
            return res.status(400).json({ message: 'Branch with this name already exists' });
        }

        const newBranch = new Branch({
            branchName,
            address,
            city,
            state,
            country,
            leadPastor,
            contactNumber,
            email,
            phone,
            createdBy,
        });

        await newBranch.save();

        logger.info('Branch added successfully', { branchId: newBranch._id });
        res.status(201).json(newBranch);
    } catch (error) {
        logger.error('Error adding new branch', error);
        res.status(500).json({ message: 'Server error while adding branch' });
    }
};

// Update an existing branch
exports.updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { branchName, address, city, state, country, leadPastor, contactNumber, email } = req.body;

        if (!branchName || !address || !city || !country) {
            logger.warn('Missing required fields');
            return res.status(400).json({ message: 'Branch name, address, city, and country are required' });
        }

        logger.info('Updating branch', { branchId: id, updateData: req.body });

        const updatedBranch = await Branch.findByIdAndUpdate(
            id,
            { branchName, address, city, state, country, leadPastor, contactNumber, email },
            { new: true }
        );

        if (!updatedBranch) {
            logger.warn(`Branch not found with ID: ${id}`);
            return res.status(404).json({ message: 'Branch not found' });
        }

        logger.info('Branch updated successfully', { branchId: updatedBranch._id });
        res.json(updatedBranch);
    } catch (error) {
        logger.error('Error updating branch', error);
        res.status(500).json({ message: 'Server error while updating branch' });
    }
};

// Delete a branch
exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBranch = await Branch.findByIdAndDelete(id);

        if (!deletedBranch) {
            logger.warn(`Branch not found with ID: ${id}`);
            return res.status(404).json({ message: 'Branch not found' });
        }

        logger.info('Branch deleted successfully', { branchId: id });
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        logger.error('Error deleting branch', error);
        res.status(500).json({ message: 'Server error while deleting branch' });
    }
};