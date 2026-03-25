const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function testFetch() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await User.findOne({});
    
    if (!user) process.exit(1);
    
    const walletAddress = user.get('walletAddress');
    console.log(`Wallet Address from Mongo: ${walletAddress}`);

    console.log(`Sending GET /api/reputation/attestation/${walletAddress}`);
    
    const getRes = await axios.get(`http://localhost:3000/api/reputation/attestation/${walletAddress}`);
    console.log("REACT UI RECEIVED:", JSON.stringify(getRes.data, null, 2));
    
    process.exit(0);
  } catch (e) {
    console.error("API ERROR:", e.response ? e.response.data : e.message);
    process.exit(1);
  }
}

testFetch();
