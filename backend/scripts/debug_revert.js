require('dotenv').config({ path: '.env' });
const { ethers } = require('ethers');

async function debugRevert() {
  const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'http://127.0.0.1:8545');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = [
    "function anchorReputation(address user, uint256 score, string ipfsHash) external",
    "function admin() view returns (address)"
  ];

  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

  console.log(`Testing against contract: ${process.env.CONTRACT_ADDRESS}`);
  
  try {
    const admin = await contract.admin();
    console.log(`Admin is: ${admin} | Wallet is: ${wallet.address}`);
    
    // Simulate exactly what the user is doing
    const dummyUser = wallet.address; 
    const fakeCID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"; // Exactly 46 chars like Pinata
    const score = 100;

    console.log(`Calling anchorReputation(${dummyUser}, ${score}, ${fakeCID})`);
    
    // Perform a static call first to cleanly catch any Solidity require() errors
    await contract.anchorReputation.staticCall(dummyUser, score, fakeCID);
    console.log('Static call passed! The logic works.');
    
    // Now actually send to ensure Ganache mines it
    const tx = await contract.anchorReputation(dummyUser, score, fakeCID);
    const receipt = await tx.wait();
    
    console.log(`Transaction mined! Status: ${receipt.status}`);
  } catch (err) {
    console.error("FATAL REVERT DETECTED!");
    console.error(err);
    if (err.info) console.log("ERROR INFO:", err.info);
    if (err.data) console.log("ERROR DATA:", err.data);
  }
}

debugRevert();
