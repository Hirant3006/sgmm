const db = require('../config/db');
const MachineType = require('../models/MachineType');
const Machine = require('../models/Machine');
const Order = require('../models/Order');
const MachineSubtype = require('../models/MachineSubtype');
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

// Google Sheets public URL
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQHUNmcrXDgKEJyzchbIENvSwuXPIZruqBM7htN4_zocoqk_pVV-kEJsy5hoz9DjkGYzttA6mkaoACX/pubhtml?gid=0&single=true';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only Excel files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ hỗ trợ file Excel (.xlsx, .xls)'), false);
    }
  }
}).single('file');

const migrationController = {
  // Handle file upload
  uploadFile: async (req, res) => {
    upload(req, res, async function(err) {
      if (err) {
        console.error('File upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'Lỗi khi tải lên file',
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Không tìm thấy file',
        });
      }
      
      try {
        // Read the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        
        // Process the data to match the expected format
        const previewData = data.map((row, index) => {
          return {
            id: index + 1,
            name: row['Tên'] || row['Name'] || '',
            type: row['Loại'] || row['Type'] || '',
            price: row['Giá'] || row['Price'] || 0,
          };
        });
        
        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);
        
        res.json({
          success: true,
          message: 'File đã được tải lên thành công',
          preview: previewData,
        });
      } catch (error) {
        console.error('Error processing uploaded file:', error);
        
        // Clean up the uploaded file in case of error
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
          success: false,
          message: 'Lỗi khi xử lý file',
          error: error.message,
        });
      }
    });
  },
  
  // Get preview data from Google Sheets
  getPreviewData: async (req, res) => {
    try {
      // Fetch the HTML content of the public Google Sheet
      const response = await fetch(SHEETS_URL);
      const html = await response.text();
      
      // Parse the HTML to extract table data
      const root = parse(html);
      const table = root.querySelector('table');
      
      if (!table) {
        throw new Error('Không thể tìm thấy bảng dữ liệu trong Google Sheets');
      }
      
      // Extract headers and data rows
      const rows = table.querySelectorAll('tr');
      const headers = rows[0].querySelectorAll('th').map(th => th.text.trim());
      
      // Process data rows (skip header row)
      const previewData = [];
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells.length === 0) continue;
        
        const rowData = {};
        cells.forEach((cell, index) => {
          if (index < headers.length) {
            rowData[headers[index]] = cell.text.trim();
          }
        });
        
        // Only add rows that have data
        if (Object.values(rowData).some(value => value)) {
          previewData.push(rowData);
        }
      }
      
      res.json({
        success: true,
        data: previewData,
      });
    } catch (error) {
      console.error('Error fetching preview data:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải dữ liệu từ Google Sheets',
        error: error.message,
      });
    }
  },
  
  // Start the migration process
  startMigration: async (req, res) => {
    let client;
    try {
        console.log('Starting migration process...');
        console.log('Request body:', JSON.stringify(req.body));
        
        client = await db.getClient();
        console.log('Database client obtained successfully');
        
        await client.query('BEGIN');
        console.log('Transaction started');
        
        const dataRows = req.body.data;
        if (!dataRows || !Array.isArray(dataRows)) {
            throw new Error('Invalid data format provided');
        }
        
        console.log(`Processing ${dataRows.length} rows...`);
        console.log('First row sample:', JSON.stringify(dataRows[0], null, 2));
        
        let successCount = 0;
        let errorCount = 0;
        let errors = [];
        
        for (const row of dataRows) {
            try {
                // Log the raw row data
                console.log('Raw row data:', JSON.stringify(row, null, 2));
                
                // Skip rows that only have STT value and are otherwise empty
                const hasData = Object.entries(row).some(([key, value]) => {
                    // Skip STT column and check if any other column has a value
                    const hasValue = key !== 'STT' && value && value.toString().trim() !== '';
                    if (hasValue) {
                        console.log(`Found data in column ${key}: ${value}`);
                    }
                    return hasValue;
                });

                if (!hasData) {
                    console.log(`Skipping empty row with STT: ${row.STT}`);
                    continue;
                }

                // Validate machine name and type
                const machineName = row.name ? row.name.toString().trim() : '';
                const machineType = row.type ? row.type.toString().trim() : '';
                const price = row.price ? parseFloat(row.price.toString().trim()) : null;
                
                if (!machineName || !machineType) {
                    console.log(`Skipping row - Missing machine name or type. Name: "${machineName}", Type: "${machineType}"`);
                    errorCount++;
                    errors.push({
                        row: row.id,
                        error: `Missing required fields: ${!machineName ? 'name' : ''} ${!machineType ? 'type' : ''}`.trim()
                    });
                    continue;
                }

                // Validate price
                if (price === null || isNaN(price) || price <= 0) {
                    console.log(`Skipping row - Invalid price. Price: "${row.price}"`);
                    errorCount++;
                    errors.push({
                        row: row.id,
                        error: 'Invalid or missing price'
                    });
                    continue;
                }

                console.log(`Processing row ${row.id}`);
                
                // Validate required fields
                const requiredFields = ['name', 'type', 'unit', 'price'];
                const missingFields = requiredFields.filter(field => !row[field]);
                
                if (missingFields.length > 0) {
                    console.log(`Missing required fields: ${missingFields.join(', ')}`);
                    errorCount++;
                    errors.push({
                        row: row.id,
                        error: `Missing required fields: ${missingFields.join(', ')}`
                    });
                    continue;
                }
                
                let date = null;
                if (row.date) {
                    try {
                        // First try parsing as DD/MM/YY
                        const parts = row.date.split('/');
                        if (parts.length === 3) {
                            // Ensure we have valid numbers
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-based
                            let year = parseInt(parts[2], 10);
                            
                            // Handle YY format by adding 2000
                            if (year < 100) {
                                year += 2000;
                            }
                            
                            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                                date = new Date(year, month, day);
                                if (!isNaN(date.getTime())) {
                                    console.log(`Successfully parsed date: ${row.date} -> ${date.toISOString()}`);
                                }
                            }
                        }
                        
                        // If DD/MM/YY parsing failed, try direct parsing
                        if (!date || isNaN(date.getTime())) {
                            const parsedDate = new Date(row.date);
                            if (!isNaN(parsedDate.getTime())) {
                                date = parsedDate;
                                console.log(`Successfully parsed date directly: ${row.date} -> ${date.toISOString()}`);
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing date:', error);
                    }
                }
                
                // If date is still null or invalid, use current date
                if (!date || isNaN(date.getTime())) {
                    date = new Date();
                    console.log(`Using current date as fallback: ${date.toISOString()}`);
                }
                
                const type = row.type || '';
                const name = row.name || '';
                const unit = row.unit || ''; // This is the "Cục/xe" column
                const source = row.source || '';
                const notes = row.notes || '';
                const costOfGood = row.costOfGood ? parseFloat(row.costOfGood) : 0;
                const purchaseLocation = row.purchaseLocation || '';
                const shippingCost = row.shippingCost ? parseFloat(row.shippingCost) : 0;
                
                console.log('Creating/finding machine type:', type);
                let machineTypeId = null;
                if (type) {
                    const machineTypes = await MachineType.getAll();
                    console.log('Machine types:', machineTypes);
                    const existingType = machineTypes.find(t => t.name === type);
                    
                    if (existingType) {
                        machineTypeId = existingType.machine_type_id;
                        console.log('Found existing machine type:', machineTypeId);
                    } else {
                        const newType = await MachineType.create({ name: type });
                        machineTypeId = newType.machine_type_id;
                        console.log('Created new machine type:', machineTypeId);
                    }
                }
                
                console.log('Creating/finding machine subtype:', unit);
                let machineSubtypeId = null;
                if (unit) {
                    const machineSubtypes = await MachineSubtype.getAll();
                    console.log('Machine subtypes:', machineSubtypes);
                    const existingSubtype = machineSubtypes.find(st => st.name === unit);
                    
                    if (existingSubtype) {
                        machineSubtypeId = existingSubtype.machine_subtype_id;
                        console.log('Found existing machine subtype:', machineSubtypeId);
                    } else {
                        const newSubtype = await MachineSubtype.create({ name: unit });
                        machineSubtypeId = newSubtype.machine_subtype_id;
                        console.log('Created new machine subtype:', machineSubtypeId);
                    }
                }
                
                // Skip if required fields are missing
                if (!machineTypeId || !machineSubtypeId) {
                    console.log('Skipping row due to missing machine type or subtype');
                    errorCount++;
                    errors.push({
                        row: row.id,
                        error: 'Missing machine type or subtype'
                    });
                    continue;
                }
                
                console.log('Creating/finding machine:', name);
                let machineId = null;
                if (name) {
                    const machines = await Machine.getAll();
                    console.log('Machines:', machines);
                    const existingMachine = machines.find(m => m.name === name);
                    
                    if (existingMachine) {
                        machineId = existingMachine.machine_id;
                        console.log('Found existing machine:', machineId);
                    } else {
                        const newMachine = await Machine.create({
                            name,
                            machine_type_id: machineTypeId,
                            machine_subtype_id: machineSubtypeId,
                            price: costOfGood,
                        });
                        machineId = newMachine.machine_id;
                        console.log('Created new machine:', machineId);
                    }
                }
                
                // Skip if machine creation failed
                if (!machineId) {
                    console.log('Skipping row due to missing machine');
                    errorCount++;
                    errors.push({
                        row: row.id,
                        error: 'Failed to create or find machine'
                    });
                    continue;
                }
                
                console.log('Creating order...');
                const orderData = {
                    date,
                    machine_id: machineId,
                    machine_type_id: machineTypeId,
                    machine_subtype_id: machineSubtypeId,
                    source,
                    notes,
                    price,
                    cost_of_good: costOfGood,
                    shipping_cost: shippingCost,
                    purchase_location: purchaseLocation,
                    customer_name: row.customerName || '',
                    customer_phone: row.customerPhone || '',
                };
                
                // Log the order data for debugging
                console.log('Order data:', JSON.stringify(orderData));
                
                const result = await Order.create(orderData);
                console.log('Order created successfully:', result);
                successCount++;
            } catch (error) {
                console.error('Error processing row:', error);
                errorCount++;
                errors.push({
                    row: row.id,
                    error: error.message
                });
            }
        }
        
        await client.query('COMMIT');
        console.log('Transaction committed');
        
        res.json({
            success: true,
            data: {
                successCount,
                errorCount,
                totalCount: dataRows.length,
                errors: errors
            },
        });
    } catch (error) {
        console.error('Migration failed:', error);
        if (client) {
            try {
        await client.query('ROLLBACK');
                console.log('Transaction rolled back');
            } catch (rollbackError) {
                console.error('Error rolling back transaction:', rollbackError);
            }
        }
        
        res.status(500).json({
            success: false,
            message: 'Không thể di chuyển dữ liệu',
            error: error.message,
            stack: error.stack
        });
    } finally {
        if (client) {
        client.release();
            console.log('Database client released');
        }
    }
  },
  
  // Get migration status
  getMigrationStatus: async (req, res) => {
    try {
      // This would typically check a status table or cache
      // For now, we'll just return a simple status
      res.json({
        success: true,
        data: {
          status: 'completed',
          lastRun: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error getting migration status:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy trạng thái di chuyển',
        error: error.message,
      });
    }
  },
  
  // Get migration progress
  getMigrationProgress: async (req, res) => {
    try {
      // This would typically check a progress table or cache
      // For now, we'll just return a simple progress
      res.json({
        success: true,
        data: {
          progress: 100,
          currentItem: 0,
          totalItems: 0,
        },
      });
    } catch (error) {
      console.error('Error getting migration progress:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy tiến trình di chuyển',
        error: error.message,
      });
    }
  },
  
  // Google Sheets authentication
  googleSheetsAuth: async (req, res) => {
    try {
      // This would typically redirect to Google OAuth
      // For now, we'll just return a success message
      res.json({
        success: true,
        message: 'Google Sheets authentication successful',
        authUrl: null, // In a real implementation, this would be a Google OAuth URL
      });
    } catch (error) {
      console.error('Error with Google Sheets authentication:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể xác thực với Google Sheets',
        error: error.message,
      });
    }
  },
};

module.exports = migrationController; 