const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ElectionFactoryModule", (m) => {
  const electionFactory = m.contract(
    "ElectionFactory",
    ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"],
    {}
  );

  return { electionFactory };
});
