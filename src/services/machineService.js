// Machine service for handling machine-related API calls
const MachineService = {
  // Fetch all machines
  getMachines: async () => {
    try {
      const response = await fetch('/api/machines', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải dữ liệu máy móc');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  },
  
  // Get a single machine by ID
  getMachineById: async (machineId) => {
    try {
      const response = await fetch(`/api/machines/${machineId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải thông tin máy');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching machine ${machineId}:`, error);
      throw error;
    }
  },
  
  // Create a new machine
  createMachine: async (machineData) => {
    try {
      const response = await fetch('/api/machines', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(machineData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo máy mới');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating machine:', error);
      throw error;
    }
  },
  
  // Update an existing machine
  updateMachine: async (machineId, machineData) => {
    try {
      const response = await fetch(`/api/machines/${machineId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(machineData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật máy');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error updating machine ${machineId}:`, error);
      throw error;
    }
  },
  
  // Delete a machine
  deleteMachine: async (machineId) => {
    try {
      const response = await fetch(`/api/machines/${machineId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa máy');
      }
      
      return true;
    } catch (error) {
      console.error(`Error deleting machine ${machineId}:`, error);
      throw error;
    }
  },
  
  // Fetch all machine types
  getMachineTypes: async () => {
    try {
      const response = await fetch('/api/machine-types', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải dữ liệu loại máy');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching machine types:', error);
      throw error;
    }
  },
  
  // Fetch all machine subtypes
  getMachineSubTypes: async () => {
    try {
      const response = await fetch('/api/machine-subtypes', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải dữ liệu loại máy con');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching machine subtypes:', error);
      throw error;
    }
  }
};

export default MachineService; 