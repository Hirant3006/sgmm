import React from 'react';
import { Modal, Form, Input, Typography } from 'antd';

const { Text } = Typography;

const MachineSubTypeModal = ({ visible, onCancel, onSubmit, machineSubType }) => {
  const [form] = Form.useForm();
  const isEditing = !!machineSubType;

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? 'Sửa Loại Máy Con' : 'Thêm Loại Máy Con Mới'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={machineSubType}
      >
        {isEditing && (
          <Form.Item label="Mã Loại Máy Con">
            <Input value={machineSubType?.machine_subtype_id} disabled style={{ color: '#666' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Mã loại máy con không thể chỉnh sửa
            </Text>
          </Form.Item>
        )}
        
        <Form.Item
          name="name"
          label="Tên Loại Máy Con"
          rules={[
            { required: true, message: 'Vui lòng nhập tên loại máy con' },
            { min: 2, message: 'Tên loại máy con phải có ít nhất 2 ký tự!' },
            { max: 100, message: 'Tên loại máy con không được vượt quá 100 ký tự!' }
          ]}
        >
          <Input placeholder="Nhập tên loại máy con" />
        </Form.Item>
      </Form>
      
      {!isEditing && (
        <Text type="secondary">
          Lưu ý: Mã loại máy con sẽ được tự động tạo bởi hệ thống
        </Text>
      )}
    </Modal>
  );
};

export default MachineSubTypeModal; 