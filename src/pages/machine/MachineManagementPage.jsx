import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs } from 'antd';
import { ShoppingOutlined, TagsOutlined } from '@ant-design/icons';
import MachineTab from './MachineTab';
import MachineTypeTab from './MachineTypeTab';

const MachineManagementPage = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('1');
  
  // Redirect to login if not authenticated
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }
  
  const handleTabChange = (key) => {
    setActiveTab(key);
  };
  
  return (
    <div>
      <h2>Quản Lý Máy Móc</h2>
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        tabPosition="top"
        destroyInactiveTabPane
        items={[
          {
            key: '1',
            label: (
              <span>
                <ShoppingOutlined />
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
          }
        ]}
      />
    </div>
  );
};

export default MachineManagementPage; 