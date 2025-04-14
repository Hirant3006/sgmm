import React, { useState, useEffect } from 'react';
import { Button, Space, message, Spin, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MachineTable from '../../components/machine/MachineTable';
import MachineModal from '../../components/machine/MachineModal';
import MachineService from '../../services/machineService';

const MachineTab = () => {
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [machineTypes, setMachineTypes] = useState([]);

  // Fetch machines and machine types data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch machines using MachineService
        const machinesArray = await MachineService.getMachines();
        setMachines(machinesArray);
        setFilteredMachines(machinesArray);
        
        // Fetch machine types for dropdown using MachineService
        const machineTypesArray = await MachineService.getMachineTypes();
        setMachineTypes(machineTypesArray);
        
        setError(null);
      } catch (err) {
        setError(err.message);
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    
    if (value) {
      const filtered = machines.filter(
        machine => 
          machine.machine_id.toLowerCase().includes(value) || 
          (machine.name && machine.name.toLowerCase().includes(value)) ||
          (machine.machine_type_name && machine.machine_type_name.toLowerCase().includes(value))
      );
      setFilteredMachines(filtered);
    } else {
      setFilteredMachines(machines);
    }
  };

  // Add a new machine with auto-generated ID
  const addMachine = async (machine) => {
    try {
      // Create machine using MachineService
      const newMachineData = await MachineService.createMachine(machine);
      
      // Find the machine type name from machineTypes
      const machineType = machineTypes.find(type => type.machine_type_id === machine.machine_type_id);
      const newMachine = {
        ...newMachineData,
        machine_type_name: machineType ? machineType.name : ''
      };
      
      const updatedMachines = [...machines, newMachine];
      setMachines(updatedMachines);
      setFilteredMachines(
        searchText ? 
          updatedMachines.filter(
            m => 
              m.machine_id.toLowerCase().includes(searchText) || 
              (m.name && m.name.toLowerCase().includes(searchText)) ||
              (m.machine_type_name && m.machine_type_name.toLowerCase().includes(searchText))
          ) : 
          updatedMachines
      );
      setIsModalVisible(false);
      message.success('Thêm máy mới thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Update an existing machine
  const updateMachine = async (machine) => {
    try {
      // Update machine using MachineService
      const updatedMachineData = await MachineService.updateMachine(currentMachine.machine_id, machine);
      
      const updatedMachines = machines.map((item) => 
        item.machine_id === currentMachine.machine_id ? updatedMachineData : item
      );
      
      setMachines(updatedMachines);
      setFilteredMachines(
        searchText ? 
          updatedMachines.filter(
            m => 
              m.machine_id.toLowerCase().includes(searchText) || 
              (m.name && m.name.toLowerCase().includes(searchText)) ||
              (m.machine_type_name && m.machine_type_name.toLowerCase().includes(searchText))
          ) : 
          updatedMachines
      );
      
      setIsModalVisible(false);
      setCurrentMachine(null);
      message.success('Cập nhật máy thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Delete a machine
  const deleteMachine = async (machineId) => {
    try {
      // Delete machine using MachineService
      await MachineService.deleteMachine(machineId);
      
      const updatedMachines = machines.filter((machine) => machine.machine_id !== machineId);
      setMachines(updatedMachines);
      setFilteredMachines(
        searchText ? 
          updatedMachines.filter(
            m => 
              m.machine_id.toLowerCase().includes(searchText) || 
              (m.name && m.name.toLowerCase().includes(searchText)) ||
              (m.machine_type_name && m.machine_type_name.toLowerCase().includes(searchText))
          ) : 
          updatedMachines
      );
      message.success('Xóa máy thành công');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Edit machine (open modal with machine data)
  const editMachine = (machine) => {
    setCurrentMachine(machine);
    setIsModalVisible(true);
  };

  // Show modal for adding new machine
  const showAddModal = () => {
    setCurrentMachine(null);
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentMachine(null);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    if (currentMachine) {
      updateMachine(values);
    } else {
      addMachine(values);
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Input
          placeholder="Tìm kiếm theo mã máy, tên máy hoặc loại máy"
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
          Thêm Máy Mới
        </Button>
      </Space>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <div style={{ color: 'red', padding: '20px' }}>
          {error}
        </div>
      ) : (
        <MachineTable 
          machines={filteredMachines} 
          onEdit={editMachine} 
          onDelete={deleteMachine}
        />
      )}
      
      {isModalVisible && (
        <MachineModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          machine={currentMachine}
          machineTypes={machineTypes}
          title={currentMachine ? 'Chỉnh Sửa Máy' : 'Thêm Máy Mới'}
        />
      )}
    </div>
  );
};

export default MachineTab; 