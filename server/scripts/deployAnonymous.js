const fs = require("fs");

const SEMAPHORE_ADDRESS="0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131";

async function main() {

  const OneVote = await ethers.getContractFactory('OneVote');

  // Deploy OneVote contract
  const oneVote = await OneVote.deploy(SEMAPHORE_ADDRESS,1223333,{
    gasLimit: 10000000
  });
  await oneVote.deployed();
  console.log('OneVote deployed:', oneVote.address);

  fs.writeFileSync(
    "../clientAnonymousVoting/src/constants/contractAddresses.js",
    `
    export const oneVoteAddress = "${oneVote.address}";
    export const semaphoreAddress = "${SEMAPHORE_ADDRESS}";
    `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
