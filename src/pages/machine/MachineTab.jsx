import React, { useState, useEffect } from 'react';
import { Button, Space, message, Spin, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import MachineTable from '../../components/machine/MachineTable';
import MachineModal from '../../components/machine/MachineModal';

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
        // Fetch machines
        const machinesResponse = await fetch('/api/machines', {
          credentials: 'include'
        });
        
        if (!machinesResponse.ok) {
          throw new Error('Failed to load machines data');
        }
        
        const machinesData = await machinesResponse.json();
        const machinesArray = machinesData.data || [];
        setMachines(machinesArray);
        setFilteredMachines(machinesArray);
        
        // Fetch machine types for dropdown
        const machineTypesResponse = await fetch('/api/machine-types', {
          credentials: 'include'
        });
        
        if (!machineTypesResponse.ok) {
          throw new Error('Failed to load machine types data');
        }
        
        const machineTypesData = await machineTypesResponse.json();
        setMachineTypes(machineTypesData.data || []);
        
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
      const response = await fetch('/api/machines', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machine),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add new machine');
      }
      
      const newMachine = await response.json();
      const updatedMachines = [...machines, newMachine.data];
      setMachines(updatedMachines);
      setFilteredMachines(
        searchText ? 
          updatedMachines.filter(
            m => 
              m.machine_id.toLowerCase().includes(searchText) || 
              (m.machine_type_name && m.machine_type_name.toLowerCase().includes(searchText))
          ) : 
          updatedMachines
      );
      setIsModalVisible(false);
      message.success('Machine added successfully');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Update an existing machine
  const updateMachine = async (machine) => {
    try {
      const response = await fetch(`/api/machines/${currentMachine.machine_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machine),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update machine');
      }
      
      const updatedMachine = await response.json();
      
      const updatedMachines = machines.map((item) => 
        item.machine_id === currentMachine.machine_id ? updatedMachine.data : item
      );
      
      setMachines(updatedMachines);
      setFilteredMachines(
        searchText ? 
          updatedMachines.filter(
            m => 
              m.machine_id.toLowerCase().includes(searchText) || 
              (m.machine_type_name && m.machine_type_name.toLowerCase().includes(searchText))
          ) : 
          updatedMachines
      );
      
      setIsModalVisible(false);
      setCurrentMachine(null);
      message.success('Machine updated successfully');
    } catch (err) {
      message.error(err.message);
    }
  };

  // Delete a machine
  const deleteMachine = async (machineId) => {
    try {
      const response = await fetch(`/api/machines/${machineId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete machine');
      }
      
      const updatedMachines = machines.filter((machine) => machine.machine_id !== machineId);
      setMachines(updatedMachines);
      setFilteredMachines(
        searchText ? 
          updatedMachines.filter(
            m => 
              m.machine_id.toLowerCase().includes(searchText) || 
              (m.machine_type_name && m.machine_type_name.toLowerCase().includes(searchText))
          ) : 
          updatedMachines
      );
      message.success('Machine deleted successfully');
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
          placeholder="Search by machine ID or type"
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
          Add New Machine
        </Button>
      </Space>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <MachineTable 
          machines={filteredMachines} 
          onEdit={editMachine} 
          onDelete={deleteMachine} 
        />
      )}
      
      <MachineModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        machine={currentMachine}
        machineTypes={machineTypes}
      />
    </div>
  );
};

export default MachineTab; 