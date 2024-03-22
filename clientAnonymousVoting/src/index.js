import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import {store} from './store/store'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

const projectId = "8e778482126e2af936e44f9cdfb08c37";

const sepolia = {
  chainId:11155111,
  name:"Sepolia",
  rpcUrl:"https://eth-sepolia.g.alchemy.com/v2/bOWZwPZQpppSliRgqTvwjqPPSLTnuzPW",
  currency:"ETH",
  explorerUrl: 'https://sepolia.etherscan.io/',
}

const metadata = {
  name:"Agora Blockchain",
  description: 'Agora is a blockchain-based voting system that allows for secure, anonymous, and transparent voting.',

}

const config = defaultConfig({
  metadata
})

createWeb3Modal({
  ethersConfig:config,
  chains:[sepolia],
  projectId:projectId,
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);