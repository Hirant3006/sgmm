import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Alert, 
  Spin
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [formError, setFormError] = useState('');
  const { login, user, loading, error } = useAuth();
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
      setFormError(result.message || 'Login failed. Please try again.');
    }
    // If successful, the useEffect will handle navigation
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Spin spinning={loading} size="large">
        <Card 
          style={{ 
            width: 400, 
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
              Login
            </Title>
            
            {(formError || error) && (
              <Alert
                message="Error"
                description={formError || error}
                type="error"
                showIcon
              />
            )}
            
            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Username"
                  size="large"
                  autoComplete="username"
                  autoFocus
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Password"
                  size="large"
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
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                Default credentials: username <strong>admin</strong>, password <strong>admin</strong>
              </Text>
            </div>
          </Space>
        </Card>
      </Spin>
    </div>
  );
};

export default Login; 