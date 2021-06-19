import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import '../../styles/Modal.scss';

function VoteModal({Candidate, isActive}) {
    const [isOpen, setIsOpen] = useState(false);
  
    const closeModal = e => {
      e.preventDefault();
      setIsOpen(false);
    };
  
    const openModal = e => {
      e.preventDefault();
      setIsOpen(true);
    };
  
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

                    <div style={{margin: "10px", maxWidth: "500px", width: "90%"}}>
                        <h5>Choose candidates according to your preferences</h5>

                        <br/>

                        <div>
                            <b>1st Preference</b>
                            <br/><br/>

                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                                <label className="voteCandidate">
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
                                </label>
                            </div>
                        </div>
                    </div>
        
                    <div className="modalButtons">
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3}>Confirm</Button>
                    </div>                    
                </Card>
            </Modal>
        </div>
    );
  }

export default VoteModal;