import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider';
import { Button, Result } from 'antd';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${props => props.$isDark ? '#1f1f1f' : '#f0f2f5'};
`;

const PageNotFound = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <NotFoundContainer $isDark={isDark}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Back Home
          </Button>
        }
      />
    </NotFoundContainer>
  );
};

export default PageNotFound; 