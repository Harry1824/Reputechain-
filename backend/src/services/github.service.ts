import axios from 'axios';
import { env } from '../config/env';
import logger from '../utils/logger';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchGithubProfile = async (usernameInput: string) => {
  try {
    // Sanitize username in case a user inputted a full URL
    let username = usernameInput.trim();
    if (username.includes('github.com/')) {
      username = username.split('github.com/')[1].split('/')[0];
    }
  
    const hasValidToken = env.github.token && !env.github.token.includes('your_github');
    const headers = hasValidToken ? { Authorization: `token ${env.github.token}` } : {};
    
    const userResponse = await axios.get(`${GITHUB_API_URL}/users/${username}`, { headers });
    const reposResponse = await axios.get(`${GITHUB_API_URL}/users/${username}/repos?per_page=100`, { headers });
    
    const publicRepos = userResponse.data.public_repos;
    const followers = userResponse.data.followers;
    
    const totalStars = reposResponse.data.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
    
    return {
      username,
      publicRepos,
      followers,
      totalStars,
    };
  } catch (error: any) {
    logger.error(`Error fetching GitHub data for ${usernameInput}:`, error?.response?.data || error.message);
    logger.warn('Warning: GitHub fetch failed, gracefully falling back to zero score so transaction succeeds.');
    // Do not throw! Just return zeros so user is not blocked from blockchain anchoring!
    return {
      username: usernameInput,
      publicRepos: 0,
      followers: 0,
      totalStars: 0
    };
  }
};
