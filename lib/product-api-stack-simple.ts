import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class ProductApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '041520261133';

    // DynamoDB Table
    const productsTable = new dynamodb.Table(this, `ProductsTable${suffix}`, {
      tableName: `ProductsTable${suffix}`,
      partitionKey: {
        name: 'productId',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Enable auto scaling
    productsTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    productsTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10
    });

    // Lambda Functions
    const getAllProductsFunction = new lambda.Function(this, `GetAllProductsFunction${suffix}`, {
      functionName: `GetAllProductsFunction${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const command = new ScanCommand({
      TableName: process.env.TABLE_NAME
    });
    
    const result = await docClient.send(command);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      },
      body: JSON.stringify({
        success: true,
        data: result.Items || []
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: productsTable.tableName
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 128
    });

    const getProductByIdFunction = new lambda.Function(this, `GetProductByIdFunction${suffix}`, {
      functionName: `GetProductByIdFunction${suffix}`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const productId = event.pathParameters?.productId;
    
    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Product ID is required',
          code: 'MISSING_PRODUCT_ID'
        })
      };
    }
    
    const command = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { productId }
    });
    
    const result = await docClient.send(command);
    
    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Product not found',
          code: 'PRODUCT_NOT_FOUND'
        })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      },
      body: JSON.stringify({
        success: true,
        data: result.Item
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      })
    };
  }
};
      `),
      environment: {
        TABLE_NAME: productsTable.tableName
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 128
    });

    // Grant permissions
    productsTable.grantReadData(getAllProductsFunction);
    productsTable.grantReadData(getProductByIdFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, `ProductApi${suffix}`, {
      restApiName: `ProductApi${suffix}`,
      description: 'Product API for accessing product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      }
    });

    // API Resources and Methods
    const productsResource = api.root.addResource('products');
    
    // GET /products
    productsResource.addMethod('GET', new apigateway.LambdaIntegration(getAllProductsFunction));
    
    // GET /products/{productId}
    const productByIdResource = productsResource.addResource('{productId}');
    productByIdResource.addMethod('GET', new apigateway.LambdaIntegration(getProductByIdFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL'
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: productsTable.tableName,
      description: 'DynamoDB Table Name'
    });
  }
}