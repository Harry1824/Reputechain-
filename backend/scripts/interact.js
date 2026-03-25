require('dotenv').config({ path: '.env' });
const { ethers } = require('ethers');

async function main() {
  // 1. Connect to the local blockchain (Ganache)
  const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'http://127.0.0.1:8545');

  // 2. Connect the wallet using the private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // 3. Define the minimal ABI needed to interact with ReputeChain.sol
  const abi = [
    "function anchorReputation(address user, uint256 score, string memory ipfsHash) external",
    "function getAttestation(address user) external view returns (uint256 score, string ipfsHash, uint256 timestamp, address issuer)",
    "function admin() public view returns (address)"
  ];

  const contractAddress = process.env.CONTRACT_ADDRESS;
  console.log(`Connecting to Contract at: ${contractAddress}`);

  // 4. Create the Contract instance
  const reputeChain = new ethers.Contract(contractAddress, abi, wallet);

  // Check the Admin address out of curiosity
  const admin = await reputeChain.admin();
  console.log(`Contract Admin is: ${admin}`);

  // 5. Interact: Let's read an attestation for a dummy address
  const dummyAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Ganache Account #2
  console.log(`\nFetching attestation for: ${dummyAddress}...`);
  
  try {
    const attestation = await reputeChain.getAttestation(dummyAddress);
    console.log("Attestation found:");
    console.log("- Score:", attestation.score.toString());
    console.log("- IPFS Hash:", attestation.ipfsHash);
    console.log("- Timestamp:", new Date(Number(attestation.timestamp) * 1000).toLocaleString());
    console.log("- Issuer:", attestation.issuer);
  } catch (err) {
    if (err.message.includes("No attestation found")) {
      console.log(`No attestation found for this user yet. Let's create one!`);
      
      console.log(`\nAnchoring new reputation score to the blockchain...`);
      const tx = await reputeChain.anchorReputation(dummyAddress, 850, "QmTestHash12345");
      console.log(`Transaction sent! Hash: ${tx.hash}`);
      
      console.log("Waiting for confirmation...");
      await tx.wait();
      console.log("Transaction confirmed in block.");
      
      console.log(`\nFetching attestation again...`);
      const newAttestation = await reputeChain.getAttestation(dummyAddress);
      console.log("- New Score:", newAttestation.score.toString());
      console.log("- New IPFS Hash:", newAttestation.ipfsHash);
    } else {
      console.error("Error fetching attestation:", err.message);
    }
  }
}

main().catch(console.error);
