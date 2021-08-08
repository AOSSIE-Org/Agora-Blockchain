import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import '../../styles/Modal.scss';
import { AVATARS } from '../../constants';

function VoteModal({Candidate, isActive, currentElectionDetails, CurrentElection, account}) {
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
        console.log(await CurrentElection.getTimestamps().call())
        try{
            console.log(candidateId)
            await CurrentElection.vote(candidateId).send({from: account})
            setCandidateId(null);
            setIsOpen(false);
        } catch(err) {
            alert("Transaction failed: ", JSON.stringify(err))
        }
    }
  
    return (
        <div>
            {isActive
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
                                    currentElectionDetails?.candidate?.map((candidate) => (
                                        <label className="voteCandidate">
                                            <input type="radio" name="candidate" value={candidate?.id} onChange={handleCandidateIdChange} className="voteCandiateInput"/>
                                            <Candidate name={candidate?.name} id={candidate?.id} about={candidate?.about} voteCount={candidate?.voteCount} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}/> 
                                        </label>
                                    ))
                                }
                                
                                {/* <label className="voteCandidate">
                                    <input type="radio" name="candidate" className="voteCandiateInput"/>
                                    <Candidate name="Raj" id="1" imageUrl="/assets/avatar.png"/>
                                </label>

                                <label className="voteCandidate">
                                    <input type="radio" name="candidate" className="voteCandiateInput"/>
                                    <Candidate name="Ayush" id="2" imageUrl="/assets/avatar2.png"/>
                                </label>

                                <label className="voteCandidate">
                                    <input type="radio" name="candidate" className="voteCandiateInput"/>
                                    <Candidate name="Thuva" id="3" imageUrl="/assets/avatar4.png"/>
                                </label>

                                <label className="voteCandidate">
                                    <input type="radio" name="candidate" className="voteCandiateInput"/>
                                    <Candidate name="Bruno" id="4" imageUrl="/assets/avatar3.png"/>
                                </label>

                                <label className="voteCandidate">
                                    <input type="radio" name="candidate" className="voteCandiateInput"/>
                                    <Candidate name="Bruno" id="4" imageUrl="/assets/avatar3.png"/>
                                </label> */}
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
    );
  }

export default VoteModal;