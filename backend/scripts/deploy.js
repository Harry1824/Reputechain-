const solc = require('solc');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

async function main() {
  // 1. Compile Contract
  const contractPath = path.resolve(__dirname, '..', 'contracts', 'ReputeChain.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'ReputeChain.sol': {
        content: source,
      },
    },
    settings: {
      evmVersion: 'paris',
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  };

  console.log("Compiling contract...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    let hasError = false;
    output.errors.forEach((err) => {
      console.error(err.formattedMessage);
      if (err.severity === 'error') hasError = true;
    });
    if (hasError) process.exit(1);
  }

  const contract = output.contracts['ReputeChain.sol']['ReputeChainAttestation'];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  // 2. Deploy Contract
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
  // the first default key from ganache
  const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Using the standard hardhat/ganache test key 0
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying contract...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const deployedContract = await factory.deploy();
  await deployedContract.waitForDeployment();
  const address = await deployedContract.getAddress();
  
  console.log(`Contract deployed at: ${address}`);

  // 3. Update .env
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/CONTRACT_ADDRESS=.*$/m, `CONTRACT_ADDRESS=${address}`);
    envContent = envContent.replace(/PRIVATE_KEY=.*$/m, `PRIVATE_KEY=${privateKey}`);
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env file with new CONTRACT_ADDRESS and PRIVATE_KEY");
  } else {
    console.log("Please update your .env file.");
  }
}

main().catch(console.error);
