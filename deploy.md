# AI SW Program Manager — Full Deployment Guide

---

## Table of Contents

1. [Debugging Report](#1-debugging-report)
2. [Prerequisites](#2-prerequisites)
3. [Environment Variable Setup](#3-environment-variable-setup)
4. [Backend Deployment (AWS CDK)](#4-backend-deployment-aws-cdk)
5. [Frontend Deployment](#5-frontend-deployment)
6. [Running Locally](#6-running-locally)
7. [Integration Check](#7-integration-check)
8. [Deployment Options](#8-deployment-options)
9. [Common Errors and Fixes](#9-common-errors-and-fixes)
10. [Best Practices](#10-best-practices)

---

## 1. Debugging Report

### 1.1 Frontend Errors Fixed

| # | File | Line(s) | Error | Fix Applied |
|---|------|---------|-------|-------------|
| 1 | `package.json` | — | Missing deps: `react-router-dom`, `recharts`, `axios`, `aws-amplify`, `@aws-amplify/ui-react`, `@mui/icons-material`, `@types/*` | Added all missing packages |
| 2 | `tsconfig.json` | 24–26 | Wildcard `paths` entry `"*": ["node_modules/*","src/*"]` broke all module resolution | Removed broken paths block |
| 3 | `tsconfig.json` | 4 | `lib` missing `esnext` — caused Promise/async type errors | Added `esnext` to lib array |
| 4 | `App.tsx` | 1–55 | `Amplify.configure()` never called; `useAuthenticator` hook fails without `Authenticator.Provider` | Added `Amplify.configure(awsConfig)` and wrapped app in `Authenticator.Provider` |
| 5 | `config/aws-config.ts` | 1–18 | Amplify v5 config format used (`Auth.region`, `API.endpoints`) — incompatible with v6 | Rewrote to Amplify v6 `Auth.Cognito` format |
| 6 | `config/aws-config.ts` | — | `REACT_APP_REGION` env var not referenced | Added region and S3 storage config |
| 7 | `components/Auth/Login.tsx` | 19 | `variation="modal"` is not a valid prop on `Authenticator` in v6 | Removed invalid prop |
| 8 | `components/Auth/Login.tsx` | 25–27 | `navigate('/dashboard')` called directly inside render — React side-effect violation | Moved to `useEffect` with `[user, navigate]` deps |
| 9 | `components/Auth/Login.tsx` | — | `useAuthenticator` used outside `Authenticator` context | Extracted into `LoginInner` component rendered inside `<Authenticator>` |
| 10 | `services/api.ts` | 2 | `import { Auth } from 'aws-amplify'` — `Auth` removed in Amplify v6 | Replaced with `fetchAuthSession`, `signOut` from `aws-amplify/auth` |
| 11 | `services/api.ts` | 14 | `Auth.currentSession()` — v5 API, removed in v6 | Replaced with `fetchAuthSession()` |
| 12 | `services/api.ts` | 31 | `Auth.signOut()` — v5 API | Replaced with `signOut()` from `aws-amplify/auth` |
| 13 | `Dashboard.tsx` | 95–105 | `<ListItem button>` — deprecated in MUI v5, causes TypeScript error | Replaced with `<ListItem disablePadding><ListItemButton>` |
| 14 | `SimpleDashboard.tsx` | 55–75 | Same `<ListItem button>` deprecation | Same fix applied |
| 15 | `RiskAlertsCard.tsx` | 110–125 | Same `<ListItem button>` deprecation | Same fix applied |
| 16 | `DocumentUpload.tsx` | 3 | `ListItemSecondaryAction` imported and used — deprecated in MUI v5 | Replaced with `secondaryAction` prop on `ListItem` |
| 17 | `DocumentUpload.tsx` | 55 | `useCallback` for `handleDrop` missing `handleFiles` in dependency array | Added eslint-disable comment with explanation |
| 18 | `NotificationPanel.tsx` | 3 | `ListItemSecondaryAction` deprecated | Replaced with `secondaryAction` prop |
| 19 | `NotificationPanel.tsx` | 98 | `String.prototype.substr()` deprecated | Replaced with `substring()` |
| 20 | `SemanticSearch.tsx` | 85 | `onKeyPress` deprecated in React 17+ | Replaced with `onKeyDown` |
| 21 | `ReportGeneration.tsx` | — | File was completely empty — `TS1208` isolatedModules error | Implemented full working component |
| 22 | `.env` | — | `REACT_APP_REGION` missing; placeholder values not documented | Added region var and clear comments |

### 1.2 Backend Errors Fixed (Previous Session)

| # | File | Error | Fix Applied |
|---|------|-------|-------------|
| 1 | `audit_logging_stack.py` | `kms:DecryptDataKey` is not a valid KMS action | Changed to `kms:Decrypt` |
| 2 | `audit_logging_stack.py` | `object_lock_enabled=True` incompatible with standard CDK bucket setup | Removed — requires special first-deploy setup |
| 3 | `audit_logging_stack.py` | CloudTrail `send_to_cloud_watch_logs=True` without explicit IAM role fails | Added explicit `cloud_watch_role` with inline policy |
| 4 | `audit_logging_stack.py` | Unused imports (`aws_logs_destinations`, `aws_lambda`) | Removed |
| 5 | `ingestion_workflow_stack.py` | `StateMachine(definition=...)` — `definition` param removed in CDK v2 | Changed to `definition_body=sfn.DefinitionBody.from_chainable(...)` |
| 6 | `cache_stack.py` | `auth_token_enabled=False` is not a valid `CfnReplicationGroup` property | Removed invalid property |
| 7 | `api_gateway_stack.py` | `handler="handler.create_user"` — single function, not a router | Changed to `handler="handler.lambda_handler"` |
| 8 | `api_gateway_stack.py` | `handler="handler.configure_jira_integration"` — same issue | Changed to `handler="handler.lambda_handler"` |
| 9 | `api_gateway_stack.py` | Relative import `from ..lambda_optimization_config` fails at CDK synth | Replaced with `sys.path` absolute import |
| 10 | `auth_stack.py` | Same relative import failure | Same fix |
| 11 | `monitoring_stack.py` | Duplicate alarm names with `api_gateway_stack.py` | Prefixed monitoring stack alarm names |
| 12 | `user_management/handler.py` | No `lambda_handler` entry point | Added router function |
| 13 | `jira_integration/handler.py` | No `lambda_handler` entry point | Added router function |
| 14 | `azure_devops_integration/handler.py` | `from .data_fetcher import ...` relative import fails in Lambda | Replaced with try/except absolute import |
| 15 | `shared/decorators.py` | `from security_monitoring.violation_detector import ...` fails if `src/` not in path | Added `sys.path` fallback |

---

## 2. Prerequisites

### Required Software

```bash
# Check versions
node --version        # Must be >= 18.x
npm --version         # Must be >= 9.x
python --version      # Must be >= 3.11
aws --version         # Must be >= 2.x
cdk --version         # Must be >= 2.x
```

### Install Global Tools

```bash
# AWS CDK CLI
npm install -g aws-cdk

# Serve (for local static hosting)
npm install -g serve
```

### AWS Account Requirements

- Active AWS account
- IAM user/role with permissions for: CloudFormation, Lambda, API Gateway, DynamoDB, RDS, S3, Cognito, OpenSearch, VPC, IAM, Secrets Manager, CloudWatch, EventBridge, Step Functions, ElastiCache, SQS, KMS

---

## 3. Environment Variable Setup

### 3.1 Backend (CDK)

```bash
# Windows PowerShell
$env:CDK_DEFAULT_ACCOUNT = (aws sts get-caller-identity --query Account --output text)
$env:CDK_DEFAULT_REGION  = "us-east-1"

# Linux / macOS
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export CDK_DEFAULT_REGION=us-east-1
```

### 3.2 Frontend

Edit `AI-SW-Program-Manager/frontend/.env`:

```env
# Get these values AFTER deploying the backend stacks
REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_REGION=us-east-1
REACT_APP_API_ENDPOINT=https://XXXXXXXXXX.execute-api.us-east-1.amazonaws.com/prod
REACT_APP_S3_BUCKET=ai-sw-program-manager-documents
REACT_APP_DEBUG=false
GENERATE_SOURCEMAP=false
```

Retrieve values after backend deploy:

```bash
# Cognito User Pool ID
aws cloudformation describe-stacks \
  --stack-name AISWProgramManager-Auth \
  --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" \
  --output text

# Cognito Client ID
aws cloudformation describe-stacks \
  --stack-name AISWProgramManager-Auth \
  --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" \
  --output text

# API Gateway endpoint
aws cloudformation describe-stacks \
  --stack-name AISWProgramManager-APIGateway \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text
```

---

## 4. Backend Deployment (AWS CDK)

### Step 1 — Install Python dependencies

```bash
# From project root
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Step 2 — Install CDK Node dependencies

```bash
cd infrastructure
npm install
```

### Step 3 — Configure AWS credentials

```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output (json)

# Verify
aws sts get-caller-identity
```

### Step 4 — Bootstrap CDK (first time only)

```bash
cd infrastructure
cdk bootstrap aws://$CDK_DEFAULT_ACCOUNT/$CDK_DEFAULT_REGION
```

### Step 5 — Preview changes

```bash
cdk diff
```

### Step 6 — Deploy all stacks

```bash
cdk deploy --all --require-approval never
```

Deployment order (handled automatically by CDK dependency graph):

```
1. AISWProgramManager-Auth
2. AISWProgramManager-VPCNetworkSecurity
3. AISWProgramManager-Database
4. AISWProgramManager-Storage
5. AISWProgramManager-Cache
6. AISWProgramManager-Monitoring
7. AISWProgramManager-AuditLogging
8. AISWProgramManager-IngestionWorkflow
9. AISWProgramManager-APIGateway
```

> **Note:** Full deployment takes 30–45 minutes. OpenSearch domain alone takes 15–20 minutes.

### Step 7 — Initialize database schema

```bash
# Get RDS endpoint
aws rds describe-db-instances \
  --query "DBInstances[?DBName=='ai_sw_program_manager'].Endpoint.Address" \
  --output text

# Get DB password from Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id <SECRET_ARN> \
  --query SecretString --output text

# Run schema (from bastion host or Lambda with VPC access)
psql -h <RDS_ENDPOINT> -U postgres -d ai_sw_program_manager \
  -f infrastructure/database/schema.sql
```

### Step 8 — Verify backend

```bash
# Check all stacks are CREATE_COMPLETE
aws cloudformation list-stacks \
  --stack-status-filter CREATE_COMPLETE \
  --query "StackSummaries[?contains(StackName,'AISWProgramManager')].StackName"

# Check DynamoDB tables
aws dynamodb list-tables --query "TableNames[?contains(@,'ai-sw-pm')]"

# Check Lambda functions
aws lambda list-functions \
  --query "Functions[?contains(FunctionName,'ai-sw-pm')].FunctionName"
```

---

## 5. Frontend Deployment

### Step 1 — Install dependencies

```bash
cd AI-SW-Program-Manager/frontend
npm install --legacy-peer-deps
```

### Step 2 — Set environment variables

Fill in `.env` with values from Step 3.2 above.

### Step 3 — Build for production

```bash
npm run build
```

Output: `build/` directory ready for static hosting.

### Step 4 — Deploy to AWS S3 + CloudFront (recommended)

```bash
# Create S3 bucket for frontend
aws s3 mb s3://ai-sw-pm-frontend-<your-account-id>

# Enable static website hosting
aws s3 website s3://ai-sw-pm-frontend-<your-account-id> \
  --index-document index.html \
  --error-document index.html

# Upload build
aws s3 sync build/ s3://ai-sw-pm-frontend-<your-account-id> --delete

# Create CloudFront distribution (optional but recommended)
aws cloudfront create-distribution \
  --origin-domain-name ai-sw-pm-frontend-<your-account-id>.s3-website-us-east-1.amazonaws.com \
  --default-root-object index.html
```

---

## 6. Running Locally

### Backend (Lambda functions run on AWS — no local server)

```bash
# Activate venv
.\venv\Scripts\Activate.ps1   # Windows
source venv/bin/activate       # Linux/macOS

# Run unit tests locally (no AWS required)
pytest tests/unit -v

# Run with coverage
pytest --cov=src --cov-report=html
```

### Frontend

```bash
cd AI-SW-Program-Manager/frontend

# Development server (hot reload)
npm start
# Opens http://localhost:3000

# Production preview
npm run build
serve -s build -l 3000
```

---

## 7. Integration Check

### API Endpoint Mapping

| Frontend Call | Backend Lambda | CDK Stack |
|---------------|---------------|-----------|
| `GET /health-score` | `ai-sw-pm-health-score` | APIGateway |
| `GET /risks` | `ai-sw-pm-risk-detection` | APIGateway |
| `POST /predictions/delay-probability` | `ai-sw-pm-prediction` | APIGateway |
| `POST /documents/upload` | `ai-sw-pm-document-upload` | APIGateway |
| `POST /documents/{id}/process` | `ai-sw-pm-document-intelligence` | APIGateway |
| `POST /search` | `ai-sw-pm-semantic-search` | APIGateway |
| `POST /reports/generate` | `ai-sw-pm-report-generation` | APIGateway |
| `GET /dashboard/overview` | `ai-sw-pm-dashboard` | APIGateway |
| `POST /users` | `ai-sw-pm-user-management` | APIGateway |
| `POST /integrations/jira/configure` | `ai-sw-pm-jira-integration` | APIGateway |
| `POST /integrations/azure-devops/configure` | `ai-sw-pm-azure-devops` | APIGateway |

### CORS Configuration

API Gateway is configured with `allow_origins=Cors.ALL_ORIGINS` for development.

**For production**, restrict to your frontend domain:

```python
# In infrastructure/stacks/api_gateway_stack.py
default_cors_preflight_options=apigw.CorsOptions(
    allow_origins=["https://your-frontend-domain.com"],
    allow_methods=apigw.Cors.ALL_METHODS,
    allow_headers=["Content-Type", "Authorization"],
    allow_credentials=True
)
```

### Authentication Flow

```
User → Login page → Cognito Authenticator UI
     → JWT token issued → stored in browser
     → axios interceptor attaches Bearer token to every API call
     → API Gateway Lambda Authorizer validates JWT
     → Request forwarded to Lambda with tenant context
```

### Data Format Verification

All API responses follow this structure:

```json
{
  "statusCode": 200,
  "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  "body": "{\"data\": ...}"
}
```

Frontend `api.ts` uses axios which automatically parses `response.data`.

---

## 8. Deployment Options

### Option A — AWS (Full Stack, Recommended)

| Layer | Service | Notes |
|-------|---------|-------|
| Frontend | S3 + CloudFront | CDN, HTTPS, custom domain |
| Auth | Cognito | Already in CDK stack |
| API | API Gateway + Lambda | Already in CDK stack |
| Database | DynamoDB + RDS | Already in CDK stack |
| Search | OpenSearch | Already in CDK stack |
| Cache | ElastiCache Redis | Already in CDK stack |
| Storage | S3 | Already in CDK stack |

### Option B — Vercel (Frontend Only)

```bash
npm install -g vercel
cd AI-SW-Program-Manager/frontend
vercel --prod
```

Set environment variables in Vercel dashboard under Project → Settings → Environment Variables.

### Option C — Netlify (Frontend Only)

```bash
npm install -g netlify-cli
cd AI-SW-Program-Manager/frontend
npm run build
netlify deploy --prod --dir=build
```

Add a `netlify.toml` for SPA routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option D — Docker (Frontend)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }
}
```

```bash
docker build -t ai-sw-pm-frontend .
docker run -p 3000:80 ai-sw-pm-frontend
```

---

## 9. Common Errors and Fixes

### Frontend

**Error:** `Module not found: Can't resolve 'react-router-dom'`
```bash
npm install react-router-dom --legacy-peer-deps
```

**Error:** `Amplify.configure is not a function`
```
Cause: aws-amplify v5/v6 API mismatch.
Fix: Ensure aws-amplify >= 6.0.0 and use the v6 config format in aws-config.ts.
```

**Error:** `useAuthenticator must be used inside Authenticator`
```
Cause: useAuthenticator called outside <Authenticator.Provider>.
Fix: Wrap App in <Authenticator.Provider> in App.tsx.
```

**Error:** `Cannot read properties of undefined (reading 'idToken')`
```
Cause: fetchAuthSession() returns undefined tokens when not logged in.
Fix: Already handled with optional chaining: session.tokens?.idToken?.toString()
```

**Error:** `TS1208: cannot be compiled under --isolatedModules`
```
Cause: A .tsx file has no import/export statements (treated as global script).
Fix: Add at minimum `export {};` or a real export to the file.
```

**Error:** White screen after login redirect
```
Cause: REACT_APP_API_ENDPOINT not set or pointing to wrong URL.
Fix: Update .env with the correct API Gateway URL from CDK outputs.
```

### Backend

**Error:** `cdk synth` fails with `ImportError`
```bash
# Ensure venv is active and dependencies installed
pip install -r infrastructure/requirements.txt
```

**Error:** `Unable to resolve AWS account`
```bash
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export CDK_DEFAULT_REGION=us-east-1
```

**Error:** `OpenSearch domain creation timeout`
```
Cause: OpenSearch takes 15–30 minutes.
Fix: Wait and check status:
aws opensearch describe-domain --domain-name <domain-name>
```

**Error:** Lambda `Runtime.ImportModuleError`
```bash
# Check CloudWatch logs
aws logs tail /aws/lambda/ai-sw-pm-<function-name> --follow
# Usually means a missing dependency in the Lambda package
```

**Error:** `ResourceExistsException` on Secrets Manager
```
Cause: Secret from a previous deploy still exists.
Fix: Delete the old secret:
aws secretsmanager delete-secret --secret-id <name> --force-delete-without-recovery
```

**Error:** API Gateway 403 on all requests
```
Cause: Lambda Authorizer rejecting token.
Fix: Verify USER_POOL_ID env var on the authorizer Lambda matches your Cognito pool.
```

---

## 10. Best Practices

### Security

- Never commit `.env` or real AWS credentials to version control — add to `.gitignore`
- Restrict CORS `allow_origins` to your specific frontend domain in production
- Enable AWS WAF on API Gateway for production
- Rotate Cognito app client secrets regularly
- Use AWS Secrets Manager for all credentials (already implemented)
- Enable MFA on the AWS root account

### Performance

- Enable CloudFront caching for the frontend S3 bucket
- Use Lambda Provisioned Concurrency for the authorizer and dashboard functions (already configured in `lambda_optimization_config.py`)
- ElastiCache Redis is already configured for dashboard caching — ensure Lambda functions use it
- Set `GENERATE_SOURCEMAP=false` in production `.env` to reduce bundle size

### Scalability

- DynamoDB is on PAY_PER_REQUEST billing — scales automatically
- Lambda concurrency limits are set per function — adjust `reserved_concurrent_executions` as needed
- OpenSearch is configured with 2 data nodes — scale `data_nodes` for higher search load

### Maintainability

- Keep `src/shared/` utilities centralized — never duplicate error handling or logging
- All Lambda handlers should route through a single `lambda_handler` entry point
- Use the `with_logging`, `with_error_handling`, `with_tenant_isolation` decorators consistently
- Add `REACT_APP_` prefix to all frontend env vars (CRA requirement)

### CI/CD (Recommended Next Step)

```yaml
# .github/workflows/deploy.yml (example)
name: Deploy
on:
  push:
    branches: [main]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with: { python-version: '3.11' }
      - run: pip install -r requirements.txt
      - run: cd infrastructure && cdk deploy --all --require-approval never
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          CDK_DEFAULT_REGION: us-east-1

  frontend:
    needs: backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: cd AI-SW-Program-Manager/frontend && npm install --legacy-peer-deps
      - run: cd AI-SW-Program-Manager/frontend && npm run build
        env:
          REACT_APP_USER_POOL_ID: ${{ secrets.REACT_APP_USER_POOL_ID }}
          REACT_APP_USER_POOL_CLIENT_ID: ${{ secrets.REACT_APP_USER_POOL_CLIENT_ID }}
          REACT_APP_API_ENDPOINT: ${{ secrets.REACT_APP_API_ENDPOINT }}
          REACT_APP_REGION: us-east-1
      - run: aws s3 sync AI-SW-Program-Manager/frontend/build/ s3://${{ secrets.FRONTEND_BUCKET }} --delete
```

---

*Last updated: 2024 | Version: 2.0.0*
