# Máy Móc Quản Lý - Tài Liệu Kỹ Thuật

## 1. Tổng Quan

Tài liệu này mô tả chi tiết kỹ thuật cho chức năng quản lý máy móc, loại máy và phân loại máy phụ. Chức năng này cho phép người dùng đã xác thực thực hiện các thao tác CRUD (Tạo, Đọc, Cập nhật, Xóa) đối với các thực thể máy móc và loại máy.

## 2. Kiến Trúc Hệ Thống

### 2.1 Kiến Trúc Tổng Quan

Hệ thống sẽ tuân theo kiến trúc hiện có với phần frontend React và backend Express. Dữ liệu sẽ được lưu trữ trong PostgreSQL.

```
+-------------+       +------------+        +------------+
|             |       |            |        |            |
|  Frontend   | <---> |  Backend   | <----> | PostgreSQL |
|  (React)    |       |  (Express) |        | Database   |
|             |       |            |        |            |
+-------------+       +------------+        +------------+
```

### 2.2 Cấu Trúc Dữ Liệu

#### 2.2.1 Bảng Máy Móc (Machines)
```sql
CREATE TABLE machines (
    machine_id VARCHAR(50) PRIMARY KEY,
    machine_type_id VARCHAR(50) NOT NULL,
    price DECIMAL(15, 2) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (machine_type_id) REFERENCES machine_types(machine_type_id)
);
```

#### 2.2.2 Bảng Loại Máy (Machine Types)
```sql
CREATE TABLE machine_types (
    machine_type_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. Thiết Kế Frontend

### 3.1 Cấu Trúc Trang

Trang quản lý máy móc sẽ có một giao diện tab để chuyển đổi giữa quản lý máy móc và quản lý loại máy.

```
+------------------------------------------------------------------+
|                                                                  |
|  [Tab Máy Móc]   [Tab Loại Máy]                                  |
|                                                                  |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  [Nút Thêm Mới]                                            |  |
|  |                                                            |  |
|  |  +------------------------------------------------------+  |  |
|  |  |                                                      |  |  |
|  |  |  Bảng Dữ Liệu                                        |  |  |
|  |  |  +---------------+------------+------------+-------+ |  |  |
|  |  |  | Mã Máy        | Loại Máy   | Giá (VND)  | Thao  | |  |  |
|  |  |  |               |            |            | Tác   | |  |  |
|  |  |  +---------------+------------+------------+-------+ |  |  |
|  |  |  | ...           | ...        | ...        | ...   | |  |  |
|  |  |  +---------------+------------+------------+-------+ |  |  |
|  |  |                                                      |  |  |
|  |  +------------------------------------------------------+  |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                  |
+------------------------------------------------------------------+
```

### 3.2 Các Component Chính

1. **MachineManagementPage**: Container chính chứa các tab và logic chuyển tab
2. **MachineTable**: Bảng hiển thị danh sách máy móc với các tính năng sắp xếp và phân trang
3. **MachineTypeTable**: Bảng hiển thị danh sách loại máy
4. **MachineModal**: Form modal cho việc thêm mới/chỉnh sửa máy móc
5. **MachineTypeModal**: Form modal cho việc thêm mới/chỉnh sửa loại máy
6. **Common Components**: Các thành phần chung như nút, thông báo, v.v.

### 3.3 Luồng Dữ Liệu

Dữ liệu sẽ được quản lý thông qua hooks và các API calls. Chúng ta sẽ sử dụng React Context để quản lý trạng thái toàn cục nếu cần thiết.

### 3.4 Phân Quyền và Bảo Mật

Người dùng cần được xác thực để truy cập trang. Chúng ta sẽ sử dụng middleware bảo vệ các route và kiểm tra trạng thái đăng nhập ở phía client.

## 4. Thiết Kế Backend

### 4.1 API Endpoints

#### 4.1.1 Machine Endpoints

- `GET /api/machines`: Lấy danh sách tất cả máy móc
- `GET /api/machines/:id`: Lấy thông tin một máy cụ thể
- `POST /api/machines`: Tạo máy mới
- `PUT /api/machines/:id`: Cập nhật thông tin máy
- `DELETE /api/machines/:id`: Xóa máy

#### 4.1.2 Machine Type Endpoints

- `GET /api/machine-types`: Lấy danh sách tất cả loại máy
- `GET /api/machine-types/:id`: Lấy thông tin một loại máy cụ thể
- `POST /api/machine-types`: Tạo loại máy mới
- `PUT /api/machine-types/:id`: Cập nhật thông tin loại máy
- `DELETE /api/machine-types/:id`: Xóa loại máy

### 4.2 Middleware

- **Authentication Middleware**: Kiểm tra người dùng đã đăng nhập chưa
- **Validation Middleware**: Kiểm tra dữ liệu đầu vào

### 4.3 Controllers

- **MachineController**: Xử lý các request liên quan đến máy móc
- **MachineTypeController**: Xử lý các request liên quan đến loại máy

### 4.4 Models

- **Machine Model**: Đại diện cho thực thể máy móc
- **MachineType Model**: Đại diện cho thực thể loại máy

## 5. Kế Hoạch Triển Khai

### 5.1 Backend

1. Tạo các bảng trong database
2. Tạo models
3. Tạo controllers
4. Tạo middlewares
5. Thiết lập routes

### 5.2 Frontend

1. Tạo cấu trúc thư mục
2. Tạo các components cơ bản
3. Thiết lập routing
4. Tích hợp API
5. Thêm xử lý lỗi và thông báo

### 5.3 Tích Hợp và Testing

1. Tích hợp frontend và backend
2. Kiểm thử chức năng CRUD
3. Kiểm thử xác thực và phân quyền
4. Kiểm thử UI/UX

## 6. Yêu Cầu Phi Chức Năng

### 6.1 Hiệu Năng
- Thời gian phản hồi các API không quá 500ms
- Tối ưu hóa hiệu suất tải trang

### 6.2 Bảo Mật
- Xác thực người dùng cho tất cả API endpoints
- Kiểm tra quyền truy cập
- Làm sạch đầu vào để ngăn chặn SQL injection
- Sử dụng HTTPS

### 6.3 Khả Năng Bảo Trì
- Mã nguồn có tổ chức rõ ràng
- Sử dụng các thực hành phát triển tốt nhất
- Ghi nhật ký đầy đủ cho các thao tác quan trọng

### 6.4 Trải Nghiệm Người Dùng
- Giao diện đáp ứng, hoạt động tốt trên các kích thước màn hình khác nhau
- Hỗ trợ các tính năng trợ năng
- Thông báo rõ ràng về thành công/lỗi
- Hỗ trợ phím tắt và tối ưu hóa form

## 7. Chi Tiết Thực Hiện

### 7.1 Cấu Trúc Thư Mục Frontend

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   └── Table.jsx
│   ├── machine/
│   │   ├── MachineTable.jsx
│   │   ├── MachineModal.jsx
│   │   └── MachineDeleteConfirm.jsx
│   └── machineType/
│       ├── MachineTypeTable.jsx
│       ├── MachineTypeModal.jsx
│       └── MachineTypeDeleteConfirm.jsx
├── pages/
│   └── MachineManagementPage.jsx
├── context/
│   └── MachineContext.jsx
└── services/
    ├── machineService.js
    └── machineTypeService.js
```

### 7.2 Cấu Trúc Thư Mục Backend

```
src/
├── controllers/
│   ├── machineController.js
│   └── machineTypeController.js
├── models/
│   ├── Machine.js
│   └── MachineType.js
├── middleware/
│   ├── auth.js
│   └── validator.js
├── routes/
│   ├── machineRoutes.js
│   └── machineTypeRoutes.js
└── services/
    ├── machineService.js
    └── machineTypeService.js
```

## 8. Triển Khai API

### 8.1 Machine API

#### 8.1.1 GET /api/machines
```json
{
  "success": true,
  "data": [
    {
      "machine_id": "M001",
      "machine_type_id": "MT001",
      "machine_type_name": "Máy Pha Cà Phê",
      "price": 5000000
    }
  ],
  "total": 1
}
```

#### 8.1.2 POST /api/machines
Request:
```json
{
  "machine_id": "M002",
  "machine_type_id": "MT001",
  "price": 6000000
}
```

Response:
```json
{
  "success": true,
  "data": {
    "machine_id": "M002",
    "machine_type_id": "MT001",
    "machine_type_name": "Máy Pha Cà Phê",
    "price": 6000000
  }
}
```

### 8.2 Machine Type API

#### 8.2.1 GET /api/machine-types
```json
{
  "success": true,
  "data": [
    {
      "machine_type_id": "MT001",
      "name": "Máy Pha Cà Phê"
    }
  ],
  "total": 1
}
```

#### 8.2.2 POST /api/machine-types
Request:
```json
{
  "machine_type_id": "MT002",
  "name": "Máy Xay Cà Phê"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "machine_type_id": "MT002",
    "name": "Máy Xay Cà Phê"
  }
}
```

## 9. Validation Rules

### 9.1 Machine Validation
- `machine_id`: Bắt buộc, định dạng hợp lệ (chỉ chữ và số)
- `machine_type_id`: Bắt buộc, phải tồn tại trong bảng machine_types
- `price`: Số không âm, mặc định 0

### 9.2 Machine Type Validation
- `machine_type_id`: Bắt buộc, định dạng hợp lệ (chỉ chữ và số)
- `name`: Bắt buộc, độ dài từ 2-100 ký tự

## 10. Toast Notifications

### 10.1 Success Messages
- Thêm máy thành công
- Cập nhật máy thành công
- Xóa máy thành công
- Thêm loại máy thành công
- Cập nhật loại máy thành công
- Xóa loại máy thành công

### 10.2 Error Messages
- Lỗi khi tạo/cập nhật/xóa
- Lỗi dữ liệu không hợp lệ
- Lỗi không tìm thấy dữ liệu
- Lỗi xác thực
``` 