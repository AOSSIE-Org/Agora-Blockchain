var mainContract = artifacts.require("MainContract");
// import "User";
var User = artifacts.require("User");
var Election = artifacts.require("Election");
contract("userContract", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const user3 = accounts[3];
  const nda = ["Ayush", "Test election", "demo_algo"];
  const se = [1625168700, 1625685220]; //timestamps in unix epochs
  let deployedMainContract;
  let res;
  let election;
  let createdElection;

  beforeEach(async () => {
    deployedMainContract = await mainContract.deployed();
    await deployedMainContract.createUser({ from: user1 });
    const createdUser1 = await deployedMainContract.Users.call(1);
    res = await User.at(createdUser1);
    election = await res.createElection(nda, se, {
      from: user1,
    });
    const newElection = await res.Elections.call(1);
    createdElection = await Election.at(newElection);
  });

  it("should create new election", async () => {
    assert.equal(election.logs[0].event, "electionCreated");
  });

  //Before carrying out below tests, comment out all the require statements from Election.sol

  it("should add candidates to the election", async () => {
    await createdElection.addCandidate("Ayush", "Agora member 1", {
      from: user1,
    });
    await createdElection.addCandidate("Raj", "Agora member 2", {
      from: user1,
    });

    const totalCandidates = await createdElection.candidatesCount.call();
    assert.equal(totalCandidates, 2);
  });

  it("should vote and get the result", async () => {
    await createdElection.addCandidate("Ayush", "Agora member 1", {
      from: user1,
    });
    await createdElection.addCandidate("Raj", "Agora member 2", {
      from: user1,
    });
    await createdElection.vote(1, {
      from: user1,
    });
    await createdElection.vote(1, {
      from: user2,
    });
    await createdElection.vote(2, {
      from: user3,
    });
    const result = await createdElection.getWinnerDetails.call();
    assert.equal(result[0].name, "Ayush");
  });
});
