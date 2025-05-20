const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');

// Use routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Argo Quiz API is running');
});

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start server
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    }); 