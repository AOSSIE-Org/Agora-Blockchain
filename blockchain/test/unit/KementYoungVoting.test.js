const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const {
  deployElectionFactoryFixture,
} = require('../fixtures/ElectionFactoryFixture')
const { expect } = require('chai')

describe('Kemeny-Young Voting Algorithm Tests', function () {
  it('Should handle double vote & candidate', async function () {
    const { electionFactory, voter1 } = await loadFixture(
      deployElectionFactoryFixture
    )

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Ranked Election',
      description: 'This is a ranked test election',
    }
    const ballotType = 7 // Kemeny Young
    const resultType = 7 // Kemeny Young
    const initialCandidates = [
      { candidateID: 1, name: 'candidate1', description: 'candidate1' },
      { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
    ]

    await electionFactory.createElection(
      electionInfo,
      initialCandidates,
      ballotType,
      resultType
    )

    const openElections = await electionFactory.getOpenElections()
    const Election = await ethers.getContractFactory('Election')
    const electionInstance = Election.attach(openElections[0])

    await time.increase(120) // Move time forward to make the election active

    await electionInstance.connect(voter1).userVote([0, 1]) // Rank: A

    await time.increase(3600) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    expect(winner[0]).to.equal(0) // Candidate C is the winner
  })
  it('Test with three voters and three candidates', async function () {
    const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
      deployElectionFactoryFixture
    )

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Kemeny-Young Election',
      description: 'This is a Kemeny-Young test election',
    }
    const ballotType = 7 // Kemeny-Young
    const resultType = 7 // Kemeny-Young
    const initialCandidates = [
      { candidateID: 1, name: 'candidate1', description: 'candidate1' },
      { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
    ]

    await electionFactory.createElection(
      electionInfo,
      initialCandidates,
      ballotType,
      resultType
    )

    const openElections = await electionFactory.getOpenElections()
    const Election = await ethers.getContractFactory('Election')
    const electionInstance = Election.attach(openElections[0])

    await electionInstance.addCandidate('Candidate A', 'Test Description')

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Voters submit their rankings
    await electionInstance.connect(voter1).userVote([0, 1, 2]) // A > B > C
    await electionInstance.connect(voter2).userVote([1, 2, 0]) // B > C > A
    await electionInstance.connect(voter3).userVote([1, 0, 2]) // B > A > C

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest Kemeny-Young score
    expect(winner[0]).to.equal(0)
  })
  it('Test with five voters and four candidates', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Kemeny-Young Election',
      description: 'This is a Kemeny-Young test election',
    }
    const ballotType = 7 // Kemeny-Young
    const resultType = 7 // Kemeny-Young
    const initialCandidates = [
      { candidateID: 1, name: 'candidate1', description: 'candidate1' },
      { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
    ]

    await electionFactory.createElection(
      electionInfo,
      initialCandidates,
      ballotType,
      resultType
    )

    const openElections = await electionFactory.getOpenElections()
    const Election = await ethers.getContractFactory('Election')
    const electionInstance = Election.attach(openElections[0])

    await electionInstance.addCandidate('Candidate C', 'Test Description')
    await electionInstance.addCandidate('Candidate D', 'Test Description')

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Voters submit their votes
    await electionInstance.connect(voter1).userVote([0, 1, 2, 3]) // Voter 1: A > B > C > D
    await electionInstance.connect(voter2).userVote([3, 2, 1, 0]) // Voter 2: D > C > B > A
    await electionInstance.connect(voter3).userVote([1, 0, 3, 2]) // Voter 3: B > A > D > C
    await electionInstance.connect(voter4).userVote([2, 3, 0, 1]) // Voter 4: C > D > A > B
    await electionInstance.connect(voter5).userVote([0, 3, 2, 1]) // Voter 5: A > D > C > B

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest Kemeny-Young score
    expect(winner[0]).to.equal(0) // Adjust this based on the actual Kemeny-Young calculation
  })
  it('Test 1 multiple winners', async function () {
    const { electionFactory, voter1, voter2, voter3 } = await loadFixture(
      deployElectionFactoryFixture
    )

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Kemeny-Young Election',
      description: 'This is a Kemeny-Young test election',
    }
    const ballotType = 7 // Kemeny-Young
    const resultType = 7 // Kemeny-Young
    const initialCandidates = [
      { candidateID: 1, name: 'candidate1', description: 'candidate1' },
      { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
    ]

    await electionFactory.createElection(
      electionInfo,
      initialCandidates,
      ballotType,
      resultType
    )

    const openElections = await electionFactory.getOpenElections()
    const Election = await ethers.getContractFactory('Election')
    const electionInstance = Election.attach(openElections[0])

    await electionInstance.addCandidate('Candidate C', 'Test Description')

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Voters submit their rankings
    await electionInstance.connect(voter1).userVote([0, 1, 2]) // A > B > C
    await electionInstance.connect(voter2).userVote([1, 2, 0]) // B > C > A
    await electionInstance.connect(voter3).userVote([2, 1, 0]) // B > A > C

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest Kemeny-Young score
    expect(winner).deep.to.equal([0, 1, 2])
  })
  it('Test 2 for multiple winners', async function () {
    const { electionFactory, voter1, voter2, voter3, voter4, voter5, voter6 } =
      await loadFixture(deployElectionFactoryFixture)

    const electionInfo = {
      startTime: Math.floor(Date.now() / 1000) + 60,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      name: 'Kemeny-Young Election',
      description: 'This is a Kemeny-Young test election',
    }
    const ballotType = 7 // Kemeny-Young
    const resultType = 7 // Kemeny-Young
    const initialCandidates = [
      { candidateID: 1, name: 'candidate1', description: 'candidate1' },
      { candidateID: 2, name: 'candidate2', description: 'candidate2s' },
    ]

    await electionFactory.createElection(
      electionInfo,
      initialCandidates,
      ballotType,
      resultType
    )

    const openElections = await electionFactory.getOpenElections()
    const Election = await ethers.getContractFactory('Election')
    const electionInstance = Election.attach(openElections[0])

    await electionInstance.addCandidate('Candidate C', 'Test Description')
    await electionInstance.addCandidate('Candidate D', 'Test Description')
    await electionInstance.addCandidate('Candidate E', 'Test Description')

    await ethers.provider.send('evm_increaseTime', [120]) // Move time forward to make the election active

    // Voters submit their vote
    await electionInstance.connect(voter1).userVote([0, 1, 2, 3, 4])
    await electionInstance.connect(voter2).userVote([1, 2, 0, 3, 4])
    await electionInstance.connect(voter3).userVote([2, 0, 3, 1, 4])
    await electionInstance.connect(voter4).userVote([1, 3, 2, 0, 4])
    await electionInstance.connect(voter5).userVote([3, 2, 0, 4, 1])
    await electionInstance.connect(voter6).userVote([1, 4, 0, 2, 3])

    await ethers.provider.send('evm_increaseTime', [3600]) // Move time forward to end the election

    await electionInstance.getResult()
    const winner = await electionInstance.getWinners()

    // The expected winner index would be the candidate with the highest Kemeny-Young score
    expect(winner).deep.to.equal([0, 1, 2, 3, 4])
  })
})
