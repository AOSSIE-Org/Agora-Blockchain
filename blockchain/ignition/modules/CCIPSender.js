const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CrossChainSenderModule", (m) => {
  const crosschainSender = m.contract(
    "CCIPSender",
    [
      "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2",
      "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
    ],
    {}
  );

  return { crosschainSender };
});
