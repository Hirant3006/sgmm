import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import OrderService from '../services/orderService';

// Create order context
const OrderContext = createContext();

// Order provider component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Fetch orders with current filters and pagination
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await OrderService.getOrders(queryParams);
      
      setOrders(response.data || []);
      setPagination({
        ...pagination,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 0
      });
    } catch (error) {
      setError(error.message);
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Fetch orders when filters or pagination changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Get a single order by ID
  const getOrderById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await OrderService.getOrderById(id);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error('Error fetching order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await OrderService.createOrder(orderData);
      
      // Refresh orders list
      fetchOrders();
      
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error('Error creating order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing order
  const updateOrder = async (id, orderData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await OrderService.updateOrder(id, orderData);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === id ? response.data : order
      ));
      
      // If updating current order, update it
      if (currentOrder && currentOrder.id === id) {
        setCurrentOrder(response.data);
      }
      
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error('Error updating order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await OrderService.deleteOrder(id);
      
      // Update local state
      setOrders(orders.filter(order => order.id !== id));
      
      // If deleting current order, clear it
      if (currentOrder && currentOrder.id === id) {
        setCurrentOrder(null);
      }
      
      return true;
    } catch (error) {
      setError(error.message);
      console.error('Error deleting order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    // Reset to page 1 when filters change
    setPagination({
      ...pagination,
      page: 1
    });
    
    setFilters({
      ...filters,
      ...newFilters
    });
  };

  // Update pagination
  const updatePagination = (newPagination) => {
    setPagination({
      ...pagination,
      ...newPagination
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      sortBy: 'date',
      sortOrder: 'desc'
    });
    
    setPagination({
      ...pagination,
      page: 1
    });
  };

  // Context value
  const value = {
    orders,
    currentOrder,
    setCurrentOrder,
    loading,
    error,
    pagination,
    filters,
    fetchOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    updateFilters,
    updatePagination,
    clearFilters
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use the order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext; 