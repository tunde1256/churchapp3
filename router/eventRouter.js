const  express = require('express');
const router = express.Router();
const eventController = require('../controller/eventController');
const { verifyAdmin } = require('../middleware/verifyAdmin');
const { authenticateToken } = require('../middleware/jwt');
const upload = require('../middleware/multer');


router.get('/events/location',  eventController.getEventsByLocation);
router.post('/events', upload.single('image'), eventController.addEvent);
router.put('/events/:id', upload.single('image'), eventController.updateEvent);

router.get('/event/:id',  eventController.getEventById);
router.get('/events/getAll',  eventController.getEvents);
router.delete('/event/:id',  eventController.deleteEvent);
router.get('/events/date-range',  eventController.getEventsByDateRange);
router.get('/events/organizer',  eventController.getEventsByOrganizer);
router.get('/events/location',  eventController.getEventsByLocation);
router.get('/events/branch',  eventController.getEventByBranch);

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Operations related to events
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Add a new event with an optional image
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Charity Gala"
 *               description:
 *                 type: string
 *                 example: "A charity event for local community support"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-30"
 *               branchName:
 *                 type: string
 *                 example: "Main Branch"
 *               organizer:
 *                 type: string
 *                 example: "John Doe"
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Jane Smith", "Michael Brown"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                 branchName:
 *                   type: string
 *                 organizer:
 *                   type: string
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: string
 *                 image:
 *                   type: string
 *       400:
 *         description: Bad request, missing or invalid fields
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event with an optional new image
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Charity Gala"
 *               description:
 *                 type: string
 *                 example: "Updated description for charity event"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-09-01"
 *               location:
 *                 type: string
 *                 example: "Grand Hall"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                 location:
 *                   type: string
 *                 organizer:
 *                   type: string
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: string
 *                 image:
 *                   type: string
 *       400:
 *         description: Bad request, missing or invalid fields
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Successful response with event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                 location:
 *                   type: string
 *                 organizer:
 *                   type: string
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: string
 *                 image:
 *                   type: string
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/getAll:
 *   get:
 *     summary: Get all events with optional filters
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of events per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "date"
 *         description: Field to sort events by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           example: "asc"
 *         description: Sort order (asc or desc)
 *     responses:
 *       200:
 *         description: Successful response with paginated events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   organizer:
 *                     type: string
 *                   attendees:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       400:
 *         description: Bad request, invalid query parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/date-range:
 *   get:
 *     summary: Get events within a date range
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for filtering events
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for filtering events
 *     responses:
 *       200:
 *         description: Successful response with events within the date range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   organizer:
 *                     type: string
 *                   attendees:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       400:
 *         description: Bad request, invalid date range
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/location:
 *   get:
 *     summary: Get events by location
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         required: true
 *         description: Location to filter events
 *     responses:
 *       200:
 *         description: Successful response with events at the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   organizer:
 *                     type: string
 *                   attendees:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       400:
 *         description: Bad request, location parameter missing
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/branch:
 *   get:
 *     summary: Get events by branch name
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: branchName
 *         schema:
 *           type: string
 *         required: true
 *         description: Branch name to filter events
 *     responses:
 *       200:
 *         description: Successful response with events for the specified branch
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   organizer:
 *                     type: string
 *                   attendees:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       400:
 *         description: Bad request, branch name parameter missing
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /events/organizer:
 *   get:
 *     summary: Get events by organizer
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: organizerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Organizer ID to filter events
 *     responses:
 *       200:
 *         description: Successful response with events organized by the specified organizer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                   location:
 *                     type: string
 *                   organizer:
 *                     type: string
 *                   attendees:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       400:
 *         description: Bad request, organizer ID parameter missing
 *       404:
 *         description: Organizer not found
 *       500:
 *         description: Server error
 */


module.exports = router;
