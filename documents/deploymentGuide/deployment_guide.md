# Deployment Guide for Xenuocmiatuan Application

This guide provides step-by-step instructions for deploying the application using free-tier cloud services.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Deployment (Neon PostgreSQL)](#database-deployment)
3. [Backend Deployment (Render)](#backend-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment)
5. [Domain Setup and Configuration](#domain-setup)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Maintenance and Monitoring](#maintenance-and-monitoring)

## Prerequisites

- GitHub account
- Git repository with your project code
- Node.js and npm installed locally
- PostgreSQL database locally for testing
- Basic knowledge of terminal commands

## Database Deployment

### Step 1: Sign up for Neon PostgreSQL

1. Go to [Neon.tech](https://neon.tech) and sign up for a free account
2. Verify your email address

### Step 2: Create a New Project

1. Log in to your Neon dashboard
2. Click on "New Project"
3. Name your project "xenuocmiatuan"
4. Select the closest region to your users (e.g., Singapore for Vietnam)
5. Click "Create Project"

### Step 3: Configure the Database

1. In your project dashboard, go to the "Connection" tab
2. Note your connection string, which should look like:
   ```
   postgres://user:password@endpoint/database
   ```
3. Create necessary tables:
   - You can use the reset_database.js script to create tables remotely
   - Alternatively, execute the SQL scripts directly from the PostgreSQL interface

### Step 4: Update Environment Variables

Create a .env file for production with the following variables:
```
DB_HOST=your-neon-hostname
DB_USER=your-neon-username
DB_PASSWORD=your-neon-password
DB_NAME=your-neon-database
DB_PORT=5432
DB_SSL=true
NODE_ENV=production
PORT=3000
JWT_SECRET=your-strong-jwt-secret
```

## Backend Deployment

### Step 1: Sign up for Render

1. Go to [Render.com](https://render.com) and sign up for a free account
2. Connect your GitHub account

### Step 2: Create a New Web Service

1. On the Render dashboard, click "New+" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: xenuocmiatuan-backend
   - Environment: Node
   - Region: Closest to your users
   - Branch: main (or your production branch)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

### Step 3: Configure Environment Variables

1. In the Render dashboard, go to your web service
2. Navigate to the "Environment" tab
3. Add all the environment variables from your .env file

### Step 4: Deploy the Backend

1. Click "Create Web Service"
2. Wait for the build and deployment process to complete
3. Once deployed, note the URL provided by Render (e.g., https://xenuocmiatuan-backend.onrender.com)

## Frontend Deployment

### Step 1: Sign up for Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up for a free account
2. Connect your GitHub account

### Step 2: Import your Repository

1. On the Vercel dashboard, click "Add New" > "Project"
2. Import your GitHub repository
3. Configure the project:
   - Framework Preset: Create React App
   - Root Directory: `. (If your frontend is in the root, otherwise specify the directory)`
   - Build Command: `npm install && npm run build`
   - Output Directory: `build`

### Step 3: Configure Environment Variables

1. Add the following environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

### Step 4: Deploy the Frontend

1. Click "Deploy"
2. Wait for the build and deployment process to complete
3. Once deployed, note the URL provided by Vercel (e.g., https://xenuocmiatuan.vercel.app)

## Domain Setup

### Step 1: Purchase a Domain

1. Go to [Namecheap.com](https://www.namecheap.com) or your preferred domain registrar
2. Search for and purchase your desired domain name
3. Complete the registration process

### Step 2: Configure DNS for Frontend

1. In your domain registrar's dashboard, go to DNS settings
2. Add the following records for Vercel:
   - Type: A
   - Host: @
   - Value: 76.76.21.21
   - TTL: Automatic

3. Add the following CNAME record:
   - Type: CNAME
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: Automatic

### Step 3: Configure DNS for Backend (Optional)

1. Add the following CNAME record:
   - Type: CNAME
   - Host: api
   - Value: your-backend-url.onrender.com
   - TTL: Automatic

### Step 4: Configure Custom Domain in Vercel

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your domain (e.g., xenuocmiatuan.com)
3. Vercel will automatically verify the DNS configuration and issue an SSL certificate

### Step 5: Configure Custom Domain in Render (Optional)

1. In your Render web service dashboard, go to "Settings"
2. Scroll to "Custom Domains" and click "Add Custom Domain"
3. Enter your domain (e.g., api.xenuocmiatuan.com)
4. Follow the instructions to verify domain ownership
5. Render will automatically issue an SSL certificate

## Post-Deployment Verification

### Step 1: Test Frontend

1. Visit your domain in a web browser
2. Verify that all pages and features work correctly
3. Test user authentication and other key functionalities

### Step 2: Test Backend API

1. Use a tool like Postman to test API endpoints
2. Verify that the backend can connect to the database
3. Test data retrieval and manipulation

### Step 3: Monitor Initial Performance

1. Check the Render and Vercel dashboards for any errors or warnings
2. Monitor database performance in the Neon dashboard
3. Address any issues that arise during initial usage

## Maintenance and Monitoring

### Regular Maintenance Tasks

1. **Database Backups**
   - Neon provides automatic backups on the free tier
   - Periodically check backup status in the Neon dashboard

2. **Dependency Updates**
   - Regularly update npm packages for security patches
   - Test updates locally before deploying

3. **Performance Monitoring**
   - Use free monitoring tools like New Relic or Sentry's free tiers
   - Set up basic uptime monitoring with UptimeRobot (free tier)

4. **Security Updates**
   - Keep your Node.js version updated
   - Regularly update all dependencies
   - Implement proper authentication and authorization

## Troubleshooting Common Issues

1. **Database Connection Issues**
   - Verify connection string and environment variables
   - Check Neon's status page for service disruptions
   - Ensure proper SSL configuration

2. **Deployment Failures**
   - Check build logs in Render or Vercel
   - Verify that all environment variables are set correctly
   - Ensure package.json scripts are properly configured

3. **Performance Issues**
   - Implement caching where appropriate
   - Optimize database queries
   - Use compression for static assets

---

This deployment guide provides a cost-effective approach using free tiers of cloud services. As your application grows, you may need to upgrade to paid tiers for better performance and additional features. 