import React from 'react';
import { Table, Space, Button, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MachineTable = ({ machines, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã Máy',
      dataIndex: 'machine_id',
      key: 'machine_id',
      width: '15%',
      sorter: (a, b) => a.machine_id.localeCompare(b.machine_id),
    },
    {
      title: 'Tên Máy',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Loại Máy',
      dataIndex: 'machine_type_name',
      key: 'machine_type_name',
      width: '25%',
      sorter: (a, b) => a.machine_type_name.localeCompare(b.machine_type_name),
      render: (text, record) => (
        <span>{text}</span>
      ),
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      sorter: (a, b) => a.price - b.price,
      render: (price) => (
        <Text strong>{price.toLocaleString('vi-VN')} VND</Text>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa máy này?"
            description="Bạn có chắc muốn xóa máy này không?"
            onConfirm={() => onDelete(record.machine_id)}
            okText="Xóa"
            cancelText="Hủy"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={machines.map(machine => ({ ...machine, key: machine.machine_id }))}
      rowKey="machine_id"
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50'],
      }}
      bordered
      scroll={{ x: 800 }}
    />
  );
};

export default MachineTable; 