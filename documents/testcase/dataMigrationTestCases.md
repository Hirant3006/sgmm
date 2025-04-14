# Data Migration Test Cases

## Authentication Tests
1. **TC-AUTH-001**: Unauthenticated user cannot access migration page
   - Expected: Redirect to login page
   - Priority: High

2. **TC-AUTH-002**: Non-admin user cannot access migration page
   - Expected: Show access denied message
   - Priority: High

3. **TC-AUTH-003**: Admin user can access migration page
   - Expected: Show migration interface
   - Priority: High

## Data Preview Tests
1. **TC-PREVIEW-001**: Successfully fetch data from Google Sheets
   - Expected: Display data in preview table
   - Priority: High

2. **TC-PREVIEW-002**: Handle Google Sheets API errors
   - Expected: Show appropriate error message
   - Priority: High

3. **TC-PREVIEW-003**: Data mapping preview
   - Expected: Show correct mapping between source and target fields
   - Priority: Medium

## Migration Process Tests
1. **TC-MIG-001**: Start migration with valid data
   - Expected: Successfully migrate all records
   - Priority: High

2. **TC-MIG-002**: Create new Machine Type if not exists
   - Expected: New Machine Type created
   - Priority: High

3. **TC-MIG-003**: Create new Machine if not exists
   - Expected: New Machine created with correct details
   - Priority: High

4. **TC-MIG-004**: Create new Machine Subtype if not exists
   - Expected: New Machine Subtype created
   - Priority: High

5. **TC-MIG-005**: Create Order with all required fields
   - Expected: Order created with correct data
   - Priority: High

## Data Validation Tests
1. **TC-VAL-001**: Validate date format
   - Expected: Proper date conversion
   - Priority: High

2. **TC-VAL-002**: Validate price formats
   - Expected: Proper number conversion
   - Priority: High

3. **TC-VAL-003**: Handle missing required fields
   - Expected: Skip invalid records with error log
   - Priority: High

## Progress Tracking Tests
1. **TC-PROG-001**: Show real-time progress
   - Expected: Progress bar updates correctly
   - Priority: Medium

2. **TC-PROG-002**: Display success/error counts
   - Expected: Counts update in real-time
   - Priority: Medium

3. **TC-PROG-003**: Show completion status
   - Expected: Final status displayed correctly
   - Priority: Medium

## Error Handling Tests
1. **TC-ERR-001**: Handle network errors
   - Expected: Show retry option
   - Priority: High

2. **TC-ERR-002**: Handle database errors
   - Expected: Show appropriate error message
   - Priority: High

3. **TC-ERR-003**: Handle API rate limits
   - Expected: Implement backoff strategy
   - Priority: Medium

## UI/UX Tests
1. **TC-UI-001**: Keyboard navigation
   - Expected: All actions accessible via keyboard
   - Priority: Medium

2. **TC-UI-002**: Vietnamese language support
   - Expected: All text in Vietnamese
   - Priority: High

3. **TC-UI-003**: Responsive design
   - Expected: Works on all screen sizes
   - Priority: Medium

## Performance Tests
1. **TC-PERF-001**: Handle large datasets
   - Expected: Process without timeout
   - Priority: High

2. **TC-PERF-002**: Batch processing
   - Expected: Efficient processing of records
   - Priority: High

3. **TC-PERF-003**: Memory usage
   - Expected: Stable memory consumption
   - Priority: Medium

## Security Tests
1. **TC-SEC-001**: Prevent SQL injection
   - Expected: No SQL injection vulnerabilities
   - Priority: High

2. **TC-SEC-002**: Validate file access
   - Expected: Secure access to Google Sheets
   - Priority: High

3. **TC-SEC-003**: Rate limiting
   - Expected: Prevent abuse of API
   - Priority: Medium 