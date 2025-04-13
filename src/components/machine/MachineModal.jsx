import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

const MachineModal = ({ visible, onCancel, onSubmit, machine, machineTypes }) => {
  const [form] = Form.useForm();
  const isEditing = !!machine;
  
  // Reset form when modal opens/closes or machine changes
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (machine) {
        // Fill form with machine data for editing
        form.setFieldsValue({
          name: machine.name,
          machine_type_id: machine.machine_type_id,
          price: machine.price,
        });
      }
    }
  }, [visible, machine, form]);
  
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        onSubmit(values);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title={isEditing ? "Cập Nhật Máy" : "Thêm Máy Mới"}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEditing ? "Cập Nhật" : "Thêm Mới"}
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="machine_form"
      >
        {isEditing && (
          <Form.Item label="Mã Máy">
            <Input value={machine?.machine_id} disabled style={{ color: '#666' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Mã máy không thể chỉnh sửa
            </Text>
          </Form.Item>
        )}
        
        <Form.Item
          name="name"
          label="Tên Máy"
          rules={[{ required: true, message: 'Vui lòng nhập tên máy!' }]}
        >
          <Input placeholder="Nhập tên máy" />
        </Form.Item>
        
        <Form.Item
          name="machine_type_id"
          label="Loại Máy"
          rules={[{ required: true, message: 'Vui lòng chọn loại máy!' }]}
        >
          <Select placeholder="Chọn loại máy">
            {machineTypes && machineTypes.map(type => (
              <Option key={type.machine_type_id} value={type.machine_type_id}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="price"
          label="Giá (VND)"
          rules={[
            { required: true, message: 'Vui lòng nhập giá!' },
            { 
              validator: (_, value) => {
                if (value === undefined || value === null) {
                  return Promise.resolve();
                }
                if (value < 0) {
                  return Promise.reject('Giá phải lớn hơn hoặc bằng 0!');
                }
                return Promise.resolve();
              }
            }
          ]}
          initialValue={0}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            min={0}
            placeholder="Nhập giá"
            addonAfter="VND"
          />
        </Form.Item>
      </Form>
      
      {!isEditing && (
        <Text type="secondary">
          Lưu ý: Mã máy sẽ được tự động tạo bởi hệ thống
        </Text>
      )}
    </Modal>
  );
};

export default MachineModal; 