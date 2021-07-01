const Election = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  // Deployed election for testing purpose. To be replaced by MainContract.
  deployer.deploy(Election, ["Election 0", "This is initial Election with ID = 0", "Default"], [1624992660, 1624992760]);
};