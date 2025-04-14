# Data Migration Feature PRD

## Overview
The Data Migration feature allows admin users to import historical order data from a Google Sheets document into the application's database. This feature ensures a smooth transition of existing business data into the new system while maintaining data integrity and relationships.

## User Stories

### Admin Data Migration
**As an** admin user  
**I want to** migrate data from the Google Sheets document  
**So that** I can have all my historical order data in the system

**Acceptance Criteria:**
- Admin can access the migration page when authenticated
- Admin can view the source data from Google Sheets
- Admin can initiate the migration process
- System automatically creates missing Machine Types, Machines, and Machine Subtypes
- System creates Orders with all required fields
- Admin receives confirmation of successful migration
- Admin can view migration status and results

## Non-Functional Requirements

### Security
- Only authenticated admin users can access the migration feature
- All API endpoints must be protected with JWT authentication
- Data validation before insertion to prevent SQL injection

### Performance
- Migration should handle large datasets efficiently
- Batch processing for better performance
- Progress indicator for long-running migrations

### Accessibility
- Vietnamese language support throughout the interface
- Keyboard navigation support
- Clear error messages and success notifications
- WCAG 2.1 compliance

### UI/UX
- Clean and intuitive interface
- Clear migration status indicators
- Confirmation dialogs for important actions
- Error handling with user-friendly messages

## Data Mapping

### Source to Target Mapping
1. Ngày (Date) → Order Date
2. Loại (Type) → Machine Type
3. Tên (Name) → Machine Name
4. Cục/Xe (Unit/Vehicle) → Machine Subtype
5. Nguồn xe (Source) → Source
6. Ghi chú (Notes) → Notes
7. Giá bán (Selling Price) → Price
8. Giá nhập (Purchase Price) → Cost of Good
9. Nơi mua (Purchase Location) → Purchase Location
10. Vận chuyển (Transportation) → Shipping Cost

## Success Metrics
- Successful migration of all records
- Zero data loss during migration
- Accurate creation of related entities (Machine Types, Machines, Subtypes)
- User satisfaction with migration process
- Migration completion time within acceptable limits

## Dependencies
- Existing authentication system
- Machine management system
- Order management system
- Database system
- Google Sheets API access 