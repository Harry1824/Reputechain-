import { ethers } from 'ethers';
import { env } from '../config/env';
import logger from '../utils/logger';

// Standard ERC20 / Attestation Contract ABI (Simplified for the anchor function)
const ATT_ABI = [
  "function anchorReputation(address user, uint256 score, string ipfsHash) external",
  "function getAttestation(address user) external view returns (tuple(uint256 score, string ipfsHash, uint256 timestamp, address issuer))"
];

// Placeholder address if none provided in env
const CONTRACT_ADDRESS = env.web3.contractAddress || '0x0000000000000000000000000000000000000000';

export class Web3Service {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(env.web3.rpcUrl);
    // Be careful with private keys, handle error specifically if invalid
    if (env.web3.privateKey.length === 66 || env.web3.privateKey.length === 64) {
      this.wallet = new ethers.Wallet(env.web3.privateKey, this.provider);
    } else {
      // Create random wallet for dev if not properly configured to avoid crash
      logger.warn('Invalid private key provided; generating random wallet for test env');
      this.wallet = ethers.Wallet.createRandom().connect(this.provider) as unknown as ethers.Wallet;
    }
    
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, ATT_ABI, this.wallet);
  }

  async anchorReputation(userAddress: string, score: number, ipfsHash: string) {
    try {
      if (CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        logger.warn('Mocking transaction: Contract address not set');
        return '0x_mock_tx_hash';
      }

      logger.info(`Anchoring score ${score} for ${userAddress} with IPFS Hash ${ipfsHash}`);
      
      const tx = await this.contract.anchorReputation(userAddress, score, ipfsHash, { gasLimit: 800000 });
      const receipt = await tx.wait();
      
      return receipt.hash;
    } catch (error: any) {
      logger.error('Error anchoring to blockchain:', error);
      throw new Error(`Blockchain transaction failed: ${error.message}`);
    }
  }

  async getOnChainAttestation(userAddress: string) {
    try {
      if (CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
         return { notice: "Contract not configured yet" };
      }
      const data = await this.contract.getAttestation(userAddress);
      return {
        score: Number(data.score),
        ipfsHash: data.ipfsHash,
        timestamp: Number(data.timestamp),
        issuer: data.issuer
      };
    } catch (error: any) {
      logger.error('Error reading from blockchain:', error);
      throw new Error(`Failed to read on-chain attestation: ${error.message}`);
    }
  }
}

export const web3Service = new Web3Service();
