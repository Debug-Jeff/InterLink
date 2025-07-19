// Test script to verify deployment connectivity
const https = require('https');

const FRONTEND_URL = 'https://interlinkweb.netlify.app';
const BACKEND_URL = 'https://interlink-1lil.onrender.com';

console.log('🚀 Testing InterLink Deployment Connectivity...\n');

// Test 1: Backend Health Check
console.log('1. Testing Backend Health Check...');
https.get(`${BACKEND_URL}/api/health`, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(`   ✅ Backend Health: ${res.statusCode} - ${data}`);
    testFrontend();
  });
}).on('error', (err) => {
  console.log(`   ❌ Backend Health Error: ${err.message}`);
  testFrontend();
});

// Test 2: Frontend Availability
function testFrontend() {
  console.log('\n2. Testing Frontend Availability...');
  https.get(FRONTEND_URL, (res) => {
    console.log(`   ✅ Frontend Status: ${res.statusCode}`);
    console.log(`   📍 Frontend URL: ${FRONTEND_URL}`);
    testCORS();
  }).on('error', (err) => {
    console.log(`   ❌ Frontend Error: ${err.message}`);
    testCORS();
  });
}

// Test 3: CORS Configuration
function testCORS() {
  console.log('\n3. Testing CORS Configuration...');
  const options = {
    hostname: 'interlink-1lil.onrender.com',
    path: '/api/health',
    method: 'OPTIONS',
    headers: {
      'Origin': FRONTEND_URL,
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  };

  const req = https.request(options, (res) => {
    const corsHeaders = {
      'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': res.headers['access-control-allow-headers']
    };
    console.log(`   ✅ CORS Status: ${res.statusCode}`);
    console.log(`   🔗 CORS Headers:`, corsHeaders);
    showSummary();
  });

  req.on('error', (err) => {
    console.log(`   ❌ CORS Test Error: ${err.message}`);
    showSummary();
  });

  req.end();
}

function showSummary() {
  console.log('\n📋 DEPLOYMENT SUMMARY:');
  console.log(`   🌐 Frontend: ${FRONTEND_URL}`);
  console.log(`   🔧 Backend:  ${BACKEND_URL}`);
  console.log(`   💾 Database: Supabase (configured)`);
  console.log('\n🎯 Next Steps:');
  console.log('   1. Verify both services are running');
  console.log('   2. Test user authentication');
  console.log('   3. Check dashboard data loading');
  console.log('   4. Test form submissions');
}