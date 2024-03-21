import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { Contract, ethers } from "ethers";
import '../styles/Modal.scss';
import '../VotingPage.module.css';
import Spinner from 'react-bootstrap/Spinner';
import { Candidate } from './Candidate';
import { AVATARS } from '../constants';
import { generateProof } from "@semaphore-protocol/proof";
import { Identity } from "@semaphore-protocol/identity";
import { Group } from "@semaphore-protocol/group";
import { getProviderAndSigner, getUserAuthStatus } from "../../web3/contracts";
import votingProcessAbi from "../../abis/contracts/VotingProcess.sol/VotingProcess.json";

export function VoteModal({ electionAddress, candidates }) {

    const [isOpen, setIsOpen] = useState(false);
    const [candidateId, setCandidateId] = useState(null);
    const [pending, setPending] = useState(false);


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
        e.preventDefault();
        console.log(candidateId);
        const vote = ethers.BigNumber.from(candidateId).toString();
        const { signer } = getProviderAndSigner();
        const address = await signer.getAddress();
        const message = `I am signing this message to confirm my identity: ${address}`;
        if (address) {
            const signature = await signer.signMessage(message);
            const identity = new Identity(signature);
            console.log(identity);
            const authStatus = await getUserAuthStatus(identity.commitment);
            try {
                if (!authStatus) {
                    return;
                }
                // the group id specified while deploying the smart contract.
                const group = new Group(1223333);
                console.log("We have a group now!");
                const { provider } = getProviderAndSigner();
		        const votingProcessContract = new Contract(electionAddress, votingProcessAbi.abi, provider);
		        
                const electionId = await votingProcessContract.id();
                group.addMember(identity.commitment);
                console.log(electionId.toNumber());
                const { proof, merkleTreeRoot, nullifierHash } = await generateProof(
                    identity,
                    group,
                    electionId.toNumber(),
                    vote
                );
                console.log("Proof generated!",proof);
              
                let response;
                response = await fetch("http://localhost:4000/vote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        vote,
                        merkleTreeRoot,
                        nullifierHash,
                        proof,
                        // This will work as external nullifier.
                        electionId
                    })
                })
                if(response.status===200){
                    // TODO: Show toast
                    setIsOpen(false);
                }
            } catch (e) {
                console.log(e);
                setPending(false);
            }
        }
    }


    const renderVotingStatus = () => {
        const proofStatus = 'You need to select option';
        let res;
        if (proofStatus === '') {
            res = '';
        }
        else if (proofStatus === 'You need to select option') {
            res =
                <div style={{ marginTop: "2em", display: "flex", margin: "auto", textAlign: "center", justifyContent: "center" }}>
                    <h3 style={{ color: "orange", marginRight: "0.7em" }}>{proofStatus}!</h3>
                </div>
        }
        else if (proofStatus === "Successful vote") {
            res =
                <div style={{ marginTop: "2em", display: "flex", margin: "auto", textAlign: "center", justifyContent: "center" }}>
                    <h3 style={{ color: "green", marginRight: "0.7em" }}>{proofStatus} :)</h3>
                </div>
        } else if (proofStatus === "Error while voting") {
            res =
                <div style={{ marginTop: "2em", display: "flex", margin: "auto", textAlign: "center", justifyContent: "center" }}>
                    <h3 style={{ color: "#f1356d", marginRight: "0.7em" }}>{proofStatus} :(</h3>
                </div>
        }
        else {
            res =
                <div style={{ marginTop: "2em", display: "flex", margin: "auto", textAlign: "center", justifyContent: "center" }}>
                    <h3 style={{ color: "gray", marginRight: "0.7em" }}>{proofStatus}</h3>
                    <Spinner animation="border" />
                </div>
        }
        return res;
    }




    return (
        <div>
            <div className="voteButton" onClick={openModal}>
                VOTE
            </div>
            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"80%"} p={0} style={{ maxWidth: "700px", borderRadius: "5px" }}>
                    <Button.Text
                        style={{ margin: "0px" }}
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

                    <div style={{ margin: "10px", maxWidth: "700px", width: "96%" }}>
                        <h3 style={{ textAlign: "center", paddingTop: "24px", fontWeight: "bold", fontFamily: "monospace" }}>Choose candidates according to your preferences</h3>
                        <div>
                            <br />
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                                {
                                    candidates.map((candidate, index) => {

                                        return (
                                            <div key={candidate} className="card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                                                <div>
                                                    <div>
                                                        <input type="radio" name="candidate" value={index} onChange={handleCandidateIdChange} className="voteCandiateInput" />
                                                    </div>
                                                    <div >
                                                        <Candidate name={ethers.utils.parseBytes32String(candidate)} id={index} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'} />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: "2em", marginBottom: "4em" }}>
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