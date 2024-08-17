# Agora Blockchain

## Contributions by [Roshan Singh](https://github.com/Ronnieraj37)

## Links

- Project - https://github.com/AOSSIE-Org/Agora-Blockchain

## Agora Blockchain

**Agora** is a library of voting algorithms like `Moore's`, `Oklahoma` , `Borda` , `IRV` etc. Some of these voting algorithms are already implemented by **AOSSIE** in a centralized manner using Scala as their backend. Our vision is to take these algorithms on a decentralized platform, so that, crucial votes of the voters could not be tampered with by admins, hackers, or anyone with access to the database. Blockchain technology would make the ballots immutable and hence more secure.

### Use case modeling

I have identified the following tasks in the project at the start of the project.

1. Auditing vulnerabilities and optimizing gas usage in Diamond Proxy facets.
2. Implementing cross-chain interoperability.
3. Establishing a Web3 database to reduce on-chain data.
4. Expanding voting algorithms to enhance security and flexibility.
5. Implementing ERC-1155 for election and NFT voter proof.
6. Enhancing security through data hashing.

**Revised Implementation:**
After discussions with fellow contributors and mentors, we decided to adjust several tasks and reimplement the entire application (blockchain + client).

1. Audited vulnerabilities and optimized gas usage —opted for Minimal Proxy EIP-1167 instead of Diamond Proxy. - **Done**
2. Implemented cross-chain interoperability. - **Done**
3. Reduced on-chain data by leveraging IPFS. - **Done**
4. Expanded voting algorithms to improve security and flexibility. - **Done**
5. Reimplemented the complete blockchain contract to minimize code duplication and enhance efficiency. - **Done**
6. Developed the app's frontend in Next.js with an improved UI/UX. - **Done**
7. Added Moore's Voting Algorithm as an additional feature. - **Done**
8. Integrated a chatbot to handle blockchain-related queries. - **Done**

Removed these as they were not relevant and necessary to implement :

1. Implement ERC1155 for election and NFT voter proof(Additional Gas for users to pay).
2. Data Hashing for Enhanced Security(Implemented in ZK).

### Technical aspect of frontend and backend

For developing the front end of the code and integrating it with blockchain (backend), below mentioned tech stack has been used.

- [Node.js](https://nodejs.org/en/) - Provides the package manager used in this project
- [Hardhat](https://hardhat.org/) - Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software.
- [NextJS](https://nextjs.org/) - Our frontend is built using NextJS. NextJs makes development easy and extremely fast because of the static destinations and server-side rendering.
- [Solidity](https://docs.soliditylang.org/en/v0.8.24/) - Solidity is an object-oriented, high-level language for implementing smart contracts. Smart contracts are programs which govern the behaviour of accounts within the Ethereum state.
- [MetaMask](https://metamask.io/) - MetaMask is a software cryptocurrency wallet used to interact with the Ethereum blockchain.
- [ngrok](https://ngrok.com/) - Ngrok is a tool that creates secure tunnels from your local machine to the internet, allowing you to share and access web servers or applications running on your computer with others remotely. It's commonly used for testing, showcasing, and temporary sharing of local web projects..
- [Ethereum EIPs](https://eips.ethereum.org/) - The official website for Ethereum Improvement Proposals, which defines standards for the Ethereum platform.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework used for building custom designs directly in the frontend.
- [Vercel](https://vercel.com/) - The platform used for deploying the Next.js frontend, offering seamless deployment and hosting with serverless functions.

## Phases of development (GSoC 2024)

### Community bonding period(May 1 - May 26)

In the phase of community bonding, we outlined our upcoming regular meeting timetable, agreed upon the technologies we would employ, discussed strategies for development and deployment. We also delineated our GSoC'24 tasks, aiming to initiate them in the initial week of the coding period. This phase was primarily focused on establishing connections with mentors and fellow developers and familiarizing ourselves with the organization, without directly involving any coding tasks.

The workflow was divided as:

- Phase 1

  - Backend side

    - Generalized the voting system to support multiple ballot methods, and decoupled result generation to enhance efficiency.
    - Utilized EIP-1167 Clones for efficient election creation.
    - Implemented whitelisting for secure cross-chain voting and integrated multiple voting methods (Borda, Kemeny-Young, Quadratic, Schulze, Score ballot).
    - Enhanced the contract to support multiple winners and added relevant tests.
    - Resolved a bug related to single-candidate results.

  - Client-side

    - Developed and integrated essential pages, including Dashboard, Login, Election, and Create.
    - Added features for displaying election status and filtering election lists.
    - Implemented cross-chain functionality, including data fetching and voting (initially on Avalanche Fuji).
    - Added a clipboard feature for easy sharing of election URLs.

- Phase 2

  - Backend side

    - Implemented Moore's Voting Algorithm and corresponding tests.
    - Enhanced the system to support user-created elections and addressed edge cases in result calculations.
    - Introduced IPFS functionality for creating groups, pinning/deleting files, and saving IPFS hashes.
    - Optimized result calculators and resolved CCIP-related vulnerabilities, including securing cross-chain voting for elections funded with Link tokens.

  - Client side

    - Integrated additional voting methods (Score, Quadratic, Moore's Voting) into the frontend.
    - Added user-friendly enhancements such as tooltips, updated Quick Actions for multiple winners, and a new modal for inactive elections.
    - Introduced a chatbot for blockchain-related queries and made minor IPFS-related updates.

### Phase 1 (May 27 - July 12)

1. Generalized the voting system to accommodate multiple ballot methods.
2. Decoupled result generation from specific voting mechanisms, enhancing code efficiency.
3. Utilized EIP-1167 Clones for the efficient creation of elections.
4. Implemented comprehensive tests for all supported voting systems.
5. Added whitelisting to restrict cross-chain votes to specific contracts.
6. Integrated the following voting methods into the current system: Borda, Kemeny-Young, Quadratic, Schulze, and Score ballot.
7. Created and integrated key pages: Dashboard (Home), Login, Election, and Create.
8. Added a sidecard feature to display election status.
9. Enabled support for cross-chain data fetching.
10. Introduced cross-chain voting (currently supported only on Avalanche Fuji).
11. Implemented an election list filter.
12. Modified the contract to support multiple winners.
13. Added tests to verify the multiple-winner functionality.
14. Fixed a bug related to obtaining results when there is only one candidate.

### Phase 2 (July 12 - August 19)

I worked on the following tasks during the second phase -

1. Added Moore's Voting Algorithm.
2. Implemented tests for Moore's Algorithm.
3. Enabled user-created elections.
4. Resolved various edge cases in result calculators.
5. Integrated Score, Quadratic, and Moore's Voting methods into the frontend.
6. Added tooltips for election creation, quick actions, and other user helpers.
7. Updated Quick Actions by Winner after results are fetched to support multiple winners.
8. Added a distinct modal to display candidates when the election is inactive.
9. Integrated a chatbot on the frontend to respond to blockchain-related queries.
10. Made minor ID-related updates to smart contracts for IPFS.
11. Added functions for creating groups, pinning files, pinning JSON files, and deleting files.
12. Updated the system to save the IPFS hash instead of descriptions.
13. Optimized result calculators.
14. Fixed a CCIP vulnerability.
15. Enabled CCIP for elections only when funded with Link tokens, making cross-chain voting accessible to elections that fund the CCIP contract with Link tokens.
16. Added a clipboard feature for easy copying and sharing of election URLs.

### Challenges

Things are not always how you expected. We have a lot of experience with this while working on the project. It is usually a good idea to include a few slots in the buffer for debugging in case something goes wrong. The obstacles that we faced are stated below:

1. **Implementing Cross-Chain Interoperability** - Integrating Chainlink's cross-chain interoperability with the Elections contract on a different blockchain presented significant challenges. Although Chainlink provides excellent documentation, adapting it to accommodate various voting ballots, each requiring different inputs, without resorting to multiple functions was complex. Generalizing the process while ensuring all vulnerabilities were addressed was particularly time-consuming.

### Acknowledgements

I would like to extend my gratitude to my mentors **Raj Ranjan** and **Kumar Harsh**, as well as **Bruno Woltzenlogel Paleo** and the entire organization, for their invaluable support and feedback. Their guidance was instrumental in overcoming challenges and refining our features.

Our work opens up significant potential applications, particularly in managing internal elections within educational institutions. Additionally, it plays a crucial role in the evolving field of decentralized autonomous organizations (DAOs). By leveraging decentralized voting mechanisms, blockchain organizations can effectively deliberate and make decisions on community proposals. This technology enhances transparency and empowers community members to actively influence the direction of these organizations. Moreover, our contributions serve as a foundation for those interested in exploring Blockchain and Solidity, promoting broader adoption of decentralized voting solutions and inspiring innovation across various sectors.

---

### Merge Requests

1. [Merge request !39](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/39) - **Merged**

   - Generalized voting system and decoupled result generation for improved efficiency.
   - Utilized EIP-1167 Clones for efficient election creation and added cross-chain vote whitelisting.
   - Implemented tests for all supported voting systems.

2. [Merge request !40](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/40) - **Merged**

   - Integrated Borda, Kemeny-Young, Quadratic, Schulze, and Score ballots into the voting system.
   - Ensured consistency across all ballots and developed corresponding tests.
   - Designed the backend system.

3. [Merge request !49](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/49) - **Merged**

   - Integrated the Dashboard, Login, Election, and Create Election pages into the frontend voting system

4. [Merge request !50](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/50) - **Merged**

   - Modified the contract to display more data and added candidate descriptions on-chain.
   - Added a sidecard for election status and support for cross-chain data fetching and voting (currently on Avalanche Fuji).
   - Video link of CCIP functionality : https://youtu.be/uGJSzBa2mOQ

5. [Merge request !51](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/51) - **Merged**

   - Modified the contract and frontend to support multiple winners, added corresponding tests, and fixed a bug for single-candidate results.
   - Added an election list filter.

6. [Merge request !55](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/55) - **Merged**

   - Added Moore's Voting Algorithm and user-created elections, with tests for Moore's Algorithm.
   - Fixed edge cases in result calculators and integrated Score, Quadratic, and Moore's Voting.
   - Enhanced the frontend with tooltips, updated Quick Actions for multiple winners, and added a modal for inactive elections.
   - Introduced a chatbot for blockchain-related queries.

7. [Merge request !59](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/59) - **Open**

   - Added IPFS-related ID changes and functions for creating groups, pinning files, and managing JSON files.
   - Updated the frontend to support these IPFS changes and save IPFS hashes instead of descriptions.

8. [Merge request !60](https://github.com/AOSSIE-Org/Agora-Blockchain/pull/60) - **Open**

   - Optimized result calculators and fixed CCIP vulnerabilities.
   - Integrated CCIP for elections funded with Link tokens and added a clipboard feature for sharing election URLs.
   - Refactored CCIP-related code and updated funding for the CCIP sender contract with 25 Link tokens.
