# AI SW Program Manager - Frontend

A modern React TypeScript dashboard for AI-powered software program management.

## Features

- **Authentication** - AWS Cognito integration with secure login/signup
- **Dashboard** - Real-time project health scores, RAG status, and metrics
- **Risk Management** - Color-coded risk alerts with detailed analysis
- **Predictions** - AI-powered delay and workload predictions with charts
- **Document Intelligence** - Upload and extract insights from SOWs, BRDs, SLAs
- **Semantic Search** - Natural language search across all documents
- **Report Generation** - Automated PDF report creation and scheduling
- **Real-time Notifications** - Live alerts and updates
- **Multi-tenant Support** - Tenant-specific branding and data isolation

## Tech Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for components and theming
- **AWS Amplify** for authentication and API integration
- **Recharts** for data visualization
- **Axios** for HTTP requests
- **Zustand** for state management
- **React Router** for navigation

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── HealthScoreCard.tsx
│   │   ├── RiskAlertsCard.tsx
│   │   └── PredictionCharts.tsx
│   ├── Documents/
│   │   └── DocumentUpload.tsx
│   ├── Search/
│   │   └── SemanticSearch.tsx
│   ├── Reports/
│   │   └── ReportGeneration.tsx
│   └── Notifications/
│       └── NotificationPanel.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── config/
│   └── aws-config.ts
├── App.tsx
├── App.css
├── index.tsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- AWS account with Cognito User Pool configured
- Backend API deployed and accessible

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**
   Create `.env` file in the frontend directory:
   ```env
   REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
   REACT_APP_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
   REACT_APP_API_ENDPOINT=https://your-api-gateway-url.com
   REACT_APP_S3_BUCKET=your-documents-bucket
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

   The app will open at http://localhost:3000

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Configuration

### AWS Amplify Setup

The app uses AWS Amplify for authentication. Configure your AWS resources in `src/config/aws-config.ts`:

```typescript
export const awsConfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-client-id',
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: 'your-api-gateway-url',
        region: 'us-east-1',
      },
    ],
  },
};
```

### API Integration

The frontend communicates with the Python backend via REST APIs. All API calls are configured in `src/services/api.ts` with automatic JWT token handling.

## Key Components

### Dashboard
- **HealthScoreCard**: Displays project health with RAG status
- **RiskAlertsCard**: Shows color-coded risk alerts
- **PredictionCharts**: AI prediction visualizations

### Document Management
- **DocumentUpload**: Drag & drop file upload with AI processing
- **SemanticSearch**: Natural language document search

### Reports
- **ReportGeneration**: Create and download PDF reports
- **NotificationPanel**: Real-time alerts and updates

## Features in Detail

### Authentication Flow
1. User lands on login page
2. AWS Cognito handles authentication
3. JWT token stored and used for API calls
4. Automatic redirect to dashboard on success

### Real-time Updates
- Health scores refresh every 30 seconds
- Risk alerts update in real-time
- Notifications appear instantly
- Charts update with new prediction data

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Collapsible sidebar navigation
- Adaptive chart sizing

### Security
- JWT token authentication
- HTTPS-only communication
- XSS protection
- CSRF prevention

## API Endpoints

The frontend expects these backend endpoints:

```
GET  /health-score          - Project health data
GET  /risks                 - Risk alerts list
GET  /predictions           - AI predictions
POST /documents/upload      - Document upload
POST /search               - Semantic search
POST /reports/generate     - Report generation
GET  /notifications        - User notifications
```

## Deployment

### AWS S3 + CloudFront
1. Build the app: `npm run build`
2. Upload to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_USER_POOL_ID` | AWS Cognito User Pool ID | Yes |
| `REACT_APP_USER_POOL_CLIENT_ID` | Cognito App Client ID | Yes |
| `REACT_APP_API_ENDPOINT` | Backend API base URL | Yes |
| `REACT_APP_S3_BUCKET` | S3 bucket for documents | Yes |

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Material-UI design system
- Consistent component structure

### Testing
```bash
npm test                    # Run tests
npm run test:coverage      # Coverage report
```

### Debugging
- React Developer Tools
- Redux DevTools (if using Redux)
- Network tab for API calls
- Console logs for errors

## Performance Optimization

- **Code Splitting**: Lazy loading for routes
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: webpack-bundle-analyzer

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Cognito configuration
   - Verify User Pool settings
   - Ensure CORS is configured

2. **API Connection Issues**
   - Verify API Gateway URL
   - Check CORS headers
   - Validate JWT token format

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify environment variables

### Debug Mode
Set `REACT_APP_DEBUG=true` to enable debug logging.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting guide
- Review API documentation
- Contact the development team

---

**Status**: ✅ Frontend MVP Complete
**Next Steps**: Deploy and integrate with backend APIs