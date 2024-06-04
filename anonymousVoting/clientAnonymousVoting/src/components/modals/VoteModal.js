import { useState ,useEffect} from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionABI from '../../build/Election.sol/Election.json'
import { successtoast,dangertoast } from "../utilities/Toasts";
import { ToastContainer, toast } from "react-toastify";
import '../styles/Modal.scss';
import { getVotingProcess, getOneVoteContract, getSignalsForNullifier, getVotingProcessContract } from '../../web3/contracts';
import styles from '../VotingPage.module.css';
import Spinner from 'react-bootstrap/Spinner';
import * as snarkjs from 'snarkjs'
import { Candidate } from './Candidate';
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
} from '../../web3/semaphoreStorage';


import { AVATARS, STATUS } from '../constants';

export function VoteModal({electionId,status}) {
    
    const circuitUrl = "http://127.0.0.1:5000/circuit.json"
    const provingKeyUrl = "http://127.0.0.1:5000/proving_key.bin"
	// const electionId = electionId;
    
    const [isOpen, setIsOpen] = useState(false);
    const [candidateId, setCandidateId] = useState(null);
    const [votingProcess, setVotingProcess] = useState(null);
    const [vote, setVote] = useState('');
    const [proofStatus, setProofStatus] = useState('');
    const [votesPerProposal, setVotesPerProposal] = useState(null);
    

    const closeModal = e => {
        e.preventDefault();
        setIsOpen(false);
    };

    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };

    const handleCandidateIdChange = (e) => {
        setCandidateId(e.target.value);
        
    }

    const handleVoteSubmit = async (e) => {
        let id = electionId;
       
        
        
        try{
            console.log("Candidate ID: ", candidateId)

            const oneVoteContract = await getOneVoteContract();
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
            console.log("identity: ", identity);
            setProofStatus('Generating witness')
            var result,witness;
            
            console.log("Vote: ", vote)
            console.log("leaves: ", leaves)
            try{
             result = await genWitness(
                candidateId,
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
            const voteBytes = ethers.utils.toUtf8Bytes(candidateId);
            console.log("Vote: ", candidateId);


            console.log("Proof root: ", ethers.BigNumber.from(params.root));
       

            try{
                console.log("connecting to contract");
                
                console.log('vote',candidateId,params.proof,'root', ethers.BigNumber.from(params.root),'nullifier hash',params.nullifiersHash,'external nullifier',params.externalNullifier)
                const tx = await oneVoteContract.vote(
                    candidateId,
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
        e.preventDefault();
        setIsOpen(false);

    }


    useEffect(() => {
        getVotingProcess(electionId).then((result) => {
            console.log("Voting process electionId: ", electionId);
            console.log("Voting process: ", result);
            setVotingProcess(result);
        })
        getSignalsForNullifier(electionId).then((result) => {
            console.log("Votes per proposal at 0: ", parseInt(result[2][1]._hex));
            setVotesPerProposal(result);
            console.log("Votes per proposal: ", votesPerProposal[0][1]);
        });
    }, []);

    const fetchWithoutCache = (
        url,
    ) => {
        return fetch(url, { cache: 'no-store' })
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
        <div>
            {
                status === STATUS.ACTIVE
                ?
                <div className="voteButton" onClick={openModal}>
                    VOTE
                </div>
                :
                <div className="voteButton voteButtonDisabled">
                    VOTE
                </div>
            }
            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"80%"} p={0} style={{maxWidth: "700px", borderRadius: "5px"}}>
                    <Button.Text
                        style={{margin: "0px"}}
                        icononly
                        icon={"Close"}
                        color={"moon-gray"}
                        position={"absolute"}
                        top={0}
                        right={0}
                        mt={3}
                        mr={3}
                        onClick={closeModal}
                    />

                    <div style={{margin: "10px", maxWidth: "700px", width: "96%"}}>
                        <h3 style={{textAlign:"center" ,paddingTop:"24px" ,fontWeight:"bold" , fontFamily:"monospace"}}>Choose candidates according to your preferences</h3>
                        <div>
                            
                            <br/>

                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
                                {
                                    votingProcess?.proposals?.map((candidate,index) => (
                                        <div className="card"  style={{display:"flex", marginLeft:"1%",marginRight:"1%",marginBottom:"2%",padding:"2%" ,paddingTop:"0.4%"}}>
                                           
                                            <div>

                                            <div>
                                            <input type="radio" name="candidate" value={candidate} onChange={handleCandidateIdChange} className="voteCandiateInput"/>
                                            </div>
                                            <div style={{padding:"1.9rem"}}>
                                                {/* voteCount ={parseInt(votesPerProposal[2][1]._hex)} */}

                                        <Candidate name={ ethers.utils.toUtf8String(candidate)} id={index}  imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}/> 
                                        {
                                                votesPerProposal == null ? <div>0</div> :
                                                <div>Total votes:{parseInt(votesPerProposal[index][1]._hex)}</div>
                                            }
                                            </div>
                                            </div>

                                      
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop: "2em", marginBottom: "4em"}}>
                    {renderVotingStatus()}
                </div>

                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-start"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={handleVoteSubmit}>Confirm</Button>
                    </Flex>                
                </Card>
            </Modal>
        </div>
    )
}