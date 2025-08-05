const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'shopzone-secret-key-2024';

// MongoDB connection
let client;
let db;

async function connectToMongoDB() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }
    
    try {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        db = client.db('ShopZone');
        console.log('Connected to MongoDB Atlas');
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

function getCollection(collectionName) {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db.collection(collectionName);
}

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for now
    credentials: true
}));

// Enhanced JSON parsing with error handling
app.use(express.json({ 
    limit: '50mb',
    verify: (req, res, buf, encoding) => {
        try {
            JSON.parse(buf);
        } catch (e) {
            console.error('❌ JSON Parse Error:', e.message);
            console.error('📦 Received data:', buf.toString());
            res.status(400).json({
                success: false,
                message: 'Invalid JSON format'
            });
            return;
        }
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Global variables for collections
let usersCollection;

// Initialize MongoDB connection and collections
const initializeDatabase = async () => {
    try {
        await connectToMongoDB();
        usersCollection = getCollection('users');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
        return false;
    }
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, email, and password' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertedId, email },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: {
                id: result.insertedId,
                name,
                email,
                role: 'user'
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong!' 
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }

        // Find user
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check if user has a password field
        if (!user.password) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong!' 
        });
    }
});

// Get current user profile
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { ObjectId } = require('mongodb');
        const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
});

// Logout endpoint (optional - just for completeness)
app.post('/api/auth/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'ShopZone API is running with MongoDB Atlas!',
        timestamp: new Date().toISOString(),
        database: 'MongoDB Atlas Connected'
    });
});

// Get all users (admin only - for testing)
app.get('/api/users', async (req, res) => {
    try {
        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
        
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Serve the main HTML file for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
const startServer = async () => {
    try {
        const dbConnected = await initializeDatabase();
        
        if (!dbConnected) {
            console.error('❌ Cannot start server without database connection');
            process.exit(1);
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 ShopZone Server running on http://localhost:${PORT}`);
            console.log('🗄️  Connected to MongoDB Atlas successfully');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
