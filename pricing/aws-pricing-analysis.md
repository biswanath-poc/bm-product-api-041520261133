# AWS Cost Analysis Report: Product API System

## Executive Summary

This comprehensive cost analysis provides detailed pricing estimates for the Product API system, a serverless architecture built on AWS Lambda, API Gateway, and DynamoDB. The system is designed for scalable product data management with flexible JSON storage capabilities.

## Architecture Overview

The Product API system consists of:
- **AWS API Gateway (REST API)**: Entry point for all API requests
- **AWS Lambda Functions**: Serverless compute for business logic (Node.js 18.x)
- **Amazon DynamoDB**: NoSQL database with on-demand billing
- **AWS CloudWatch**: Monitoring and logging

## Service-by-Service Cost Analysis

### 1. AWS Lambda

**Configuration:**
- Runtime: Node.js 18.x
- Memory: 128 MB (GetAllProducts, GetProductById), 256 MB (PopulateSampleData)
- Timeout: 30 seconds (API functions), 60 seconds (data population)

**Pricing Structure:**
- **Requests**: $0.0000002 per request
- **Compute Duration (GB-seconds)**:
  - Tier 1 (0-6B GB-seconds): $0.0000166667 per GB-second
  - Tier 2 (6B-15B GB-seconds): $0.0000150000 per GB-second
  - Tier 3 (15B+ GB-seconds): $0.0000133334 per GB-second

**Monthly Cost Scenarios:**

| Usage Level | Requests/Month | Avg Duration | GB-Seconds | Request Cost | Compute Cost | Total Cost |
|-------------|----------------|--------------|------------|--------------|--------------|------------|
| **Low** | 10,000 | 200ms | 256 | $0.002 | $0.004 | **$0.006** |
| **Medium** | 100,000 | 200ms | 2,560 | $0.020 | $0.043 | **$0.063** |
| **High** | 1,000,000 | 200ms | 25,600 | $0.200 | $0.427 | **$0.627** |
| **Enterprise** | 10,000,000 | 200ms | 256,000 | $2.000 | $4.267 | **$6.267** |

### 2. Amazon API Gateway (REST API)

**Pricing Structure:**
- **First 333M requests/month**: $3.50 per million requests
- **Next 667M requests/month**: $2.80 per million requests
- **Next 19B requests/month**: $2.38 per million requests
- **Over 20B requests/month**: $1.51 per million requests

**Monthly Cost Scenarios:**

| Usage Level | Requests/Month | Cost Calculation | Total Cost |
|-------------|----------------|------------------|------------|
| **Low** | 10,000 | 0.01M × $3.50 | **$0.035** |
| **Medium** | 100,000 | 0.1M × $3.50 | **$0.350** |
| **High** | 1,000,000 | 1M × $3.50 | **$3.500** |
| **Enterprise** | 10,000,000 | 10M × $3.50 | **$35.000** |

### 3. Amazon DynamoDB (On-Demand)

**Configuration:**
- Billing Mode: On-Demand (Pay-per-request)
- Table: ProductsTable with flexible JSON schema

**Pricing Structure:**
- **Read Request Units**: $0.125 per million RRUs
- **Write Request Units**: $0.625 per million WRUs
- **Storage**: $0.25 per GB-month (estimated)

**Monthly Cost Scenarios:**

| Usage Level | Read Requests | Write Requests | Storage (GB) | Read Cost | Write Cost | Storage Cost | Total Cost |
|-------------|---------------|----------------|--------------|-----------|------------|--------------|------------|
| **Low** | 8,000 | 2,000 | 0.1 | $0.001 | $0.001 | $0.025 | **$0.027** |
| **Medium** | 80,000 | 20,000 | 1.0 | $0.010 | $0.013 | $0.250 | **$0.273** |
| **High** | 800,000 | 200,000 | 5.0 | $0.100 | $0.125 | $1.250 | **$1.475** |
| **Enterprise** | 8,000,000 | 2,000,000 | 25.0 | $1.000 | $1.250 | $6.250 | **$8.500** |

### 4. AWS CloudWatch

**Included Services:**
- Lambda function logs
- API Gateway access logs
- DynamoDB metrics

**Estimated Monthly Costs:**
- **Low Usage**: $2-5
- **Medium Usage**: $5-15
- **High Usage**: $15-50
- **Enterprise Usage**: $50-150

## Total Monthly Cost Summary

| Usage Scenario | Lambda | API Gateway | DynamoDB | CloudWatch | **Total Monthly Cost** |
|----------------|--------|-------------|----------|------------|----------------------|
| **Low** | $0.006 | $0.035 | $0.027 | $3.00 | **$3.07** |
| **Medium** | $0.063 | $0.350 | $0.273 | $8.00 | **$8.69** |
| **High** | $0.627 | $3.500 | $1.475 | $25.00 | **$30.60** |
| **Enterprise** | $6.267 | $35.000 | $8.500 | $75.00 | **$124.77** |

## Cost Optimization Recommendations

### Immediate Optimizations
1. **Lambda Memory Optimization**: Monitor actual memory usage and adjust allocation
2. **DynamoDB Query Optimization**: Implement efficient query patterns to reduce RRU consumption
3. **API Gateway Caching**: Enable caching for frequently accessed endpoints
4. **CloudWatch Log Retention**: Set appropriate log retention periods (7-30 days for development)

### Long-term Strategies
1. **Reserved Capacity**: Consider DynamoDB reserved capacity for predictable workloads
2. **Lambda Provisioned Concurrency**: For consistent performance requirements
3. **Multi-region Deployment**: Evaluate costs vs. benefits for global distribution
4. **Data Archival**: Implement lifecycle policies for old product data

## Free Tier Benefits

**AWS Lambda:**
- 1M free requests per month
- 400,000 GB-seconds of compute time per month

**Amazon DynamoDB:**
- 25 GB of storage
- 25 provisioned Write Capacity Units (WCU)
- 25 provisioned Read Capacity Units (RCU)

**API Gateway:**
- 1M API calls per month (first 12 months)

## Key Assumptions

1. **Geographic Region**: US East (N. Virginia) pricing
2. **Usage Patterns**: Evenly distributed throughout the month
3. **Data Size**: Average product record ~2KB
4. **Read/Write Ratio**: 80% reads, 20% writes for DynamoDB
5. **Lambda Execution**: Average 200ms execution time
6. **No Reserved Instances**: All pricing based on on-demand rates
7. **Standard Support**: No premium support costs included

## Exclusions

- Data transfer costs between regions
- Custom domain names and SSL certificates
- Development and testing environment costs
- Third-party integrations and services
- Backup and disaster recovery solutions
- Enhanced monitoring and alerting tools

## Pricing Model

**Primary Model**: ON DEMAND
- Pay-per-use pricing for all services
- No upfront commitments
- Automatic scaling based on demand

## Cost Monitoring Recommendations

1. **AWS Cost Explorer**: Set up monthly cost tracking
2. **CloudWatch Billing Alarms**: Configure alerts at $10, $50, $100 thresholds
3. **AWS Budgets**: Create budget alerts for each service
4. **Cost Allocation Tags**: Implement consistent tagging strategy
5. **Regular Reviews**: Monthly cost analysis and optimization reviews

## Conclusion

The Product API system offers excellent cost efficiency for serverless workloads, with costs scaling linearly with usage. The low-usage scenario costs under $5/month, making it ideal for development and small-scale production deployments. For enterprise-scale usage, the system remains cost-effective at approximately $125/month for 10M requests.

The serverless architecture provides automatic scaling, high availability, and minimal operational overhead, making it an excellent choice for product data management systems with variable or unpredictable traffic patterns.

---

**Report Generated**: April 15, 2026  
**Pricing Data Source**: AWS Pricing API  
**Currency**: USD  
**Region**: US East (N. Virginia)