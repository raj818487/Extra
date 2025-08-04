const express = require('express');
const puppeteer = require('puppeteer');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Database setup
const dbPath = path.join(__dirname, 'resumes.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
    db.serialize(() => {
        // Create resumes table
        db.run(`CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT,
            email TEXT,
            phone TEXT,
            location TEXT,
            linkedin TEXT,
            sections TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
app.post('/api/resumes', (req, res) => {
    const { name, title, email, phone, location, linkedin, sections } = req.body;
    
    const sectionsJson = JSON.stringify(sections);
    
    db.run(
        'INSERT INTO resumes (name, title, email, phone, location, linkedin, sections) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, title, email, phone, location, linkedin, sectionsJson],
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
    db.all('SELECT id, name, title, email, phone, location, linkedin, sections, created_at, updated_at FROM resumes ORDER BY updated_at DESC', (err, rows) => {
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
        
        // Generate PDF with A4 settings
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
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
        
        // Generate PDF with A4 settings
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('HTML to PDF converter ready!');
    console.log(`Database file: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
}); 