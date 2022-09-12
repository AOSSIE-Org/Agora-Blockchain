import {ethers} from 'ethers'
import { ContractABI } from "./abis";

const provider = new ethers.providers.Web3Provider(window.ethereum)

async function connect() {
    const from = await provider.getSigner('0x4cB0eb69fA785Dcc1Ae8a094DB2669a2b9865429')
    const ins = getInstance("0x18f439Bc6B45a5b6573AD61583BDB3FFC4052359", "ElectionOrganizer")
	const signer = ins.connect(from)
    const tx = signer.createElection(
        [1, "hi", "there", 1, 2],
        "0x7e70A77d7977eCb3B00B961b801143a72f5516e4",
        "0x7e70A77d7977eCb3B00B961b801143a72f5516e4"
    );
    console.log(tx)
}

connect()

export function getInstance(address, ABI) {
    // connect()
    return new ethers.Contract(address, ContractABI[ABI], provider)
}