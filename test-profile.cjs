const http = require('http');

async function doFetch(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 8080,
      path,
      ...options
    }, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function run() {
  const loginBody = JSON.stringify({ email: 'test@example.com', password: 'password123' });
  console.log("Logging in...");
  const loginRes = await doFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginBody) },
    body: loginBody
  });
  
  if (loginRes.status !== 200) {
    console.error("Login failed", loginRes.status, loginRes.body);
    return;
  }
  
  const token = JSON.parse(loginRes.body).tokens.access.token;
  console.log("Token received");
  
  console.log("Fetching profile...");
  const profRes = await doFetch('/api/user/profile', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("Profile:", profRes.status, profRes.body);
  
  console.log("Fetching reputation...");
  const repRes = await doFetch('/api/reputation/calculate', {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log("Reputation:", repRes.status, repRes.body);
}

run().catch(console.error);
