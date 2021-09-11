var mainContract = artifacts.require("MainContract");

contract("mainContract", function (accounts) {
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  let deployedMainContract;

  beforeEach(async () => {
    deployedMainContract = await mainContract.deployed();
  });

  it("Testing creation of users", async () => {
    const u_one = await deployedMainContract.createUser("Ayush", {
      from: user1,
    });
    const u_two = await deployedMainContract.createUser("Raj", { from: user2 });
    assert.equal(u_one.logs[0].event, "userCreated", "Failed to create user 1");
    assert.equal(u_two.logs[0].event, "userCreated", "Failed to create user 2");
  });

  it("Should not create duplicate users", async () => {
    try {
      await deployedMainContract.createUser("Ayush", { from: user1 });
    } catch (e) {
      assert.equal(e.reason, "User already registered!");
    }
  });
});
