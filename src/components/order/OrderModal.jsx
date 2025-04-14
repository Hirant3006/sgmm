import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button, 
  Divider,
  Row,
  Col,
  Typography,
  Descriptions
} from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { formatCurrency } from '../../utils/formatters';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const StyledModal = styled(Modal)`
  top: 20px;
  
  .ant-modal-content {
    max-height: calc(100vh - 40px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
  }
  
  .ant-modal-body {
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    padding: 24px;
    width: 100%;
  }
  
  @media (max-width: 860px) {
    width: 95vw !important;
    max-width: 95vw !important;
    
    .ant-modal-content {
      max-width: 100%;
    }
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item-label {
    font-weight: 500;
  }
  
  width: 100%;
`;

const SummarySection = styled.div`
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
  width: 100%;
`;

const OrderModal = ({ 
  visible, 
  onCancel, 
  onSubmit, 
  initialValues, 
  title, 
  machineTypes, 
  machines, 
  machineSubTypes 
}) => {
  const [form] = Form.useForm();
  const [filteredMachines, setFilteredMachines] = useState(machines);
  const [filteredSubTypes, setFilteredSubTypes] = useState([]);
  const [selectedMachineType, setSelectedMachineType] = useState(null);
  const [profit, setProfit] = useState(0);
  
  // Set initial form values when modal opens
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        // Convert date string to Dayjs object for DatePicker
        const dateValue = initialValues.date ? dayjs(initialValues.date) : null;
        
        // Set the form values
        form.setFieldsValue({
          ...initialValues,
          date: dateValue,
        });
        
        // Calculate profit
        calculateProfit(
          initialValues.price,
          initialValues.cost_of_good,
          initialValues.shipping_cost
        );
        
        // If we have a machine type, filter machines and subtypes
        if (initialValues.machine_type_id) {
          setSelectedMachineType(initialValues.machine_type_id);
          filterMachinesByType(initialValues.machine_type_id);
        }
      } else {
        // For new orders, set today's date
        form.setFieldsValue({
          date: dayjs(),
        });
        
        // Reset other form fields
        setSelectedMachineType(null);
        setFilteredMachines(machines);
        setFilteredSubTypes([]);
      }
    }
  }, [visible, form, initialValues, machines, machineSubTypes]);
  
  // Filter machines when machine type changes
  const filterMachinesByType = (machineTypeId) => {
    if (!machineTypeId) {
      setFilteredMachines(machines);
      setFilteredSubTypes([]);
      return;
    }
    
    // Filter machines by machine_type_id
    const filtered = machines.filter(machine => 
      machine.machine_type_id === machineTypeId
    );
    setFilteredMachines(filtered);
    
    // Filter subtypes - note that machine subtypes may not have machine_type_id directly
    // We'll need to adapt this based on your data structure
    const filteredSubs = machineSubTypes;
    setFilteredSubTypes(filteredSubs);
  };
  
  // Handle machine type change
  const handleMachineTypeChange = (value) => {
    setSelectedMachineType(value);
    filterMachinesByType(value);
    
    // Clear machine and subtype selections
    form.setFieldsValue({
      machine_id: undefined,
      machine_subtype_id: undefined
    });
  };
  
  // Handle machine selection to auto-fill cost_of_good
  const handleMachineChange = (machineId) => {
    if (machineId) {
      // Find the selected machine
      const selectedMachine = machines.find(machine => machine.machine_id === machineId);
      
      if (selectedMachine && selectedMachine.price) {
        // Auto-fill the cost_of_good with the machine price
        form.setFieldsValue({
          cost_of_good: selectedMachine.price
        });
        
        // Update profit calculation
        const price = form.getFieldValue('price') || 0;
        const shipping = form.getFieldValue('shipping_cost') || 0;
        calculateProfit(price, selectedMachine.price, shipping);
      }
    }
  };
  
  // Calculate profit based on price, cost, and shipping
  const calculateProfit = (price, cost, shipping) => {
    price = parseFloat(price) || 0;
    cost = parseFloat(cost) || 0;
    shipping = parseFloat(shipping) || 0;
    
    const profitValue = price - cost - shipping;
    setProfit(profitValue);
    
    return profitValue;
  };
  
  // Handle price, cost, or shipping change to update profit
  const handleFinancialChange = () => {
    const price = form.getFieldValue('price');
    const cost = form.getFieldValue('cost_of_good');
    const shipping = form.getFieldValue('shipping_cost');
    
    calculateProfit(price, cost, shipping);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Convert date object to string
      if (values.date) {
        values.date = values.date.format('YYYY-MM-DD');
      }
      
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <StyledModal
      title={title}
      open={visible}
      width="800px"
      centered
      onCancel={onCancel}
      bodyStyle={{ padding: 0 }}
      footer={[
        <Button key="cancel" icon={<CloseOutlined />} onClick={onCancel}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          icon={<SaveOutlined />} 
          onClick={handleSubmit}
        >
          Lưu
        </Button>
      ]}
    >
      <StyledForm
        form={form}
        layout="vertical"
        requiredMark="optional"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="date"
              label="Ngày Đặt Hàng"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                locale={locale}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={16}>
            <Form.Item
              name="machine_type_id"
              label="Loại Máy"
              rules={[{ required: true, message: 'Vui lòng chọn loại máy' }]}
            >
              <Select 
                placeholder="Chọn loại máy" 
                onChange={handleMachineTypeChange}
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
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="machine_id"
              label="Máy"
              rules={[{ required: true, message: 'Vui lòng chọn máy' }]}
            >
              <Select 
                placeholder="Chọn máy" 
                disabled={!selectedMachineType}
                showSearch
                optionFilterProp="children"
                onChange={handleMachineChange}
              >
                {filteredMachines.map(machine => (
                  <Option key={machine.machine_id} value={machine.machine_id}>
                    {machine.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="machine_subtype_id"
              label="Loại Máy Con"
              rules={[{ required: true, message: 'Vui lòng chọn loại máy con' }]}
            >
              <Select 
                placeholder="Chọn loại máy con" 
                disabled={!selectedMachineType}
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
        </Row>
        
        <Divider orientation="left">Thông Tin Khách Hàng</Divider>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="customer_name"
              label="Tên Khách Hàng"
            >
              <Input placeholder="Nhập tên khách hàng" />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="customer_phone"
              label="Số Điện Thoại"
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="source"
              label="Nguồn xe"
            >
              <Input placeholder="Ví dụ: Facebook, Zalo, ..." />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="purchase_location"
              label="Nơi Mua"
            >
              <Input placeholder="Địa điểm mua hàng" />
            </Form.Item>
          </Col>
        </Row>
        
        <Divider orientation="left">Thông Tin Tài Chính</Divider>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="price"
              label="Giá Bán"
              rules={[{ required: true, message: 'Vui lòng nhập giá bán' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập giá bán"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                onChange={handleFinancialChange}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={8}>
            <Form.Item
              name="cost_of_good"
              label="Giá Vốn"
              tooltip="Tự động điền giá theo máy đã chọn, có thể chỉnh sửa thủ công"
              rules={[{ required: true, message: 'Vui lòng nhập giá vốn' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập giá vốn"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                onChange={handleFinancialChange}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={8}>
            <Form.Item
              name="shipping_cost"
              label="Phí Vận Chuyển"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập phí vận chuyển"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0}
                onChange={handleFinancialChange}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <SummarySection>
          <Descriptions title="Tóm Tắt" column={1} bordered size="small">
            <Descriptions.Item label="Lợi Nhuận">
              <Text 
                strong 
                type={profit > 0 ? 'success' : profit < 0 ? 'danger' : 'secondary'}
              >
                {formatCurrency(profit)}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </SummarySection>
        
        <Form.Item
          name="notes"
          label="Ghi Chú"
          style={{ marginTop: 16 }}
        >
          <TextArea 
            placeholder="Nhập ghi chú (nếu có)" 
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </StyledForm>
    </StyledModal>
  );
};

export default OrderModal; 