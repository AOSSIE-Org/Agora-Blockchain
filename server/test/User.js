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
    await deployedMainContract.createUser("Ayush", { from: user1 });
  });

  it("Should create new election", async () => {
    const createdUser1 = await deployedMainContract.Users.call(0);
    const electionContract = await User.at(createdUser1.contractAddress);
    const election = await electionContract.createElection(nda, se, {
      from: user1,
    });
    assert.equal(election.logs[0].event, "electionCreated");
  });
});
