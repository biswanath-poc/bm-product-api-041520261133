# Product API Project

A serverless AWS solution for accessing product specifications through REST API endpoints. The system provides flexible JSON schema storage in DynamoDB and exposes product data through API Gateway.

## Architecture

- **API Gateway**: REST API endpoints for product access
- **AWS Lambda**: Serverless compute for business logic
- **DynamoDB**: NoSQL database with flexible JSON schema
- **CDK**: Infrastructure as Code deployment

## API Endpoints

### Base URL
```
https://fslvfni787.execute-api.us-east-1.amazonaws.com/prod/
```

### GET /products
Retrieve all products from the database.

**Request:**
```bash
curl "https://fslvfni787.execute-api.us-east-1.amazonaws.com/prod/products"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "productId": "prod-001",
      "productName": "Wireless Bluetooth Headphones",
      "category": "Electronics",
      "brand": "TechBrand",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 199.99,
      "specifications": {
        "batteryLife": "30 hours",
        "connectivity": "Bluetooth 5.0",
        "weight": "250g",
        "colors": ["Black", "White", "Blue"]
      },
      "createdAt": "2026-04-15T06:19:12.331Z",
      "updatedAt": "2026-04-15T06:19:12.334Z"
    }
  ]
}
```

### GET /products/{productId}
Retrieve a specific product by ID.

**Request:**
```bash
curl "https://fslvfni787.execute-api.us-east-1.amazonaws.com/prod/products/prod-001"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "prod-001",
    "productName": "Wireless Bluetooth Headphones",
    "category": "Electronics",
    "brand": "TechBrand",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 199.99,
    "specifications": {
      "batteryLife": "30 hours",
      "connectivity": "Bluetooth 5.0",
      "weight": "250g",
      "colors": ["Black", "White", "Blue"]
    },
    "createdAt": "2026-04-15T06:19:12.331Z",
    "updatedAt": "2026-04-15T06:19:12.334Z"
  }
}
```

**Error Response (Product Not Found):**
```json
{
  "success": false,
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

## Sample Data

The system includes 5 sample products across different categories:

1. **Wireless Bluetooth Headphones** (Electronics)
2. **Smart Fitness Watch** (Wearables)
3. **Organic Coffee Beans** (Food & Beverages)
4. **Ergonomic Office Chair** (Furniture)
5. **Smartphone Case** (Accessories)

## Deployment

### Prerequisites
- AWS CLI configured with appropriate permissions
- Node.js 18+ installed
- CDK CLI installed (`npm install -g aws-cdk`)

### Deploy Infrastructure
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Set environment variables
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export CDK_DEFAULT_REGION=$(aws configure get region || echo "us-east-1")

# Deploy CDK stack
npx cdk deploy --require-approval never
```

### Populate Sample Data
```bash
# Run the data population script
node populate-data.js
```

## AWS Resources Created

- **DynamoDB Table**: `ProductsTable041520261133`
- **Lambda Functions**:
  - `GetAllProductsFunction041520261133`
  - `GetProductByIdFunction041520261133`
- **API Gateway**: `ProductApi041520261133`
- **IAM Roles**: Service roles for Lambda functions with minimal permissions

## Testing

### Test All Products Endpoint
```bash
curl "https://fslvfni787.execute-api.us-east-1.amazonaws.com/prod/products"
```

### Test Single Product Endpoint
```bash
curl "https://fslvfni787.execute-api.us-east-1.amazonaws.com/prod/products/prod-001"
```

### Test Error Handling
```bash
curl "https://fslvfni787.execute-api.us-east-1.amazonaws.com/prod/products/invalid-id"
```

## Data Schema

Products follow a flexible JSON schema with these core fields:

- `productId` (string): Unique identifier
- `productName` (string): Product name
- `category` (string): Product category
- `brand` (string): Brand name
- `description` (string): Product description
- `price` (number): Product price
- `specifications` (object): Flexible nested attributes
- `createdAt` (string): ISO timestamp
- `updatedAt` (string): ISO timestamp

## Error Handling

The API returns structured error responses with appropriate HTTP status codes:

- **400**: Bad Request (missing parameters)
- **404**: Product Not Found
- **500**: Internal Server Error

## Security

- CORS enabled for cross-origin requests
- IAM roles with minimal required permissions
- No authentication required (prototype scope)

## Monitoring

- CloudWatch Logs for Lambda function execution
- API Gateway access logging
- DynamoDB CloudWatch metrics

## Cleanup

To remove all resources:
```bash
npx cdk destroy
```

## Project Structure

```
├── bin/
│   └── bm-product-api.ts          # CDK app entry point
├── lib/
│   └── product-api-stack-simple.ts # CDK stack definition
├── populate-data.js               # Sample data population script
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── cdk.json                       # CDK configuration
└── README.md                      # This file
```