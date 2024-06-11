import * as ethers from 'ethers'
import { Contract } from 'ethers';
import semaphoreAbi from '@/../../abi/Semaphore.json';
import semaphoreNetworks from '@/../../addresses/Semaphore.json';
import oneVoteAbi from '@/../../abi/OneVote.json';
import oneVoteNetworks from '@/../../addresses/OneVote.json';
import votingProcessAbi from '@/../../abi/VotingProcess.json';

const semaphoreAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const oneVoteAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const deployVotingProcess = async (name, description,startDate,endDate) => {
    console.log("One Vote testnet address: ", oneVoteAddress);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const args = [
        name, description,startDate,endDate
    ];

    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const result = await oneVoteContract.createVotingProcess(...args)
    await result.wait()
    
    console.log("Result of create voting process: ", result);
    return result;
}

const getVotingProcesses = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const votingProcesses = await oneVoteContract.getProcesses();
    console.log("Voting processes: ", votingProcesses);
    return votingProcesses;
}

const getAuthStatus = async (identityCommitment) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    console.log("Identity commitment: ", identityCommitment);
    const authStatus = await oneVoteContract.getAuthStatus(identityCommitment);
    console.log("Voting processes: ", authStatus);
    return authStatus;
}

const getVotingProcess = async (id) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const votingProcess = await oneVoteContract.getProcess(id);
    
    console.log("Voting process: ", votingProcess);
    return votingProcess;
}

const getVotingProcessContract = async (id) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const votingProcessAddress = await oneVoteContract.votingProcesses(id);
    const votingProcessContract = new Contract(votingProcessAddress, votingProcessAbi.abi, signer);
    console.log("Voting process contract: ", votingProcessContract);
    return votingProcessContract;
}

const getOneVoteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new ethers.Contract(oneVoteAddress, oneVoteAbi.abi, signer);

    return oneVoteContract;
}

const getSignalsForNullifier = async (id) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const votingProcessAddress = await oneVoteContract.votingProcesses(id);
    const votingProcessContract = new Contract(votingProcessAddress, votingProcessAbi.abi, signer);
    const result = await votingProcessContract.getVotesPerProposal();
    console.log("Votes per proposal: ", result);
    return result;
}

const addProposal = async (id,proposal) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi.abi, signer);
    const result =oneVoteContract.addProposal(id,proposal);
    return result;
}


export {
    addProposal,
    deployVotingProcess,
    getVotingProcesses,
    getVotingProcess,
    getVotingProcessContract,
    getOneVoteContract,
    getSignalsForNullifier,
    getAuthStatus
}