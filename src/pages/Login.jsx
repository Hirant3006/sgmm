import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import styled from 'styled-components';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Spin,
  Divider,
  Switch,
  Flex
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  BulbOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Styled components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1f1f1f' : '#f0f2f5'};
  transition: background 0.3s;
`;

const LoginCard = styled(Card)`
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, ${props => props.$isDark ? '0.3' : '0.1'});
  background: ${props => props.$isDark ? '#111' : '#fff'};
  
  @media (max-width: 480px) {
    width: 90%;
    max-width: 360px;
  }
  
  .ant-card-body {
    padding: 32px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  
  .logo-icon {
    font-size: 32px;
    color: #1677ff;
    margin-right: 12px;
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.$isDark ? 'white' : '#333'};
  }
`;

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  
  .theme-label {
    margin: 0 8px;
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)'};
  }
`;

const Login = () => {
  const [form] = Form.useForm();
  const [formError, setFormError] = useState('');
  const { login, user, loading, error } = useAuth();
  const { mode, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (values) => {
    const { username, password } = values;
    
    // Clear form error
    setFormError('');
    
    // Attempt login
    const result = await login(username, password);
    
    if (!result.success) {
      // Login failed, set form error
      setFormError(result.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
    // If successful, the useEffect will handle navigation
  };
  
  return (
    <LoginContainer $isDark={isDark}>
      <Spin spinning={loading} size="large">
        <LoginCard $isDark={isDark} bordered={false}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <LogoContainer $isDark={isDark}>
              <AppstoreOutlined className="logo-icon" />
              <span className="logo-text">SGMM</span>
            </LogoContainer>
            
            <Title level={3} style={{ textAlign: 'center', margin: '0 0 24px' }}>
              Đăng nhập vào hệ thống
            </Title>
            
            {(formError || error) && (
              <Alert
                message="Lỗi Xác Thực"
                description={formError || error}
                type="error"
                showIcon
                style={{ marginBottom: '16px' }}
              />
            )}
            
            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              requiredMark={false}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  placeholder="Tên đăng nhập"
                  autoComplete="username"
                  autoFocus
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
                  placeholder="Mật khẩu"
                  autoComplete="current-password"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading} 
                  block
                  size="large"
                  icon={<LoginOutlined />}
                >
                  Đăng Nhập
                </Button>
              </Form.Item>
            </Form>
            
            <Divider plain>
              <Text type="secondary">Thông tin đăng nhập mẫu</Text>
            </Divider>
            
            <Flex justify="center" gap="middle">
              <Space direction="vertical" size={0} align="center">
                <Text type="secondary" strong>Tên đăng nhập</Text>
                <Text copyable>admin</Text>
              </Space>
              
              <Space direction="vertical" size={0} align="center">
                <Text type="secondary" strong>Mật khẩu</Text>
                <Text copyable>admin</Text>
              </Space>
            </Flex>
            
            <ThemeToggle $isDark={isDark}>
              <BulbOutlined />
              <Text className="theme-label">Chế độ tối</Text>
              <Switch 
                size="small" 
                checked={isDark} 
                onChange={toggleTheme} 
              />
            </ThemeToggle>
          </Space>
        </LoginCard>
      </Spin>
    </LoginContainer>
  );
};

export default Login; 