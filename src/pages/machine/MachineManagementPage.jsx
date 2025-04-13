import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Typography, Card, Space } from 'antd';
import { ToolOutlined, TagsOutlined, AppstoreOutlined } from '@ant-design/icons';
import MachineTab from './MachineTab';
import MachineTypeTab from './MachineTypeTab';
import MachineSubTypeTab from './MachineSubTypeTab';
import styled from 'styled-components';

const { Title } = Typography;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 24px;
  }
  
  .ant-tabs-tab {
    padding: 12px 0;
  }
  
  .ant-tabs-tab-btn {
    font-size: 16px;
  }
`;

const MachineManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || '1';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  useEffect(() => {
    const tab = activeTab === '2' ? 'types' : activeTab === '3' ? 'subtypes' : 'list';
    navigate(`/machines?tab=${tab}`, { replace: true });
  }, [activeTab, navigate]);
  
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <StyledTabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        tabPosition="top"
        destroyInactiveTabPane
        items={[
          {
            key: '1',
            label: (
              <span>
                <ToolOutlined />
                Máy Móc
              </span>
            ),
            children: <MachineTab />
          },
          {
            key: '2',
            label: (
              <span>
                <TagsOutlined />
                Loại Máy
              </span>
            ),
            children: <MachineTypeTab />
          },
          {
            key: '3',
            label: (
              <span>
                <AppstoreOutlined />
                Loại Máy Con
              </span>
            ),
            children: <MachineSubTypeTab />
          }
        ]}
      />
    </Space>
  );
};

export default MachineManagementPage; 