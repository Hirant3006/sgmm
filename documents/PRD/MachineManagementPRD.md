# Product Requirements Document: Machine Management

## Overview
The Machine Management feature allows authenticated users to manage machines, machine types, and machine subtypes through a tabbed interface. This feature provides CRUD operations for all three entities with proper validation, error handling, and user feedback.

## User Stories

### 1. Machine Management
As a user, I want to CRUD machine data, so that I can maintain accurate machine information for my business.

**Machine Data Fields:**
- MachineID (Required, Primary Key, Non-editable)
- MachineTypeID (Required, Foreign Key)
- Price (Number, Default: 0, Must be ≥ 0, Suffix: VND)

**Use Cases:**
- View list of machines with pagination and sorting
- Search machines by ID or name
- Add new machines with validation
- Edit existing machines
- Delete machines with confirmation
- View machine type names in the table
- Select machine types from dropdown when creating/editing

### 2. Machine Type Management
As a user, I want to CRUD machine type data, so that I can categorize machines properly.

**Machine Type Data Fields:**
- MachineTypeID (Required, Primary Key, Non-editable)
- Name (Required, Non-null)

**Use Cases:**
- View list of machine types with pagination and sorting
- Search machine types by ID or name
- Add new machine types with validation
- Edit existing machine types
- Delete machine types with confirmation

### 3. Machine Subtype Management
As a user, I want to CRUD machine subtype data, so that I can further categorize machines.

**Machine Subtype Data Fields:**
- MachineSubTypeID (Required, Primary Key, Non-editable)
- Name (Required, Non-null)

**Use Cases:**
- View list of machine subtypes with pagination and sorting
- Search machine subtypes by ID or name
- Add new machine subtypes with validation
- Edit existing machine subtypes
- Delete machine subtypes with confirmation

## Non-Functional Requirements

### Security
- Only authenticated users can access the Machine Management pages
- All API endpoints require authentication
- Input validation on both client and server sides

### Performance
- Efficient database queries with proper indexing
- Pagination for large datasets
- Optimized frontend rendering

### Usability
- Intuitive tabbed interface
- Consistent UI/UX across all three management sections
- Clear error messages and success notifications
- Vietnamese language for all UI content
- Responsive design for different screen sizes

### Accessibility
- WCAG compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

## Technical Requirements

### Frontend
- React with functional components and hooks
- Ant Design UI library
- Styled-components for custom styling
- Form validation
- Error handling
- Loading states
- Toast notifications

### Backend
- Express.js REST API
- MySQL database
- Authentication middleware
- Input validation
- Error handling
- Proper HTTP status codes

### Database
- Machines table
- Machine Types table
- Machine Subtypes table
- Proper foreign key relationships
- Timestamps for created_at and updated_at

## Success Metrics
- Successful CRUD operations for all three entities
- Proper error handling and user feedback
- Responsive UI across different devices
- Accessibility compliance
- Performance under load 