// Amplify v6 configuration — all values driven from environment variables
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      loginWith: {
        email: true,
      },
    },
  },
  Storage: {
    S3: {
      bucket: process.env.REACT_APP_S3_BUCKET || 'ai-sw-program-manager-documents',
      region: process.env.REACT_APP_REGION || 'us-east-1',
    },
  },
};
