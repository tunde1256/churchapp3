const mongoose = require('mongoose');
const Branch = require('../model/branchModel'); // Adjust path as needed
const Financial = require('../model/financialModel');
const logger = require('../logger');  // Import Winston logger


// Function to find a branch by name


exports.addFinancialRecord = async (req, res) => {
    try {
        const { date, branchName, amount, type, description } = req.body;

        if (!date || !branchName || amount == null || !type) {
            logger.warn('Validation failed: missing required fields', { date, branchName, amount, type });
            return res.status(400).json({ message: 'Date, branch name, amount, and type are required' });
        }

        logger.info('Searching for branch with name:', branchName);

        // Find the branch by name
        const branch = await Branch.findOne({ branchName }).exec();
        logger.info('Branch query result:', { branch });

        if (!branch) {
            logger.warn('Branch not found:', branchName);
            return res.status(404).json({ message: 'Branch not found' });
        }

        // Check if branch has an _id
        if (!branch._id) {
            logger.error('Branch does not have a valid ID:', { branch });
            return res.status(500).json({ message: 'Branch does not have a valid ID' });
        }

        // Create and save the new financial record
        const newRecord = new Financial({
            date,
            branch: branch._id, // Store the branch ID
            amount,
            type,
            description
        });

        await newRecord.save();
        logger.info('Financial record added:', { newRecord });

        // Return the created record along with the branch name
        res.status(201).json({
            ...newRecord.toObject(),
            branchName: branch.branchName // Include branch name in the response
        });
    } catch (error) {
        logger.error('Error adding financial record:', error);
        res.status(500).json({ message: 'Server error while adding financial record' });
    }
};

exports.getFinancialReport = async (req, res) => {
    try {
        const { branch, startDate, endDate, page = 1, limit = 10 } = req.query;
        const query = {};

        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        // Validate page and limit values
        if (isNaN(pageNumber) || pageNumber < 1) {
            logger.warn('Invalid page number:', pageNumber);
            return res.status(400).json({ message: 'Invalid page number' });
        }
        if (isNaN(pageSize) || pageSize < 1) {
            logger.warn('Invalid limit value:', pageSize);
            return res.status(400).json({ message: 'Invalid limit value' });
        }

        if (branch) {
            // Ensure branch is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(branch)) {
                logger.warn('Invalid branch ID:', branch);
                return res.status(400).json({ message: 'Invalid branch ID' });
            }
            query.branch = new mongoose.Types.ObjectId(branch);
        }

        if (startDate && endDate) {
            // Ensure valid date format
            if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
                logger.warn('Invalid date format:', { startDate, endDate });
                return res.status(400).json({ message: 'Invalid date format' });
            }
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        logger.info('Query:', query);

        // Count total number of records
        const totalRecords = await Financial.countDocuments(query).exec();
        // Fetch paginated financial records
        const financialRecords = await Financial.find(query)
            .skip((pageNumber - 1) * pageSize) // Skip records
            .limit(pageSize) // Limit records
            .exec();

        logger.info('Financial Records:', { financialRecords });

        res.json({
            totalRecords,
            page: pageNumber,
            totalPages: Math.ceil(totalRecords / pageSize),
            records: financialRecords
        });
    } catch (error) {
        logger.error('Error fetching financial report:', error);
        res.status(500).json({ message: 'Server error while fetching financial report' });
    }
};

exports.updateFinancialRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description } = req.body;

        if (!amount || !description) {
            logger.warn('Validation failed: missing amount or description', { amount, description });
            return res.status(400).json({ message: 'Amount and description are required' });
        }

        const updatedRecord = await Financial.findByIdAndUpdate(id, { amount, description }, { new: true });

        if (!updatedRecord) {
            logger.warn('Financial record not found:', id);
            return res.status(404).json({ message: 'Financial record not found' });
        }

        logger.info('Financial record updated:', { updatedRecord });
        res.json(updatedRecord);
    } catch (error) {
        logger.error('Error updating financial record:', error);
        res.status(500).json({ message: 'Server error while updating financial record' });
    }
};

exports.deleteFinancialRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRecord = await Financial.findByIdAndDelete(id);

        if (!deletedRecord) {
            logger.warn('Financial record not found:', id);
            return res.status(404).json({ message: 'Financial record not found' });
        }

        logger.info('Financial record deleted:', { deletedRecord });
        res.json(deletedRecord);
    } catch (error) {
        logger.error('Error deleting financial record:', error);
        res.status(500).json({ message: 'Server error while deleting financial record' });
    }
};

exports.getFinancialByBranch = async (req, res) => {
    try {
        const { branchName } = req.body;

        const financialRecords = await Financial.findOne({ branchName });
        logger.info('Financial records by branch:', { branchName, financialRecords });

        res.json(financialRecords);
    } catch (error) {
        logger.error('Error fetching financial records by branch:', error);
        res.status(500).json({ message: 'Server error while fetching financial records' });
    }
};

exports.getFinancialByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const financialRecords = await Financial.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } });
        logger.info('Financial records by date range:', { startDate, endDate, financialRecords });

        res.json(financialRecords);
    } catch (error) {
        logger.error('Error fetching financial records by date range:', error);
        res.status(500).json({ message: 'Server error while fetching financial records' });
    }
};

exports.getFinancialByType = async (req, res) => {
    try {
        const { type } = req.query;

        const financialRecords = await Financial.find({ type });
        logger.info('Financial records by type:', { type, financialRecords });

        res.json(financialRecords);
    } catch (error) {
        logger.error('Error fetching financial records by type:', error);
        res.status(500).json({ message: 'Server error while fetching financial records' });
    }
};