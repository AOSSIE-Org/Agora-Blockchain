require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  settings: { optimizer: { enabled: true, runs: 10_000 } },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    amoy: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_AMOY,
      accounts: [process.env.PRIVATE_KEY],
    },
    sepolia: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_SEPOLIA,
      accounts: [process.env.PRIVATE_KEY],
    },
    fuji: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_FUJI,
      accounts: [process.env.PRIVATE_KEY],
    },
    bsc: {
      allowUnlimitedContractSize: true,
      url: process.env.RPC_URL_BSC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  contractSizer: {
    runOnCompile: true,
  },
};
