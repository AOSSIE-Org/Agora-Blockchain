const MainContract = artifacts.require("MainContract");

module.exports = function (deployer) {
  deployer.deploy(MainContract);
};
