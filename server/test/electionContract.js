var mainContract = artifacts.require("MainContract");
var Election = artifacts.require("Election");
var User = artifacts.require("User");
contract("userContract", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const nda = ["Ayush", "Test election", "demo_algo"];
  const se = ["1234", "5678"];
  const candidates = [accounts[3], accounts[4], accounts[5]];
  let deployedMainContract;
  let userElections;

  beforeEach(async () => {
    deployedMainContract = await mainContract.deployed();
    await deployedMainContract.createUser({ from: user1 });
    const createdUser1 = await deployedMainContract.Users.call(1);
    let res = await User.at(createdUser1);
    const election = await res.createElection(nda, se, {
      from: user1,
    });
    userElections = await Election.at(election.logs[0].args[0]);
  });

  it("for future implementation", async () => {});
});
