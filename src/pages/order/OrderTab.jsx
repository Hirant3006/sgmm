import React, { useState, useEffect } from 'react';
import { Button, Space, message, Spin, Typography, Card, Row, Col } from 'antd';
import { PlusOutlined, FilterOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import OrderTable from '../../components/order/OrderTable';
import OrderModal from '../../components/order/OrderModal';
import OrderFilters from '../../components/order/OrderFilters';
import { useOrder } from '../../context/OrderContext';
import styled from 'styled-components';

const { Title } = Typography;

const StyledCard = styled(Card)`
  margin-bottom: 20px;
`;

const ActionButton = styled(Button)`
  min-width: 100px;
`;

const OrderTab = () => {
  const {
    orders,
    loading,
    error,
    pagination,
    filters,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    setCurrentOrder,
    currentOrder,
    updatePagination,
    clearFilters
  } = useOrder();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [machineTypes, setMachineTypes] = useState([]);
  const [machines, setMachines] = useState([]);
  const [machineSubTypes, setMachineSubTypes] = useState([]);

  // Fetch machine types, machines, and subtypes for dropdowns
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        // Fetch machine types
        const machineTypesResponse = await fetch('/api/machine-types', {
          credentials: 'include'
        });
        
        if (!machineTypesResponse.ok) {
          throw new Error('Không thể tải dữ liệu loại máy');
        }
        
        const machineTypesData = await machineTypesResponse.json();
        setMachineTypes(machineTypesData.data || []);
        
        // Fetch machines
        const machinesResponse = await fetch('/api/machines', {
          credentials: 'include'
        });
        
        if (!machinesResponse.ok) {
          throw new Error('Không thể tải dữ liệu máy móc');
        }
        
        const machinesData = await machinesResponse.json();
        setMachines(machinesData.data || []);
        
        // Fetch machine subtypes
        const machineSubTypesResponse = await fetch('/api/machine-subtypes', {
          credentials: 'include'
        });
        
        if (!machineSubTypesResponse.ok) {
          throw new Error('Không thể tải dữ liệu loại máy con');
        }
        
        const machineSubTypesData = await machineSubTypesResponse.json();
        setMachineSubTypes(machineSubTypesData.data || []);
      } catch (err) {
        message.error(err.message);
      }
    };
    
    fetchReferenceData();
  }, []);

  // Show modal for adding new order
  const showAddModal = () => {
    setCurrentOrder(null);
    setIsModalVisible(true);
  };

  // Show modal for editing an order
  const editOrder = (order) => {
    setCurrentOrder(order);
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentOrder(null);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (values) => {
    try {
      if (currentOrder) {
        // Update existing order
        await updateOrder(currentOrder.id, values);
        message.success('Cập nhật đơn đặt hàng thành công');
      } else {
        // Create new order
        await createOrder(values);
        message.success('Thêm đơn đặt hàng mới thành công');
      }
      setIsModalVisible(false);
      setCurrentOrder(null);
    } catch (error) {
      message.error(error.message);
    }
  };

  // Handle order deletion
  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      message.success('Xóa đơn đặt hàng thành công');
    } catch (error) {
      message.error(error.message);
    }
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    updatePagination({ page, limit: pageSize });
  };

  // Handle table change (for sorting)
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field && sorter.order) {
      const sortBy = sorter.field;
      const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
      
      // Only update if changed
      if (sortBy !== filters.sortBy || sortOrder !== filters.sortOrder) {
        const updatedFilters = {
          ...filters,
          sortBy,
          sortOrder
        };
        updatePagination(updatedFilters);
      }
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    clearFilters();
    message.success('Đã xóa tất cả bộ lọc');
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchOrders();
    message.success('Đã làm mới dữ liệu');
  };

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>Quản Lý Đơn Đặt Hàng</Title>
        </Col>
        <Col>
          <Space>
            <ActionButton 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
            >
              Thêm Mới
            </ActionButton>
            <ActionButton 
              icon={<FilterOutlined />} 
              onClick={toggleFilters}
              type={isFiltersVisible ? 'primary' : 'default'}
            >
              Bộ Lọc
            </ActionButton>
            <ActionButton 
              icon={<ClearOutlined />} 
              onClick={handleClearFilters}
            >
              Xóa Lọc
            </ActionButton>
            <ActionButton 
              icon={<ReloadOutlined />} 
              onClick={handleRefresh}
            >
              Làm Mới
            </ActionButton>
          </Space>
        </Col>
      </Row>

      {isFiltersVisible && (
        <StyledCard>
          <OrderFilters
            machineTypes={machineTypes}
            machines={machines}
            machineSubTypes={machineSubTypes}
          />
        </StyledCard>
      )}

      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

      <Spin spinning={loading}>
        <OrderTable
          orders={orders}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: handlePaginationChange
          }}
          onChange={handleTableChange}
          onEdit={editOrder}
          onDelete={handleDelete}
        />
      </Spin>

      {isModalVisible && (
        <OrderModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          initialValues={currentOrder}
          machineTypes={machineTypes}
          machines={machines}
          machineSubTypes={machineSubTypes}
          title={currentOrder ? 'Cập Nhật Đơn Đặt Hàng' : 'Thêm Đơn Đặt Hàng Mới'}
        />
      )}
    </div>
  );
};

export default OrderTab; 