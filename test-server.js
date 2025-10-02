const http = require('http');

console.log('Testing server connection...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Server is running! Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (e) => {
  console.error(`❌ Server connection failed: ${e.message}`);
  console.log('Make sure the backend server is running on port 5000');
});

req.setTimeout(5000, () => {
  console.log('❌ Request timeout - server may not be running');
  req.destroy();
});

req.end();
