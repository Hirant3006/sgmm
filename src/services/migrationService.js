// Migration service for handling data migration from Google Sheets
const MigrationService = {
  // Get preview data from Google Sheets
  getPreviewData: async () => {
    try {
      const response = await fetch('/api/migration/preview', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tải dữ liệu xem trước');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching preview data:', error);
      throw error;
    }
  },
  
  // Start the migration process
  startMigration: async () => {
    try {
      const response = await fetch('/api/migration/start', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể bắt đầu di chuyển dữ liệu');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error starting migration:', error);
      throw error;
    }
  },
  
  // Get migration status
  getMigrationStatus: async () => {
    try {
      const response = await fetch('/api/migration/status', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy trạng thái di chuyển');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error getting migration status:', error);
      throw error;
    }
  },
  
  // Get migration progress
  getMigrationProgress: async () => {
    try {
      const response = await fetch('/api/migration/progress', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy tiến trình di chuyển');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error getting migration progress:', error);
      throw error;
    }
  }
};

export default MigrationService; 