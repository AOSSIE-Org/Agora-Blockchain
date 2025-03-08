async function deployElectionFactoryFixture() {
  const [
    owner,
    otherAccount,
    voter1,
    voter2,
    voter3,
    voter4,
    voter5,
    voter6,
    voter7,
    voter8,
    voter9,
    voter10,
    voter11,
    voter12,
  ] = await ethers.getSigners()

  const BallotGenerator = await ethers.getContractFactory('BallotGenerator')
  const ResultCalculator = await ethers.getContractFactory('ResultCalculator')
  const Election = await ethers.getContractFactory('Election')
  const ElectionFactory = await ethers.getContractFactory('ElectionFactory')

  const ballotGenerator = await BallotGenerator.deploy()
  const resultCalculator = await ResultCalculator.deploy()
  const election = await Election.deploy()
  const electionFactory = await ElectionFactory.deploy(
    '0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59'
  )

  return {
    electionFactory,
    election,
    ballotGenerator,
    resultCalculator,
    owner,
    otherAccount,
    voter1,
    voter2,
    voter3,
    voter4,
    voter5,
    voter6,
    voter7,
    voter8,
    voter9,
    voter10,
    voter11,
    voter12,
  }
}

module.exports = { deployElectionFactoryFixture }
