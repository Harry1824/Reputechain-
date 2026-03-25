const { execSync } = require('child_process');
const { ethers } = require('ethers');
require('dotenv').config({ path: '.env' });

async function init() {
  console.log("Waiting 3 seconds for local Ganache node to start...");
  await new Promise(r => setTimeout(r, 3000));

  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  
  let needsDeploy = true;
  if (process.env.CONTRACT_ADDRESS && process.env.CONTRACT_ADDRESS.length > 10) {
    try {
      const code = await provider.getCode(process.env.CONTRACT_ADDRESS);
      if (code !== '0x') {
        console.log(`Contract already persists at ${process.env.CONTRACT_ADDRESS}! Skipping deployment.`);
        needsDeploy = false;
      }
    } catch(e) {
      console.log('Error checking contract code:', e.message);
    }
  }

  if (needsDeploy) {
    console.log("Contract not found on this chain instance! Bootstrapping new deployment...");
    execSync('node scripts/deploy.js', { stdio: 'inherit' });
  }
}

init().catch(console.error);
