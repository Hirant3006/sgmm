import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeProvider';
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Space,
  Divider,
  List,
  Avatar,
  Flex
} from 'antd';
import {
  ToolOutlined,
  SettingOutlined,
  RiseOutlined,
  UserOutlined,
  ClockCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text, Paragraph } = Typography;

const StyledCard = styled(Card)`
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(107, 190, 169, 0.1);
  transition: all 0.3s;
  border: 1px solid ${props => props.$isDark ? '#374945' : '#E9F5F2'};
  
  &:hover {
    box-shadow: 0 4px 12px rgba(107, 190, 169, 0.2);
    transform: translateY(-2px);
  }
`;

const QuickLinkCard = styled(StyledCard)`
  cursor: pointer;
  
  .ant-card-body {
    padding: 16px;
  }
  
  .card-icon {
    font-size: 28px;
    color: #6BBEA9;
    margin-bottom: 12px;
  }
  
  &:hover .card-icon {
    color: #5AA897;
  }
`;

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  
  // Sample data for dashboard
  const recentActivities = [
    { id: 1, user: 'Admin', action: 'Thêm máy mới', time: '2 giờ trước' },
    { id: 2, user: 'Admin', action: 'Cập nhật loại máy', time: '1 ngày trước' },
    { id: 3, user: 'User', action: 'Xem danh sách máy', time: '3 ngày trước' },
  ];
  
  // Quick access links
  const quickLinks = [
    { 
      title: 'Máy Móc',
      icon: <ToolOutlined className="card-icon" />,
      description: 'Quản lý tất cả máy móc',
      link: '/machines'
    },
    { 
      title: 'Loại Máy',
      icon: <SettingOutlined className="card-icon" />,
      description: 'Cấu hình loại máy',
      link: '/machines?tab=types'
    },
    { 
      title: 'Cài Đặt',
      icon: <AppstoreOutlined className="card-icon" />,
      description: 'Cấu hình hệ thống',
      link: '/settings'
    },
  ];
  
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={16}>
          <Title level={2} style={{ margin: 0 }}>
            Xin chào, {user?.username || 'User'}
          </Title>
          <Paragraph type="secondary">
            Đây là tổng quan về hệ thống quản lý Xe Nước Mía Tuấn
          </Paragraph>
        </Col>
        <Col xs={24} md={8} style={{ textAlign: 'right' }}>
          <Space>
            <Text type="secondary">
              {new Date().toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </Space>
        </Col>
      </Row>
      
      <Divider style={{ margin: '12px 0' }} />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic 
              title="Tổng Máy Móc" 
              value={42} 
              prefix={<ToolOutlined />} 
              valueStyle={{ color: '#1677ff' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic 
              title="Loại Máy" 
              value={8} 
              prefix={<SettingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic 
              title="Người Dùng Hoạt Động" 
              value={5} 
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </StyledCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledCard>
            <Statistic 
              title="Thời Gian Hoạt Động" 
              value="99.9%" 
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </StyledCard>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <StyledCard title="Truy Cập Nhanh">
            <Row gutter={[16, 16]}>
              {quickLinks.map((link, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Link to={link.link} style={{ display: 'block' }}>
                    <QuickLinkCard>
                      <Flex vertical align="center" style={{ textAlign: 'center' }}>
                        {link.icon}
                        <Title level={5} style={{ margin: '8px 0' }}>{link.title}</Title>
                        <Text type="secondary">{link.description}</Text>
                      </Flex>
                    </QuickLinkCard>
                  </Link>
                </Col>
              ))}
            </Row>
          </StyledCard>
        </Col>
        
        <Col xs={24} lg={8}>
          <StyledCard 
            title="Hoạt Động Gần Đây" 
            extra={<Button type="link">Xem Tất Cả</Button>}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.action}
                    description={
                      <Flex align="center" gap="small">
                        <ClockCircleOutlined style={{ fontSize: '12px' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.time}
                        </Text>
                      </Flex>
                    }
                  />
                </List.Item>
              )}
            />
          </StyledCard>
        </Col>
      </Row>
    </Space>
  );
};

export default Dashboard; 