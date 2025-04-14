import React from 'react';
import { Typography, Space } from 'antd';
import { OrderProvider } from '../../context/OrderContext';
import OrderTab from './OrderTab';
import styled from 'styled-components';

const { Title } = Typography;

const PageContainer = styled.div`
  width: 100%;
`;

const OrderManagementPage = () => {
  return (
    <OrderProvider>
      <PageContainer>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <OrderTab />
        </Space>
      </PageContainer>
    </OrderProvider>
  );
};

export default OrderManagementPage; 