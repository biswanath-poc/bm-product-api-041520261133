# Technical Design Document

## Architecture Overview

The Product API system follows a serverless architecture pattern using AWS services to provide a scalable, cost-effective solution for product data management and retrieval.

## System Architecture

### High-Level Components

1. **API Gateway**: Entry point for all API requests, handles routing and request/response transformation
2. **Lambda Functions**: Serverless compute for business logic execution
3. **DynamoDB**: NoSQL database for flexible JSON product data storage
4. **CDK**: Infrastructure as Code for deployment and resource management

### Architecture Diagram

```
[Client] → [API Gateway] → [Lambda Functions] → [DynamoDB]
                ↓
         [CloudWatch Logs]
```

## Technical Stack

- **Runtime**: Node.js 18.x
- **Database**: Amazon DynamoDB
- **API Management**: AWS API Gateway (REST API)
- **Compute**: AWS Lambda
- **Infrastructure**: AWS CDK
- **Deployment**: CDK Deploy

## Database Design

### DynamoDB Table Structure

**Table Name**: `ProductsTable`

**Primary Key**: 
- Partition Key: `productId` (String)

**Attributes** (flexible JSON schema):
```json
{
  "productId": "string",
  "productName": "string",
  "category": "string", 
  "brand": "string",
  "description": "string",
  "price": "number",
  "specifications": {
    // Flexible nested attributes
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Sample Data Structure**:
```json
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
  "createdAt": "2026-04-15T06:06:18.508Z",
  "updatedAt": "2026-04-15T06:06:18.508Z"
}
```

## API Design

### REST Endpoints

#### GET /products
- **Purpose**: Retrieve all products
- **Response**: Array of product objects
- **Status Codes**: 200 (success), 500 (server error)

#### GET /products/{productId}
- **Purpose**: Retrieve specific product by ID
- **Parameters**: productId (path parameter)
- **Response**: Single product object
- **Status Codes**: 200 (success), 404 (not found), 500 (server error)

### Response Format

**Success Response**:
```json
{
  "success": true,
  "data": [/* product objects */]
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Lambda Functions

### GetAllProducts Function
- **Runtime**: Node.js 18.x
- **Memory**: 128 MB
- **Timeout**: 30 seconds
- **Purpose**: Scan DynamoDB table and return all products

### GetProductById Function
- **Runtime**: Node.js 18.x
- **Memory**: 128 MB
- **Timeout**: 30 seconds
- **Purpose**: Query DynamoDB for specific product by ID

### PopulateSampleData Function
- **Runtime**: Node.js 18.x
- **Memory**: 256 MB
- **Timeout**: 60 seconds
- **Purpose**: Initialize database with sample product data

## Security Considerations

- API Gateway handles HTTPS termination
- Lambda functions use IAM roles with minimal required permissions
- DynamoDB access restricted to Lambda execution roles
- No authentication required (prototype scope)

## Performance Considerations

- DynamoDB on-demand billing for cost optimization
- Lambda cold start mitigation through proper memory allocation
- API Gateway caching disabled for development simplicity
- CloudWatch logging enabled for monitoring

## Deployment Strategy

- Single CDK stack deployment
- Environment-specific configuration through CDK context
- Automated resource provisioning and configuration
- Sample data population as part of deployment process

## Monitoring and Logging

- CloudWatch Logs for Lambda function execution
- API Gateway access logging
- DynamoDB CloudWatch metrics
- Error tracking through structured logging