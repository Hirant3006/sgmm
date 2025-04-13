# Dashboard Technical Documentation

## Overview
The Dashboard page serves as the main landing page after successful authentication in the Xe Nước Mía Tuấn management system. It provides an overview of system statistics, quick access to key features, and recent activities.

## File Location
`src/pages/Dashboard.jsx`

## Dependencies
```jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../theme/ThemeProvider'
import styled from 'styled-components'
import { Row, Col, Card, Typography, Space, Statistic, List, Tag } from 'antd'
```

## Component Structure
### Main Components
1. **DashboardContainer**
   - Main layout container
   - Responsive grid system
   - Theme-aware styling

2. **StyledCard**
   - Enhanced Ant Design Card
   - Hover effects
   - Statistics display

3. **QuickLinkCard**
   - Interactive navigation cards
   - Icon integration
   - Click handlers

### Layout Structure
```jsx
<Space direction="vertical" size="large" style={{ width: '100%' }}>
  <WelcomeSection />
  <StatisticsSection />
  <QuickLinksSection />
  <RecentActivitiesSection />
</Space>
```

## State Management
1. **Dashboard Data**
   - Machine statistics
   - User information
   - Activity logs

2. **Theme State**
   - Dark/light mode integration
   - Styled components theming

3. **Loading States**
   - Data fetching indicators
   - Skeleton loading

## Functions
### fetchDashboardData
```jsx
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard', {
      credentials: 'include'
    });
    const data = await response.json();
    setDashboardData(data);
  } catch (error) {
    message.error('Không thể tải dữ liệu bảng điều khiển');
  } finally {
    setLoading(false);
  }
};
```

### Data Refresh
```jsx
useEffect(() => {
  fetchDashboardData();
  const interval = setInterval(fetchDashboardData, 300000); // 5 minutes
  return () => clearInterval(interval);
}, []);
```

## Statistics Display
### Key Metrics
1. **Total Machines**
   - Count of all machines
   - Status breakdown
   - Trend indicators

2. **Machine Types**
   - Category distribution
   - Usage statistics
   - Type comparisons

3. **System Health**
   - Uptime metrics
   - Error rates
   - Performance indicators

## Recent Activities
### Activity List
```jsx
<List
  dataSource={activities}
  renderItem={(item) => (
    <List.Item>
      <List.Item.Meta
        title={item.title}
        description={item.timestamp}
      />
      <Tag color={item.type}>{item.status}</Tag>
    </List.Item>
  )}
/>
```

## Quick Links
### Navigation Cards
1. **Machine Management**
   - Direct access to machine list
   - Add new machine shortcut
   - Machine type management

2. **User Functions**
   - Profile settings
   - Notifications
   - Help center

## Styling
### Theme Integration
```jsx
const DashboardContainer = styled.div`
  background: ${props => props.$isDark ? '#1F2937' : '#F3F4F6'};
  min-height: 100vh;
  padding: 24px;
`;
```

### Responsive Design
```jsx
<Row gutter={[24, 24]}>
  <Col xs={24} sm={12} lg={6}>
    <StatisticCard />
  </Col>
  // ... more columns
</Row>
```

## Error Handling
1. **Data Loading**
   - Fallback UI
   - Error boundaries
   - Retry mechanisms

2. **API Errors**
   - User notifications
   - Graceful degradation
   - Error logging

## Performance Optimization
1. **Data Caching**
   - Local storage
   - Memory caching
   - Stale data handling

2. **Render Optimization**
   - Memoization
   - Virtual scrolling
   - Lazy loading

## Test Cases
### Dashboard Loading
1. **Initial Load**
   - Expected: Show skeleton
   - Load all sections
   - Display data

2. **Data Refresh**
   - Auto refresh
   - Manual refresh
   - Error recovery

### User Interactions
1. **Quick Links**
   - Navigation testing
   - Click handlers
   - Loading states

2. **Activity List**
   - Scroll behavior
   - Item rendering
   - Data updates

## Accessibility
1. **Keyboard Navigation**
   - Focus management
   - Tab order
   - Shortcut keys

2. **Screen Readers**
   - ARIA labels
   - Semantic markup
   - Status announcements

## Future Improvements
1. **Features**
   - Customizable dashboard
   - More statistics
   - Advanced filtering

2. **Performance**
   - Real-time updates
   - Better caching
   - Optimized rendering

3. **UX Enhancements**
   - Interactive charts
   - Custom widgets
   - Personalization options 