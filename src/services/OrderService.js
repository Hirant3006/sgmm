const OrderService = {
  // Get all orders with filtering
  getOrders: async (filters = {}) => {
    try {
      // Convert the filters object to URL query params
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      
      // Add sorting params
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      // Add date filters
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
      
      // Add machine filters
      if (filters.machineId) queryParams.append('machineId', filters.machineId);
      if (filters.machineTypeId) queryParams.append('machineTypeId', filters.machineTypeId);
      if (filters.machineSubTypeId) queryParams.append('machineSubTypeId', filters.machineSubTypeId);
      
      // Add customer filters
      if (filters.customerName) queryParams.append('customerName', filters.customerName);
      if (filters.customerPhone) queryParams.append('customerPhone', filters.customerPhone);
      
      // Add other filters
      if (filters.source) queryParams.append('source', filters.source);
      if (filters.priceFrom) queryParams.append('priceFrom', filters.priceFrom);
      if (filters.priceTo) queryParams.append('priceTo', filters.priceTo);
      if (filters.costFrom) queryParams.append('costFrom', filters.costFrom);
      if (filters.costTo) queryParams.append('costTo', filters.costTo);
      if (filters.shippingFrom) queryParams.append('shippingFrom', filters.shippingFrom);
      if (filters.shippingTo) queryParams.append('shippingTo', filters.shippingTo);
      if (filters.purchaseLocation) queryParams.append('purchaseLocation', filters.purchaseLocation);
      
      const response = await fetch(`/api/orders?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải danh sách đơn đặt hàng');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Get order by ID
  getOrderById: async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải thông tin đơn đặt hàng');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo đơn đặt hàng mới');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing order
  updateOrder: async (id, orderData) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật đơn đặt hàng');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  
  // Delete an order
  deleteOrder: async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa đơn đặt hàng');
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};

export default OrderService; 