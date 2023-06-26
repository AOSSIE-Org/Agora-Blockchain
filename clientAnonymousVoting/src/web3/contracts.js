import * as ethers from 'ethers'
import { Contract } from 'ethers';
import semaphoreAbi from '@/../../abi/Semaphore.json';
import semaphoreNetworks from '@/../../addresses/Semaphore.json';
import oneVoteAbi from '@/../../abi/OneVote.json';
import oneVoteNetworks from '@/../../addresses/OneVote.json';
import votingProcessAbi from '@/../../abi/VotingProcess.json';

const semaphoreAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const oneVoteAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

const deployVotingProcess = async (name, description, proposals) => {
    console.log("One Vote testnet address: ", oneVoteAddress);
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const args = [
        name, description, proposals
    ];

    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    const result = await oneVoteContract.createVotingProcess(...args)
    await result.wait()
    
    console.log("Result of create voting process: ", result);
    return result;
}

const getVotingProcesses = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    const votingProcesses = await oneVoteContract.getProcesses();
    console.log("Voting processes: ", votingProcesses);
    return votingProcesses;
}

const getVotingProcess = async (id) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    const votingProcess = await oneVoteContract.getProcess(id);
    
    console.log("Voting process: ", votingProcess);
    return votingProcess;
}

const getVotingProcessContract = async (id) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    const votingProcessAddress = await oneVoteContract.votingProcesses(id);
    const votingProcessContract = new Contract(votingProcessAddress, votingProcessAbi, signer);
    console.log("Voting process contract: ", votingProcessContract);
    return votingProcessContract;
}

const getOneVoteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    return oneVoteContract;
}

const getSignalsForNullifier = async (id) => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const oneVoteContract = new Contract(oneVoteAddress, oneVoteAbi, signer);
    const votingProcessAddress = await oneVoteContract.votingProcesses(id);
    const votingProcessContract = new Contract(votingProcessAddress, votingProcessAbi, signer);
    const result = await votingProcessContract.getVotesPerProposal();
    console.log("Votes per proposal: ", result);
    return result;
}


export {
    deployVotingProcess,
    getVotingProcesses,
    getVotingProcess,
    getVotingProcessContract,
    getOneVoteContract,
    getSignalsForNullifier,
}