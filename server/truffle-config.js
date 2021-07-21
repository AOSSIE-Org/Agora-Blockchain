require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

//Account credentials from which our contract will be deployed
const mnemonic = process.env.MNEMONIC;

//API key of your Datahub account for Avalanche Fuji test network
const APIKEY = process.env.APIKEY;

const RPCURL = `https://api.avax-test.network/ext/bc/C/rpc`;
const DATAHUB_RPC_URL = `https://avalanche--fuji--rpc.datahub.figment.io/apikey/${APIKEY}/ext/bc/C/rpc/`;

module.exports = {
  contracts_build_directory: "../client/src/blockchainBuild/",
  networks: {
    rinkeby: {
      host: "localhost",
      provider: () =>
        new HDWalletProvider(mnemonic, `wss://rinkeby.infura.io/ws/v3/${key}`),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    fuji: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic,
          providerOrUrl: RPCURL,
          chainId: "0xa869",
        });
      },
      network_id: "*",
      skipDryRun: true,
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};
