# 📄 Dynamic HTML to PDF Resume Maker

A professional resume builder that converts HTML resumes to PDF format with A4 page sizing. Features dynamic sections, real-time preview, and SQLite database storage.

## ✨ Features

### 🎯 Core Functionality
- **HTML to PDF Conversion**: Convert HTML resumes to professional PDF format
- **A4 Page Formatting**: Optimized for standard A4 paper size
- **Dynamic Sections**: Create, edit, and reorder custom resume sections
- **Real-time Preview**: See changes instantly as you type
- **Drag & Drop**: Reorder sections by dragging them

### 💾 Data Persistence
- **SQLite Database**: Server-side storage for all resume data
- **Auto-save**: Automatic saving every 30 seconds and after changes
- **Multiple Resumes**: Save and manage multiple resume versions
- **Import/Export**: Backup and restore resume data as JSON files
- **Cross-device**: Access resumes from any device

### 👁️ Preview Features
- **A4 Preview Mode**: See how your resume will look on paper
- **Print Preview**: Test printing directly from the browser
- **Refresh Preview**: Manual preview updates with visual feedback
- **Responsive Design**: Works on desktop and mobile devices

### 📁 File Management
- **HTML Upload**: Upload existing HTML files for PDF conversion
- **PDF Download**: Download generated PDFs with custom filenames
- **File Validation**: Secure file handling with error checking

## 🚀 Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the server**:
   ```bash
   npm start
   ```
4. **Open your browser** and go to `http://localhost:3000`

## 📊 Database Information

The application uses SQLite database for storing resume data:

- **Database File**: `resumes.db` (created automatically in project root)
- **Table**: `resumes` (stores all resume information)
- **Auto-initialization**: Database is created when server starts

### Database Structure
```sql
CREATE TABLE resumes (
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
);
```

### Database Management
- **Check database info**: `node database-info.js`
- **Backup database**: Copy `resumes.db` file
- **Reset database**: Delete `resumes.db` file (will be recreated)

## 🎯 Usage

### Creating a Resume
1. **Fill in personal information** (name, title, contact details)
2. **Add sections** using the dynamic section builder
3. **Preview in real-time** as you make changes
4. **Save your resume** to the database
5. **Generate PDF** for download

### Managing Resumes
- **Save**: Click "💾 Save Resume" to store in database
- **Load**: Click "📂 Load Resume" to restore from database
- **Export**: Click "📤 Export Data" to download as JSON
- **Import**: Click "📥 Import Data" to restore from JSON file

### Dynamic Sections
- **Add sections**: Choose section type and add content
- **Edit sections**: Click "Edit" on any section
- **Reorder sections**: Drag and drop to change order
- **Remove sections**: Click "Remove" to delete sections

### Preview Options
- **Normal Preview**: Standard browser preview
- **A4 Preview**: Simulates A4 paper size
- **Print Preview**: Opens print-friendly version
- **Refresh**: Manual preview update

## 🔧 API Endpoints

### Resume Management
- `POST /api/resumes` - Save new resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### PDF Generation
- `POST /convert` - Convert HTML to PDF
- `POST /upload` - Upload HTML file and convert to PDF

## 📁 Project Structure

```
resume-maker/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── resumes.db            # SQLite database (auto-created)
├── database-info.js      # Database information script
├── public/
│   └── index.html        # Main application interface
├── uploads/              # Temporary file uploads
├── sample-resume.html    # Example HTML resume
└── README.md            # This file
```

## 🛠️ Technical Details

### Backend Technologies
- **Node.js**: Server runtime
- **Express**: Web framework
- **Puppeteer**: HTML to PDF conversion
- **SQLite3**: Database storage
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### Frontend Technologies
- **Vanilla JavaScript**: No frameworks required
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients
- **Local Storage**: Client-side caching
- **Drag & Drop API**: Section reordering

### PDF Generation
- **A4 Format**: 210mm × 297mm page size
- **Margins**: 20mm on all sides
- **Print Background**: Colors and images preserved
- **High Quality**: Professional print-ready output

## 🔒 Security Features

- **File Validation**: Secure file upload handling
- **SQL Injection Protection**: Parameterized queries
- **Error Handling**: Graceful error management
- **Input Sanitization**: Clean data processing

## 🚀 Deployment

### Local Development
```bash
npm install
npm start
```

### Production Deployment
1. **Install dependencies**: `npm install --production`
2. **Set environment variables** (optional):
   - `PORT`: Server port (default: 3000)
3. **Start server**: `npm start`
4. **Access application**: `http://your-domain:3000`

### Database Backup
- **Automatic**: Database is automatically created
- **Manual**: Copy `resumes.db` file for backup
- **Restore**: Replace `resumes.db` file to restore

## 🐛 Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT environment variable
2. **PDF generation fails**: Check Puppeteer installation
3. **Database errors**: Delete `resumes.db` to reset
4. **File upload issues**: Check `uploads/` directory permissions

### Error Messages
- **"Failed to generate PDF"**: Check HTML content validity
- **"Database error"**: Restart server to reinitialize database
- **"File upload error"**: Check file size and format

## 📈 Performance

- **Fast PDF Generation**: Optimized Puppeteer settings
- **Efficient Database**: SQLite for fast queries
- **Auto-save**: Minimal performance impact
- **Responsive UI**: Works on all devices

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Puppeteer**: For reliable HTML to PDF conversion
- **SQLite**: For lightweight database storage
- **Express**: For robust web server functionality

---

**Happy Resume Building! 🎯** 