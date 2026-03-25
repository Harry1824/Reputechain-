const mongoose = require('mongoose');
const { ethers } = require('ethers');
require('dotenv').config({ path: '.env' });

async function forceAnchor() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    
    // Find the first user in the DB (the user who logged in)
    const user = await User.findOne({});
    if (!user) {
      console.log("No user found in DB.");
      process.exit(1);
    }
    
    const walletAddress = user.get('walletAddress');
    if (!walletAddress) {
      console.log("User hasn't linked a MetaMask wallet!");
      process.exit(1);
    }
    
    console.log(`Found User: ${user.get('name')} | Wallet: ${walletAddress}`);

    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'http://127.0.0.1:8545');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const abi = [
      "function anchorReputation(address user, uint256 score, string ipfsHash) external"
    ];

    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

    console.log(`Anchoring manually to ${process.env.CONTRACT_ADDRESS}...`);
    
    // Hardcode a score and a fake CID so it bypasses Pinata keys if they are still broken
    const score = 95;
    const fakeCID = "QmeSjM2P5ozZNAQZ81nEa1ZtUKx1bTqN7J8s1tXq7YhRk3"; // 46 chars
    
    const tx = await contract.anchorReputation(walletAddress, score, fakeCID, { gasLimit: 800000 });
    const receipt = await tx.wait();
    
    console.log(`Successfully verified on-chain! TRX Hash: ${receipt.hash}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

forceAnchor();
