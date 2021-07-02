var mainContract = artifacts.require("MainContract");
var User = artifacts.require("User");
var electionContract = artifacts.require("Election");

contract("mainContract", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  const nda = ["Ayush", "Test election", "demo_algo"];
  const se = ["1234", "5678"];
  const candidates = [accounts[3], accounts[4], accounts[5]];

  it("Testing creation of users", async () => {
    const deployedMainContract = await mainContract.deployed();
    const u_one = await deployedMainContract.createUser({ from: user1 });
    const u_two = await deployedMainContract.createUser({ from: user2 });

    const createdUser1 = await deployedMainContract.Users.call(1);
    const createdUser2 = await deployedMainContract.Users.call(2);
    assert.equal(
      createdUser1,
      u_one.logs[0].args.user,
      "User 1 not created successfully"
    );
    assert.equal(
      createdUser2,
      u_two.logs[0].args.user,
      "User 2 not created successfully"
    );
  });
});
