# Environment Variables Guide for Xenuocmiatuan Application

This document lists all the environment variables required for deploying the application. Copy these to each environment where you deploy the application.

## Database Variables

```
# PostgreSQL Connection
DB_HOST=your-hostname.neon.tech
DB_USER=your-username
DB_PASSWORD=your-secure-password
DB_NAME=your-database-name
DB_PORT=5432
DB_SSL=true
```

## Server Variables

```
# Node.js Server Settings
NODE_ENV=production
PORT=3000
```

## Authentication Variables

```
# JWT Authentication
JWT_SECRET=your-long-secure-random-string
JWT_EXPIRES_IN=1d
```

## Frontend Variables

```
# API URL for Frontend
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Optional Variables

```
# Logging (optional)
LOG_LEVEL=info

# CORS Settings (optional)
CORS_ORIGIN=*

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=15
RATE_LIMIT_MAX=100
```

## Environment-Specific Configuration

### Development Environment
```
NODE_ENV=development
DB_HOST=localhost
```

### Production Environment
```
NODE_ENV=production
DB_HOST=your-hostname.neon.tech
```

### Testing Environment
```
NODE_ENV=test
DB_NAME=your-test-database
```

## Important Notes

1. Never commit environment variables to your repository
2. Use different JWT secrets for different environments
3. For local development, create a `.env` file in the project root
4. For production, set environment variables through the hosting provider's interface
5. Generate strong, random values for secrets and passwords
6. Rotate secrets and passwords periodically for security 