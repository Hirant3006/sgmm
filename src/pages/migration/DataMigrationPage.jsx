import React, { useState, useEffect } from 'react';
import { Card, Button, message, Table, Space, Typography, Spin, Input } from 'antd';
import { FileExcelOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TextArea } = Input;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const DataMigrationPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [migrationStatus, setMigrationStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [sheetData, setSheetData] = useState([]);
  const [parsedData, setParsedData] = useState([]);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    message.error('Bạn không có quyền truy cập tính năng này');
    return <Navigate to="/" replace />;
  }

  // Fetch data from Google Sheets
  useEffect(() => {
    const fetchGoogleSheetData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQHUNmcrXDgKEJyzchbIENvSwuXPIZruqBM7htN4_zocoqk_pVV-kEJsy5hoz9DjkGYzttA6mkaoACX/pubhtml?gid=0&single=true');
        const html = await response.text();
        
        // Extract table data from HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const table = doc.querySelector('table');
        
        if (!table) {
          throw new Error('Không tìm thấy bảng dữ liệu');
        }
        
        const rows = Array.from(table.querySelectorAll('tr'));
        
        // Skip the first two rows (header and empty row)
        const dataRows = rows.slice(2);
        
        const data = dataRows.map((row, index) => {
          const cells = Array.from(row.querySelectorAll('td'));
          
          // Skip rows with insufficient cells or empty rows
          if (cells.length < 10 || cells.every(cell => !cell.textContent.trim())) {
            return null;
          }
          
          // Extract data from cells
          const date = cells[1]?.textContent.trim() || '';
          const type = cells[2]?.textContent.trim() || '';
          const name = cells[3]?.textContent.trim() || '';
          const unit = cells[4]?.textContent.trim() || '';
          const source = cells[5]?.textContent.trim() || '';
          const notes = cells[6]?.textContent.trim() || '';
          const customerName = cells[11]?.textContent.trim() || '';
          const customerPhone = cells[12]?.textContent.trim() || '';
          
          // Extract numeric values, removing currency symbols and commas
          const price = cells[7]?.textContent.trim().replace(/[^\d]/g, '') || '0';
          const costOfGood = cells[8]?.textContent.trim().replace(/[^\d]/g, '') || '0';
          const purchaseLocation = cells[9]?.textContent.trim() || '';
          const shippingCost = cells[10]?.textContent.trim().replace(/[^\d]/g, '') || '0';
          
          // Skip rows with no meaningful data
          if (!date && !type && !name && !price && !costOfGood) {
            return null;
          }
          
          return {
            id: index + 1,
            date,
            type,
            name,
            unit,
            source,
            notes,
            price,
            costOfGood,
            purchaseLocation,
            shippingCost,
            customerName,
            customerPhone
          };
        }).filter(item => item !== null);
        
        setSheetData(data);
        setParsedData(data);
        message.success(`Dữ liệu đã được tải thành công (${data.length} bản ghi)`);
      } catch (error) {
        console.error('Error fetching Google Sheet data:', error);
        message.error('Không thể tải dữ liệu từ Google Sheets: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoogleSheetData();
  }, []);

  const handlePreview = () => {
    setPreviewData(parsedData);
    message.success('Dữ liệu xem trước đã được tải thành công');
  };

  const handleStartMigration = async () => {
    setLoading(true);
    setMigrationStatus('running');
    try {
      const response = await fetch('/api/migration/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: parsedData }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to start migration');
      }
      
      message.success(`Quá trình nhập dữ liệu đã bắt đầu. ${data.data.successCount} bản ghi thành công, ${data.data.errorCount} bản ghi lỗi.`);
      checkMigrationStatus();
    } catch (error) {
      console.error('Error starting migration:', error);
      message.error(`Không thể bắt đầu quá trình nhập dữ liệu: ${error.message}`);
      setMigrationStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const checkMigrationStatus = async () => {
    try {
      const response = await fetch('/api/migration/status', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to check migration status');
      }
      
      const data = await response.json();
      setMigrationStatus(data.data.status);
      
      if (data.data.status === 'running') {
        setTimeout(checkMigrationStatus, 2000);
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
    }
  };

  const checkMigrationProgress = async () => {
    try {
      const response = await fetch('/api/migration/progress', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to check migration progress');
      }
      
      const data = await response.json();
      setProgress(data.data.progress || 0);
      
      if (migrationStatus === 'running') {
        setTimeout(checkMigrationProgress, 1000);
      }
    } catch (error) {
      console.error('Error checking migration progress:', error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cục/Xe',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Nguồn xe',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price ? `${Number(price).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
    },
    {
      title: 'Giá nhập',
      dataIndex: 'costOfGood',
      key: 'costOfGood',
      render: (cost) => cost ? `${Number(cost).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
    },
    {
      title: 'Nơi mua',
      dataIndex: 'purchaseLocation',
      key: 'purchaseLocation',
    },
    {
      title: 'Vận chuyển',
      dataIndex: 'shippingCost',
      key: 'shippingCost',
      render: (cost) => cost ? `${Number(cost).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý dữ liệu</Title>
      
      <StyledCard title="Nhập dữ liệu từ Google Sheets">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>
            Hệ thống sẽ tự động lấy dữ liệu từ Google Sheets công khai. 
            Nhấn nút "Xem trước dữ liệu" để xem dữ liệu trước khi nhập.
          </Text>
          
          <Button 
            type="primary" 
            icon={<FileExcelOutlined />}
            onClick={handlePreview}
            loading={loading}
          >
            Xem trước dữ liệu
          </Button>
        </Space>
      </StyledCard>
      
      {previewData.length > 0 && (
        <StyledCard title="Dữ liệu xem trước">
          <Table 
            dataSource={previewData} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
          
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={handleStartMigration}
            loading={loading || migrationStatus === 'running'}
            style={{ marginTop: 16 }}
          >
            Bắt đầu nhập dữ liệu
          </Button>
        </StyledCard>
      )}
      
      {migrationStatus !== 'idle' && (
        <StyledCard title="Trạng thái nhập dữ liệu">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text>
              Trạng thái: {migrationStatus === 'running' ? 'Đang nhập dữ liệu...' : 
                             migrationStatus === 'completed' ? 'Hoàn thành' : 
                             migrationStatus === 'failed' ? 'Thất bại' : 'Chưa xác định'}
            </Text>
            
            {migrationStatus === 'running' && (
              <div>
                <Text>Tiến độ: {progress}%</Text>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              </div>
            )}
          </Space>
        </StyledCard>
      )}
    </div>
  );
};

export default DataMigrationPage; 