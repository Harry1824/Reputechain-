import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User';
import * as githubService from '../services/github.service';
import logger from '../utils/logger';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    logger.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { walletAddress, linkedinProfile, upworkProfile, stackoverflowProfile } = req.body;
    const user = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { walletAddress, linkedinProfile, upworkProfile, stackoverflowProfile },
      { new: true }
    ).select('-password');

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const connectGithub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { githubUsername } = req.body;
    const user = req.user;

    const githubData = await githubService.fetchGithubProfile(githubUsername);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { githubUsername },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'GitHub connected successfully',
      user: updatedUser,
      githubData
    });
  } catch (error: any) {
    logger.error('Error connecting GitHub:', error);
    res.status(400).json({ message: error.message || 'Failed to connect GitHub' });
  }
};
