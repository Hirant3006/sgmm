import React from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const MachineSubTypeTable = ({ machineSubTypes, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã Loại Máy Con',
      dataIndex: 'machine_subtype_id',
      key: 'machine_subtype_id',
      sorter: (a, b) => a.machine_subtype_id.localeCompare(b.machine_subtype_id),
    },
    {
      title: 'Tên Loại Máy Con',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Thao Tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa loại máy con này?"
            onConfirm={() => onDelete(record.machine_subtype_id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
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
      dataSource={machineSubTypes}
      rowKey="machine_subtype_id"
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng số ${total} loại máy con`,
      }}
    />
  );
};

export default MachineSubTypeTable; 