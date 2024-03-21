// /** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require("@semaphore-protocol/hardhat");
require("@nomiclabs/hardhat-waffle");


/** @type import('hardhat/config').HardhatUserConfig */
//require("hardhat-contract-sizer");
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.23",
        settings: {},
      },
    ],
  },
  defaultNetwork:"sepoli",
  networks:{
    hardhat:{
      allowUnlimitedContractSize:true
    },
    mumbai:{
      allowUnlimitedContractSize:true,
      url:process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com/",
      accounts:[process.env.PRIVATE_KEY],  //private key place here
    },
    sepoli:{
      allowUnlimitedContractSize:true,
      
      url:process.env.SEPOLI_RPC_URL || "https://rpc-mumbai.maticvigil.com/",
      accounts:[process.env.PRIVATE_KEY],  //private key place here
    }
  },  
  mocha: {
    timeout: 100000000
  },
  settings: {
    optimizer: {
      enabled: true
    }
  },
  contractSizer:{
    runOnCompile:true
  },
  paths: {
		artifacts: "../clientAnonymousVoting/src/abis",
	},

};

