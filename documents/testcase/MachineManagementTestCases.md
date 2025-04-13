# Test Cases: Machine Management

## 1. Machine Management

### TC-1.1: View Machine List
**Description:** Verify that users can view the list of machines
**Preconditions:** User is authenticated, machines exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Máy Móc" tab
**Expected Result:** List of machines is displayed with pagination

### TC-1.2: Search Machines
**Description:** Verify that users can search machines by ID or name
**Preconditions:** User is authenticated, machines exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Máy Móc" tab
3. Enter a search term in the search box
**Expected Result:** Only machines matching the search term are displayed

### TC-1.3: Add New Machine
**Description:** Verify that users can add a new machine
**Preconditions:** User is authenticated
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Máy Móc" tab
3. Click "Thêm Máy Mới" button
4. Fill in the required fields (MachineID, MachineTypeID, Price)
5. Click "OK" button
**Expected Result:** New machine is added and success message is displayed

### TC-1.4: Edit Machine
**Description:** Verify that users can edit an existing machine
**Preconditions:** User is authenticated, machines exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Máy Móc" tab
3. Click "Sửa" button for an existing machine
4. Modify the machine details
5. Click "OK" button
**Expected Result:** Machine is updated and success message is displayed

### TC-1.5: Delete Machine
**Description:** Verify that users can delete a machine
**Preconditions:** User is authenticated, machines exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Máy Móc" tab
3. Click "Xóa" button for an existing machine
4. Confirm deletion
**Expected Result:** Machine is deleted and success message is displayed

### TC-1.6: Machine Type Dropdown
**Description:** Verify that machine type dropdown shows correct options
**Preconditions:** User is authenticated, machine types exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Máy Móc" tab
3. Click "Thêm Máy Mới" button
**Expected Result:** Machine type dropdown shows all available machine types

## 2. Machine Type Management

### TC-2.1: View Machine Type List
**Description:** Verify that users can view the list of machine types
**Preconditions:** User is authenticated, machine types exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy" tab
**Expected Result:** List of machine types is displayed with pagination

### TC-2.2: Search Machine Types
**Description:** Verify that users can search machine types by ID or name
**Preconditions:** User is authenticated, machine types exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy" tab
3. Enter a search term in the search box
**Expected Result:** Only machine types matching the search term are displayed

### TC-2.3: Add New Machine Type
**Description:** Verify that users can add a new machine type
**Preconditions:** User is authenticated
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy" tab
3. Click "Thêm Loại Máy Mới" button
4. Fill in the required fields (MachineTypeID, Name)
5. Click "OK" button
**Expected Result:** New machine type is added and success message is displayed

### TC-2.4: Edit Machine Type
**Description:** Verify that users can edit an existing machine type
**Preconditions:** User is authenticated, machine types exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy" tab
3. Click "Sửa" button for an existing machine type
4. Modify the machine type details
5. Click "OK" button
**Expected Result:** Machine type is updated and success message is displayed

### TC-2.5: Delete Machine Type
**Description:** Verify that users can delete a machine type
**Preconditions:** User is authenticated, machine types exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy" tab
3. Click "Xóa" button for an existing machine type
4. Confirm deletion
**Expected Result:** Machine type is deleted and success message is displayed

## 3. Machine Subtype Management

### TC-3.1: View Machine Subtype List
**Description:** Verify that users can view the list of machine subtypes
**Preconditions:** User is authenticated, machine subtypes exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy Con" tab
**Expected Result:** List of machine subtypes is displayed with pagination

### TC-3.2: Search Machine Subtypes
**Description:** Verify that users can search machine subtypes by ID or name
**Preconditions:** User is authenticated, machine subtypes exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy Con" tab
3. Enter a search term in the search box
**Expected Result:** Only machine subtypes matching the search term are displayed

### TC-3.3: Add New Machine Subtype
**Description:** Verify that users can add a new machine subtype
**Preconditions:** User is authenticated
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy Con" tab
3. Click "Thêm Loại Máy Con Mới" button
4. Fill in the required fields (MachineSubTypeID, Name)
5. Click "OK" button
**Expected Result:** New machine subtype is added and success message is displayed

### TC-3.4: Edit Machine Subtype
**Description:** Verify that users can edit an existing machine subtype
**Preconditions:** User is authenticated, machine subtypes exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy Con" tab
3. Click "Sửa" button for an existing machine subtype
4. Modify the machine subtype details
5. Click "OK" button
**Expected Result:** Machine subtype is updated and success message is displayed

### TC-3.5: Delete Machine Subtype
**Description:** Verify that users can delete a machine subtype
**Preconditions:** User is authenticated, machine subtypes exist in the database
**Steps:**
1. Navigate to the Machine Management page
2. Select the "Loại Máy Con" tab
3. Click "Xóa" button for an existing machine subtype
4. Confirm deletion
**Expected Result:** Machine subtype is deleted and success message is displayed

## 4. Authentication Tests

### TC-4.1: Unauthenticated Access
**Description:** Verify that unauthenticated users cannot access the Machine Management page
**Preconditions:** User is not authenticated
**Steps:**
1. Try to navigate to the Machine Management page
**Expected Result:** User is redirected to the login page

### TC-4.2: API Authentication
**Description:** Verify that API endpoints require authentication
**Preconditions:** User is not authenticated
**Steps:**
1. Try to access any Machine Management API endpoint directly
**Expected Result:** API returns 401 Unauthorized error

## 5. Error Handling Tests

### TC-5.1: Invalid Input Validation
**Description:** Verify that the system validates input correctly
**Preconditions:** User is authenticated
**Steps:**
1. Try to add/edit a machine with invalid data (e.g., negative price)
**Expected Result:** System displays appropriate error message

### TC-5.2: Duplicate ID Handling
**Description:** Verify that the system prevents duplicate IDs
**Preconditions:** User is authenticated, machines/machine types/machine subtypes exist in the database
**Steps:**
1. Try to add a new machine/machine type/machine subtype with an existing ID
**Expected Result:** System displays appropriate error message

### TC-5.3: Network Error Handling
**Description:** Verify that the system handles network errors gracefully
**Preconditions:** User is authenticated
**Steps:**
1. Simulate a network error while performing CRUD operations
**Expected Result:** System displays appropriate error message 