const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CrossChainSenderModule", (m) => {
  const crosschainSender = m.contract(
    "CCIPSender",
    [
      "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
      "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    ],
    {}
  );

  return { crosschainSender };
});
