# Technical Documentation: Machine Management

## Architecture Overview

The Machine Management feature follows a client-server architecture with a React frontend and Express.js backend. The data is stored in a MySQL database.

### Frontend Architecture
- React with functional components and hooks
- Ant Design UI library for components
- Styled-components for custom styling
- React Router for navigation
- Fetch API for HTTP requests

### Backend Architecture
- Express.js REST API
- MySQL database
- JWT authentication
- Middleware for request validation and authentication

## Database Schema

### Machines Table
```sql
CREATE TABLE machines (
  machine_id VARCHAR(50) PRIMARY KEY,
  machine_type_id VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_type_id) REFERENCES machine_types(machine_type_id)
);
```

### Machine Types Table
```sql
CREATE TABLE machine_types (
  machine_type_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Machine Subtypes Table
```sql
CREATE TABLE machine_subtypes (
  machine_subtype_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### Machines API
- `GET /api/machines` - Get all machines
- `GET /api/machines/:id` - Get a single machine
- `POST /api/machines` - Create a new machine
- `PUT /api/machines/:id` - Update a machine
- `DELETE /api/machines/:id` - Delete a machine

### Machine Types API
- `GET /api/machine-types` - Get all machine types
- `GET /api/machine-types/:id` - Get a single machine type
- `POST /api/machine-types` - Create a new machine type
- `PUT /api/machine-types/:id` - Update a machine type
- `DELETE /api/machine-types/:id` - Delete a machine type

### Machine Subtypes API
- `GET /api/machine-subtypes` - Get all machine subtypes
- `GET /api/machine-subtypes/:id` - Get a single machine subtype
- `POST /api/machine-subtypes` - Create a new machine subtype
- `PUT /api/machine-subtypes/:id` - Update a machine subtype
- `DELETE /api/machine-subtypes/:id` - Delete a machine subtype

## Frontend Components

### MachineManagementPage
- Main container component
- Manages tab state and navigation
- Renders the appropriate tab component based on the active tab

### MachineTab
- Displays the list of machines
- Handles CRUD operations for machines
- Includes search and pagination functionality

### MachineTypeTab
- Displays the list of machine types
- Handles CRUD operations for machine types
- Includes search and pagination functionality

### MachineSubTypeTab
- Displays the list of machine subtypes
- Handles CRUD operations for machine subtypes
- Includes search and pagination functionality

### Common Components
- Tables for displaying data
- Modals for adding/editing data
- Search inputs
- Confirmation dialogs for deletions

## Authentication and Authorization

- JWT-based authentication
- All API endpoints require a valid JWT token
- Frontend routes are protected with authentication checks
- Tokens are stored in HTTP-only cookies for security

## Error Handling

### Frontend
- Form validation for user inputs
- Error messages displayed in modals and toasts
- Loading states for async operations
- Network error handling

### Backend
- Input validation middleware
- Proper HTTP status codes
- Detailed error messages
- Logging for debugging

## Performance Considerations

- Pagination for large datasets
- Efficient database queries with proper indexing
- Optimized React rendering with proper state management
- Debounced search inputs

## Security Considerations

- JWT authentication
- HTTP-only cookies
- Input validation on both client and server
- SQL injection prevention with parameterized queries
- XSS prevention with proper escaping

## Accessibility

- WCAG compliance
- Keyboard navigation
- Screen reader compatibility
- Sufficient color contrast
- ARIA labels and roles

## Deployment

### Frontend
- Build process with optimization
- Environment-specific configuration
- Static file serving

### Backend
- Environment-specific configuration
- Database migrations
- Error logging
- Performance monitoring

## Testing

- Unit tests for components and utilities
- Integration tests for API endpoints
- End-to-end tests for user flows
- Accessibility testing
- Performance testing 