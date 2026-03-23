# Deployment Guide - AI SW Program Manager

## Prerequisites

- Python 3.11+
- Node.js 18+
- AWS CLI installed and configured
- AWS CDK CLI: `npm install -g aws-cdk`

## Step 1: Setup Development Environment

```powershell
cd AI-SW-Program-Manager
.\setup.ps1
.\venv\Scripts\Activate.ps1
```

## Step 2: Configure AWS Credentials

```powershell
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Verify
aws sts get-caller-identity

# Set environment variables
$env:CDK_DEFAULT_ACCOUNT = (aws sts get-caller-identity --query Account --output text)
$env:CDK_DEFAULT_REGION = "us-east-1"
```

## Step 3: Build Lambda Layers

```powershell
.\layers\build-layers.ps1
```

Builds three layers: common, data-processing, and ai-ml.

## Step 4: Bootstrap CDK (First Time Only)

```powershell
cd infrastructure
cdk bootstrap aws://$env:CDK_DEFAULT_ACCOUNT/$env:CDK_DEFAULT_REGION
```

## Step 5: Deploy Backend Infrastructure

```powershell
cd infrastructure

# Preview changes
cdk diff

# Deploy all stacks
cdk deploy --all
```

### Stack Deployment Order

Stacks deploy in dependency order:

1. **Auth** - Cognito User Pool
2. **VPCNetworkSecurity** - VPC, security groups, flow logs
3. **Database** - DynamoDB tables + RDS PostgreSQL (depends on VPC)
4. **Storage** - S3 buckets + OpenSearch (depends on VPC)
5. **Cache** - ElastiCache Redis (depends on VPC)
6. **Monitoring** - CloudWatch log groups, X-Ray, SNS alarm topic
7. **AuditLogging** - CloudTrail, log aggregation (depends on Monitoring)
8. **IngestionWorkflow** - Step Functions orchestration (depends on Database)
9. **APIGateway** - REST API + Lambda functions (depends on Auth, Database, Monitoring)

### Deploy Individual Stacks (Optional)

```powershell
cdk deploy AISWProgramManager-Auth
cdk deploy AISWProgramManager-VPCNetworkSecurity
cdk deploy AISWProgramManager-Database
cdk deploy AISWProgramManager-Storage
cdk deploy AISWProgramManager-Cache
cdk deploy AISWProgramManager-Monitoring
cdk deploy AISWProgramManager-AuditLogging
cdk deploy AISWProgramManager-IngestionWorkflow
cdk deploy AISWProgramManager-APIGateway
```

## Step 6: Initialize Database Schema

After the Database stack is deployed:

```powershell
# Get RDS endpoint
aws rds describe-db-instances --query "DBInstances[?DBName=='ai_sw_program_manager'].Endpoint.Address" --output text

# Get credentials from Secrets Manager
aws secretsmanager get-secret-value --secret-id <SECRET_ARN_FROM_STACK_OUTPUT> --query SecretString --output text

# Run schema from a bastion host or VPC-connected Lambda
psql -h <RDS_ENDPOINT> -U postgres -d ai_sw_program_manager -f infrastructure/database/schema.sql
```

> **Note:** RDS is in a private subnet. You need a bastion host or VPC-connected Lambda to run the schema.

## Step 7: Deploy Frontend

```powershell
cd frontend
npm install
npm run build
```

- For local development: `npm start`
- For production: deploy the `frontend/build/` output to an S3 bucket with CloudFront

## Step 8: Verify Deployment

```powershell
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE
aws dynamodb list-tables
aws s3 ls | findstr ai-sw-pm
aws rds describe-db-instances --query "DBInstances[].DBInstanceIdentifier"
```

## Teardown

```powershell
cd infrastructure
cdk destroy --all
```

## Notes

- OpenSearch domain creation can take 15-30 minutes.
- Check CloudWatch Logs for Lambda errors: `aws logs tail /aws/lambda/ai-sw-pm-<service-name> --follow`
- Use `cdk diff` before every deploy to review changes.
