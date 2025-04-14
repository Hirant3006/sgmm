import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Tooltip, Tag, Typography, Popconfirm, Dropdown, Checkbox, Divider } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  ExclamationCircleOutlined,
  SettingOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { formatCurrency, formatDate } from '../../utils/formatters';

const { Text } = Typography;

const ActionButton = styled(Button)`
  padding: 0 8px;
`;

const ColumnSettingsWrapper = styled.div`
  padding: 8px;
  min-width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ColumnSettingsTitle = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  padding: 0 8px;
  color: #1890ff;
`;

const ColumnSettingsItem = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  margin: 2px 0;
  
  &:hover {
    background-color: #f0f7ff;
  }
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #fafafa;
    font-weight: 600;
    color: #333;
  }

  .ant-table-tbody > tr > td {
    padding: 12px 8px;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f5f5f5;
  }

  .ant-table-tbody > tr:nth-child(even) {
    background-color: #fafafa;
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PriceCell = styled.div`
  text-align: right;
  font-weight: 500;
`;

const NotesCell = styled.div`
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const STORAGE_KEY = 'orderTableColumnSettings';

const OrderTable = ({ orders, pagination, onChange, onEdit, onDelete }) => {
  const [columnSettings, setColumnSettings] = useState({
    id: true,
    date: true,
    machine_name: true,
    machine_type_name: true,
    machine_subtype_name: true,
    customer_name: true,
    source: true,
    price: true,
    cost_of_good: true,
    shipping_cost: true,
    profit: true,
    purchase_location: true,
    notes: true,
    action: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      setColumnSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleColumnSettingChange = (key, checked) => {
    const newSettings = {
      ...columnSettings,
      [key]: checked
    };
    setColumnSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const baseColumns = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text strong>{id}</Text>,
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Ngày Đặt',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatDate(date),
      sorter: true,
      defaultSortOrder: 'descend',
      width: 120,
    },
    {
      title: 'Máy',
      dataIndex: 'machine_name',
      key: 'machine_name',
      render: (machine_name, record) => (
        <Tooltip title={`ID: ${record.machine_id}`}>
          {machine_name || 'N/A'}
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: 'Loại Máy',
      dataIndex: 'machine_type_name',
      key: 'machine_type_name',
      width: 150,
      render: (machine_type_name) => {
        let color = 'default';
        switch (machine_type_name?.toLowerCase()) {
          case 'thường':
            color = 'blue';
            break;
          case 'siêu sạch':
            color = 'green';
            break;
          case 'xe cơm':
            color = 'orange';
            break;
          case 'xe lai':
            color = 'purple';
            break;
          default:
            color = 'default';
        }
        return (
          <Tag color={color}>
            {machine_type_name || 'N/A'}
          </Tag>
        );
      },
    },
    {
      title: 'Loại Máy Con',
      dataIndex: 'machine_subtype_name',
      key: 'machine_subtype_name',
      width: 150,
    },
    {
      title: 'Khách Hàng',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (customer_name, record) => (
        <CustomerInfo>
          {customer_name && <Text strong>{customer_name}</Text>}
          {record.customer_phone && <Text type="secondary">{record.customer_phone}</Text>}
        </CustomerInfo>
      ),
      width: 180,
    },
    {
      title: 'Nguồn',
      dataIndex: 'source',
      key: 'source',
      width: 120,
    },
    {
      title: 'Giá Bán',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <PriceCell>{formatCurrency(price)}</PriceCell>,
      sorter: true,
      width: 130,
      align: 'right',
    },
    {
      title: 'Giá Vốn',
      dataIndex: 'cost_of_good',
      key: 'cost_of_good',
      render: (cost) => <PriceCell>{formatCurrency(cost)}</PriceCell>,
      sorter: true,
      width: 130,
      align: 'right',
    },
    {
      title: 'Phí Vận Chuyển',
      dataIndex: 'shipping_cost',
      key: 'shipping_cost',
      render: (shipping) => shipping ? <PriceCell>{formatCurrency(shipping)}</PriceCell> : '',
      sorter: true,
      width: 150,
      align: 'right',
    },
    {
      title: 'Lợi Nhuận',
      key: 'profit',
      render: (_, record) => {
        const profit = 
          (record.price || 0) - 
          (record.cost_of_good || 0) - 
          (record.shipping_cost || 0);
        
        let color = 'green';
        if (profit < 0) color = 'red';
        else if (profit === 0) color = 'gray';
        
        return (
          <PriceCell>
            <Tag color={color}>
              {formatCurrency(profit)}
            </Tag>
          </PriceCell>
        );
      },
      width: 130,
      align: 'right',
    },
    {
      title: 'Nơi Mua',
      dataIndex: 'purchase_location',
      key: 'purchase_location',
      width: 150,
    },
    {
      title: 'Ghi Chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      render: (notes) => (
        <NotesCell>
          {notes}
        </NotesCell>
      ),
    },
    {
      title: 'Thao Tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa">
            <ActionButton 
              type="primary" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => onEdit(record)} 
            />
          </Tooltip>
          <Popconfirm
            title="Xóa đơn đặt hàng này?"
            description="Bạn có chắc chắn muốn xóa đơn đặt hàng này không?"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <ActionButton 
                danger 
                icon={<DeleteOutlined />} 
                size="small" 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns = baseColumns.filter(col => columnSettings[col.key || col.dataIndex]);

  const columnSettingsContent = (
    <ColumnSettingsWrapper>
      <ColumnSettingsTitle>Cài đặt hiển thị cột</ColumnSettingsTitle>
      <Divider style={{ margin: '8px 0' }} />
      {baseColumns.map(col => (
        <ColumnSettingsItem key={col.key || col.dataIndex}>
          <span>{col.title}</span>
          <Checkbox
            checked={columnSettings[col.key || col.dataIndex]}
            onChange={(e) => handleColumnSettingChange(col.key || col.dataIndex, e.target.checked)}
          />
        </ColumnSettingsItem>
      ))}
    </ColumnSettingsWrapper>
  );

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Dropdown 
          overlay={columnSettingsContent} 
          trigger={['click']}
          placement="bottomRight"
          overlayStyle={{
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Button 
            icon={<SettingOutlined />}
            type="primary"
            ghost
          >
            Cài đặt cột ({Object.values(columnSettings).filter(Boolean).length}/{baseColumns.length})
          </Button>
        </Dropdown>
      </div>
      <StyledTable
        columns={columns}
        dataSource={orders}
        rowKey="id"
        pagination={{
          ...pagination,
          position: ['bottomCenter'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} đơn hàng`
        }}
        onChange={onChange}
        scroll={{ x: 1800, y: 500 }}
        size="middle"
      />
    </div>
  );
};

export default OrderTable; 