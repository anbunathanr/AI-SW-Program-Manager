export const awsConfig = {
  Auth: {
    region: 'us-east-1',
    userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: process.env.REACT_APP_API_ENDPOINT || 'https://api.example.com',
        region: 'us-east-1',
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: process.env.REACT_APP_S3_BUCKET || 'ai-sw-program-manager-documents',
      region: 'us-east-1',
    },
  },
};