# 🚀 Deployment Guide

This guide will help you deploy your Resume Maker application to various hosting platforms.

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Git repository with your code

## 🌐 Deployment Options

### 1. Heroku Deployment

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
heroku create your-resume-maker-app
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

#### Step 5: Deploy
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Step 6: Open App
```bash
heroku open
```

### 2. Railway Deployment

#### Step 1: Connect to Railway
- Go to [Railway.app](https://railway.app)
- Connect your GitHub repository
- Railway will automatically detect Node.js

#### Step 2: Set Environment Variables
- `NODE_ENV=production`
- `PORT=3000`

#### Step 3: Deploy
- Railway will automatically deploy on push to main branch

### 3. Render Deployment

#### Step 1: Connect to Render
- Go to [Render.com](https://render.com)
- Connect your GitHub repository
- Choose "Web Service"

#### Step 2: Configure
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node

#### Step 3: Set Environment Variables
- `NODE_ENV=production`
- `PORT=3000`

### 4. Vercel Deployment

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
vercel
```

#### Step 3: Follow prompts
- Choose your project
- Set environment variables if needed

### 5. Netlify Deployment

**Note**: Netlify is primarily for static sites. For this Node.js app, consider using Vercel or Railway.

## 🔧 Environment Variables

Set these environment variables in your hosting platform:

```bash
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 📦 Build Configuration

The application is configured for deployment with:

- **Start Script**: `npm start`
- **Node Version**: 16.0.0+
- **Port**: 3000 (or environment variable)
- **Database**: SQLite (file-based)

## 🐛 Troubleshooting

### Common Issues

1. **Port Issues**
   - Ensure your hosting platform uses the `PORT` environment variable
   - Check if port 3000 is available

2. **Database Issues**
   - SQLite database is file-based and will be created automatically
   - Ensure write permissions in the app directory

3. **Puppeteer Issues**
   - Some platforms require additional dependencies for Puppeteer
   - Add buildpacks if needed for Chrome dependencies

4. **CORS Issues**
   - Set `ALLOWED_ORIGINS` environment variable
   - Use `*` for development, specific domains for production

### Health Check

Your app includes a health check endpoint:
```
GET /health
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

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Configure allowed origins for production
3. **File Uploads**: Limited to 5MB HTML files
4. **Database**: SQLite file is included in deployment

## 📊 Monitoring

- Check application logs in your hosting platform
- Monitor the `/health` endpoint
- Set up alerts for downtime

## 🚀 Post-Deployment

1. Test all features:
   - User registration/login
   - Resume creation
   - PDF generation
   - File uploads

2. Set up monitoring and alerts

3. Configure custom domain (optional)

4. Set up SSL certificate (usually automatic)

## 📞 Support

If you encounter issues:

1. Check the application logs
2. Verify environment variables
3. Test locally first
4. Check platform-specific documentation

---

**Happy Deploying! 🎉** 