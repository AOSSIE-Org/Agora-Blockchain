/* global ethers task */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.10",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY],
    },
    amoy: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_AMOY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  mocha: {
    timeout: 100000000,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  contractSizer: {
    runOnCompile: true,
  },
};
