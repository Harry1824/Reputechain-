require('dotenv').config({ path: '.env' });
const { ethers } = require('ethers');

async function testGet() {
  const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL || 'http://127.0.0.1:8545');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = [
    "function getAttestation(address user) external view returns (uint256 score, string ipfsHash, uint256 timestamp, address issuer)"
  ];

  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

  console.log(`Checking attestation for ${wallet.address} on contract ${process.env.CONTRACT_ADDRESS}...`);
  try {
    const data = await contract.getAttestation(wallet.address);
    console.log("Raw Attestation Data:", data);
  } catch (err) {
    console.error("Error fetching:", err);
  }
}

testGet();
