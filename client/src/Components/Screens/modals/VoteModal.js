import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionABI from '../../../build/Election.sol/Election.json'

import '../../styles/Modal.scss';

import { AVATARS, STATUS } from '../../constants';

export function VoteModal({Candidate, status, candidates, CurrentElection, account,contractAddress,ballotAddress}) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateId, setCandidateId] = useState(null);
    

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
        setIsOpen(false);
        
        try{

            const { ethereum } = window;
            if (ethereum) {
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              const addr = await signer.getAddress();
              const CurrentElection = new ethers.Contract(
                contractAddress,
                ElectionABI.abi,
                signer
              );
            
            
            // window.toastProvider.addMessage("Processing your voting request.", {
            //     variant: "processing"
            // })
            let res  =await CurrentElection.vote(addr,candidateId,1,[]);
            // window.toastProvider.addMessage("Voted", {
            //     secondaryMessage: "You have successfully voted! Thank you.",
            //     variant: "success"
            // });
            console.log('you have succesfully voted ')
            setCandidateId(null);
            setIsOpen(false);
        }
        } catch(err) {
            // window.toastProvider.addMessage("Failed", {
            //     secondaryMessage: "Transaction failed. Try again",
            //     variant: "failure"
            // });
            console.log(err)
        }
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

                    <div style={{margin: "10px", maxWidth: "700px", width: "90%"}}>
                        <h5>Choose candidates according to your preferences</h5>

                        <br/>

                        <div>
                            <b>1st Preference</b>
                            <br/><br/>

                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                                {
                                    candidates?.map((candidate) => (
                                        <label className="voteCandidate">
                                            <input type="radio" name="candidate" value={candidate?.candidateID} onChange={handleCandidateIdChange} className="voteCandiateInput"/>
                                            <Candidate name={candidate?.name} id={Number(candidate?.candidateID._hex)} about={candidate?.about} voteCount={candidate?.voteCount} ballotAddress={ballotAddress} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}/> 
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-end"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={handleVoteSubmit}>Confirm</Button>
                    </Flex>                
                </Card>
            </Modal>
        </div>
    )
}