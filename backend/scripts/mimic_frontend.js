const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

async function mimicFrontend() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await User.findOne({});
    
    if (!user) {
      console.log("No user in DB.");
      process.exit(1);
    }
    
    const walletAddress = user.get('walletAddress');
    console.log(`User: ${user.get('name')} | Wallet: ${walletAddress}`);
    
    if (!walletAddress) {
      console.log("WALLET ADDRESS IS NULL IN DATABASE! THIS IS WHY THE UI IS NULL!");
      process.exit(0);
    }

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET);
    console.log(`Sending GET /api/reputation/attestation/${walletAddress}`);
    
    try {
      const res = await axios.get(`http://localhost:3000/api/reputation/attestation/${walletAddress}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("API SUCCESS:", JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("API ERROR:", err.response ? err.response.data : err.message);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

mimicFrontend();
