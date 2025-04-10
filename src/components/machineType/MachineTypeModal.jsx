import React, { useEffect } from 'react';
import { Modal, Form, Input, Typography } from 'antd';

const { Text } = Typography;

const MachineTypeModal = ({ visible, onCancel, onSubmit, machineType }) => {
  const [form] = Form.useForm();
  const isEditing = !!machineType;
  
  // Reset form when modal opens/closes or machineType changes
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (machineType) {
        // Fill form with machine type data for editing
        form.setFieldsValue({
          machine_type_id: machineType.machine_type_id,
          name: machineType.name,
        });
      }
    }
  }, [visible, machineType, form]);
  
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
      title={isEditing ? "Cập Nhật Loại Máy" : "Thêm Loại Máy Mới"}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={isEditing ? "Cập Nhật" : "Thêm Mới"}
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        name="machine_type_form"
      >
        <Form.Item
          name="machine_type_id"
          label="Mã Loại Máy"
          rules={[
            { required: true, message: 'Vui lòng nhập mã loại máy!' },
            { pattern: /^[a-zA-Z0-9]+$/, message: 'Mã loại máy chỉ được chứa chữ cái và số!' },
          ]}
        >
          <Input 
            disabled={isEditing} 
            placeholder="Nhập mã loại máy" 
          />
        </Form.Item>
        
        <Form.Item
          name="name"
          label="Tên Loại Máy"
          rules={[
            { required: true, message: 'Vui lòng nhập tên loại máy!' },
            { min: 2, message: 'Tên loại máy phải có ít nhất 2 ký tự!' },
            { max: 100, message: 'Tên loại máy không được vượt quá 100 ký tự!' },
          ]}
        >
          <Input placeholder="Nhập tên loại máy" />
        </Form.Item>
      </Form>
      
      {isEditing && (
        <Text type="secondary">Lưu ý: Không thể chỉnh sửa mã loại máy</Text>
      )}
    </Modal>
  );
};

export default MachineTypeModal; 