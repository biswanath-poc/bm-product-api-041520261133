const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

const sampleProducts = [
  {
    productId: 'prod-001',
    productName: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    brand: 'TechBrand',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    specifications: {
      batteryLife: '30 hours',
      connectivity: 'Bluetooth 5.0',
      weight: '250g',
      colors: ['Black', 'White', 'Blue']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'prod-002',
    productName: 'Smart Fitness Watch',
    category: 'Wearables',
    brand: 'FitTech',
    description: 'Advanced fitness tracking with heart rate monitoring',
    price: 299.99,
    specifications: {
      displaySize: '1.4 inches',
      batteryLife: '7 days',
      waterResistance: '5ATM',
      sensors: ['Heart Rate', 'GPS', 'Accelerometer']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'prod-003',
    productName: 'Organic Coffee Beans',
    category: 'Food & Beverages',
    brand: 'BrewMaster',
    description: 'Premium organic coffee beans from Colombia',
    price: 24.99,
    specifications: {
      origin: 'Colombia',
      roastLevel: 'Medium',
      weight: '1kg',
      organic: true,
      fairTrade: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'prod-004',
    productName: 'Ergonomic Office Chair',
    category: 'Furniture',
    brand: 'ComfortSeating',
    description: 'Adjustable ergonomic chair for office use',
    price: 449.99,
    specifications: {
      material: 'Mesh and Fabric',
      adjustableHeight: true,
      lumbarSupport: true,
      armrests: 'Adjustable',
      warranty: '5 years'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    productId: 'prod-005',
    productName: 'Smartphone Case',
    category: 'Accessories',
    brand: 'ProtectTech',
    description: 'Durable protective case for smartphones',
    price: 19.99,
    specifications: {
      material: 'Silicone and TPU',
      dropProtection: '6 feet',
      compatibility: ['iPhone 15', 'iPhone 15 Pro'],
      colors: ['Clear', 'Black', 'Blue', 'Red']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function populateData() {
  try {
    const putRequests = sampleProducts.map(product => ({
      PutRequest: {
        Item: product
      }
    }));
    
    const command = new BatchWriteCommand({
      RequestItems: {
        'ProductsTable041520261133': putRequests
      }
    });
    
    const result = await docClient.send(command);
    console.log('Sample data populated successfully:', result);
    
    // Verify data was inserted
    const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
    const scanCommand = new ScanCommand({
      TableName: 'ProductsTable041520261133'
    });
    
    const scanResult = await docClient.send(scanCommand);
    console.log(`\nVerification: ${scanResult.Items.length} products inserted:`);
    scanResult.Items.forEach(item => {
      console.log(`- ${item.productId}: ${item.productName}`);
    });
    
  } catch (error) {
    console.error('Error populating data:', error);
  }
}

populateData();