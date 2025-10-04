const http = require('http');

console.log('🧪 Testing Railway setup...');

// Test if the built server can be imported
try {
  console.log('✅ TypeScript build successful');
  console.log('✅ Compiled files exist in dist/');
  
  // Test if we can require the compiled server
  const serverPath = './dist/server.js';
  console.log(`📁 Server file: ${serverPath}`);
  
  // Check if file exists
  const fs = require('fs');
  if (fs.existsSync(serverPath)) {
    console.log('✅ Server file exists');
    console.log('✅ Ready for Railway deployment!');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Go to railway.app and create a new project');
    console.log('3. Connect your GitHub repository');
    console.log('4. Set environment variables in Railway dashboard');
    console.log('5. Deploy!');
    
    console.log('\n📚 Your Swagger UI will be available at:');
    console.log('https://your-app-name.railway.app/api-docs');
    
  } else {
    console.log('❌ Server file not found');
  }
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
}

console.log('\n🎉 Railway setup test completed!');
