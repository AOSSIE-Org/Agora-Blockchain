import * as ethers from 'ethers'
import { Contract } from 'ethers';
import { oneVoteAddress, } from "../constants/contractAddresses";
import oneVoteAbi from "../abis/contracts/OneVote.sol/OneVote.json";
import votingProcessAbi from "../abis/contracts/VotingProcess.sol/VotingProcess.json";

const getProviderAndSigner = () => {
    const { ethereum } = window;
    if (!ethereum) {
        console.error("Ethereum object not found, you need to install MetaMask!");
        return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return { provider, signer };
};

const createVotingProcess = async (name, description, startDate, endDate) => {
    const { signer } = getProviderAndSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const tx = await oneVoteContract.createVotingProcess(name, description, startDate, endDate);
    await tx.wait();
    console.log("Voting process created:", tx);
    return tx;
};

const addVoter = async (identityCommitment,debug=false) => {
    const { signer } = getProviderAndSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const tx = await oneVoteContract.addVoter(identityCommitment);
    const recipt=await tx.wait();
    console.log("Voter added:", tx);
    if(debug){
        console.log(recipt);
    }
    return recipt;
};

// TODO: Should call the backend.
const vote = async (vote, nullifierHash, pollId, merkleTreeRoot, proof) => {
    const { signer } = getProviderAndSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const tx = await oneVoteContract.vote(vote, nullifierHash, pollId, merkleTreeRoot, proof);
    await tx.wait();
    console.log("Vote cast:", tx);
};


const getUserAuthStatus = async (identityCommitment) => {
    const { provider } = getProviderAndSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, provider);
    const status = await oneVoteContract.getUserAuthStatus(identityCommitment);
    console.log("User authorization status:", status);
    return status;
};


const addCandidate = async (processId, candidate) => {
    const { signer } = getProviderAndSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const tx = await oneVoteContract.addCandidate(processId, candidate);
    await tx.wait();
    console.log("Candidate added:", tx);
};


const getOneVoteContract = async () => {
    const {provider,signer} = getProviderAndSigner();
    const oneVoteContract = new ethers.Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    return oneVoteContract;
}

const getVotingProcessContract = async (processId) => {
    const { provider } = getProviderAndSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, provider);
    const address = await oneVoteContract.votingProcesses(processId);
    const votingProcessContract = new Contract(address, votingProcessAbi.abi, provider);
    console.log("Voting Process Contract:", votingProcessContract);
    return votingProcessContract;
};


const getAllVotingProcesses = async () => {
    const { provider } = getProviderAndSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, provider);
    const processes = await oneVoteContract.getAllVotingProcesses();
    console.log("All Voting Processes:", processes);
    return processes;
};



export {
    createVotingProcess,
    addVoter,
    getUserAuthStatus,
    vote,
    addCandidate,
    getVotingProcessContract,
    getAllVotingProcesses,
    getProviderAndSigner,
}