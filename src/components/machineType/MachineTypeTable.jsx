import React from 'react';
import { Table, Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const MachineTypeTable = ({ machineTypes, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã Loại Máy',
      dataIndex: 'machine_type_id',
      key: 'machine_type_id',
      width: '30%',
      sorter: (a, b) => a.machine_type_id.localeCompare(b.machine_type_id),
    },
    {
      title: 'Tên Loại Máy',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: '30%',
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
            title="Xóa loại máy này?"
            description="Bạn có chắc muốn xóa loại máy này không?"
            onConfirm={() => onDelete(record.machine_type_id)}
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
      dataSource={machineTypes.map(type => ({ ...type, key: type.machine_type_id }))}
      rowKey="machine_type_id"
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

export default MachineTypeTable; 