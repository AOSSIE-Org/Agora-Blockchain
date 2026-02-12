# Agora Blockchain Project

This project contains the smart contracts for Agora Blockchain, built using **Foundry**.

## Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Format

```shell
forge fmt
```

### Local Node

Start a local testnet:

```shell
anvil
```

### Deploy

To deploy contracts, use `forge create` or `forge script`.

```shell
forge script script/MyScript.s.sol --rpc-url <your_rpc_url> --private-key <your_private_key>
```

## Live Code

- Election Factory - https://sepolia.etherscan.io/address/0x64c720eBD5227bba57a5E8282893e71087cCcBb8#code
- CCIP Sender :-
  - Fuji - https://testnet.snowtrace.io//address/0xf267f0603672E791779E52B153BD9A39C9928767#code

## Gas Comparison (Historical)

**Create Election:**

- 0.011334162446332343 - Before
- 0.002298823499424792 - After

**Add Candidate:**

- 0.000716409329167840 - Before
- 0.000256279986480672 - After

**Vote:**

- 0.00027771 - Before
- 0.00050715 - After

**IPFS Optimization:**

- Medium Description: 0.00197243 -> 0.00035482 SepoliaETH
- Large Description: 0.00537738 -> 0.00035595 SepoliaETH
