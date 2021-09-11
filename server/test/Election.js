var mainContract = artifacts.require("MainContract");
var User = artifacts.require("User");
var Election = artifacts.require("Election");

contract("mainContract", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const nda = ["Ayush", "Test election", "demo_algo"];
  const se = ["1628581506", "1628591506"]; //need to modify with proper start and end time of election
  const candidates = [accounts[3], accounts[4], accounts[5]];
  let election, electionContract;

  beforeEach(async () => {
    const deployedMainContract = await mainContract.deployed();
    await deployedMainContract.createUser("Ayush", { from: user1 });
    const createdUser1 = await deployedMainContract.Users.call(0);
    const userContract = await User.at(createdUser1.contractAddress);
    const election = await userContract.createElection(nda, se, {
      from: user1,
    });
    const electionAddress = await userContract.Elections.call(1);
    electionContract = await Election.at(electionAddress);
  });

  it("Should add a candidate and vote for it", async () => {
    //Can be tested only when election has't started. Will fail otherwise.
    const can = await electionContract.addCandidate("Raj", "Hello world");
    assert.equal(
      can.logs[0].event,
      "candidateAdded",
      "Error while adding the candidate"
    );

    //Can be tested only after election has started. Will fail otherwise.
    //Comment out the require statements from vote function in Election.sol for testing
    const vote = await electionContract.vote(1, { from: candidates[0] });
    assert.equal(vote.logs[0].event, "voted", "Error while voting");
  });
});
