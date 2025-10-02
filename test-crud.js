const http = require('http');

// Test CRUD operations
async function testCRUD() {
  console.log('🧪 Testing CRUD Operations...\n');

  // First, login to get a token
  const loginData = JSON.stringify({
    email: 'mbonimana12@gmail.com',
    password: 'admin123'
  });

  console.log('1. Testing Login...');
  const loginResponse = await makeRequest('/api/auth/login', 'POST', loginData);
  
  if (loginResponse.statusCode !== 200) {
    console.log('❌ Login failed');
    return;
  }
  
  const loginResult = JSON.parse(loginResponse.data);
  const token = loginResult.token;
  console.log('✅ Login successful! Token:', token.substring(0, 20) + '...\n');

  // Get current products
  console.log('2. Getting current products...');
  const getResponse = await makeRequest('/api/products', 'GET');
  const products = JSON.parse(getResponse.data);
  console.log(`✅ Found ${products.length} products\n`);

  if (products.length > 0) {
    const productId = products[0]._id;
    console.log('3. Testing Product Update...');
    
    const updateData = JSON.stringify({
      title: 'Updated ' + products[0].title,
      description: 'This product has been updated via API test',
      price: 99.99,
      category: 'Test Category',
      stock: 50,
      featured: true
    });

    const updateResponse = await makeRequest(`/api/products/${productId}`, 'PUT', updateData, token);
    
    if (updateResponse.statusCode === 200) {
      console.log('✅ Product updated successfully!');
      const updatedProduct = JSON.parse(updateResponse.data);
      console.log('Updated title:', updatedProduct.title);
    } else {
      console.log('❌ Product update failed:', updateResponse.data);
    }

    console.log('\n4. Testing Product Delete...');
    const deleteResponse = await makeRequest(`/api/products/${productId}`, 'DELETE', null, token);
    
    if (deleteResponse.statusCode === 200) {
      console.log('✅ Product deleted successfully!');
    } else {
      console.log('❌ Product delete failed:', deleteResponse.data);
    }

    console.log('\n5. Verifying deletion...');
    const verifyResponse = await makeRequest('/api/products', 'GET');
    const remainingProducts = JSON.parse(verifyResponse.data);
    console.log(`✅ Remaining products: ${remainingProducts.length}`);
  }

  console.log('\n🎉 CRUD test completed!');
}

function makeRequest(path, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

testCRUD().catch(console.error);
