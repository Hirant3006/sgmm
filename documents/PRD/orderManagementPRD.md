# Order Management PRD

## Overview
The Order Management feature allows authenticated users to manage orders for machines, including creating, reading, updating, and deleting order records. The feature also provides comprehensive filtering capabilities to help users find specific orders based on various criteria.

## User Stories

### 1. Order CRUD Operations
As a user, I want to CRUD orders, so that I can maintain correct data for my business.

#### Acceptance Criteria
- Users can create new orders with the following data:
  - ID (Required)
  - Date (Required, default: current date)
  - Machine (Required, linked to machine table)
  - Machine Type (Required, linked to machine table)
  - Machine SubType (Required, linked to machine table)
  - Customer Name (Optional)
  - Customer Phone (Optional)
  - Source (Optional)
  - Price (Required, VND format)
  - Cost of Good (Required, VND format)
  - Shipping Cost (Optional, VND format)
  - Purchase Location (Optional)
  - Notes (Optional)
- Users can view all orders in a table format
- Users can edit existing orders
- Users can delete orders
- Success/error notifications via toast messages
- Modal forms for create/edit operations

### 2. Order Filtering
As a user, I want to filter orders data, so that I can find specific data for my business.

#### Acceptance Criteria
- Users can filter orders by:
  - Date range (Required, default: current date)
  - Machine (by name)
  - Machine Type (by name)
  - Machine SubType (by name)
  - Customer Name
  - Customer Phone
  - Source
  - Price (higher, lower, between, equal)
  - Cost of Good (higher, lower, between, equal)
  - Shipping Cost (higher, lower, between, equal)
  - Purchase Location
- Filter UI should be intuitive and user-friendly
- Filters can be combined
- Results update in real-time as filters are applied

## Non-Functional Requirements

### Security
- Only authenticated users can access the Order Management page
- JWT authentication required for all API endpoints
- Input validation on both client and server
- SQL injection prevention
- XSS prevention

### Performance
- Pagination for large datasets
- Optimized database queries
- Efficient frontend rendering
- Debounced search inputs

### Accessibility
- WCAG 2.1 compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- ARIA labels and roles

### UI/UX
- Vietnamese language interface
- Clean, minimalist design
- Responsive layout
- Consistent styling with Ant Design
- Clear feedback for user actions
- Keyboard shortcuts for common actions

## Technical Requirements

### Frontend
- React with functional components
- Ant Design UI library
- Styled Components for custom styling
- React Router for navigation
- Form validation
- Toast notifications
- Responsive design
- Theme support (light/dark mode)

### Backend
- Express.js REST API
- PostgreSQL database
- JWT authentication
- Input validation middleware
- Error handling middleware
- Database migrations

### Database Schema
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  machine_id VARCHAR(50) NOT NULL,
  machine_type_id VARCHAR(50) NOT NULL,
  machine_subtype_id VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  source VARCHAR(255),
  price DECIMAL(15, 2) NOT NULL,
  cost_of_good DECIMAL(15, 2) NOT NULL,
  shipping_cost DECIMAL(15, 2),
  purchase_location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (machine_id) REFERENCES machines(id),
  FOREIGN KEY (machine_type_id) REFERENCES machine_types(id),
  FOREIGN KEY (machine_subtype_id) REFERENCES machine_subtypes(id)
);
```

## Dependencies
- Existing authentication system
- Machine management system
- Machine type management system
- Machine subtype management system

## Success Metrics
- Reduced time to create and manage orders
- Improved data accuracy
- Increased user satisfaction
- Reduced support tickets related to order management 