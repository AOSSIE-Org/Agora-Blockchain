# Agora Blockchain

## Contributions by [Raj Ranjan](https://gitlab.com/rranjan01234)

## Links

- Project - https://gitlab.com/aossie/agora-blockchain
- Project is live on - https://agorablockchain21.herokuapp.com

## Agora Blockchain

**Agora** is a library of voting algorithms like `Moore's`, `Oklahoma` etc. Some of these voting algorithms are already implemented by **AOSSIE** in a centralized manner using Scala as their backend. Our vision is to take these algorithms on a decentralized platform, so that, crucial votes of the voters could not be tampered with by the admins, hackers, or anyone with access to the database. Blockchain technology would make the ballots immutable and hence more secure.

### Use case modeling

I have identified the following tasks in the project at the starting of the project.

1. Designing the front end of the website. - **Done**
2. Designing the workflow of the blockchain. - **Done**
3. Creation of smart contracts for `user` and `election`. - **Done**
4. Implementing frontend in ReactJS - **Done**
5. Integrating frontend with blockchain using Drizzle library - **Done**
6. Implemented user-friendly modals and error alerts for non-tech-savvy people. - **Done**
7. Documenting code for better understanding to future developers. - **Done**

### Technical aspect of frontend

For developing the frontend of the code and integrating it with blockchain (backend), below mentioned tech stack has been used.

- [Node.js](https://nodejs.org/en/) - Provides the package manager used in this project
- [Truffle](https://www.trufflesuite.com) - Provides basic configuration files, which makes writing the smart contracts, deploying them on local/public blockchain, and maintaining the meta details of deployed contracts, a lot easier.
- [Ganache](https://www.trufflesuite.com/ganache) - Provides a local running blockchain network, and exposes a local URL to connect to. Helps in debugging the contracts.
- [ReactJS](https://reactjs.org/) - Our frontend is built using ReactJS. React makes development easy to follow and learn and has efficient state management mechanisms.
- [Drizzle](https://www.trufflesuite.com/drizzle) - Drizzle is a collection of libraries to make blockchain integration easier and hassle-free.
- [Heroku](https://www.heroku.com/) - Heroku is a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud. We use the Heroku service to deploy our frontend.
- [Avalanche](https://www.avax.network/) - Avalanche is an open, programmable smart contracts platform for decentralized applications. Due to its EVM compatibility, high throughput, low transaction fees, and good community support, we choose this network to deploy our smart contracts (backend).

## Phases of development (GSoC 2021)

### Community bonding period (17th May - 6th June)

During the community bonding period, we discussed our regular meeting schedules for the coming days, technologies to be used, development, and deployment strategies. We identified our tasks to be done in GSoC'21, so that, we could get some headstart from the first week of the coding period. It didn't involve any coding work, rather we have to get in touch with our mentors and fellow developers and learn more about the organization.

### First phase (7th June - 12th July)

I worked on the following tasks during the first phase - 
1. Started working on smart contracts for the backend part.
2. Designed our website layout using the [Figma](https://www.figma.com/proto/bHBFXCXVTttj0Po8T5gUGr/Agora-Dashboard?node-id=10348%3A25&scaling=scale-down) tool.
3. Implemented frontend using ReactJS according to the designs.
4. Started frontend integration with backend using Drizzle.

### Second phase (12th July - 16th August)

I worked on the following tasks during the second phase -
1. Continued touching up the developed smart contracts.
2. Continued Drizzle integration.
3. Resolved complex bugs.
4. Modularized Drizzle API calls for smooth future development.

### Post coding period (17th August - 23rd August)

During this time, our coding was over and we had achieved all of our tasks on time. Just final touch up in the UI and documentation were left. We performed the following tasks after the coding period ended -
1. Deployed our web application on [Heroku](https://agorablockchain21.herokuapp.com), for users and developers to interact. 
2. Added user-friendly modals and error alerts while browsing through our web application.
3. Documentated the entire codebase for smooth contribution in the future.

### Challenges we faced

Things are not always like what you expected. While working on this project, we experienced this a lot. It is always a good practice to keep few slots in the buffer for debugging purposes, just in case, something went wrong. The challenges that we ran into are listed below -
1. **Deciding project structure** - We spent a considerable amount of time in deciding whether should we make a separate repository for backend and frontend, should we have separated package.json for both by keeping them in the same repo and yet independent, how to automate deployment by keeping them in the different repositories, etc. We resolved this by talking to our mentors and seniors. They guided us about the industry-level coding practices. So it is always good to discuss with your mentors if you are not sure about something.

2. **Insufficient open-source projects on Drizzle** - We used Drizzle for our integration needs. Though proper documentation on Drizzle is available, we couldn't find any efficient and scalable open-source project built using Drizzle. Due to this, we have to try a lot of strategies to integrate, but at last, we concluded with the present structure and modularized the Drizzle calls into separate components for easy and scalable development.

### Acknowledgements

Finally, I would like to thank my mentors **Bruno Woltzenlogel Paleo** and **Thuvarakan Tharmarajasingam** for helping us out whenever we are stuck in challenges and needed some experienced person to bring us to track.

I would like to thank my peer programmer **Ayush Tiwari**, without whom this project was nearly impossible to complete in the stipulated time.

I hope our contribution in this open-source project would help someone like us who are learning blockchain, Solidity, needs some reference for Drizzle based projects, or just want to conduct elections ;)

### Merge Requests

1. [Merge request !3](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/3) - Added UI for the authentication page and dashboard according to approved Figma designs. **Merged**

2. [Merge request !5](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/5) - Client-server project structure setup. **Merged**

3. [Merge request !7](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/7) - Added Election smart contract, which contains the business logic for managing various features of an election. **Merged**

4. [Merge request !10](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/10) - Initialized drizzle library for future integrations. Integrated authentication part with the frontend. **Merged**

5. [Merge request !11](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/11) - In this merge request, I have updated the solidity code for facilitating the integration needs. **Merged**

6. [Merge request !12](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/12) - Setting up of Drizzle API calls as context provider and serve the drizzle variables to client-side. **Merged**

7. [Merge request !13](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/13) - Client-side integration using drizzle api context calls. **Merged**

8. [Merge request !16](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/16) - Result section integrated, modularized drizzle calls and made deployment builds. Also added user-friendly modals and alerts. **Merged**

9. [Merge request !17](https://gitlab.com/aossie/agora-blockchain/-/merge_requests/17) - Added documentations with details about APIs, frontend, backend, deployments, designs etc. **Merged**