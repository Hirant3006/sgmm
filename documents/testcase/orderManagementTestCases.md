# Order Management Test Cases

## 1. Order CRUD Operations

### 1.1 Create Order

#### Test Case 1.1.1: Create Order with Required Fields
**Description:** Create a new order with all required fields.
**Preconditions:** User is authenticated, machines, machine types, and machine subtypes exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Click "Add New Order" button
3. Fill in the following required fields:
   - Date: Current date
   - Machine: Select an existing machine
   - Machine Type: Select an existing machine type
   - Machine SubType: Select an existing machine subtype
   - Price: 1000000
   - Cost of Good: 800000
4. Click "Save" button
**Expected Result:** Order is created successfully, success toast is displayed, and the new order appears in the table.
**Actual Result:** [To be filled during testing]

#### Test Case 1.1.2: Create Order with All Fields
**Description:** Create a new order with all fields (required and optional).
**Preconditions:** User is authenticated, machines, machine types, and machine subtypes exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Click "Add New Order" button
3. Fill in all fields:
   - Date: Current date
   - Machine: Select an existing machine
   - Machine Type: Select an existing machine type
   - Machine SubType: Select an existing machine subtype
   - Customer Name: "Nguyễn Văn A"
   - Customer Phone: "0123456789"
   - Source: "Facebook"
   - Price: 1000000
   - Cost of Good: 800000
   - Shipping Cost: 50000
   - Purchase Location: "Hà Nội"
   - Notes: "Giao hàng vào tuần sau"
4. Click "Save" button
**Expected Result:** Order is created successfully, success toast is displayed, and the new order appears in the table.
**Actual Result:** [To be filled during testing]

#### Test Case 1.1.3: Create Order with Missing Required Fields
**Description:** Attempt to create a new order with missing required fields.
**Preconditions:** User is authenticated.
**Steps:**
1. Navigate to Order Management page
2. Click "Add New Order" button
3. Leave all fields empty
4. Click "Save" button
**Expected Result:** Form validation errors are displayed for all required fields, order is not created.
**Actual Result:** [To be filled during testing]

#### Test Case 1.1.4: Create Order with Invalid Data
**Description:** Attempt to create a new order with invalid data.
**Preconditions:** User is authenticated.
**Steps:**
1. Navigate to Order Management page
2. Click "Add New Order" button
3. Fill in the following fields with invalid data:
   - Date: "invalid-date"
   - Machine: Select a non-existent machine
   - Machine Type: Select a non-existent machine type
   - Machine SubType: Select a non-existent machine subtype
   - Price: "not-a-number"
   - Cost of Good: "not-a-number"
   - Shipping Cost: "not-a-number"
4. Click "Save" button
**Expected Result:** Form validation errors are displayed for all invalid fields, order is not created.
**Actual Result:** [To be filled during testing]

### 1.2 Read Orders

#### Test Case 1.2.1: View All Orders
**Description:** View all orders in the table.
**Preconditions:** User is authenticated, orders exist in the database.
**Steps:**
1. Navigate to Order Management page
**Expected Result:** All orders are displayed in the table with pagination.
**Actual Result:** [To be filled during testing]

#### Test Case 1.2.2: View Single Order
**Description:** View details of a single order.
**Preconditions:** User is authenticated, orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Click on an order in the table
**Expected Result:** Order details are displayed in a modal or detail view.
**Actual Result:** [To be filled during testing]

### 1.3 Update Order

#### Test Case 1.3.1: Update Order with Valid Data
**Description:** Update an existing order with valid data.
**Preconditions:** User is authenticated, orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Click "Edit" button for an existing order
3. Update the following fields:
   - Customer Name: "Trần Thị B"
   - Customer Phone: "0987654321"
   - Price: 1200000
   - Notes: "Đã giao hàng"
4. Click "Save" button
**Expected Result:** Order is updated successfully, success toast is displayed, and the updated order appears in the table.
**Actual Result:** [To be filled during testing]

#### Test Case 1.3.2: Update Order with Invalid Data
**Description:** Attempt to update an existing order with invalid data.
**Preconditions:** User is authenticated, orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Click "Edit" button for an existing order
3. Update the following fields with invalid data:
   - Price: "not-a-number"
   - Cost of Good: "not-a-number"
   - Shipping Cost: "not-a-number"
4. Click "Save" button
**Expected Result:** Form validation errors are displayed for all invalid fields, order is not updated.
**Actual Result:** [To be filled during testing]

### 1.4 Delete Order

#### Test Case 1.4.1: Delete Order
**Description:** Delete an existing order.
**Preconditions:** User is authenticated, orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Click "Delete" button for an existing order
3. Confirm deletion in the confirmation dialog
**Expected Result:** Order is deleted successfully, success toast is displayed, and the order is removed from the table.
**Actual Result:** [To be filled during testing]

#### Test Case 1.4.2: Cancel Order Deletion
**Description:** Cancel the deletion of an existing order.
**Preconditions:** User is authenticated, orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Click "Delete" button for an existing order
3. Click "Cancel" button in the confirmation dialog
**Expected Result:** Confirmation dialog is closed, order is not deleted.
**Actual Result:** [To be filled during testing]

## 2. Order Filtering

### 2.1 Filter by Date

#### Test Case 2.1.1: Filter Orders by Date Range
**Description:** Filter orders by a date range.
**Preconditions:** User is authenticated, orders exist in the database with different dates.
**Steps:**
1. Navigate to Order Management page
2. Set date range filter:
   - From: First day of current month
   - To: Last day of current month
3. Click "Apply Filters" button
**Expected Result:** Only orders within the specified date range are displayed.
**Actual Result:** [To be filled during testing]

#### Test Case 2.1.2: Filter Orders by Single Date
**Description:** Filter orders by a single date.
**Preconditions:** User is authenticated, orders exist in the database with different dates.
**Steps:**
1. Navigate to Order Management page
2. Set date filter:
   - From: Current date
   - To: Current date
3. Click "Apply Filters" button
**Expected Result:** Only orders for the specified date are displayed.
**Actual Result:** [To be filled during testing]

### 2.2 Filter by Machine

#### Test Case 2.2.1: Filter Orders by Machine
**Description:** Filter orders by a specific machine.
**Preconditions:** User is authenticated, orders exist in the database with different machines.
**Steps:**
1. Navigate to Order Management page
2. Select a specific machine from the machine filter dropdown
3. Click "Apply Filters" button
**Expected Result:** Only orders for the selected machine are displayed.
**Actual Result:** [To be filled during testing]

### 2.3 Filter by Machine Type

#### Test Case 2.3.1: Filter Orders by Machine Type
**Description:** Filter orders by a specific machine type.
**Preconditions:** User is authenticated, orders exist in the database with different machine types.
**Steps:**
1. Navigate to Order Management page
2. Select a specific machine type from the machine type filter dropdown
3. Click "Apply Filters" button
**Expected Result:** Only orders for the selected machine type are displayed.
**Actual Result:** [To be filled during testing]

### 2.4 Filter by Machine SubType

#### Test Case 2.4.1: Filter Orders by Machine SubType
**Description:** Filter orders by a specific machine subtype.
**Preconditions:** User is authenticated, orders exist in the database with different machine subtypes.
**Steps:**
1. Navigate to Order Management page
2. Select a specific machine subtype from the machine subtype filter dropdown
3. Click "Apply Filters" button
**Expected Result:** Only orders for the selected machine subtype are displayed.
**Actual Result:** [To be filled during testing]

### 2.5 Filter by Customer

#### Test Case 2.5.1: Filter Orders by Customer Name
**Description:** Filter orders by customer name.
**Preconditions:** User is authenticated, orders exist in the database with different customer names.
**Steps:**
1. Navigate to Order Management page
2. Enter a customer name in the customer name filter field
3. Click "Apply Filters" button
**Expected Result:** Only orders with the specified customer name are displayed.
**Actual Result:** [To be filled during testing]

#### Test Case 2.5.2: Filter Orders by Customer Phone
**Description:** Filter orders by customer phone.
**Preconditions:** User is authenticated, orders exist in the database with different customer phones.
**Steps:**
1. Navigate to Order Management page
2. Enter a customer phone in the customer phone filter field
3. Click "Apply Filters" button
**Expected Result:** Only orders with the specified customer phone are displayed.
**Actual Result:** [To be filled during testing]

### 2.6 Filter by Price

#### Test Case 2.6.1: Filter Orders by Price Range
**Description:** Filter orders by a price range.
**Preconditions:** User is authenticated, orders exist in the database with different prices.
**Steps:**
1. Navigate to Order Management page
2. Set price range filter:
   - From: 1000000
   - To: 2000000
3. Click "Apply Filters" button
**Expected Result:** Only orders within the specified price range are displayed.
**Actual Result:** [To be filled during testing]

#### Test Case 2.6.2: Filter Orders by Minimum Price
**Description:** Filter orders by minimum price.
**Preconditions:** User is authenticated, orders exist in the database with different prices.
**Steps:**
1. Navigate to Order Management page
2. Set price filter:
   - From: 1000000
   - To: (empty)
3. Click "Apply Filters" button
**Expected Result:** Only orders with price greater than or equal to the specified minimum price are displayed.
**Actual Result:** [To be filled during testing]

### 2.7 Filter by Cost of Good

#### Test Case 2.7.1: Filter Orders by Cost of Good Range
**Description:** Filter orders by a cost of good range.
**Preconditions:** User is authenticated, orders exist in the database with different costs of good.
**Steps:**
1. Navigate to Order Management page
2. Set cost of good range filter:
   - From: 800000
   - To: 1500000
3. Click "Apply Filters" button
**Expected Result:** Only orders within the specified cost of good range are displayed.
**Actual Result:** [To be filled during testing]

### 2.8 Filter by Shipping Cost

#### Test Case 2.8.1: Filter Orders by Shipping Cost Range
**Description:** Filter orders by a shipping cost range.
**Preconditions:** User is authenticated, orders exist in the database with different shipping costs.
**Steps:**
1. Navigate to Order Management page
2. Set shipping cost range filter:
   - From: 50000
   - To: 100000
3. Click "Apply Filters" button
**Expected Result:** Only orders within the specified shipping cost range are displayed.
**Actual Result:** [To be filled during testing]

### 2.9 Filter by Purchase Location

#### Test Case 2.9.1: Filter Orders by Purchase Location
**Description:** Filter orders by purchase location.
**Preconditions:** User is authenticated, orders exist in the database with different purchase locations.
**Steps:**
1. Navigate to Order Management page
2. Enter a purchase location in the purchase location filter field
3. Click "Apply Filters" button
**Expected Result:** Only orders with the specified purchase location are displayed.
**Actual Result:** [To be filled during testing]

### 2.10 Combined Filters

#### Test Case 2.10.1: Filter Orders by Multiple Criteria
**Description:** Filter orders by multiple criteria.
**Preconditions:** User is authenticated, orders exist in the database with different attributes.
**Steps:**
1. Navigate to Order Management page
2. Set multiple filters:
   - Date range: Current month
   - Machine: Specific machine
   - Price range: 1000000 - 2000000
   - Customer name: "Nguyễn"
3. Click "Apply Filters" button
**Expected Result:** Only orders matching all specified criteria are displayed.
**Actual Result:** [To be filled during testing]

#### Test Case 2.10.2: Clear All Filters
**Description:** Clear all applied filters.
**Preconditions:** User is authenticated, filters are applied.
**Steps:**
1. Navigate to Order Management page
2. Apply multiple filters
3. Click "Clear Filters" button
**Expected Result:** All filters are cleared, and all orders are displayed.
**Actual Result:** [To be filled during testing]

## 3. Authentication and Authorization

### 3.1 Authentication

#### Test Case 3.1.1: Access Order Management Page When Authenticated
**Description:** Access the Order Management page when authenticated.
**Preconditions:** User is authenticated.
**Steps:**
1. Log in to the application
2. Navigate to Order Management page
**Expected Result:** Order Management page is displayed.
**Actual Result:** [To be filled during testing]

#### Test Case 3.1.2: Access Order Management Page When Not Authenticated
**Description:** Attempt to access the Order Management page when not authenticated.
**Preconditions:** User is not authenticated.
**Steps:**
1. Navigate to Order Management page directly
**Expected Result:** User is redirected to the login page.
**Actual Result:** [To be filled during testing]

## 4. UI/UX Testing

### 4.1 Responsive Design

#### Test Case 4.1.1: Order Management Page on Desktop
**Description:** View Order Management page on desktop.
**Preconditions:** User is authenticated.
**Steps:**
1. Open the application on a desktop browser
2. Navigate to Order Management page
**Expected Result:** Order Management page is displayed correctly on desktop.
**Actual Result:** [To be filled during testing]

#### Test Case 4.1.2: Order Management Page on Tablet
**Description:** View Order Management page on tablet.
**Preconditions:** User is authenticated.
**Steps:**
1. Open the application on a tablet browser
2. Navigate to Order Management page
**Expected Result:** Order Management page is displayed correctly on tablet.
**Actual Result:** [To be filled during testing]

#### Test Case 4.1.3: Order Management Page on Mobile
**Description:** View Order Management page on mobile.
**Preconditions:** User is authenticated.
**Steps:**
1. Open the application on a mobile browser
2. Navigate to Order Management page
**Expected Result:** Order Management page is displayed correctly on mobile.
**Actual Result:** [To be filled during testing]

### 4.2 Theme Support

#### Test Case 4.2.1: Order Management Page in Light Mode
**Description:** View Order Management page in light mode.
**Preconditions:** User is authenticated, light mode is enabled.
**Steps:**
1. Enable light mode
2. Navigate to Order Management page
**Expected Result:** Order Management page is displayed correctly in light mode.
**Actual Result:** [To be filled during testing]

#### Test Case 4.2.2: Order Management Page in Dark Mode
**Description:** View Order Management page in dark mode.
**Preconditions:** User is authenticated, dark mode is enabled.
**Steps:**
1. Enable dark mode
2. Navigate to Order Management page
**Expected Result:** Order Management page is displayed correctly in dark mode.
**Actual Result:** [To be filled during testing]

## 5. Performance Testing

### 5.1 Load Time

#### Test Case 5.1.1: Load Time with Few Orders
**Description:** Measure load time with few orders.
**Preconditions:** User is authenticated, few orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Measure load time
**Expected Result:** Page loads within acceptable time (e.g., less than 2 seconds).
**Actual Result:** [To be filled during testing]

#### Test Case 5.1.2: Load Time with Many Orders
**Description:** Measure load time with many orders.
**Preconditions:** User is authenticated, many orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Measure load time
**Expected Result:** Page loads within acceptable time (e.g., less than 3 seconds).
**Actual Result:** [To be filled during testing]

### 5.2 Pagination

#### Test Case 5.2.1: Pagination with Many Orders
**Description:** Test pagination with many orders.
**Preconditions:** User is authenticated, many orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Navigate through pages
**Expected Result:** Pagination works correctly, and page load time is acceptable.
**Actual Result:** [To be filled during testing]

## 6. Accessibility Testing

### 6.1 Keyboard Navigation

#### Test Case 6.1.1: Keyboard Navigation in Order Table
**Description:** Navigate through the order table using keyboard.
**Preconditions:** User is authenticated, orders exist in the database.
**Steps:**
1. Navigate to Order Management page
2. Use Tab key to navigate through the table
3. Use Enter key to interact with buttons
**Expected Result:** User can navigate through the table and interact with buttons using keyboard.
**Actual Result:** [To be filled during testing]

### 6.2 Screen Reader Compatibility

#### Test Case 6.2.1: Screen Reader Compatibility
**Description:** Test compatibility with screen readers.
**Preconditions:** User is authenticated, screen reader is enabled.
**Steps:**
1. Navigate to Order Management page
2. Use screen reader to navigate through the page
**Expected Result:** Screen reader correctly reads all elements on the page.
**Actual Result:** [To be filled during testing] 