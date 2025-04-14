# System for Machine Management (SGMM)

## Project Overview
SGMM is a full-stack web application for managing machines, machine types, and machine subtypes. The system provides a user-friendly interface in Vietnamese for administrators to perform CRUD operations on various machine-related entities.

## Technology Stack
- **Frontend**: React 18, Vite, Ant Design 5, Styled Components 6
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT with cookie-based storage
- **Development Tools**: Nodemon, Concurrently
- **UI Framework**: Ant Design with custom theming
- **State Management**: React Context API
- **Routing**: React Router v7

## Project Structure
```
sgmm/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   ├── theme/             # Theme configuration
│   ├── assets/            # Static assets
│   └── server/            # Backend server code
├── migrations/            # Database migration scripts
├── scripts/               # Utility scripts
├── config/                # Configuration files
├── middleware/            # Express middleware
├── documents/             # Project documentation
│   ├── PRD/               # Product Requirements Documents
│   ├── testcase/          # Test cases
│   └── technicaldocs/     # Technical documentation
└── public/                # Static public files
```

## Key Features
1. **Machine Management**
   - CRUD operations for machines
   - Machine type categorization
   - Machine subtype classification
   - Price tracking
   - Search and filtering capabilities
   - Pagination support

2. **User Authentication**
   - Secure login system
   - JWT-based authentication
   - Role-based access control
   - Session management
   - Secure cookie storage

3. **Dashboard**
   - Overview statistics
   - Recent activities
   - Quick access links
   - Real-time updates
   - Responsive design

4. **Theme Support**
   - Light/Dark mode
   - Custom color schemes
   - Consistent styling
   - Responsive design
   - Accessibility features

5. **Database Schema**
   - Machine Types Table
   - Machine Subtypes Table
   - Machines Table
   - Users Table
   - Activity Logs Table

## Development Workflow
1. **Local Development**
   - Frontend: `npm run dev:client` (Vite dev server)
   - Backend: `npm run dev:server` (Nodemon)
   - Combined: `npm run dev` (Concurrently)

2. **Database Migrations**
   - Automated table creation
   - Sample data insertion
   - Version control for schema changes

3. **Production Build**
   - Frontend: `npm run build`
   - Server: `npm start`

## API Endpoints
- `/api/auth/*` - Authentication routes
- `/api/machines` - Machine management
- `/api/machine-types` - Machine type management
- `/api/machine-subtypes` - Machine subtype management
- `/api/dashboard` - Dashboard statistics

## UI/UX Guidelines
- Vietnamese language interface
- Clean, minimalist design
- Responsive layout
- Consistent styling with Ant Design
- Clear feedback for user actions
- Accessibility compliance (WCAG)
- Keyboard navigation support
- Screen reader compatibility

## Best Practices
- Separation of concerns (frontend/backend)
- Modular component architecture
- Secure authentication implementation
- Error handling and logging
- Database migration management
- Code organization and documentation
- Performance optimization
- Security best practices

## Testing Strategy
- Unit tests for components
- Integration tests for API endpoints
- End-to-end testing for critical workflows
- Test cases documented in `/documents/testcase`
- Accessibility testing
- Performance testing

## Documentation
- PRD for each feature in `/documents/PRD`
- Technical documentation in `/documents/technicaldocs`
- Test cases in `/documents/testcase`
- Page-specific documentation in respective directories 