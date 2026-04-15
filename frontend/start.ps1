# AI SW Program Manager Frontend - Start Script

Write-Host "🚀 AI SW Program Manager Frontend - Start Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Make sure you're in the frontend directory." -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Dependencies not installed. Running installation..." -ForegroundColor Yellow
    
    # Run the install script
    if (Test-Path "install-and-fix.ps1") {
        .\install-and-fix.ps1
    } else {
        Write-Host "🔧 Installing dependencies..." -ForegroundColor Yellow
        npm install --legacy-peer-deps
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
            exit 1
        }
    }
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "📝 Creating .env file from example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "✅ .env file created. Please update it with your AWS credentials." -ForegroundColor Green
    } else {
        Write-Host "⚠️ No .env file found. Creating a basic one..." -ForegroundColor Yellow
        @"
# AWS Configuration
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_WEB_CLIENT_ID=your-client-id
REACT_APP_API_GATEWAY_URL=your-api-gateway-url

# Optional: For local development
REACT_APP_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ Basic .env file created. Please update it with your AWS credentials." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎯 Starting development server..." -ForegroundColor Green
Write-Host "The application will open at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# Start the development server
npm start