# Agora Blockchain

> This document covers the technical aspect of **Agora Blockchain**, which will help in understanding the APIs, integrations, frontend, backend, and designs of the project. Please have a look at the README.md file for contribution and installation guidelines.

## Table of Contents

[TOC]

## Prerequisites

- Basic familarity with [Git](https://git-scm.com/), [NodeJS](https://nodejs.org/en) and [npm](https://www.npmjs.com/).
- Basic familarity with [ReactJS](https://reactjs.org/), [React context APIs](https://reactjs.org/docs/context.html) and [Drizzle](https://www.trufflesuite.com/drizzle), if working on frontend part.
- Basic familiarity with Blockchain, [Solidity](https://docs.soliditylang.org/en/v0.8.6/) and [Truffle](https://www.trufflesuite.com/truffle), if working on blockchain part.

## Requirements

- [NodeJS](https://nodejs.org/en) >= 10.16 and [npm](https://www.npmjs.com/) >= 5.6 installed.
- [Git](https://git-scm.com/) installed in the system.
- [Truffle](https://www.trufflesuite.com/truffle), which can be installed globally with `npm install -g truffle`
- [Metamask](https://metamask.io) extension added to the browser.

> Please get familiar with the technologies mentioned in the pre-requisites, for a better understanding of the documentation ahead.

## About Agora Blockchain

**Agora** is a library of voting algorithms like `Moore's`, `Oklahoma` etc. Some of these voting algorithms are already implemented by **AOSSIE** in a centralized manner using Scala as their backend. Our vision is to take these algorithms on a decentralized platform, so that, crucial votes of the voters could not be tampered with by the admins, hackers, or anyone with access to the database. Blockchain technology would make the ballots immutable and hence more secure.

### Versions

#### [v1.0](https://gitlab.com/aossie/agora-blockchain/-/tree/gsoc-2021)

In **Google Summer of Code 2021**, we have implemented the first version i.e. **v1.0** with the following features implemented -

- User registration using their public address
- Creating custom elections
- Voting in elections
- Real-time vote counts
- Results of elections
- Currently we are having only `General` voting algorithm

## Project Structure

**Agora Blockchain** project is organized into two components - **Frontend** and **Backend**. We have followed the `client-server` model of development, in which `client` and `server` folders are independent of each other, with separate `package.json` and `node_modules`. An Independent and stand-alone model would ensure that developers working on the blockchain part would not end up installing unnecessary client-side dependencies and vice-versa.

**Backend** component deals with the business logic of the project. These logics are implemented using EVM-based smart contracts. Here we are using the Solidity programming language.

**Frontend** component deals with the UI/UX development and integration of deployed smart contracts with the frontend. Here we are using ReactJS and React Context APIs. Trufflesuite's Drizzle will be used for connecting our frontend with blockchain.

Though these components can be developed independently, we need the build files of the backend in the frontend. While deploying or migrating Solidity code, it generates certain build files in `JSON` format which contains the [ABI](), network information, and other necessary details. To use these files in the frontend, we will save these to the `client/src/blockchainBuild` folder.

We will learn more about these components in the documentation ahead.

> This is not a tutorial for **Solidity**, **React**, or **Drizzle**. Readers should be familiar with the mentioned **prerequisites** to understand this documentation.

## Backend

Our backend is implemented using Truffle framework and solidity language. The implementation code is present in `server` directory. The directory description is:

- `contracts` contains all the smart contracts for the blockchain
- `migrations` contains code for migrating the contracts on the chain
- `test` contains unit tests for each of the smart contract files.

### About contracts

In the contacts directory we have a `MainContract.sol` file, which is reponsible for creation of users. It contains a mapping `Users` which holds addresses of all the contracts which creates a user. The user has functions to create an election and perform operations.

Then we have a `User.sol` file, which is responsible for creation of an election by a particular user. It contains a mapping `Elections` which contains address of all the election contract, that a particular user creates.

The last contract is `Election.sol`, which is responsible for initializing an election. It contains all the details of the election, and functions for calculating results of an election.

## About tests

The `test` folder in the `server` directory is used to implement tests for every smart contracts written. In each of the test files, most of the functions of contract are being tested, to ensure expected behaviour from the functions.

Every test file has a `contract` function in which all the test cases are written. This function receives 10 acoounts from `Ganache` each with 100 test ethers. By default, all the transactions take place from 1st account ie. accounts[0].

```javascript=
contract("mainContract", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
})
```

The tests uses `Mocha` and `Chai` framework. It is expected from future contributors to implement tests for every new feature being added in the contract. The coverage of tests can be obtained using `test coverage` module, whose usage is documented in README.md

## Frontend

Our frontend is implemented using ReactJS and React context APIs. We make API calls to the blockchain network using the Drizzle library. All these calls are implemented in the `client/src/drizzle` folder.

### About Drizzle

**Drizzle** is a collection of libraries to make blockchain integration easier and hassle-free. It also helps to keep the function calls in cached form, which keeps the data fresh. Without Drizzle we had to initialize **web3**, make instances of deployed contracts, and had to manage them throughout the component tree.

We are using Drizzle's `@drizzle/store` and `@drizzle/react-plugin` libraries (see `client/src/index.js`).

```javascript=
import { Drizzle } from "@drizzle/store";
import { DrizzleContext } from '@drizzle/react-plugin';
```

Drizzle requires a `DrizzleOption` object, in which we define what contracts we want to add by default, events, web3 provider, etc. Currently, we are just adding `MainContract` to the drizzle as a default contract, as this is the only contract which we will be deployed to the network. (see `client/src/drizzle/drizzleOptions.js`).
```javascript=
import MainContract from "../blockchainBuild/MainContract.json";

const drizzleOptions = {
    contracts: [MainContract]
}

export default drizzleOptions;
```

Using this **DrizzleOption** we instantiate a drizzle object, which contains all the necessary information of the deployed contract. We extract important variables from this object using the `DrizzleContext`, which will be shown in the subsequent paragraphs.

```javascript
const drizzle = new Drizzle(drizzleOptions);
```

### Screens and Components

In the frontend, we are having the following screens and components -

- Authentication page `/auth`
- Dashboard `/dashboard`
  - Create election modal
  - Delete election modal
- Election `election?contractAddress=0x0ab...`
  - Cast vote modal
  - Add candidate modal
  - Candidate detail modal
  - Timer

### Context providers and consumers

We are having the following user-defined and installed context providers in our project. All of these are present in the `client/src/index.js` file -

```javascript=
const drizzle = new Drizzle(drizzleOptions);

ReactDOM.render(
  <React.StrictMode>
    <DrizzleContext.Provider drizzle={drizzle}>
      <ContractProvider>
        <CallProvider>
          <App />
        </CallProvider>
      </ContractProvider>
    </DrizzleContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

**DrizzleContext** - It is an installed context provider from the `@drizzle/react-plugin` library and is used for extracting Drizzle variables like deployed contracts, drizzle state, web3 information, etc. from the `Drizzle` object passed in the `DrizzleContext.Provider` component.

![](https://imgur.com/m8ixx18.png)

The extracted context variables can be accessed by their children components using the following line of code.

```javascript
const { drizzle } = useContext(DrizzleContext.Context);
```

**ContractProvider** - User-defined context provider, present at `client/src/drizzle/drizzleContracts.js`, to make available runtime deployed contracts to the Drizzle like `Election` and `User` contract, which are not present while starting the application. This component keeps track of all the contracts with which the user interacts within a particular session.

```javascript=
useEffect(() => {
        contracts.forEach(({contractName, contractAddress, contractType}) => {
            if(!checkContractExist({contractName, contractAddress})) {
                let web3Contract;
                switch (contractType) {
                    case USER_CONTRACT:
                        web3Contract = new drizzle.web3.eth.Contract(UserContract.abi, contractAddress);
                        break;
                    case ELECTION_CONTRACT:
                        web3Contract = new drizzle.web3.eth.Contract(ElectionContract.abi, contractAddress);
                        break;
                    default: console.log("Contract type not given");
                }
                drizzle.addContract({ contractName, web3Contract });
            }
        });
}, [contracts.length]);
```

In the above code snippet, `contracts` is an array of all the contracts with their `name`, `address` and `type` (Election or User type). For adding contracts to Drizzle, we need its `web3` instance, using the following line of code.

```javascript
web3Contract = new drizzle.web3.eth.Contract(UserContract.abi, contractAddress);
```

`User` or `Election` ABI will be required, depending upon which type of contract we are deploying. Once the web3 instance is ready, we can add the contract to drizzle, using the below code.

```javascript
drizzle.addContract({ contractName, web3Contract });
```

This `useEffect()` hook is called whenever there is a new contract, as identified by a change in `contracts.length` in its dependency array. New contracts are added in the `contracts` array by calling the `pushNewContracts()` function. This function is called when all the elections are loaded, or a new election is created by the user, or when the user signs in.

```javascript=
const pushNewContracts = (contractName, contractAddress, contractType) => {
    let newContract = {
        contractName,
        contractAddress,
        contractType
    };
    setContracts(oldContracts => (
        !isAvailable(oldContracts, contractName, contractAddress)
        ?
        [...oldContracts, newContract]
        :
        oldContracts
    ));
}
```

**CallProvider** - This context (`client/src/drizzle/calls.js`) manages the drizzle contract calls and provides contract methods according to the ABI, cached method calls, account address, etc. to the consumer. Since there are 3 types of contracts viz. `MainContract`, `User` and `Election`, we divide this provider into 3 function components, and these are - `MainContractCall`, `UserCall`, `ElectionCall`. Each of these functions manages and returns methods, subscribers, and identifiers related to each added contract. Following values are provided by this context provider.

```javascript=
return (
    <Context.Provider
      value={{
        MainContract,
        MainSubscriber,
        UserContract,
        UserSubscriber,
        userInfo,
        electionDetails,
        getCurrentElection,
        CurrentElection,
        currentElectionDetails,
        initialized,
        isRegistered,
        account,
      }}
    >
      {children}
    </Context.Provider>
);
```

Here, `MainContract`, `UserContract` and `CurrentElection` variables are objects obtained from their respective functional components (like `UserContract` is obtained from `UserCall.js`). Using these objects we can make general contract calls. See the below code snippet.

```javascript
CurrentElection.vote(2).send({ from: account });
```

`CurrentElection` is an object of the `Election` contract which we are viewing. `vote` is a function defined in the `Election` smart contract. We use this line to call the `vote` function with argument `2` (`send` is used to initiate a transaction).

```javascript
UserContract.userInfo().call();
```

Similarly, we can make a non-transaction, view-type contract call by using the above snippet.

But, how do we access these context variables? Since these are provided by the **CallProvider**, only its children can access these variables through the `useContext()` hook, as shown below.

```javascript
import { useCallContext } from "../../drizzle/calls";

const { MainContract, userInfo, account } = useCallContext();
```

### Let's briefly discuss these context variables

**MainContract** - Object to manage general `call` and `send` contract calls for the deployed `MainContract`. See `ABI` for method details.

**MainSubscriber** - Object to manage cached method calls of the `MainContract`.

**UserContract** - Same as `MainContract`

**UserSubscriber** - Same as `MainSubscriber`

**userInfo** - Information about user signed in. It is an object with the following structure.
```javascript
{
    id: Number,
    name: String,
    publicAddress: String,
    contractAddress: String
}
```

**electionDetails** - Array of details of elections created by the user signed in. Each element in the array is an object, with the following structure.
```javascript
id: Number,
name: String,
description: String,
algorithm: String,
sdate: Number,
edate: Number,
voterCount: Number,
electionOrganiser: String,
contractAddress: String
```

**getCurrentElection** - A function to add Election contract according to contract address to Drizzle. Takes `contractAddress` as argument.

**CurrentElection** - An object with `Election` smart contract as its type, and is used for making `call` and `send` calls to the contract.

**currentElectionDetails** - Same as `electionDetails`, but it is not an array, instead is an object with `electionDetails` of the current election only.

**initialized** - A boolean typed variable to denote whether the drizzle variables, states, store are ready or not. Calling these drizzle variables before they are ready, can throw errors, hence the `initialized` variable is used.

**isRegistered** - It is an integer array of length 2, where 0th index represents whether the user is registered or not (0 for not registered and 1 for registered) and 1th index represents the `userId` of the registered user.

**account** - Public address of the active and connected account on the Metamask wallet.

## Deployments

In this project, we separately deploy **backend** (blockchain) and **frontend** (ReactJS). We choose **[Avalanche](https://www.avax.network/)** or any **EVM** based test network for deploying our smart contracts. Whereas, we deploy our frontend on **[Heroku](https://heroku.com)**.

### Deploying backend
To migrate our smart contracts to the blockchain, we need 2 things - **RPC node** connected to the network and **an account** with few funds in it to cover the deployment cost. **Avalanche** provides RPC node, and since we are deploying on test network (**Avalanche's Fuji**), we can get free test tokens from their **Faucet**.

**Steps to deploy backend**

- Move to `server` directory.
- Compile your smart contracts if modified using `truffle compile`
- Make a `.env` file (`.` is necessary) with the following content

```bash
MNEMONIC=""
```

- Now make a new wallet (or use your existing) [here](https://wallet.avax.network) and save the mnemonic in the `.env` file, against the `MNEMONIC` variable, inside the quotes.
- Visit the [faucet](https://faucet.avax-test.network/) and request some test `AVAX` in your account, by putting your public address in the input field.
- Now deploy smart contracts using the command

```bash
truffle migrate --network fuji --reset
```

- After successful execution of this command, the contracts will be deployed on the network.

### Deploying frontend

We use **Heroku's** cloud service to deploy our frontend. So, to deploy, you need - **an account on Heroku**.

**Steps to deploy frontend**

- Open Heroku dashboard and create a new application by giving it any name of your choice.
- Install Heroku CLI on your system.
- Login to your Heroku CLI using the `heroku login` command
- Now add this newly created application's repo as the remote URL for your `git` using the below command.

```bash
git remote add heroku https://git.heroku.com/<your_app_name>.git
```

- Push the `main` or `develop` or any other branch, to your app's repository, using

```bash
git push heroku <branch_name>:main
```

This last command will initiate the deployment, and after successful deployment, you can see your application at `https://<your_app_name>.herokuapp.com`

> **Find this document incomplete?** Make a Pull Request!
