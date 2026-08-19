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
  const MockCCIPReceiverRouter = await ethers.getContractFactory(
    'MockCCIPReceiverRouter'
  )
  const ballotGenerator = await BallotGenerator.deploy()
  const resultCalculator = await ResultCalculator.deploy()
  const election = await Election.deploy()
  const mockRouter = await MockCCIPReceiverRouter.deploy(ethers.ZeroAddress)
  const electionFactory = await ElectionFactory.deploy(mockRouter.target)
  await mockRouter.setElectionFactory(electionFactory.target)

  return {
    electionFactory,
    election,
    mockRouter,
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
