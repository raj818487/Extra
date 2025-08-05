# 🎨 Professional Resume Maker

A modern, professional HTML to PDF Resume Maker with a beautiful UI, database support, and deployment-ready configuration.

## ✨ Features

### 🎯 Core Features
- **Professional Resume Creation** - Create stunning resumes with multiple templates
- **Real-time Preview** - See changes instantly as you type
- **PDF Export** - Generate high-quality PDF resumes
- **Multiple Templates** - Choose from various professional templates
- **Drag & Drop Sections** - Reorder resume sections easily
- **User Authentication** - Secure login and registration system
- **Database Storage** - Save and manage multiple resumes
- **File Upload** - Upload existing HTML files for conversion

### 🎨 UI/UX Features
- **Modern Design** - Professional, clean, and attractive interface
- **Responsive Layout** - Works perfectly on all devices
- **Smooth Animations** - Enhanced user experience with CSS animations
- **Professional Color Scheme** - Carefully chosen colors for business appeal
- **Typography** - Modern fonts and proper text hierarchy
- **Interactive Elements** - Hover effects and visual feedback

### 🔧 Technical Features
- **Node.js Backend** - Robust server with Express.js
- **SQLite Database** - Lightweight, file-based database
- **Puppeteer PDF Generation** - High-quality PDF output
- **Security Headers** - XSS protection and content security
- **Error Handling** - Comprehensive error management
- **Health Checks** - Built-in monitoring endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd resume-maker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎨 UI Improvements

### Modern Design System
- **CSS Custom Properties** - Consistent theming with CSS variables
- **Professional Color Palette** - Blue primary colors with gray accents
- **Enhanced Typography** - Inter font family for better readability
- **Improved Spacing** - Consistent padding and margins
- **Shadow System** - Layered shadows for depth
- **Border Radius** - Modern rounded corners

### Interactive Elements
- **Button Animations** - Hover effects and transitions
- **Form Styling** - Focus states and validation feedback
- **Loading States** - Visual feedback during operations
- **Responsive Grid** - Adaptive layout for all screen sizes

### Visual Enhancements
- **Gradient Backgrounds** - Subtle gradients for visual appeal
- **Card-based Layout** - Clean, organized content sections
- **Icon Integration** - Emoji icons for better UX
- **Professional Templates** - Business-ready resume designs

## 🛠️ Development

### Project Structure
```
resume-maker/
├── public/
│   ├── index.html          # Main application
│   └── resume-templates.css # Template styles
├── server.js               # Express server
├── package.json            # Dependencies
├── resumes.db              # SQLite database
├── uploads/                # File upload directory
└── README.md              # Documentation
```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (placeholder)

## 🌐 Deployment

This application is configured for easy deployment on various platforms:

### Supported Platforms
- **Heroku** - Full support with Procfile
- **Railway** - Automatic Node.js detection
- **Render** - Web service deployment
- **Vercel** - Serverless deployment
- **Netlify** - Static site hosting (limited)

### Deployment Features
- **Environment Variables** - Configurable settings
- **Health Check Endpoint** - `/health` for monitoring
- **Graceful Shutdown** - Proper cleanup on termination
- **Error Handling** - Comprehensive error management
- **Security Headers** - XSS and content security protection

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production          # Environment mode
PORT=3000                    # Server port
ALLOWED_ORIGINS=*            # CORS origins
```

### Database
- **Type**: SQLite (file-based)
- **Location**: `resumes.db`
- **Auto-creation**: Tables created on first run

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Resume Management
- `GET /api/resumes` - Get all resumes for user
- `POST /api/resumes` - Save new resume
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/deleteAll` - Delete all user resumes

### PDF Generation
- `POST /api/generate-pdf` - Generate PDF from HTML
- `POST /upload` - Upload HTML file for conversion

### Health Check
- `GET /health` - Application health status

## 🎯 Usage

### Creating a Resume
1. **Register/Login** - Create an account or sign in
2. **Fill Basic Info** - Enter name, title, contact details
3. **Add Sections** - Create professional summary, experience, education, skills
4. **Choose Template** - Select from available templates
5. **Preview** - See real-time preview of your resume
6. **Save** - Save your resume to the database
7. **Export** - Generate PDF for download

### Managing Resumes
- **Save Multiple** - Create and save multiple resume versions
- **Edit Existing** - Load and modify saved resumes
- **Delete** - Remove unwanted resumes
- **Export Data** - Backup your resume data

## 🔒 Security

### Implemented Security Measures
- **CORS Protection** - Configurable cross-origin requests
- **XSS Prevention** - Security headers and input validation
- **File Upload Limits** - 5MB maximum file size
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - Parameterized queries

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in environment variable
   PORT=3001 npm start
   ```

2. **Database Errors**
   - Ensure write permissions in app directory
   - Check if `resumes.db` file exists

3. **PDF Generation Issues**
   - Verify Puppeteer installation
   - Check system dependencies for Chrome

4. **Deployment Issues**
   - Check environment variables
   - Verify Node.js version compatibility
   - Review platform-specific requirements

### Health Check
Monitor your application health:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Express.js** - Web framework
- **Puppeteer** - PDF generation
- **SQLite** - Database
- **Inter Font** - Typography

---

**Built with ❤️ for professional resume creation** 