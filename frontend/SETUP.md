# Frontend Setup Guide

## Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd AI-SW-Program-Manager/frontend
   ```

2. **Run the setup script (Windows):**
   ```powershell
   .\start.ps1
   ```

   **Or manually:**
   ```bash
   npm install
   npm start
   ```

## Manual Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your AWS credentials:
```env
REACT_APP_USER_POOL_ID=your-cognito-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-cognito-client-id
REACT_APP_API_ENDPOINT=your-api-gateway-url
REACT_APP_S3_BUCKET=your-s3-bucket-name
```

### 3. Start Development Server
```bash
npm start
```

The app will open at http://localhost:3000

## Common Issues & Solutions

### 1. Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 2. AWS Amplify Configuration Errors
- Check your `.env` file has correct AWS credentials
- Ensure Cognito User Pool is properly configured
- Verify API Gateway CORS settings

### 3. TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### 4. Build Errors
```bash
# Clean build
npm run build
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run eject` | Eject from Create React App |

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication
│   ├── Dashboard/      # Main dashboard
│   ├── Documents/      # Document management
│   ├── Search/         # Search functionality
│   ├── Reports/        # Report generation
│   └── Notifications/  # Notifications
├── services/           # API services
├── types/             # TypeScript types
├── config/            # Configuration
└── App.tsx            # Main app component
```

## Next Steps

1. **Configure AWS Backend:**
   - Deploy your Python Lambda functions
   - Set up API Gateway
   - Configure Cognito User Pool

2. **Update Environment Variables:**
   - Replace placeholder values in `.env`
   - Test authentication flow

3. **Customize Branding:**
   - Update colors in `App.tsx` theme
   - Replace logos and icons
   - Modify styling in CSS files

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify network requests in DevTools
3. Ensure backend APIs are running
4. Check AWS service configurations

For more help, see the main README.md file.