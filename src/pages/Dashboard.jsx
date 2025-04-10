import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Typography,
  Button,
  Space,
  Menu
} from 'antd';
import {
  ShoppingOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import MachineManagementPage from './machine/MachineManagementPage';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Handle menu selection
  const handleMenuSelect = ({ key }) => {
    setSelectedMenu(key);
  };

  // Render content based on selected menu
  const renderContent = () => {
    switch (selectedMenu) {
      case 'machines':
        return <MachineManagementPage />;
      case 'dashboard':
      default:
        return (
          <>
            <Title level={2}>Bảng Điều Khiển</Title>
            <div style={{ marginTop: '24px' }}>
              <Text>Chào mừng đến với hệ thống quản lý. Vui lòng chọn chức năng từ menu bên trái.</Text>
            </div>
          </>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingOutlined style={{ fontSize: '24px', color: 'white', marginRight: '16px' }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            Trang Quản Lý
          </Title>
        </div>
        <Space>
          <Text style={{ color: 'white' }}>
            Xin chào, {user?.username}
          </Text>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Đăng Xuất
          </Button>
        </Space>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          width={200}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            style={{ height: '100%', borderRight: 0 }}
            onSelect={handleMenuSelect}
            items={[
              {
                key: 'dashboard',
                icon: <DashboardOutlined />,
                label: 'Trang Chủ',
              },
              {
                key: 'machines',
                icon: <SettingOutlined />,
                label: 'Quản Lý Máy Móc',
              },
              {
                key: 'goods',
                icon: <ShoppingOutlined />,
                label: 'Quản Lý Hàng Hóa',
              },
              {
                key: 'settings',
                icon: <AppstoreOutlined />,
                label: 'Cài Đặt',
              },
            ]}
          />
        </Sider>

        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
              borderRadius: '4px'
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard; 