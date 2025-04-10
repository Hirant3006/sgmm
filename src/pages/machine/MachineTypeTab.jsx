import React, { useState, useEffect } from 'react';
import { Button, Space, message, Spin, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MachineTypeTable from '../../components/machineType/MachineTypeTable';
import MachineTypeModal from '../../components/machineType/MachineTypeModal';

const MachineTypeTab = () => {
  const [machineTypes, setMachineTypes] = useState([]);
  const [filteredMachineTypes, setFilteredMachineTypes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMachineType, setCurrentMachineType] = useState(null);

  // Fetch machine types
  useEffect(() => {
    const fetchMachineTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/machine-types', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu loại máy');
        }
        
        const data = await response.json();
        const machineTypesArray = data.data || [];
        setMachineTypes(machineTypesArray);
        setFilteredMachineTypes(machineTypesArray);
        setError(null);
      } catch (err) {
        setError(err.message);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMachineTypes();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    
    if (value) {
      const filtered = machineTypes.filter(
        type => 
          type.machine_type_id.toLowerCase().includes(value) || 
          (type.name && type.name.toLowerCase().includes(value))
      );
      setFilteredMachineTypes(filtered);
    } else {
      setFilteredMachineTypes(machineTypes);
    }
  };

  // Add a new machine type with auto-generated ID
  const addMachineType = async (machineType) => {
    try {
      const response = await fetch('/api/machine-types', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineType),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể thêm loại máy mới');
      }
      
      const newMachineType = await response.json();
      const updatedMachineTypes = [...machineTypes, newMachineType.data];
      setMachineTypes(updatedMachineTypes);
      setFilteredMachineTypes(
        searchText ? 
          updatedMachineTypes.filter(
            type => 
              type.machine_type_id.toLowerCase().includes(searchText) || 
              (type.name && type.name.toLowerCase().includes(searchText))
          ) : 
          updatedMachineTypes
      );
      setIsModalVisible(false);
      message.success('Thêm loại máy mới thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Update an existing machine type
  const updateMachineType = async (machineType) => {
    try {
      const response = await fetch(`/api/machine-types/${currentMachineType.machine_type_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineType),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật loại máy');
      }
      
      const updatedMachineType = await response.json();
      
      const updatedMachineTypes = machineTypes.map((item) => 
        item.machine_type_id === currentMachineType.machine_type_id ? updatedMachineType.data : item
      );
      
      setMachineTypes(updatedMachineTypes);
      setFilteredMachineTypes(
        searchText ? 
          updatedMachineTypes.filter(
            type => 
              type.machine_type_id.toLowerCase().includes(searchText) || 
              (type.name && type.name.toLowerCase().includes(searchText))
          ) : 
          updatedMachineTypes
      );
      
      setIsModalVisible(false);
      setCurrentMachineType(null);
      message.success('Cập nhật loại máy thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Delete a machine type
  const deleteMachineType = async (machineTypeId) => {
    try {
      const response = await fetch(`/api/machine-types/${machineTypeId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa loại máy');
      }
      
      const updatedMachineTypes = machineTypes.filter((type) => type.machine_type_id !== machineTypeId);
      setMachineTypes(updatedMachineTypes);
      setFilteredMachineTypes(
        searchText ? 
          updatedMachineTypes.filter(
            type => 
              type.machine_type_id.toLowerCase().includes(searchText) || 
              (type.name && type.name.toLowerCase().includes(searchText))
          ) : 
          updatedMachineTypes
      );
      message.success('Xóa loại máy thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Edit machine type (open modal with machine type data)
  const editMachineType = (machineType) => {
    setCurrentMachineType(machineType);
    setIsModalVisible(true);
  };

  // Show modal for adding new machine type
  const showAddModal = () => {
    setCurrentMachineType(null);
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentMachineType(null);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (currentMachineType) {
      updateMachineType(values);
    } else {
      addMachineType(values);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Input
          placeholder="Tìm kiếm theo mã loại máy hoặc tên loại máy"
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
          Thêm Loại Máy Mới
        </Button>
      </Space>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <MachineTypeTable 
          machineTypes={filteredMachineTypes} 
          onEdit={editMachineType} 
          onDelete={deleteMachineType} 
        />
      )}
      
      <MachineTypeModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        machineType={currentMachineType}
      />
    </div>
  );
};

export default MachineTypeTab; 