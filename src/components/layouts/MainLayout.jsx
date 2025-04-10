import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Divider,
  Typography,
  Badge,
  Drawer,
  Tooltip,
  Flex
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  AppstoreOutlined,
  ToolOutlined,
  BulbOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;

// Styled components
const StyledLogo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 64px;
  color: ${props => props.$isDark ? 'white' : '#1677ff'};
  background: ${props => props.$isDark ? '#111' : '#fff'};
  overflow: hidden;
  white-space: nowrap;
  
  .logo-text {
    margin-left: 12px;
    font-weight: 700;
    font-size: 18px;
    transition: opacity 0.2s, margin-left 0.2s;
    opacity: ${props => props.$collapsed ? 0 : 1};
    margin-left: ${props => props.$collapsed ? '0' : '12px'};
  }
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: ${props => props.$isDark ? '#111' : '#fff'};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  z-index: 1;
  position: sticky;
  top: 0;
`;

const StyledSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  
  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .ant-menu {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  transition: all 0.2s;
  margin-left: ${props => props.$collapsed ? '80px' : '200px'};
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  margin: 24px;
  padding: 24px;
  background: ${props => props.$isDark ? '#1f1f1f' : '#fff'};
  border-radius: 6px;
  min-height: 280px;
  
  @media (max-width: 768px) {
    margin: 12px;
    padding: 16px;
  }
`;

// Main layout component
const MainLayout = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notifications] = useState([]);
  
  // Determine if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track screen size and update isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Menu items
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Trang Chủ',
      path: '/',
    },
    {
      key: 'machines',
      icon: <ToolOutlined />,
      label: 'Quản Lý Máy Móc',
      path: '/machines',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài Đặt',
      path: '/settings',
    },
  ];
  
  // Find current selected key based on path
  const getCurrentSelectedKey = () => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find(item => 
      (item.path === '/' && currentPath === '/') || 
      (item.path !== '/' && currentPath.startsWith(item.path))
    );
    return menuItem ? menuItem.key : 'dashboard';
  };

  // User dropdown menu
  const userDropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Hồ Sơ',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Cài Đặt Tài Khoản',
        onClick: () => navigate('/settings'),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng Xuất',
        onClick: handleLogout,
      },
    ],
  };

  // Toggle menu on mobile
  const toggleMobileMenu = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Sidebar content
  const sidebarContent = (
    <>
      <StyledLogo $collapsed={collapsed} $isDark={isDark}>
        <AppstoreOutlined style={{ fontSize: 24 }} />
        <span className="logo-text">SGMM</span>
      </StyledLogo>
      <Menu
        theme={isDark ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[getCurrentSelectedKey()]}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>,
        }))}
      />
      <Divider style={{ margin: '8px 0' }} />
      <Space direction="vertical" style={{ padding: '0 16px 16px' }} align="center">
        <Text type="secondary" style={{ fontSize: '12px', opacity: collapsed ? 0 : 1 }}>
          SGMM v1.0.0
        </Text>
        <Button 
          type="text" 
          icon={isDark ? <BulbOutlined /> : <BulbOutlined />}
          onClick={toggleTheme}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          {!collapsed && (isDark ? 'Chế Độ Sáng' : 'Chế Độ Tối')}
        </Button>
        <Button
          type="text"
          icon={<QuestionCircleOutlined />}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          {!collapsed && 'Trợ Giúp'}
        </Button>
      </Space>
    </>
  );

  return (
    <Layout hasSider>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <StyledSider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          theme={isDark ? 'dark' : 'light'}
        >
          {sidebarContent}
        </StyledSider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          width={200}
          styles={{ body: { padding: 0 } }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main Layout */}
      <StyledLayout $collapsed={collapsed}>
        <StyledHeader $isDark={isDark}>
          {isMobile && (
            <Button
              type="text"
              icon={mobileDrawerOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
              onClick={toggleMobileMenu}
              style={{ marginRight: 16 }}
            />
          )}
          {!isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginRight: 16 }}
            />
          )}
          
          <Title level={5} style={{ margin: 0, flex: 1 }}>
            {menuItems.find(item => item.key === getCurrentSelectedKey())?.label || 'Dashboard'}
          </Title>
          
          <Space size={16}>
            <Tooltip title="Tìm Kiếm">
              <Button type="text" icon={<SearchOutlined />} />
            </Tooltip>
            
            <Tooltip title="Thông Báo">
              <Badge count={notifications.length} dot>
                <Button type="text" icon={<BellOutlined />} />
              </Badge>
            </Tooltip>
            
            <Dropdown menu={userDropdownItems} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1677ff' }}
                />
                {!isMobile && (
                  <Flex vertical align="flex-start">
                    <Text strong>{user?.username || 'User'}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {user?.role || 'Admin'}
                    </Text>
                  </Flex>
                )}
              </Space>
            </Dropdown>
          </Space>
        </StyledHeader>
        
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <ContentWrapper $isDark={isDark}>
            <Outlet />
          </ContentWrapper>
        </Content>
      </StyledLayout>
    </Layout>
  );
};

export default MainLayout; 