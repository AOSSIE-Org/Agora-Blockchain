/* global ethers */
/* eslint prefer-const: "off" */

const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

async function deployDiamond() {
    const accounts = await ethers.getSigners()
    const contractOwner = accounts[0]

    // deploy DiamondCutFacet
    const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet')
    const diamondCutFacet = await DiamondCutFacet.deploy()
    await diamondCutFacet.deployed()
    console.log('DiamondCutFacet deployed:', diamondCutFacet.address)

    // deploy Diamond
    const Diamond = await ethers.getContractFactory('Diamond')
    const diamond = await Diamond.deploy(contractOwner.address, diamondCutFacet.address)
    await diamond.deployed()
    console.log('Diamond deployed:', diamond.address)

    // deploy DiamondInit
    // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
    // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
    const DiamondInit = await ethers.getContractFactory('DiamondInit')
    const diamondInit = await DiamondInit.deploy()
    await diamondInit.deployed()
    console.log('DiamondInit deployed:', diamondInit.address)

    // deploy facets
    console.log('')
    console.log('Deploying facets')
    const FacetNames = [
        'DiamondLoupeFacet',
        'OwnershipFacet',
        'Authentication',
        'ElectionOrganizer',
        'ElectionFactory',
        'GetBallot',
        'GetResultCalculator'
    ]
    const cut = []
    for (const FacetName of FacetNames) {
        const Facet = await ethers.getContractFactory(FacetName)
        const facet = await Facet.deploy()
        await facet.deployed()
        console.log(`${FacetName} deployed: ${facet.address}`)
        cut.push({
            facetAddress: facet.address,
            action: FacetCutAction.Add,
            functionSelectors: getSelectors(facet)
        })
    }

    // upgrade diamond with facets
    console.log('')
    console.log('Diamond Cut:', cut)
    const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address)
    let tx
    let receipt
    // call to init function
    let functionCall = diamondInit.interface.encodeFunctionData('init')
    tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall)
    console.log('Diamond cut tx: ', tx.hash)
    receipt = await tx.wait()
    if (!receipt.status) {
        throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }

    try {
        const auth = await ethers.getContractAt('Authentication', diamond.address);
        const res = await auth.init(diamond.address);
        console.log("success");
        const OrganizerInfo = {
            organizerID: 0,
            name: "Roshan",
            publicAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        }
        const create = await auth.createUser(OrganizerInfo, '12345678');
        console.log("Created User");
        const check = await auth.getAuthStatus("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
        console.log("Check", check);
        console.log("Trying Create Election :  ");

        const electionOrg = await ethers.getContractAt("ElectionOrganizer", diamond.address);
        const add = await electionOrg.getElectionStorage();
        console.log("address", add);
        const ElectionInfo = {
            electionID: 0,
            name: "Election1",
            description: "Test Election",
            startDate: 1745587499,
            endDate: 1775767499,
            electionType: 1
        };
        const ElectionInfo2 = {
            electionID: 1,
            name: "Election2",
            description: "Test Election2",
            startDate: 1755587499,
            endDate: 1775767499,
            electionType: 1
        };
        const response = await electionOrg.createElection(ElectionInfo, 1, 1);
        console.log("Success creating election! ");
        const elections = await electionOrg.getOpenBasedElections();
        console.log("Elections : ", elections[0]);
        const elec = await ethers.getContractAt("Election", elections[0]);
        const Candidate = {
            candidateID: 0,
            name: "Candidate",
            description: "Description"
        }
        await electionOrg.addCandidate(elections[0],Candidate);
        // await elec.addCandidate(Candidate);
        console.log("Added candidate");
        const ballotAddress = await elec.getBallot();
        const ballotContract = await ethers.getContractAt("Ballot",ballotAddress);
        await ballotContract.vote("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",1, 1, [])
        // await elec.vote(1, 1, []);
        console.log("Voted succesfully", await elec.getVoterCount());
    } catch (error) {
        console.log("Error", error);
    }
    console.log('Completed diamond cut')
    console.log("diamond address - ", diamond.address)
    return diamond.address
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
    deployDiamond()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error)
            process.exit(1)
        })
}

exports.deployDiamond = deployDiamond
