# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

Live Code at

- Election Factory - https://sepolia.etherscan.io/address/0x64c720eBD5227bba57a5E8282893e71087cCcBb8#code
- CCIP Sender :-
  - Fuji - https://testnet.snowtrace.io//address/0xf267f0603672E791779E52B153BD9A39C9928767#code

Gas Comparision :

Create Election :

0.011334162446332343 - Before
0.002298823499424792 - After

Add Candidate:

0.000716409329167840 - Before
0.000256279986480672 - After

Vote:
0.00027771 - Before
0.00050715 - After

Before IPFS

Medium Description : 0.00197243 SepoliaETH
Large Description : 0.00537738 SepoliaETH

After IPFS
Medium Description : 0.00035482 SepoliaETH
Large Description : 0.00035595 SepoliaETH
