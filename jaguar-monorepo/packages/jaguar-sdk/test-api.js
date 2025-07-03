const crypto = require('node:crypto');

// Generate UUIDs for testing
function generateUUID() {
  return crypto.randomUUID();
}

// Test data with correct schema
const testData = {
  id: generateUUID(),
  message: {
    id: generateUUID(),
    createdAt: new Date().toISOString(),
    role: 'user',
    content: 'Hello, test message',
    parts: [
      {
        type: 'text',
        text: 'Hello, test message',
      },
    ],
  },
  selectedChatModel: 'chat-model',
  selectedVisibilityType: 'private',
};

console.log('=== API Test Data ===');
console.log(JSON.stringify(testData, null, 2));

// Function to test the API
async function testAPI() {
  try {
    console.log('\n=== Making API Request ===');

    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    const responseText = await response.text();
    console.log('Response:', responseText);

    // Try to parse as JSON if possible
    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('Parsed JSON:', JSON.stringify(jsonResponse, null, 2));
    } catch (e) {
      console.log('Response is not JSON');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Check if we should run the test
if (process.argv[2] === 'test') {
  testAPI();
} else {
  console.log('\nTo test the API, run: node test-api.js test');
  console.log(
    '\nFirst, make sure your development server is running on localhost:3000',
  );
}
