# Agora Blockchain

# Agora Blockchain

## Prerequisites (only for contributing)

- Basic familarity with [Git](https://git-scm.com/), [NodeJS](https://nodejs.org/en) and [npm](https://www.npmjs.com/).
- Basic familarity with [ReactJS](https://reactjs.org/), [React context APIs](https://reactjs.org/docs/context.html), if working on frontend part.
- Basic familarity with Blockchain, [Solidity](https://docs.soliditylang.org/en/v0.8.6/) and [Hardhat](https://hardhat.org/), if working on blockchain part.

## Requirements

- [NodeJS](https://nodejs.org/en) >= 10.16 and [npm](https://www.npmjs.com/) >= 5.6 installed.
- [Git](https://git-scm.com/) installed in the system.
- [Hardhat](https://hardhat.org/), which can be installed globally with `npm install --save-dev hardhat`
- [Metamask](https://metamask.io) extension added to the browser.

## Development Guide

**Clone the repository**

```bash
git clone https://gitlab.com/aossie/agora-blockchain/
```

**Switch to develop branch**

```bash
git checkout develop
```

The frontend code is inside the `client` directory, whereas the smart contracts (solidity) is present inside `server` folder. You may proceed to `client` folder if you are here for enhancing frontend part of the Agora Blockchain. Else you can proceed to `server` folder for enhancing the efficiency or introducing new features in the blockchain part of the Agora.

> Whatever dependencies you need for frontend should be saved in their local `package.json` and not in the global one. This would ensure that a developer who only want to contribute to blockchain code, should not install unneccessary frontend dependencies and vice-versa.

## Setting up client side

Frontend code is present inside the `client` folder. Thus, the dependencies required for frontend are listed in the local `package.json` of `client` folder. You can install only the client-side dependencies using the following command.

**Install client-side dependencies**

```bash
npm run install-client --force
```

or

```bash
cd client
npm install
```

**Start frontend**

For development purpose we will run this command to start our client react app.

```bash
npm run client
```

or

```bash
cd client
npm start
```

**Build production for client**

> Only required while deploying frontend to some hosting services like AWS, Heroku, GCP etc.

This will create production build folder inside the `client` directory with the minified code of frontend. The production build will be served using `server.js` file inside the `client` folder.

```
npm run build
```

Deploying the repository to **Heroku** would automatically serve production build of the client side. This is because, **Heroku** uses `npm run build` for deploying our application. Once the `build` is complete, it uses the `npm start` command. In the `package.json` file of root directory, you can see `node client/server.js` command against `start` script. This will serve the minified files from `build` direcotry.

## Setting up Hardhat

Smart contracts or blockchain codes and necessary config files for developing, testing and deploying them are present inside `server` directory. Inside the `server` folder, there is `contracts` directory which stores **Agora Blockchain**'s business logic i.e. the smart contracts. `migrations` folder contains files for migrating smart contracts to the blockchain network. Go through these smart contracts and start contributing.

**About smart contracts**

We use Hardhat for editing, compiling, debugging and deploying your smart contracts and dApps, all of which work together to create a complete development environment. Compiled smart contracts or build files are then stored inside the `/artifacts/contracts` directory. You need to copy the required files to the frontend after compiling.

**Install server-side dependencies**

```bash
npm run install-server
```

or

```bash
cd server
npm install
```

> Now move inside `server` folder for the next steps.

**Compiling smart contracts**

If we have altered the code within our Solidity files (.sol) or made new ones or just want generate build files for the client, we need to run `npx hardhat compile` in the terminal. Compiled files are generated inside `/artifacts/contracts/File_name/`.

```bash
npx hardhat compile
```

**Create a .env file**

For deploying smart contracts on a blockchain network we need two things: A node connected to the network through which we will make RPC calls and an account with few coins, to cover the cost of deployment. [Infura](https://infura.io/) provides us the node for Ethereum network. So register there and put the Infura's API key inside of the `.env` file, like shown below.

```bash
MNEMONIC="<YOUR_SEED_GOES_HERE>"
KEY="<YOUR INFURA KEY GOES HERE>"
```

Also save your wallet's mnemonic phrase against the MNEMONIC in .env file, and don't forget to fund the account corresponding to that mnemonic. There are several faucets available to fund your account with test tokens.

> Never share or commit your `.env` file. It contains your credentials like `mnemonics` and `API` key. Therefore, it is advised to add `.env` to your `.gitignore` file.

**Deploying smart contracts**

You can deploy the smart contracts in the localhost network following these steps:

- Start a local node

```bash
npx hardhat node
```

- Open a new terminal and deploy the smart contract in the localhost network.


```bash
npx hardhat run --network localhost scripts/deploy.js
```

The above line will print the contract addresses which are deployed, mentioned in `deploy.js`.

Replace the contract addresses printed in the terminal with the contract addresses hard coded in the frontend files.
