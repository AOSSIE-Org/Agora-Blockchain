const express = require("express");
const cors = require("cors");
const oneVote = require("./abis/contracts/OneVote.sol/OneVote.json");
const { Contract, providers, Wallet } =require("ethers");
require("dotenv").config();

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); 
const PORT = 4000;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_PROVIDER = process.env.SEPOLI_RPC_URL;
const contractAddress = process.env.ONEVOTE_ADDRESS;


app.post("/vote",async (req,res)=>{
    console.log("Trying to vote!");
    const provider = new providers.JsonRpcProvider(RPC_PROVIDER);
    const signer = new Wallet(PRIVATE_KEY,provider);
    const contract = new Contract(contractAddress,oneVote.abi,signer);
    const { vote, merkleTreeRoot, nullifierHash, proof,electionId} = req.body;
    try{
        const transection = await contract.vote(vote,nullifierHash,electionId,merkleTreeRoot,proof);
        await transection.wait();
        res.status(200);
    }catch{
        res.status(500);
    }
})  


app.listen(PORT, () => {
    console.log(`Post Service live at port: ${PORT}`);
});
