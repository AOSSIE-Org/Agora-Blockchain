const { genExternalNullifier } = require('../utils');

async function main() {
  const depth = 20;
  const externalNullifier = genExternalNullifier('test-voting');

  const OneVote = await ethers.getContractFactory('OneVote');

  // Deploy MiMC contract
  const MiMC = await ethers.getContractFactory('MiMC');
  const mimc = await MiMC.deploy();
  await mimc.deployed();
  console.log('MiMC deployed:', mimc.address);


  // Deploy Semaphore contract
  const Semaphore= await ethers.getContractFactory("Semaphore", {
  libraries: {
    MiMC: mimc.address,
  },
});
  // Link MiMC library to Semaphore contract
  const semaphore = await Semaphore.deploy(depth, externalNullifier);
  await semaphore.deployed();
  console.log('Semaphore deployed:', semaphore.address);
  console.log('MiMC library linked to Semaphore contract.');


  // Deploy OneVote contract
  const oneVote = await OneVote.deploy(semaphore.address);
  await oneVote.deployed();
  console.log('OneVote deployed:', oneVote.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
