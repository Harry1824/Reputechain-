const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config({ path: '.env' });

async function mimicAnchor() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const user = await User.findOne({});
    
    if (!user) {
      console.log("No user in DB.");
      process.exit(1);
    }
    
    const walletAddress = user.get('walletAddress');
    if (!walletAddress) {
      console.log("WALLET ADDRESS IS NULL IN DATABASE!");
      process.exit(1);
    }

    const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET);
    console.log(`Sending POST /api/reputation/anchor`);
    
    try {
      const res = await axios.post(`http://localhost:3000/api/reputation/anchor`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("ANCHOR SUCCESS:", JSON.stringify(res.data, null, 2));

      console.log(`Now Sending GET /api/reputation/attestation/${walletAddress}`);
      const getRes = await axios.get(`http://localhost:3000/api/reputation/attestation/${walletAddress}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("FETCH SUCCESS:", JSON.stringify(getRes.data, null, 2));

    } catch (err) {
      console.error("API ERROR:", err.response ? err.response.data : err.message);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

mimicAnchor();
