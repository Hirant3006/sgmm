import React, { useState, useEffect } from 'react';
import { Button, Space, message, Spin, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MachineSubTypeTable from '../../components/machineSubType/MachineSubTypeTable';
import MachineSubTypeModal from '../../components/machineSubType/MachineSubTypeModal';

const MachineSubTypeTab = () => {
  const [machineSubTypes, setMachineSubTypes] = useState([]);
  const [filteredMachineSubTypes, setFilteredMachineSubTypes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMachineSubType, setCurrentMachineSubType] = useState(null);

  useEffect(() => {
    const fetchMachineSubTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/machine-subtypes', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu loại máy con');
        }
        
        const data = await response.json();
        const machineSubTypesArray = data.data || [];
        setMachineSubTypes(machineSubTypesArray);
        setFilteredMachineSubTypes(machineSubTypesArray);
        setError(null);
      } catch (err) {
        setError(err.message);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMachineSubTypes();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    
    if (value) {
      const filtered = machineSubTypes.filter(
        type => 
          type.machine_subtype_id.toLowerCase().includes(value) || 
          (type.name && type.name.toLowerCase().includes(value))
      );
      setFilteredMachineSubTypes(filtered);
    } else {
      setFilteredMachineSubTypes(machineSubTypes);
    }
  };

  const addMachineSubType = async (machineSubType) => {
    try {
      const response = await fetch('/api/machine-subtypes', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineSubType),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể thêm loại máy con mới');
      }
      
      const newMachineSubType = await response.json();
      const updatedMachineSubTypes = [...machineSubTypes, newMachineSubType.data];
      setMachineSubTypes(updatedMachineSubTypes);
      setFilteredMachineSubTypes(
        searchText ? 
          updatedMachineSubTypes.filter(
            type => 
              type.machine_subtype_id.toLowerCase().includes(searchText) || 
              (type.name && type.name.toLowerCase().includes(searchText))
          ) : 
          updatedMachineSubTypes
      );
      setIsModalVisible(false);
      message.success('Thêm loại máy con mới thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  const updateMachineSubType = async (machineSubType) => {
    try {
      const response = await fetch(`/api/machine-subtypes/${currentMachineSubType.machine_subtype_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineSubType),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật loại máy con');
      }
      
      const updatedMachineSubType = await response.json();
      
      const updatedMachineSubTypes = machineSubTypes.map((item) => 
        item.machine_subtype_id === currentMachineSubType.machine_subtype_id ? updatedMachineSubType.data : item
      );
      
      setMachineSubTypes(updatedMachineSubTypes);
      setFilteredMachineSubTypes(
        searchText ? 
          updatedMachineSubTypes.filter(
            type => 
              type.machine_subtype_id.toLowerCase().includes(searchText) || 
              (type.name && type.name.toLowerCase().includes(searchText))
          ) : 
          updatedMachineSubTypes
      );
      
      setIsModalVisible(false);
      setCurrentMachineSubType(null);
      message.success('Cập nhật loại máy con thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  const deleteMachineSubType = async (machineSubTypeId) => {
    try {
      const response = await fetch(`/api/machine-subtypes/${machineSubTypeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa loại máy con');
      }
      
      const updatedMachineSubTypes = machineSubTypes.filter((type) => type.machine_subtype_id !== machineSubTypeId);
      setMachineSubTypes(updatedMachineSubTypes);
      setFilteredMachineSubTypes(
        searchText ? 
          updatedMachineSubTypes.filter(
            type => 
              type.machine_subtype_id.toLowerCase().includes(searchText) || 
              (type.name && type.name.toLowerCase().includes(searchText))
          ) : 
          updatedMachineSubTypes
      );
      message.success('Xóa loại máy con thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  const editMachineSubType = (machineSubType) => {
    setCurrentMachineSubType(machineSubType);
    setIsModalVisible(true);
  };

  const showAddModal = () => {
    setCurrentMachineSubType(null);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentMachineSubType(null);
  };

  const handleSubmit = (values) => {
    if (currentMachineSubType) {
      updateMachineSubType(values);
    } else {
      addMachineSubType(values);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Input
          placeholder="Tìm kiếm theo mã loại máy con hoặc tên loại máy con"
          prefix={<SearchOutlined />}
          onChange={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
        >
          Thêm Loại Máy Con Mới
        </Button>
      </Space>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <MachineSubTypeTable 
          machineSubTypes={filteredMachineSubTypes} 
          onEdit={editMachineSubType} 
          onDelete={deleteMachineSubType} 
        />
      )}
      
      <MachineSubTypeModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        machineSubType={currentMachineSubType}
      />
    </div>
  );
};

export default MachineSubTypeTab; 