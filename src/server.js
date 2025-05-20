const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload size limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads (as backup for direct base64 handling)
const storage = multer.memoryStorage(); // Store in memory for conversion to base64
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB file size limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Import routes
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');

// Use routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);

// Route for image upload (if needed as a separate endpoint)
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert file to base64
        const fileBase64 = req.file.buffer.toString('base64');
        const fileType = req.file.mimetype;
        const dataUrl = `data:${fileType};base64,${fileBase64}`;

        res.status(200).json({
            message: 'File uploaded successfully',
            imageData: dataUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

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
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    }); 