# Agora Blockchain

## Student - Ayush Tiwari

## Links

- Project : https://gitlab.com/aossie/agora-blockchain
- Live demo of the Project : https://agorablockchain21.herokuapp.com

## Agora Blockchain

**Agora** is a library of voting algorithms like `Moore's`, `Oklahoma` etc. Some of these voting algorithms are already implemented by **AOSSIE** in a centralized manner using Scala as their backend. Our vision is to take these algorithms on a decentralized platform, so that, crucial votes of the voters could not be tampered with by the admins, hackers, or anyone with access to the database. Blockchain technology would make the ballots immutable and hence more secure.

### Use case modeling

I have identified the following tasks in the project at the starting of the project.

1. Designing the front end of the website. - **Done**
2. Designing the workflow of the blockchain. - **Done**
3. Implementing the creation of smart contracts for `user` and `election`. - **Done**
4. Writing tests to ensure the proper functioning of contracts. - **Done**
5. Implementing test coverage. - **Done**
6. Debugging contracts for reducing gas fees. - **Done**
7. Documenting code for better understanding to future developers. - **Done**

### Technical aspect of backend

For developing the backend of the code, below mentioned tech stack has been used.

- [Node.js](https://nodejs.org/en/) - Provides the package manager used in this project
- [Truffle](https://www.trufflesuite.com) - Provides basic configuration files, which makes writing the smart contracts and deploying on local/public blockchain, a lot easier.
- [Ganache](https://www.trufflesuite.com/ganache) - Provides a local running blockchain network, and exposes a local URL to connect to. Helps in debugging the contracts.
- [Solidity-coverage](https://www.npmjs.com/package/solidity-coverage) - A npm package that helps in estimating test coverage.
- [Mocha](https://mochajs.org) - A testing framework, helps in writing tests for the smart contracts, to ensure the proper functioning of the code.

During the first phase, we spent time designing a basic structure of the website on [figma](https://www.figma.com). After finalizing the frontend design, I started working on the workflow of the backend and its functionality. Having discussed with the mentors, we aim to provide a simple UI, hosted on `heroku`, along with the basic functionality of the election contracts.

During the second phase, we aim at improving the backend code, ensuring more secured and optimized elections. Also, I implemented the tests for every contract file written and included test coverage functionality. We also refactored the workflow of contracts, as per the requirement of the frontend.

The major roadblock was getting started. We spent quite a bit of time, designing the structure of the project and making frontend and backend code independent of each other, and yet, being able to frontend on Heroku. Writing tests for every function of the contract was a bit challenging.

Overall, it was a fun journey. I would thank my mentors Thuvarakan Tharmarajasingam, Bruno Woltzenlogel Paleo, and my fellow gsocer Raj, for guiding me throughout the project. I enjoyed learning a whole bunch of new things and writing industry-level codes.

### Merge Requests

1. [ Merge request !1](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/1) - Initial react setup: - status _Merged_

   - Initialized the project with react framework

2. [Merge request !2](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/2) - Added templates for merge requests and new issues - status _Merged_

3. [Merge request !3](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/9) - Intial version of tests and smart contracts - Status: _Merged_

   - Implemented smart contracts
   - Written tests for the contracts

4. [Merge request !4](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/14) - Test coverage - Status: _Merged_

   - Implemented test coverage

5. [Merge request !5](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/15) - Modified tests - Status: _Merged_

   - Implemented tests for the new functionalites of the contract

6. [Merge request !6](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/18) - Documentation - Status: _Merged_

   - Written documentation for the backend.
