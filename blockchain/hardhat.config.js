require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

// Validate environment variables
const getEnv = (name) => {
  if (!process.env[name]) {
    console.warn(`WARNING: Missing environment variable ${name}`);
    return "";
  }
  return process.env[name];
};

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      allowUnlimitedContractSize: true
    },
    amoy: process.env.RPC_URL_AMOY ? {
      url: getEnv("RPC_URL_AMOY"),
      accounts: [getEnv("PRIVATE_KEY")],
    } : undefined,
    sepolia: process.env.RPC_URL_SEPOLIA ? {
      url: getEnv("RPC_URL_SEPOLIA"),
      accounts: [getEnv("PRIVATE_KEY")],
    } : undefined,
  },
  etherscan: {
    apiKey: getEnv("ETHERSCAN_KEY"),
  }
};