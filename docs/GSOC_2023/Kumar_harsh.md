# Agora Blockchain

## Contributions by [Kumar Harsh](https://gitlab.com/harshme78)

## Links

- Project - https://gitlab.com/aossie/agora-blockchain

## Agora Blockchain

**Agora** is a library of voting algorithms like `Moore's`, `Oklahoma` , `Borda` , `IRV` etc. Some of these voting algorithms are already implemented by **AOSSIE** in a centralized manner using Scala as their backend. Our vision is to take these algorithms on a decentralized platform, so that, crucial votes of the voters could not be tampered with by admins, hackers, or anyone with access to the database. Blockchain technology would make the ballots immutable and hence more secure.

### Use case modeling

I have identified the following tasks in the project at the start of the project.

1. Adding additional voting Algorithm. - **Done**
2. Imlementing smart contract for Borda Voting Algorithm. - **Done**
3. Frontend Integration of Borda voting Algorithm - **Done**
4. Development of semaphore and MiMc contract smart contract to support anaonymous voting and to be linked together.- **Done**
5. Generation of circuit and proving_key to further use it to generate witness and zk-proof and futher verifier Smart Contract. - **Done**
6. Testing of the Functioning of all contracts together. - **Done**
7. Integration of Developed functionality with Frontend. - **Done**
8. Integrating the BrightID feature into the frontend in ReactJS - **Done**
9. Testing of Polygon id and its functionality to be used for ZK-KYC Othewise looking for alternatives. - **Done**
10. Development of off-chain verification of polygon id to make application chain agnostic. - **Done**
11. Integration of polygon Id with Frontend. - **Done**

Note: Upon discussion with many my fellow contributor and mentor , we decided to go with diamond structure instead of proxy contract which is being implemented by **Yogendra** which was part of gsoc proposal (Since either diamond sructure or proxy could be implemented)

### Technical aspect of frontend and backend

For developing the front end of the code and integrating it with blockchain (backend), below mentioned tech stack has been used.

- [Node.js](https://nodejs.org/en/) - Provides the package manager used in this project
- [Hardhat](https://hardhat.org/) - Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software.
- [ReactJS](https://reactjs.org/) - Our frontend is built using ReactJS. React makes development easy to follow and learn and has efficient state management mechanisms.
- [Solidity](https://docs.soliditylang.org/en/v0.8.17/) - Solidity is an object-oriented, high-level language for implementing smart contracts. Smart contracts are programs which govern the behaviour of accounts within the Ethereum state.
- [MetaMask](https://metamask.io/) - MetaMask is a software cryptocurrency wallet used to interact with the Ethereum blockchain.

- [ngrok](https://ngrok.com/) - Ngrok is a tool that creates secure tunnels from your local machine to the internet, allowing you to share and access web servers or applications running on your computer with others remotely. It's commonly used for testing, showcasing, and temporary sharing of local web projects..

## Phases of development (GSoC 2023)

### Community bonding period(May 4 - May 28)

In the phase of community bonding, we outlined our upcoming regular meeting timetable, agreed upon the technologies we would employ, discussed strategies for development and deployment. We also delineated our GSoC'23 tasks, aiming to initiate them in the initial week of the coding period. This phase was primarily focused on establishing connections with mentors and fellow developers and familiarizing ourselves with the organization, without directly involving any coding tasks.

The workflow was divided as:

- Phase 1

  - Client-side
    - Creation of Voting Modal for Borda algorithm
    - Integration of Anonymous voting with frontend
  - Backend side
    - Creation of Smart Contract for Borda voting algorithm
    - Integrating voting algorithm
    - Creation of semaphore and MiMc smart contract and testing them
    - Testing libsempaphore library
    - Generation circuit and proving_key to generate witness and zk-proof
    - Develop verifier contract
    - Testing with the deployment of contract
    - Integration testing of all the individual components

- Phase 2
  - Client side
    - Integration of Polygon ID for ZK-KYC
    - Development of Verification modal
    - Generation of QR wrt to request
  - Backend side
    - Addition of PolygonID backend logic
    - Development of server side web app for handling asynchronous request for verification
    - Integration of existing application with polygon id

### Phase 1 (May 29 - July 10)

1. Started to work upon borda algorithm and various ways to implement it.
2. Started developing the smart contract with the Borda algotithm logic.
3. Integration of Borda smart contract with existing contracts.
4. Development of modal for borda algorithm.
5. Integration of Borda algo with backend logic.
6. Started working with the semaphore smart contract.
7. MiMc contract Development that is to be linked with semaphore smart contract
8. Testing libsempaphore library
9. Completed the development work for Semaphore and MiMc contract
10. Generated circuit and proving_key to further use it to generate witness and zk-proof
11. Started with the verifier.sol contract
12. Completed Development of Verifier
13. Testing Linking of semaphore contract with MiMc library along with verifier.sol
14. Testing with the deployment of contract
15. Tested Generation of proof along by libsemaphore library and its verification by the verifier
16. Integration testing of all the individual components
17. Testing with the deployment of all contracts together to test for possible errors that may occur while deployment
18. Development of POC of a voting application
19. Testing POC
20. Integration of POC to Current Application.
21. Writing Deployment scripts of newly developed Anonymous voting contracts.

### Phase 2 (July 14 - August 21)

I worked on the following tasks during the second phase -

1. Started looking for all possible solution for ZK-KYC.
2. Started working of Polygon ID and its integration.
3. Started working with Polygon team to get documentation for Polygon ID specifaction and integration
4. Started working on both on-chain as well as off-chain verification solution.
5. Collected information on both issuer and verifier to further decide upon whole infrastructure.
6. Started working on ZK-Query Langauage to write queries for verification requests to be made
7. Started writing Logic for Polygon ID inrtegration.
8. Started to write server srcipt which will handle all asynchronous request for the handling the proof verification requests.
9. Testing of server with ngrok for public deployment
10. Integration of Polygon ID to existing application for KYC
11. Integration Testing of the Application for PolygonID implementation.
12. System testing of overall application for all avaliable features.

<!-- <img width="819" alt="2" src="https://user-images.githubusercontent.com/67586672/189636635-eff3bf0a-3b87-48e5-9e0c-605c107ad916.PNG"> -->

### Challenges

Life often surprises us with unexpected twists, and our project journey was no exception. We learned the importance of being prepared for unforeseen issues along the way. Maintaining a few extra slots in the buffer for debugging proved to be a valuable precaution in case anything didn't go according to plan. Here are the challenges we confronted:

1. **Linking the MIMC Library and Semaphore Smart contract** - I was not aware of the process to link the Contracts in solidity while deployment , while doing it with truffle was easy there wasnt any documentation to do it with hardhat

2. **Insufficient Documentation and support for PolygonID** - The biggest problem faced with PolygonID was that there wasn't enough clear information and help available. People who were using PolygonID had a hard time because there weren't proper guides or instructions to understand how it works. This made it difficult to learn how to use PolygonID effectively. Additionally, there weren't enough places to ask for help when things went wrong or when people had questions. This lack of guidance and assistance made it tough for people to use PolygonID properly. Overall, the main issue was that there wasn't enough easy-to-understand information and support available for using PolygonID.

### Acknowledgements

I want to express my heartfelt gratitude to my mentor, Kirti Lodha, and the entire organization, Bruno Woltzenlogel Paleo, for their unwavering support during challenging times. Their guidance was invaluable in steering us back on track.

A special acknowledgment goes to my fellow programmer, Yogendra, whose collaboration was vital in accomplishing this project within the given timeframe.

Our endeavors unlock a realm of potential applications, notably enabling the management of internal elections within educational institutions. This innovation extends to the intriguing landscape of decentralized autonomous organizations (DAOs), where our work takes center stage. By leveraging decentralized voting mechanisms, blockchain organizations can effectively deliberate and decide upon community proposals. This technology not only enhances transparency but also empowers community members to play an active role in shaping the direction of these organizations. Furthermore, the potential reaches beyond institutions and organizations, as our contributions offer a stepping stone for anyone seeking to delve into Blockchain, Solidity, PolygonID, and ZKs. This, in turn, fosters a broader adoption of decentralized voting solutions and sparks innovation across diverse sectors.

### Merge Requests

1. [Merge request !79](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/79) - **Closed**

- Implemented Borda Algorithm
- This MR was later integrated with MR 116 and a single PR for both borda and anonymnous voting was created

- ## Video Links
  - Borda Algo : https://youtu.be/pplfC5o7PLk

2. [Merge request !116](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/116) - **Open**

   - Implemented Borda Algorithm
   - Implemeted the Anonymous Voting
   - Wrote new Deployment Scripts
   - Integrated backend with the frontend.

- ## Video Links
  - Video link of all algorithms Working together : https://youtu.be/VJ0BMjlRxBo
  - Borda Algo : https://youtu.be/pplfC5o7PLk
  - Anonymous Voting : https://www.youtube.com/watch?v=SdrdMFAOEW0&ab_channel=kumarharsh

3. [Merge request !122](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/122) - **Open**

   - Deevlopment of logic of proof request
   - Development of Server to handle the Verification Requests
   - Integartion of Polygon ID to overall application

- ## Video Links
  - ZK-KYC : https://youtu.be/qWlkI_R0z0E
