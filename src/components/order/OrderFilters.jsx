import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select, DatePicker, Button, InputNumber, Divider } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useOrder } from '../../context/OrderContext';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterButton = styled(Button)`
  min-width: 100px;
`;

const FilterRow = styled(Row)`
  margin-bottom: 16px;
`;

const OrderFilters = ({ machineTypes, machines, machineSubTypes }) => {
  const { filters, updateFilters, clearFilters } = useOrder();
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);

  // Reset form when filters are cleared externally
  useEffect(() => {
    if (
      !filters.dateFrom && 
      !filters.dateTo && 
      !filters.machineId && 
      !filters.machineTypeId && 
      !filters.machineSubTypeId && 
      !filters.customerName && 
      !filters.customerPhone && 
      !filters.source && 
      !filters.priceFrom && 
      !filters.priceTo && 
      !filters.costFrom && 
      !filters.costTo && 
      !filters.shippingFrom && 
      !filters.shippingTo && 
      !filters.purchaseLocation
    ) {
      form.resetFields();
      setDateRange([]);
    }
  }, [filters, form]);

  // Apply filters
  const handleApplyFilters = (values) => {
    const newFilters = { ...values };
    
    // Handle date range
    if (values.dateRange && values.dateRange.length === 2) {
      newFilters.dateFrom = values.dateRange[0].format('YYYY-MM-DD');
      newFilters.dateTo = values.dateRange[1].format('YYYY-MM-DD');
    }
    
    // Remove dateRange from filters as it's not needed by the API
    delete newFilters.dateRange;
    
    updateFilters(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    form.resetFields();
    setDateRange([]);
    clearFilters();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleApplyFilters}
      initialValues={{
        machineId: filters.machineId,
        machineTypeId: filters.machineTypeId,
        machineSubTypeId: filters.machineSubTypeId,
        customerName: filters.customerName,
        customerPhone: filters.customerPhone,
        source: filters.source,
        priceFrom: filters.priceFrom,
        priceTo: filters.priceTo,
        costFrom: filters.costFrom,
        costTo: filters.costTo,
        shippingFrom: filters.shippingFrom,
        shippingTo: filters.shippingTo,
        purchaseLocation: filters.purchaseLocation,
      }}
    >
      <FilterRow gutter={16}>
        <Col xs={24} sm={24} md={8} lg={6}>
          <Form.Item label="Khoảng Thời Gian" name="dateRange">
            <RangePicker 
              style={{ width: '100%' }} 
              locale={locale}
              value={dateRange}
              onChange={setDateRange}
              allowClear
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Máy" name="machineId">
            <Select 
              placeholder="Chọn máy" 
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {machines.map(machine => (
                <Option key={machine.machine_id} value={machine.machine_id}>
                  {machine.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Loại Máy" name="machineTypeId">
            <Select 
              placeholder="Chọn loại máy" 
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {machineTypes.map(type => (
                <Option key={type.machine_type_id} value={type.machine_type_id}>
                  {type.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Loại Máy Con" name="machineSubTypeId">
            <Select 
              placeholder="Chọn loại máy con" 
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {machineSubTypes.map(subtype => (
                <Option key={subtype.machine_subtype_id} value={subtype.machine_subtype_id}>
                  {subtype.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </FilterRow>
      
      <FilterRow gutter={16}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Tên Khách Hàng" name="customerName">
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Số Điện Thoại" name="customerPhone">
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Nguồn" name="source">
            <Input placeholder="Nhập nguồn" />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label="Nơi Mua" name="purchaseLocation">
            <Input placeholder="Nhập nơi mua" />
          </Form.Item>
        </Col>
      </FilterRow>
      
      <FilterRow gutter={16}>
        <Col xs={24} sm={12} md={6} lg={3}>
          <Form.Item label="Giá Bán Từ" name="priceFrom">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Từ"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={3}>
          <Form.Item label="Đến" name="priceTo">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Đến"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={3}>
          <Form.Item label="Giá Vốn Từ" name="costFrom">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Từ"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={3}>
          <Form.Item label="Đến" name="costTo">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Đến"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={3}>
          <Form.Item label="Phí Vận Chuyển Từ" name="shippingFrom">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Từ"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={3}>
          <Form.Item label="Đến" name="shippingTo">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Đến"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
      </FilterRow>
      
      <Divider style={{ margin: '0 0 16px' }} />
      
      <Row justify="end" gutter={16}>
        <Col>
          <FilterButton 
            icon={<ClearOutlined />} 
            onClick={handleClearFilters}
          >
            Xóa Bộ Lọc
          </FilterButton>
        </Col>
        <Col>
          <FilterButton 
            type="primary" 
            icon={<FilterOutlined />}
            htmlType="submit"
          >
            Áp Dụng
          </FilterButton>
        </Col>
      </Row>
    </Form>
  );
};

export default OrderFilters; 