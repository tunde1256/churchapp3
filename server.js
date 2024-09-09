const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const db = require('./db/db');
const adminRouter = require('./router/adminRouter');
const userRouter = require('./router/userRoutes');
const branchRouter = require('./router/branchRouter');
const notificationRouter = require('./router/notificationRouter');
const eventRouter = require('./router/eventRouter');
const financialRouter = require('./router/financialRouter');
const attendanceRouter = require('./router/attendanceRouter');
const {swaggerUi, swaggerSpec} = require('./swagger');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
db();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server only after the database connection is successful
app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});

// Define routes
app.use('/api/admins', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/branches', branchRouter);
app.use('/api', notificationRouter);
app.use('/api', eventRouter);
app.use('/api', financialRouter);
app.use('/api', attendanceRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ message: 'Something went wrong!' });
});
