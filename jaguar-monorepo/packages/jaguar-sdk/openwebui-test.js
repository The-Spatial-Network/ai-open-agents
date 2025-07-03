// OpenWebUI API Test Script for ai.thespatialnetwork.net

const API_BASE = 'https://ai.thespatialnetwork.net';
const API_KEY = process.env.OPENWEBUI_API_KEY || 'YOUR_API_KEY_HERE';

async function testEndpoint(name, url, options = {}) {
  console.log(`\n=== ${name} ===`);
  console.log(`URL: ${url}`);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        ...options.headers,
      },
      ...options,
    });

    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000;

    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${responseTime}s`);

    const contentType = response.headers.get('content-type');
    console.log(`Content-Type: ${contentType}`);

    if (contentType?.includes('application/json')) {
      try {
        const data = await response.json();
        console.log('Response Data:');
        console.log(JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('Failed to parse JSON response');
        const text = await response.text();
        console.log(
          'Raw response:',
          text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        );
      }
    } else {
      const text = await response.text();
      console.log(
        'Raw response:',
        text.substring(0, 200) + (text.length > 200 ? '...' : ''),
      );
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  console.log('=== OpenWebUI API Testing ===');
  console.log(`Target: ${API_BASE}`);
  console.log(
    `API Key: ${API_KEY === 'YOUR_API_KEY_HERE' ? 'NOT SET' : 'SET'}`,
  );

  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.log(
      '\n⚠️  Set OPENWEBUI_API_KEY environment variable or update the script',
    );
  }

  // Test 1: Health check
  await testEndpoint('Health Check', `${API_BASE}/api/health`, {
    method: 'GET',
  });

  // Test 2: Available models
  await testEndpoint('Available Models', `${API_BASE}/api/models`, {
    method: 'GET',
  });

  // Test 3: Chat completion
  await testEndpoint('Chat Completion', `${API_BASE}/api/chat/completions`, {
    method: 'POST',
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Hello, test message',
        },
      ],
      stream: false,
      max_tokens: 100,
    }),
  });

  // Test 4: Try alternative endpoints
  await testEndpoint('API Info', `${API_BASE}/api/v1/models`, {
    method: 'GET',
  });

  console.log('\n=== Testing Complete ===');
  console.log('Common OpenWebUI endpoints:');
  console.log('- /api/health - Health check');
  console.log('- /api/models - Available models');
  console.log('- /api/chat/completions - Chat completions');
  console.log('- /api/v1/models - Alternative models endpoint');
  console.log('- /api/auth/signin - Authentication');
}

// Run tests if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testEndpoint, runTests };
