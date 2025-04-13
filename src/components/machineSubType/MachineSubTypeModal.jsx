import React from 'react';
import { Modal, Form, Input } from 'antd';

const MachineSubTypeModal = ({ visible, onCancel, onSubmit, machineSubType }) => {
  const [form] = Form.useForm();

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
      title={machineSubType ? 'Sửa Loại Máy Con' : 'Thêm Loại Máy Con Mới'}
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
        <Form.Item
          name="machine_subtype_id"
          label="Mã Loại Máy Con"
          rules={[
            { required: true, message: 'Vui lòng nhập mã loại máy con' },
          ]}
        >
          <Input disabled={!!machineSubType} />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên Loại Máy Con"
          rules={[
            { required: true, message: 'Vui lòng nhập tên loại máy con' },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MachineSubTypeModal; 