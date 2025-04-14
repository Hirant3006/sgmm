# Order Management Technical Documentation

## Architecture Overview

The Order Management feature follows the existing client-server architecture with a React frontend and Express.js backend. The data is stored in a PostgreSQL database.

### Frontend Architecture
- React with functional components and hooks
- Ant Design UI library for components
- Styled-components for custom styling
- React Router for navigation
- Fetch API for HTTP requests
- Form validation with Ant Design Form
- Toast notifications for user feedback

### Backend Architecture
- Express.js REST API
- PostgreSQL database
- JWT authentication
- Middleware for request validation and authentication
- Error handling middleware

## Implementation Plan

### Backend Implementation

#### 1. Database Setup
- Create orders table migration
- Add foreign key constraints
- Create indexes for performance

#### 2. Models
- Create Order model
- Implement CRUD operations
- Add validation methods
- Add relationship methods

#### 3. Controllers
- Create orderController.js
- Implement CRUD operations
- Add filtering logic
- Add error handling
- Add input validation

#### 4. Routes
- Create orderRoutes.js
- Define API endpoints
- Add authentication middleware
- Add validation middleware

#### 5. API Endpoints
- GET /api/orders - Get all orders with filtering
- GET /api/orders/:id - Get a single order
- POST /api/orders - Create a new order
- PUT /api/orders/:id - Update an order
- DELETE /api/orders/:id - Delete an order

### Frontend Implementation

#### 1. Components
- OrderManagementPage
  - Main container component
  - Manages state and data fetching
  - Renders OrderTable and OrderFilters

- OrderTable
  - Displays orders in a table format
  - Supports sorting and pagination
  - Includes action buttons for edit/delete

- OrderFilters
  - Filter form with all filter options
  - Real-time filter updates
  - Clear filters button

- OrderForm
  - Modal form for create/edit operations
  - Form validation
  - Success/error handling

#### 2. State Management
- Use React Context for global state
- Local state for component-specific data
- Form state management with Ant Design Form

#### 3. API Integration
- Create API service for orders
- Implement CRUD operations
- Handle errors and loading states
- Implement filtering logic

#### 4. UI/UX Implementation
- Vietnamese language interface
- Responsive design
- Theme support (light/dark mode)
- Accessibility features
- Keyboard navigation
- Toast notifications

## File Structure

### Backend
```
├── config/
│   └── database.js (existing)
├── controllers/
│   └── orderController.js (new)
├── models/
│   └── Order.js (new)
├── routes/
│   └── orderRoutes.js (new)
└── migrations/
    └── create_orders_table.js (new)
```

### Frontend
```
├── src/
│   ├── pages/
│   │   └── order/
│   │       ├── OrderManagementPage.jsx (new)
│   │       ├── OrderTable.jsx (new)
│   │       ├── OrderFilters.jsx (new)
│   │       └── OrderForm.jsx (new)
│   ├── components/
│   │   └── order/
│   │       ├── OrderCard.jsx (new)
│   │       └── OrderStatusBadge.jsx (new)
│   ├── context/
│   │   └── OrderContext.jsx (new)
│   └── services/
│       └── orderService.js (new)
```

## API Documentation

### GET /api/orders
Get all orders with optional filtering.

**Query Parameters:**
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- sortBy: Field to sort by (default: date)
- sortOrder: Sort order (asc/desc)
- dateFrom: Start date
- dateTo: End date
- machineId: Machine ID
- machineTypeId: Machine Type ID
- machineSubTypeId: Machine SubType ID
- customerName: Customer name
- customerPhone: Customer phone
- source: Source
- priceFrom: Minimum price
- priceTo: Maximum price
- costFrom: Minimum cost
- costTo: Maximum cost
- shippingFrom: Minimum shipping cost
- shippingTo: Maximum shipping cost
- purchaseLocation: Purchase location

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "date": "date",
      "machine": {
        "id": "string",
        "name": "string"
      },
      "machineType": {
        "id": "string",
        "name": "string"
      },
      "machineSubType": {
        "id": "string",
        "name": "string"
      },
      "customerName": "string",
      "customerPhone": "string",
      "source": "string",
      "price": "number",
      "costOfGood": "number",
      "shippingCost": "number",
      "purchaseLocation": "string",
      "notes": "string",
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
```

### POST /api/orders
Create a new order.

**Request Body:**
```json
{
  "date": "date",
  "machineId": "string",
  "machineTypeId": "string",
  "machineSubTypeId": "string",
  "customerName": "string",
  "customerPhone": "string",
  "source": "string",
  "price": "number",
  "costOfGood": "number",
  "shippingCost": "number",
  "purchaseLocation": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "date": "date",
  "machine": {
    "id": "string",
    "name": "string"
  },
  "machineType": {
    "id": "string",
    "name": "string"
  },
  "machineSubType": {
    "id": "string",
    "name": "string"
  },
  "customerName": "string",
  "customerPhone": "string",
  "source": "string",
  "price": "number",
  "costOfGood": "number",
  "shippingCost": "number",
  "purchaseLocation": "string",
  "notes": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### PUT /api/orders/:id
Update an existing order.

**Request Body:**
```json
{
  "date": "date",
  "machineId": "string",
  "machineTypeId": "string",
  "machineSubTypeId": "string",
  "customerName": "string",
  "customerPhone": "string",
  "source": "string",
  "price": "number",
  "costOfGood": "number",
  "shippingCost": "number",
  "purchaseLocation": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "date": "date",
  "machine": {
    "id": "string",
    "name": "string"
  },
  "machineType": {
    "id": "string",
    "name": "string"
  },
  "machineSubType": {
    "id": "string",
    "name": "string"
  },
  "customerName": "string",
  "customerPhone": "string",
  "source": "string",
  "price": "number",
  "costOfGood": "number",
  "shippingCost": "number",
  "purchaseLocation": "string",
  "notes": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### DELETE /api/orders/:id
Delete an order.

**Response:**
```json
{
  "message": "Order deleted successfully"
}
```

## Error Handling

### Frontend
- Form validation errors
- API error handling
- Network error handling
- Loading states
- Error boundaries

### Backend
- Input validation errors
- Database errors
- Authentication errors
- Authorization errors
- Not found errors

## Testing Strategy

### Unit Tests
- Model methods
- Controller functions
- Utility functions
- Component rendering
- Form validation

### Integration Tests
- API endpoints
- Database operations
- Authentication flow
- Form submission

### End-to-End Tests
- Order creation flow
- Order editing flow
- Order deletion flow
- Filtering flow

## Performance Considerations

### Frontend
- Pagination for large datasets
- Debounced search inputs
- Memoized components
- Lazy loading
- Virtual scrolling for large lists

### Backend
- Database indexing
- Query optimization
- Caching
- Rate limiting

## Security Considerations

- JWT authentication
- Input validation
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting
- Error handling

## Accessibility

- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader compatibility
- Sufficient color contrast
- ARIA labels and roles
- Focus management

## Deployment

### Database
- Migration script
- Backup strategy
- Rollback plan

### Frontend
- Build process
- Environment configuration
- Asset optimization

### Backend
- Environment configuration
- Error logging
- Performance monitoring 