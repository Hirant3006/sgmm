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
          machine_id: machine.machine_id,
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
        <Form.Item
          name="machine_id"
          label="Mã Máy"
          rules={[
            { required: true, message: 'Vui lòng nhập mã máy!' },
            { pattern: /^[a-zA-Z0-9]+$/, message: 'Mã máy chỉ được chứa chữ cái và số!' },
          ]}
        >
          <Input 
            disabled={isEditing} 
            placeholder="Nhập mã máy" 
          />
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
            { type: 'number', min: 0, message: 'Giá không được âm!' },
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
      
      {isEditing && (
        <Text type="secondary">Lưu ý: Không thể chỉnh sửa mã máy</Text>
      )}
    </Modal>
  );
};

export default MachineModal; 