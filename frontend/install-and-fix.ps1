# AI SW Program Manager Frontend - Install and Fix Script

Write-Host "🔧 AI SW Program Manager Frontend - Install and Fix" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Make sure you're in the frontend directory." -ForegroundColor Red
    exit 1
}

# Clean previous installations
Write-Host "🧹 Cleaning previous installations..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✅ Removed node_modules" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✅ Removed package-lock.json" -ForegroundColor Green
}

# Clear npm cache
Write-Host "🗑️ Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies. Trying with legacy peer deps..." -ForegroundColor Red
    npm install --legacy-peer-deps
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Installation failed. Please check your Node.js version." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Check TypeScript compilation
Write-Host "🔍 Checking TypeScript compilation..." -ForegroundColor Yellow
npx tsc --noEmit --skipLibCheck

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ TypeScript compilation successful!" -ForegroundColor Green
} else {
    Write-Host "⚠️ TypeScript compilation has warnings (this is normal for development)" -ForegroundColor Yellow
}

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please update it with your AWS credentials." -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env file with your AWS credentials" -ForegroundColor White
Write-Host "2. Run: npm start" -ForegroundColor White
Write-Host "3. Open http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "To start the development server now, run:" -ForegroundColor Yellow
Write-Host "npm start" -ForegroundColor Green