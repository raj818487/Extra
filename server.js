const express = require('express');
const puppeteer = require('puppeteer');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Enhanced CORS configuration for deployment
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public', {
    maxAge: NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

// Configure multer for file uploads with better error handling
const upload = multer({ 
    dest: 'uploads/',
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/html' || file.originalname.endsWith('.html')) {
            cb(null, true);
        } else {
            cb(new Error('Only HTML files are allowed'), false);
        }
    }
});

// Database setup with better error handling
const dbPath = path.join(__dirname, 'resumes.db');
let db;

try {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
            process.exit(1);
        }
        console.log('Connected to SQLite database successfully');
    });
} catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
}

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            name TEXT NOT NULL,
            title TEXT,
            email TEXT,
            phone TEXT,
            location TEXT,
            linkedin TEXT,
            sections TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(username) REFERENCES users(username)
        )`);
        console.log('Database initialized successfully');
    });
}

// Initialize database on startup
initializeDatabase();

// A4 dimensions in pixels (96 DPI)
const A4_WIDTH = 794; // 8.27 inches * 96 DPI
const A4_HEIGHT = 1123; // 11.69 inches * 96 DPI

// API Routes for Resume Management
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (row) return res.status(409).json({ error: 'Username already exists' });
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
            if (err) return res.status(500).json({ error: 'Failed to register user' });
            res.json({ success: true });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT 1 FROM users WHERE username = ? AND password = ? LIMIT 1', [username, password], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
        } else if (row) {
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.post('/api/resumes', (req, res) => {
    const { username, name, title, email, phone, location, linkedin, sections } = req.body;
    
    const sectionsJson = JSON.stringify(sections);
    
    db.run(
        'INSERT INTO resumes (username, name, title, email, phone, location, linkedin, sections) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [username, name, title, email, phone, location, linkedin, sectionsJson],
        function(err) {
            if (err) {
                console.error('Error saving resume:', err);
                res.status(500).json({ error: 'Failed to save resume' });
            } else {
                res.json({ 
                    id: this.lastID, 
                    message: 'Resume saved successfully',
                    created_at: new Date().toISOString()
                });
            }
        }
    );
});

app.get('/api/resumes', (req, res) => {
    const { username } = req.query;
    db.all('SELECT id, name, title, email, phone, location, linkedin, sections, created_at, updated_at FROM resumes WHERE username = ? ORDER BY updated_at DESC', [username], (err, rows) => {
        if (err) {
            console.error('Error fetching resumes:', err);
            res.status(500).json({ error: 'Failed to fetch resumes' });
        } else {
            // Parse sections JSON for each resume
            const resumes = rows.map(row => ({
                ...row,
                sections: JSON.parse(row.sections || '[]')
            }));
            res.json(resumes);
        }
    });
});

app.get('/api/resumes/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM resumes WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Error fetching resume:', err);
            res.status(500).json({ error: 'Failed to fetch resume' });
        } else if (!row) {
            res.status(404).json({ error: 'Resume not found' });
        } else {
            // Parse sections JSON
            row.sections = JSON.parse(row.sections || '[]');
            res.json(row);
        }
    });
});

app.put('/api/resumes/:id', (req, res) => {
    const { id } = req.params;
    const { name, title, email, phone, location, linkedin, sections } = req.body;
    
    const sectionsJson = JSON.stringify(sections);
    
    db.run(
        'UPDATE resumes SET name = ?, title = ?, email = ?, phone = ?, location = ?, linkedin = ?, sections = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, title, email, phone, location, linkedin, sectionsJson, id],
        function(err) {
            if (err) {
                console.error('Error updating resume:', err);
                res.status(500).json({ error: 'Failed to update resume' });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Resume not found' });
            } else {
                res.json({ 
                    message: 'Resume updated successfully',
                    updated_at: new Date().toISOString()
                });
            }
        }
    );
});

app.delete('/api/resumes/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM resumes WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error deleting resume:', err);
            res.status(500).json({ error: 'Failed to delete resume' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Resume not found' });
        } else {
            res.json({ message: 'Resume deleted successfully' });
        }
    });
});

// Update: Delete all resumes for a user
app.post('/api/resumes/deleteAll', (req, res) => {
    const { username } = req.body;
    db.run('DELETE FROM resumes WHERE username = ?', [username], function(err) {
        if (err) {
            console.error('Error deleting all resumes:', err);
            res.status(500).json({ error: 'Failed to delete all resumes' });
        } else {
            console.log(`All resumes for user ${username} deleted.`);
            res.json({ message: 'All resumes deleted successfully' });
        }
    });
});

// Convert HTML to PDF
app.post('/convert', async (req, res) => {
    try {
        const { html, filename = 'resume.pdf' } = req.body;
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set A4 page size
        await page.setViewport({
            width: A4_WIDTH,
            height: A4_HEIGHT
        });
        
        // Set content and wait for it to load
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Generate PDF with A4 settings and minimal margins
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '5mm',
                right: '5mm',
                bottom: '5mm',
                left: '5mm'
            }
        });
        
        await browser.close();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdf);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// Upload HTML file and convert to PDF
app.post('/upload', upload.single('htmlFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const htmlContent = fs.readFileSync(req.file.path, 'utf8');
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set A4 page size
        await page.setViewport({
            width: A4_WIDTH,
            height: A4_HEIGHT
        });
        
        // Set content and wait for it to load
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        // Generate PDF with A4 settings and minimal margins
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '5mm',
                right: '5mm',
                bottom: '5mm',
                left: '5mm'
            }
        });
        
        await browser.close();
        
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        
        const filename = req.file.originalname.replace('.html', '.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdf);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ error: 'File upload error: ' + err.message });
    }
    
    res.status(500).json({ 
        error: NODE_ENV === 'production' ? 'Internal server error' : err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server with better error handling
const server = app.listen(PORT, () => {
    console.log('🚀 Resume Maker Server Started Successfully!');
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`💾 Database: ${dbPath}`);
    console.log('✨ HTML to PDF converter ready!');
    console.log('📝 Resume management system active');
});

// Enhanced graceful shutdown
const gracefulShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('✅ HTTP server closed');
        
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('❌ Error closing database:', err);
                } else {
                    console.log('✅ Database connection closed');
                }
                console.log('👋 Server shutdown complete');
                process.exit(0);
            });
        } else {
            console.log('👋 Server shutdown complete');
            process.exit(0);
        }
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
}); 