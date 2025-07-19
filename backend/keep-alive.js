const https = require('https');

// Function to ping the server to keep it alive
function keepAlive() {
  const url = process.env.RENDER_EXTERNAL_URL || 'https://your-app-name.onrender.com';
  
  console.log(`Pinging ${url} to keep server alive...`);
  
  https.get(`${url}/api/health`, (res) => {
    console.log(`Keep-alive ping successful. Status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Keep-alive ping failed:', err.message);
  });
}

// Ping every 14 minutes (840000 ms) to prevent Render free tier sleep
if (process.env.NODE_ENV === 'production') {
  setInterval(keepAlive, 14 * 60 * 1000);
  console.log('Keep-alive service started. Will ping every 14 minutes.');
}

module.exports = { keepAlive };