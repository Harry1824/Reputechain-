const http = require('http');

const data = JSON.stringify({
  email: 'test2@example.com',
  password: 'password123',
  name: 'Test User'
});

const req = http.request(
  'http://localhost:3000/api/auth/register',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log('Register Res:', res.statusCode, body);
      try {
        const json = JSON.parse(body);
        if (json.tokens && json.tokens.access) {
          testProfile(json.tokens.access.token);
        } else if (res.statusCode === 400 && json.message === 'Email already taken') {
          login();
        }
      } catch (e) {
        console.error('Parse error', e);
      }
    });
  }
);

req.on('error', console.error);
req.write(data);
req.end();

function login() {
  const req2 = http.request(
    'http://localhost:3000/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log('Login Res:', res.statusCode, body);
        const json = JSON.parse(body);
        testProfile(json.tokens.access.token);
      });
    }
  );
  req2.on('error', console.error);
  req2.write(data);
  req2.end();
}

function testProfile(token) {
  const req3 = http.request(
    'http://localhost:3000/api/user/profile',
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log('Profile Res:', res.statusCode, body);
        testCalculate(token);
      });
    }
  );
  req3.on('error', console.error);
  req3.end();
}

function testCalculate(token) {
  const req4 = http.request(
    'http://localhost:3000/api/reputation/calculate',
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log('Calculate Res:', res.statusCode, body);
      });
    }
  );
  req4.on('error', console.error);
  req4.end();
}
