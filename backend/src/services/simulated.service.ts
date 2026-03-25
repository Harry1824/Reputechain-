export const fetchLinkedinProfile = async (profileUrl: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const connectionCount = (profileUrl.length * 12) % 500 + 100;
  const endorsements = (profileUrl.length * 5) % 100;

  return {
    profileUrl,
    connectionCount,
    endorsements,
    isVerified: true,
  };
};

export const fetchUpworkProfile = async (profileUrl: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const jobSuccessScore = 80 + (profileUrl.length % 20);
  const totalEarnings = (profileUrl.length * 1000) % 50000 + 1000;

  return {
    profileUrl,
    jobSuccessScore,
    totalEarnings,
  };
};

export const fetchStackOverflowProfile = async (profileUrl: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Determine realistic mock stats
  const reputation = (profileUrl.length * 200) % 15000 + 500;
  const badges = {
    gold: (profileUrl.length * 2) % 10,
    silver: (profileUrl.length * 3) % 25,
    bronze: (profileUrl.length * 5) % 50
  };

  return {
    profileUrl,
    reputation,
    badges,
  };
};
