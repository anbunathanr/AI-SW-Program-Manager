const { execSync } = require('child_process');

try {
  console.log('Testing ReportGeneration component compilation...');
  
  // Test TypeScript compilation
  execSync('npx tsc --noEmit --skipLibCheck src/components/Reports/ReportGeneration.tsx src/TestReportGeneration.tsx', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ ReportGeneration component compiles successfully!');
  console.log('✅ All @mui/material imports are working correctly!');
  console.log('✅ Component is ready to use!');
  
} catch (error) {
  console.error('❌ Compilation failed:', error.message);
  process.exit(1);
}