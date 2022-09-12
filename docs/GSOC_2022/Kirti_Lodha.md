# Agora Blockchain

## Contributions by [Kirti Lodha](https://gitlab.com/kirtilodha0)

## Links

- Project - https://gitlab.com/aossie/agora-blockchain
- Project is live on - https://agorablockchain21.herokuapp.com

## Agora Blockchain

**Agora** is a library of voting algorithms like `Moore's`, `Oklahoma` etc. Some of these voting algorithms are already implemented by **AOSSIE** in a centralized manner using Scala as their backend. Our vision is to take these algorithms on a decentralized platform, so that, crucial votes of the voters could not be tampered with by admins, hackers, or anyone with access to the database. Blockchain technology would make the ballots immutable and hence more secure.

### Use case modeling

I have identified the following tasks in the project at the start of the project.

1. Designing open and invite-based elections. - **Done**
2. Designing the BrightID integration into our Dapp. - **Done**
3. Creation of smart contracts for open and invite-based elections. - **Done**
4. Integrating the above feature into the frontend in ReactJS - **Done**
5. Test the contracts and the entire workflow. - **Done**
6. Creation of smart contracts for BrightID integration to prove humanity. - **Done**
7. Getting entry of Agora into BrightID app registry. - **Done**
8. Integrating the BrightID feature into the frontend in ReactJS - **Done**
9. Documenting code for better understanding to future developers. - **Done**

### Technical aspect of frontend and backend

For developing the front end of the code and integrating it with blockchain (backend), below mentioned tech stack has been used.

- [Node.js](https://nodejs.org/en/) - Provides the package manager used in this project
- [Hardhat](https://hardhat.org/) - Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software.
- [ReactJS](https://reactjs.org/) - Our frontend is built using ReactJS. React makes development easy to follow and learn and has efficient state management mechanisms.
- [Solidity](https://docs.soliditylang.org/en/v0.8.17/) - Solidity is an object-oriented, high-level language for implementing smart contracts. Smart contracts are programs which govern the behaviour of accounts within the Ethereum state.
- [MetaMask](https://metamask.io/) - MetaMask is a software cryptocurrency wallet used to interact with the Ethereum blockchain.
- [Heroku](https://www.heroku.com/) - Heroku is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud. We use the Heroku service to deploy our front end.
- [Avalanche](https://www.avax.network/) - Avalanche is an open, programmable smart contracts platform for decentralized applications. Due to its EVM compatibility, high throughput, low transaction fees, and good community support, we choose this network to deploy our smart contracts (backend).

## Phases of development (GSoC 2021)

### Community bonding period (May 20 - June 12)

During the community bonding period, we discussed our regular meeting schedules for the coming days, technologies to be used, development, and deployment strategies. We identified our tasks to be done in GSoC'22, so that, we could get a headstart from the first week of the coding period. It didn't involve any coding work, rather we have to get in touch with our mentors and fellow developers and learn more about the organization.

The workflow was divided as:
- Phase 1
    - Client-side
        - Get rid of Drizzle library
    - Backend side
      - Restructure with the SOLID principle
      - Integrating voting algorithms (for testing)
      - KYC integration - see PoH or BrightID
      - Open (KYC required by default) and Invite based election (inviting with account address)
- Phase 2
    - Client side
        - Invite/Open selection and email integration for sending invites
        - Voting algorithms dropdown
        - Submit vote modal
        - Algorithm-specific results
        - KYC steps
    - Backend side
        - Add more voting algorithms

### Phase 1 (June 13 - July 29)

I worked on the following tasks during the first phase - 
1. Started writing the smart contracts for the open and invite-based elections. 
2. These smart contracts ensured that verified users are only allowed to vote.
3. Implemented frontend using ReactJS which looked like:

    <img width="484" alt="1" src="https://user-images.githubusercontent.com/67586672/189633578-5ca5b242-8a6a-4ca5-a706-c58e4917fec4.PNG">

4. Integrated the frontend with the smart contracts.
5. Shared my work with my mentor and worked on the feedback.
6. Got entry of Agora into BrightID app registry.
7. Designed the front end for the implementation of BrightID.
8. Wrote smart contracts to verify the BrightID node.
9. Integrated the front end and the back end using `ethers.js`.


### Phase 2 (July 30 - September 12)

I worked on the following tasks during the second phase -
1. Understood the new smart contract structure made by my teammate.
2. Integrated the original frontend with the new smart contracts using `ethers.js`.
3. Integrated BrightID into the new structure.

<img width="819" alt="2" src="https://user-images.githubusercontent.com/67586672/189636635-eff3bf0a-3b87-48e5-9e0c-605c107ad916.PNG">

### BrightID integration

The workflow for a user who wants to prove their humanity to us is as follows:

1. User download BrightID app and gets verified by joining their parties (eg. google meet).
2. User visits our Get BrightID Verified page.
3. Scans a QR with their BrightID app. QR will generally represent the user's public address.
4. Gets connected to our app’s `contextID` (we have to register our project with BrightID to get context).
5. User needs to get a 1-time sponsor (by any of the existing apps on BrightID).
6. Once sponsored, we can query their verification status using their public address (contextID) and our project’s context.
7. Verification status will give the signed parameters `(v, r, and s)`
8. We can verify their humanity using the signed parameters on our smart contract.
9. These parameters are passed onto the functions in smart contracts and we check if the user is verified or not.

### Challenges we faced

Things are not always like what you expected. While working on this project, we experienced this a lot. It is always a good practice to keep a few slots in the buffer for debugging purposes, just in case, something went wrong. The challenges that we ran into are listed below -
1. **Getting the BrightID app registry** - There is a proper procedure to follow to get any app registered in BrightID. The process consisted of connecting to the BrightID community and getting our app registered. There was a long delay in this process and we had to use another app's registry to make a functional model. Later, our Dapp was registered and we could use them.
 
2. **Insufficient open-source projects on BrightID** - We used BrightID for proving humanity. Through proper documentation on BrightID is available, we couldn't find any efficient and scalable open-source project built using BrightID. Due to this, we have to try different approaches and we concluded with the best suitable approach which seemed user-friendly, easy and scalable development.

### Acknowledgements

Finally, I would like to thank my mentor **Raj Ranjan** and the entire organization  **Bruno Woltzenlogel Paleo** and **Thuvarakan Tharmarajasingam** for helping us out whenever we were stuck in challenges and needed some experienced person to bring us to track.

I would like to thank my peer programmer **Sreeniketh**, without whom this project was nearly impossible to complete in the stipulated time.

I hope our contributions to this project were valuable and would help someone who wants to get started with Blockchain, and Solidity, and could set some references for BrightID. We could help organise internal elections in colleges, schools etc. One more interesting use case is in the DAO space, where we could help blockchain organizations to take governance decisions on community proposals. 

### Merge Requests

1. [Merge request !38](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/38) - **Merged**
   
   - Implemented Hardhat with the smart contracts. 
   - Integrated backend with the frontend.
   - Authentication and Dashboard working properly.

2. [Merge request !37](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/37) - BrightID integration both in frontend and backend. **Closed**

3. [Merge request !41](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/41) - Authentication and Dashboard working with smart contracts. **Closed**
