import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getVotingProcess, getOneVoteContract, getSignalsForNullifier, getVotingProcessContract } from '../web3/contracts';

import styles from './VotingPage.module.css';
import Spinner from 'react-bootstrap/Spinner';

import {ethers} from 'ethers';
import * as snarkjs from 'snarkjs'

import {
    Identity,
    genIdentity,
    genIdentityCommitment,
    genCircuit,
    serialiseIdentity,
	genWitness,
    genExternalNullifier,
    genProof,
    genPublicSignals,
    genBroadcastSignalParams,
} from 'libsemaphore-no-test';

import {
    initStorage,
    storeId,
    retrieveId,
    hasId,
} from '../web3/semaphoreStorage';

// const fs = require('fs');


const VotingPage = () => {

    const circuitUrl = "http://127.0.0.1:5000/circuit.json"
    const provingKeyUrl = "http://127.0.0.1:5000/proving_key.bin"
    // const circuitUrl = "https://semaphoreui.blob.core.windows.net/snarks/circuit.json"
    // const provingKeyUrl = "https://semaphoreui.blob.core.windows.net/snarks/proving_key.bin"


    const { id } = useParams()

    const [votingProcess, setVotingProcess] = useState(null);
    const [vote, setVote] = useState('');
    const [proofStatus, setProofStatus] = useState('');
    const [votesPerProposal, setVotesPerProposal] = useState(null);

    useEffect(() => {
        getVotingProcess(id).then((result) => {
            console.log("Voting process id: ", result.id);
            setVotingProcess(result);
        })
        getSignalsForNullifier(id).then((result) => {
            setVotesPerProposal(result);
        });
    }, []);

    const fetchWithoutCache = (
        url,
    ) => {
        return fetch(url, { cache: 'no-store' })
    }

    const handleVoteClick = async () => {
        try{
            //get checked radio button
            var radios = document.getElementsByName('vote');
            let voteLocal;

            for (var i = 0, length = radios.length; i < length; i++) {
                if (radios[i].checked) {
                    console.log("Selected vote: ", radios[i].value);
                    setVote(radios[i].value);
                    voteLocal = radios[i].value;//setvote doesn't update imediately
                    // only one radio can be logically checked, don't check the rest
                    break;
                }
            }

            if(voteLocal == '' || voteLocal == undefined){
                setProofStatus("You need to select option");
                return;
            }

            console.log("Vote", voteLocal);
            
            const oneVoteContract = await getOneVoteContract();

            // const idCommitments = await oneVoteContract.identityCommitments(0);
            // console.log("Identity commitments: ", idCommitments)

            // const roots = await oneVoteContract.getRoots();
            // console.log("Tree roots: ", roots);

            // const rootHistory = await oneVoteContract.getRootHistory(0);
            // console.log("Root history: ", rootHistory);

            setProofStatus('Downloading leaves')
            const leaves = await oneVoteContract.getIdentityCommitments()
            console.log('Leaves:', leaves)
            console.log("Downloading Circuit")
            setProofStatus('Downloading circuit')
            var cirDef;
            // const cirDef = JSON.parse(fs.readFileSync(PATH_TO_CIRCUIT, "utf8").toString())
            try{
                cirDef = await (await fetchWithoutCache(circuitUrl)).json() 
            }
            catch(e){
                console.log("Error while downloading circuit: ", e);
                setProofStatus("Error while voting");
                return;
            }

            console.log("Downloaded circuit: ", cirDef);
            const circuit = genCircuit(cirDef)
            console.log("Generated circuit: ", circuit);

            setProofStatus('Downloading proving key')
            const toBuffer = function(ab) {
                const buf = Buffer.alloc(ab.byteLength);
                const view = new Uint8Array(ab);
                for (let i = 0; i < buf.length; ++i) {
                    buf[i] = view[i];
                }
                return buf;
            }
            const provingKey = toBuffer((await (await fetch(provingKeyUrl)).arrayBuffer()))
            console.log("Proving key: ", provingKey);

            const identity = retrieveId();
            console.log("identity",identity);
            setProofStatus('Generating witness')
            var result,witness;
            console.log("Vote: ", vote)
            console.log("leaves: ", leaves)
            try{
             result = await genWitness(
                vote,
                circuit,
                identity,
                leaves,
                20,//config.chain.semaphoreTreeDepth,
                snarkjs.bigInt(id),
                )
                console.log("b");
                
                 witness = result.witness
                console.log("Witness: ", witness);
             } catch(e){
                console.log("Error while generating witness: ", e);
                setProofStatus("Error while voting");
                return;
             }
            
            setProofStatus('Generating proof')
            const proof = await genProof(witness, provingKey)
            console.log('Generated proof: ', proof);
            
            setProofStatus('Voting');
            const publicSignals = genPublicSignals(witness, circuit);
            const params = genBroadcastSignalParams(result, proof, publicSignals);
            console.log("Params: ", params);
            const voteBytes = ethers.utils.toUtf8Bytes(voteLocal);
            console.log("Vote: ", voteLocal);


            console.log("Proof root: ", ethers.BigNumber.from(params.root));
            console.log("hi")
            // console.log("Signal: ", ethers.utils.toUtf8Bytes(params?.signal));
            console.log("hi again")

            try{
                console.log("connecting to contract");
                // const vp = await getVotingProcessContract(id);
                // const vpRes = await vp.vote(voteLocal);
                // console.log("Voted: ", vpRes);
                // console.log("Vote decision: ", ethers.utils.toUtf8Bytes(voteLocal))
                console.log('vote',voteLocal,params.proof,'root', ethers.BigNumber.from(params.root),'nullifier hash',params.nullifiersHash,'external nullifier',params.externalNullifier)
                const tx = await oneVoteContract.vote(
                    //ethers.utils.toUtf8Bytes(params.signal),
                    voteLocal,
                    params.proof,
                    ethers.BigNumber.from(params.root),
                    params.nullifiersHash,
                    params.externalNullifier,
                )
                console.log("tx: ", tx);
                const receipt = await tx.wait()
                console.log("Voting result: ", receipt);
                setProofStatus("Successful vote");
                getSignalsForNullifier(id).then((result) => {
                    setVotesPerProposal(result);
                });
            } catch (error){
                console.log("Internal error happened: ", error);
                window.alert(error.data.message);
                setProofStatus("Error while voting")
            }
        } catch(er){
            setProofStatus("Error while voting");
        }
    }

    const renderVotingStatus = () => {
        let res;
        if (proofStatus == ''){
            res = '';
        }
        else if (proofStatus == 'You need to select option'){
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "orange", marginRight:"0.7em"}}>{proofStatus}!</h3>
            </div>
        }
        else if (proofStatus == "Successful vote"){
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "green", marginRight:"0.7em"}}>{proofStatus} :)</h3>
            </div>
        } else if (proofStatus == "Error while voting"){
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "#f1356d", marginRight:"0.7em"}}>{proofStatus} :(</h3>
            </div>
        }
        else {
            res = 
            <div style={{marginTop: "2em", display: "flex", margin: "auto", textAlign:"center", justifyContent:"center"}}>
                <h3 style={{color: "gray", marginRight:"0.7em"}}>{proofStatus}</h3>
                <Spinner animation="border" />
            </div>
        }
        return res;
    }

    return (  
        <div className={styles.container}>
            {votingProcess && <div>
                <div>
                    <h1>{votingProcess.name}</h1>
                    <h4>{votingProcess.description}</h4> 
                </div>
                <div id="example-collapse-text" className={styles.collapse}>
                    <div>
                        <h4>
                            Choose a voting option
                        </h4>
                    </div>
                    <div className={styles.proposalsContainer}>
                        {console.log(votingProcess.proposals)}
                        {votingProcess.proposals.map( (proposal) => (
                            <div key={proposal}>
                                <input value={proposal} type="radio" name="vote" />
                                {ethers.utils.toUtf8String(proposal)}
                            </div>
                        ))}
                    </div>
                    <div style={{marginTop: "1em"}}>
                        <button onClick={handleVoteClick} className="baseButton">Vote</button>
                    </div>
                </div>
                <div style={{marginTop: "2em", marginBottom: "4em"}}>
                    {renderVotingStatus()}
                </div>
                <div>
                    <h2 style={{fontStyle:"italic", color: "gray"}}>Votes</h2>
                    <div>
                        {
                          votesPerProposal && votesPerProposal.map( (proposal) => (
                                <div key={proposal[0]} >
                                    <label style={{color: "#f1356d", fontSize:"calc(12px + 0.6vw)", fontWeight:"600", fontStyle:"italic"}}>{ethers.utils.toUtf8String(proposal[0])}: </label>
                                    <label style={{marginLeft:"1em"}}>{proposal[1].toString()}</label>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>}
        </div>
    );
}
 
export default VotingPage;