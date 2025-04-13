# Login Page Technical Documentation

## Overview
The Login page serves as the authentication gateway for the Xe Nước Mía Tuấn management system. It provides a secure and user-friendly interface for users to access the system.

## File Location
`src/pages/Login.jsx`

## Dependencies
```jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'
import styled from 'styled-components'
import { Form, Input, Button, Card, Space, Typography, message } from 'antd'
```

## Component Structure
### Main Components
1. **LoginContainer**
   - Styled component for page layout
   - Full-screen flex container
   - Theme-aware background

2. **LoginCard**
   - Styled Ant Design Card
   - Responsive width (90% mobile, 420px desktop)
   - Elevated design with shadow
   - Theme-aware colors

3. **LogoContainer**
   - Displays company logo and name
   - Circular logo image
   - Responsive text sizing

### Form Structure
```jsx
<Form
  name="login"
  initialValues={{ remember: true }}
  onFinish={handleLogin}
  layout="vertical"
>
  <Form.Item
    name="username"
    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
  >
    <Input placeholder="Tên đăng nhập" />
  </Form.Item>
  
  <Form.Item
    name="password"
    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
  >
    <Input.Password placeholder="Mật khẩu" />
  </Form.Item>
</Form>
```

## State Management
1. **Authentication State**
   - Managed through useAuth hook
   - Tracks login status
   - Handles authentication errors

2. **Theme State**
   - Managed through useTheme hook
   - Controls dark/light mode
   - Affects all styled components

3. **Loading State**
   - Controls button loading state
   - Prevents multiple form submissions

## Functions
### handleLogin
```jsx
const handleLogin = async (values) => {
  try {
    setLoading(true);
    await login(values.username, values.password);
    navigate('/dashboard');
  } catch (error) {
    message.error(error.message);
  } finally {
    setLoading(false);
  }
};
```

### checkAuth
```jsx
useEffect(() => {
  if (user) {
    navigate('/dashboard');
  }
}, [user, navigate]);
```

## Styling
### Theme-Aware Colors
- Background: ${props => props.$isDark ? '#1F2937' : '#F3F4F6'}
- Text: ${props => props.$isDark ? '#FFFFFF' : '#111827'}
- Card Background: ${props => props.$isDark ? '#111827' : '#FFFFFF'}

### Responsive Design
```css
width: clamp(320px, 90%, 420px);
margin: 20px;
```

## Error Handling
1. Form Validation
   - Required field validation
   - Custom error messages in Vietnamese

2. Authentication Errors
   - Display via Ant Design message system
   - User-friendly error messages
   - Network error handling

## Security Features
1. Password Field
   - Masked input
   - No password storage
   - Secure transmission

2. Route Protection
   - Redirect if already authenticated
   - Session management
   - Token handling

## Test Cases
### Authentication Flow
1. **Successful Login**
   - Input valid credentials
   - Expected: Redirect to dashboard
   - Status: Loading → Success → Redirect

2. **Invalid Credentials**
   - Input incorrect username/password
   - Expected: Error message
   - Status: Loading → Error → Form reset

3. **Empty Fields**
   - Submit without input
   - Expected: Validation messages
   - Status: Form validation errors

4. **Already Authenticated**
   - Access with valid session
   - Expected: Auto-redirect to dashboard
   - Status: Check → Redirect

### UI/UX Tests
1. **Theme Toggle**
   - Switch between dark/light modes
   - Expected: Smooth transition
   - Status: All components update

2. **Responsive Layout**
   - Test on various screen sizes
   - Expected: Maintain usability
   - Status: Adapts to viewport

3. **Loading States**
   - During authentication
   - Expected: Visual feedback
   - Status: Button shows spinner

## Performance Considerations
1. **Code Splitting**
   - Lazy loading of components
   - Optimized bundle size

2. **Render Optimization**
   - Memoized components
   - Efficient state updates

3. **Asset Loading**
   - Optimized logo image
   - Preloaded critical assets

## Accessibility
1. **Keyboard Navigation**
   - Tab order
   - Enter key submission
   - Focus management

2. **Screen Readers**
   - ARIA labels
   - Semantic HTML
   - Error announcements

## Future Improvements
1. **Features**
   - Remember me functionality
   - Password recovery
   - Multi-factor authentication

2. **UX Enhancements**
   - Password strength indicator
   - Login attempt tracking
   - Session timeout notifications

3. **Security**
   - Rate limiting
   - CAPTCHA integration
   - IP-based restrictions 