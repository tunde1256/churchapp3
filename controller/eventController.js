const Event = require('../model/eventModel')
const User = require('../model/userModel');
const upload = require('../middleware/multer');
const Branch = require('../model/branchModel'); // Ensure the correct 
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2; // Ensure Cloudinary is required
const logger = require('../logger');







// Get all events
// Get all events
exports.getEvents = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'date', order = 'asc' } = req.query;

        const sortFields = ['date', 'title', 'location'];
        if (!sortFields.includes(sort)) {
            logger.warn('Invalid sort field requested', { sort });
            return res.status(400).json({ message: 'Invalid sort field' });
        }

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
            logger.warn('Invalid pagination parameters', { pageNumber, pageSize });
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const events = await Event.find({})
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        logger.info('Fetched events successfully', { pageNumber, pageSize, sort, order });
        res.json(events);
    } catch (error) {
        logger.error('Error fetching events', { error: error.message });
        res.status(500).json({ message: 'Server error while fetching events' });
    }
};

// Get an event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            logger.warn('Event not found', { id: req.params.id });
            return res.status(404).json({ message: 'Event not found' });
        }
        logger.info('Fetched event by ID', { id: req.params.id });
        res.json(event);
    } catch (error) {
        logger.error('Error fetching event by ID', { error: error.message });
        res.status(500).json({ message: 'Server error while fetching event' });
    }
};

// Add a new event
exports.addEvent = async (req, res) => {
    try {
        const { title, description, date, location, organizer, attendees, branchName } = req.body;
        const imageFile = req.file;

        let imageUrl;
        if (imageFile) {
            try {
                logger.info('Image file detected', { imageFile: imageFile.path });
                const result = await cloudinary.uploader.upload(imageFile.path);
                imageUrl = result.secure_url;
                logger.info('Image uploaded to Cloudinary', { imageUrl });
            } catch (cloudinaryError) {
                logger.error('Error uploading image to Cloudinary', { error: cloudinaryError.message });
                return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
            }
        } else {
            logger.info('No image file provided.');
        }

        logger.info('Location value before querying Branch', { location });

        let branch;
        if (mongoose.Types.ObjectId.isValid(location)) {
            branch = await Branch.findById(location);
        } else {
            branch = await Branch.findOne({ branchName: location });
        }
        logger.info('Branch found', { branch });

        if (!branch) {
            logger.warn('Branch not found', { location });
            return res.status(404).json({ message: 'Branch not found' });
        }

        const user = await User.findById(organizer);
        logger.info('Organizer found', { user });

        if (!user) {
            logger.warn('Organizer not found', { organizer });
            return res.status(404).json({ message: 'Organizer not found' });
        }

        const attendeesArray = attendees ? attendees.split(',').map(id => id.trim()) : [];
        const attendeesObjectIdArray = attendeesArray.filter(id => {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                logger.error('Invalid ObjectId', { id });
                return false;
            }
            return true;
        }).map(id => new mongoose.Types.ObjectId(id));

        if (attendeesObjectIdArray.length !== attendeesArray.length) {
            return res.status(400).json({ message: 'One or more attendee IDs are invalid' });
        }

        logger.info('Attendees ObjectId Array', { attendeesObjectIdArray });

        const event = new Event({
            title,
            description,
            date,
            location: branch._id,
            organizer: user._id,
            attendees: attendeesObjectIdArray,
            image: imageUrl,
            branchName
        });

        const savedEvent = await event.save();
        logger.info('Event saved', { savedEvent });

        res.status(201).json({ message: 'Event created successfully', event: savedEvent });
    } catch (error) {
        logger.error('Error adding event', { error: error.message });
        res.status(500).json({ message: 'Server error while adding event' });
    }
};

// Update an existing event
exports.updateEvent = [
    upload.single('image'),
    async (req, res) => {
        try {
            logger.info('Update Event Request Body', { body: req.body });
            logger.info('Uploaded File', { file: req.file });

            const { id } = req.params;
            const { title, description, date, location } = req.body;
            const image = req.file ? req.file.path : null;

            if (!title || !description || !date || !location) {
                logger.warn('Validation failed', { title, description, date, location });
                return res.status(400).json({ message: 'Title, description, date, and location are required' });
            }

            const existingEvent = await Event.findById(id);
            if (!existingEvent) {
                logger.warn('Event not found', { id });
                return res.status(404).json({ message: 'Event not found' });
            }

            const updatedEventData = {
                title,
                description,
                date,
                location,
                image: image || existingEvent.image
            };

            const updatedEvent = await Event.findByIdAndUpdate(id, updatedEventData, { new: true });
            if (!updatedEvent) {
                logger.warn('Event not found after update', { id });
                return res.status(404).json({ message: 'Event not found after update' });
            }

            logger.info('Event updated successfully', { updatedEvent });
            res.json(updatedEvent);
        } catch (error) {
            logger.error('Error updating event', { error: error.message });
            res.status(500).json({ message: 'Server error while updating event', error: error.message });
        }
    }
];

// Delete an event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            logger.warn('Event not found', { id });
            return res.status(404).json({ message: 'Event not found' });
        }

        logger.info('Event deleted successfully', { id });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        logger.error('Error deleting event', { error: error.message });
        res.status(500).json({ message: 'Server error while deleting event' });
    }
};

// Get events by date range
exports.getEventsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            logger.warn('Start and end dates are required', { startDate, endDate });
            return res.status(400).json({ message: 'Start and end dates are required' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        logger.info('Parsed Start Date', { start });
        logger.info('Parsed End Date', { end });

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            logger.warn('Invalid date format', { startDate, endDate });
            return res.status(400).json({ message: 'Invalid date format' });
        }

        const events = await Event.find({
            date: { $gte: start, $lte: end }
        });

        logger.info('Number of Events Found', { count: events.length });
        res.json(events);
    } catch (error) {
        logger.error('Error fetching events by date range', { error: error.message });
        res.status(500).json({ message: 'Server error while fetching events' });
    }
};

// Get events by location
exports.getEventsByLocation = async (req, res) => {
    try {
        const { location } = req.query;

        if (!location) {
            logger.warn('Location is required', { location });
            return res.status(400).json({ message: 'Location is required' });
        }

        const events = await Event.find({ location });

        logger.info('Fetched events by location', { location, count: events.length });
        res.json(events);
    } catch (error) {
        logger.error('Error fetching events by location', { error: error.message });
        res.status(500).json({ message: 'Server error while fetching events' });
    }
};

// Get events by branch
exports.getEventByBranch = async (req, res) => {
    try {
        const { branchName } = req.body;

        const getBranchName = await Event.find({ branchName });
        logger.info('Fetched events by branch name', { branchName, count: getBranchName.length });
        res.json(getBranchName);
    } catch (error) {
        logger.error('Error fetching events by branch name', { error: error.message });
        res.status(500).json({ message: 'Server error while fetching events' });
    }
};

// Get events by organizer
exports.getEventsByOrganizer = async (req, res) => {
    try {
        const { organizerId } = req.query;

        if (!organizerId) {
            logger.warn('Organizer ID is required', { organizerId });
            return res.status(400).json({ message: 'Organizer ID is required' });
        }

        const organizer = await User.findById(organizerId);
        if (!organizer) {
            logger.warn('Organizer not found', { organizerId });
            return res.status(404).json({ message: 'Organizer not found' });
        }

        const events = await Event.find({ organizer: organizer._id }).populate('organizer', 'name');
        logger.info('Fetched events by organizer', { organizerId, count: events.length });
        res.json(events);
    } catch (error) {
        logger.error('Error fetching events by organizer', { error: error.message });
        res.status(500).json({ message: 'Server error while fetching events' });
    }
};
