require('dotenv').config({ path: '.env' });
const axios = require('axios');

async function testPinata() {
  const data = JSON.stringify({
    pinataOptions: { cidVersion: 1 },
    pinataMetadata: { name: `Test_Pin.json` },
    pinataContent: { hello: "world" }
  });

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
      headers: {
        'Content-Type': 'application/json',
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });
    console.log("SUCCESS:", response.data);
  } catch (err) {
    if (err.response) {
      console.error("PINATA ERROR RESPONSE:", err.response.data);
    } else {
      console.error("NETWORK ERROR:", err.message);
    }
  }
}

testPinata();
