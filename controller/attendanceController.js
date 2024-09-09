const logger = require('../logger');  // Import Winston logger
const Attendance = require('../model/attendanceModel');
const User = require('../model/userModel');
const mongoose = require('mongoose');
const Branch = require('../model/branchModel');

exports.addAttendance = async (req, res) => {
    try {
        const { date, branch, attendees, maleCount, femaleCount, childrenCount } = req.body;

        // Validate required fields
        if (!date || !branch || !attendees || typeof maleCount !== 'number' || typeof femaleCount !== 'number' || typeof childrenCount !== 'number') {
            logger.warn('Missing required fields');
            return res.status(400).json({ message: 'Date, branch, attendees, maleCount, femaleCount, and childrenCount are required' });
        }

        // Validate branch
        const branchExists = await Branch.findById(branch);
        if (!branchExists) {
            logger.warn(`Branch not found: ${branch}`);
            return res.status(404).json({ message: 'Branch not found' });
        }

        // Validate attendees
        const users = await User.find({ _id: { $in: attendees } });
        if (users.length !== attendees.length) {
            const invalidAttendees = attendees.filter(id => !users.map(user => user._id.toString()).includes(id));
            logger.warn(`Invalid attendee IDs: ${invalidAttendees.join(', ')}`);
            return res.status(400).json({ message: `Invalid attendee IDs: ${invalidAttendees.join(', ')}` });
        }

        // Create new attendance record
        const newAttendance = new Attendance({
            date,
            branch,
            attendees,
            maleCount,
            femaleCount,
            childrenCount
        });

        await newAttendance.save();

        logger.info('Attendance record added successfully', { attendanceId: newAttendance._id });
        res.status(201).json(newAttendance);
    } catch (error) {
        logger.error('Error adding attendance', error);
        res.status(500).json({ message: 'Server error while adding attendance' });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            logger.warn('Invalid pagination parameters');
            return res.status(400).json({ message: 'Page and limit must be positive integers' });
        }

        const skip = (page - 1) * limit;

        const attendance = await Attendance.find()
            .skip(skip)
            .limit(limit)
            .populate('branch', 'name');

        const totalRecords = await Attendance.countDocuments();

        logger.info('Fetched attendance records', { page, limit, totalRecords });
        res.json({
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            data: attendance
        });
    } catch (error) {
        logger.error('Error fetching attendance', error);
        res.status(500).json({ message: 'Server error while fetching attendance' });
    }
};

// Get attendance by date range
exports.getAttendanceByDateRange = async (req, res) => {
    try {
        const { startDate, endDate, page = 1, limit = 10 } = req.query;

        if (!startDate || !endDate) {
            logger.warn('Start date and end date are required');
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        if (isNaN(startDateObj) || isNaN(endDateObj)) {
            logger.warn('Invalid date format for start and end dates');
            return res.status(400).json({ message: 'Invalid date format for start and end dates' });
        }

        if (startDateObj > endDateObj) {
            logger.warn('Start date cannot be after end date');
            return res.status(400).json({ message: 'Start date cannot be after end date' });
        }

        const skip = (page - 1) * limit;

        const attendance = await Attendance.find({ date: { $gte: startDateObj, $lte: endDateObj } })
            .skip(skip)
            .limit(Number(limit))
            .populate('branch', 'name')
            .populate('attendees', 'name');

        const totalRecords = await Attendance.countDocuments({ date: { $gte: startDateObj, $lte: endDateObj } });
        const totalPages = Math.ceil(totalRecords / limit);

        logger.info('Fetched attendance records by date range', { startDate, endDate, page, totalRecords });
        res.json({
            attendance,
            currentPage: page,
            totalPages,
            totalRecords
        });
    } catch (error) {
        logger.error('Error fetching attendance by date range', error);
        res.status(500).json({ message: 'Server error while fetching attendance by date range' });
    }
};

// Get attendance by branch name
exports.getAttendanceByBranchName = async (req, res) => {
    try {
        const { branchName } = req.query;

        if (!branchName) {
            logger.warn('Branch name is required');
            return res.status(400).json({ message: 'Branch name is required' });
        }

        logger.info(`Searching for branch with name: "${branchName}"`);

        const branch = await Branch.findOne({ branchName }).exec();
        logger.info('Branch query result:', branch);

        if (!branch) {
            logger.warn(`Branch not found: ${branchName}`);
            return res.status(404).json({ message: 'Branch not found' });
        }

        const attendance = await Attendance.find({ branch: branch._id })
            .populate('branch', 'branchName')
            .populate('attendees', 'name');

        if (attendance.length === 0) {
            logger.warn(`No attendance records found for branch: ${branchName}`);
            return res.status(404).json({ message: 'No attendance records found for this branch' });
        }

        logger.info(`Fetched attendance records for branch: ${branchName}`);
        res.json(attendance);
    } catch (error) {
        logger.error('Error fetching attendance by branch', error);
        res.status(500).json({ message: 'Server error while fetching attendance by branch' });
    }
};