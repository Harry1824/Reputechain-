import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as reputationService from '../services/reputation.service';
import { pinJSONToIPFS } from '../services/ipfs.service';
import { web3Service } from '../services/web3.service';
import logger from '../utils/logger';

export const calculateScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const reputationData = await reputationService.calculateScore(user._id.toString());

    res.status(200).json({
      message: 'Reputation score calculated successfully',
      data: reputationData
    });
  } catch (error: any) {
    logger.error('Error calculating reputation:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const anchorScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const reputationData = await reputationService.calculateScore(user._id.toString());
    
    const ipfsMetadata = {
      user: {
        id: user._id,
        name: user.name,
        walletAddress: user.walletAddress
      },
      ...reputationData
    };
    
    const ipfsHash = await pinJSONToIPFS(ipfsMetadata);

    if (!user.walletAddress) {
      res.status(400).json({ message: 'User wallet address is missing. Please update profile.' });
      return;
    }

    const txHash = await web3Service.anchorReputation(user.walletAddress, reputationData.score, ipfsHash);

    res.status(200).json({
      message: 'Reputation anchored to blockchain successfully',
      txHash,
      ipfsHash,
      score: reputationData.score
    });
  } catch (error: any) {
    logger.error('Error anchoring to blockchain:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const getAttestation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      res.status(400).json({ message: 'Wallet address required' });
      return;
    }

    const attestation = await web3Service.getOnChainAttestation(walletAddress);
    
    logger.info(`FRONTEND_FETCH for ${walletAddress}: ` + JSON.stringify(attestation));

    res.status(200).json({
      message: 'Attestation fetched successfully',
      data: attestation
    });
  } catch (error: any) {
    logger.error('Error fetching attestation:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
