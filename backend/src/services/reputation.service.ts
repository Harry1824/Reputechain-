import { User } from '../models/User';
import * as githubService from './github.service';
import * as simulatedService from './simulated.service';

export const calculateScore = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  let totalScore = 0;
  const breakDown: any = {};

  if (user.githubUsername) {
    const ghData = await githubService.fetchGithubProfile(user.githubUsername);
    let ghScore = 0;
    ghScore += Math.min(ghData.publicRepos * 0.5, 10);
    ghScore += Math.min(ghData.followers * 0.2, 10);
    ghScore += Math.min(ghData.totalStars * 0.5, 20);
    totalScore += ghScore;
    breakDown.github = { data: ghData, score: Math.round(ghScore) };
  }

  if (user.linkedinProfile) {
    const lnData = await simulatedService.fetchLinkedinProfile(user.linkedinProfile);
    let lnScore = 0;
    lnScore += Math.min(lnData.connectionCount * 0.04, 20);
    lnScore += Math.min(lnData.endorsements * 0.2, 10);
    totalScore += lnScore;
    breakDown.linkedin = { data: lnData, score: Math.round(lnScore) };
  }

  if (user.upworkProfile) {
    const upData = await simulatedService.fetchUpworkProfile(user.upworkProfile);
    let upScore = 0;
    upScore += (upData.jobSuccessScore / 100) * 15;
    upScore += Math.min(upData.totalEarnings / 1000, 15);
    totalScore += upScore;
    breakDown.upwork = { data: upData, score: Math.round(upScore) };
  }

  // 4. StackOverflow Score (max 20 points)
  if (user.stackoverflowProfile) {
    const soData = await simulatedService.fetchStackOverflowProfile(user.stackoverflowProfile);
    let soScore = 0;
    soScore += Math.min(soData.reputation / 100, 10);
    soScore += Math.min((soData.badges.gold * 3) + (soData.badges.silver * 2) + soData.badges.bronze, 10);
    totalScore += soScore;
    breakDown.stackoverflow = { data: soData, score: Math.round(soScore) };
  }

  if (totalScore === 0) {
    totalScore = 10;
  }

  totalScore = Math.min(Math.round(totalScore), 100);

  return {
    userId,
    score: totalScore,
    breakDown,
    timestamp: new Date().toISOString()
  };
};
