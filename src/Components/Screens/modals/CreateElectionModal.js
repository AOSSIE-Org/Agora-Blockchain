import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";

function CreateElectionModal() {
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
            <div className="dashboardButton" onClick={openModal}>
                <img src="/assets/plus.png" alt="+" style={{width: "15px", height: "15px", marginRight: "10px"}}/>
                Create Election
            </div>
            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"80%"} p={0}>
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

                    <div style={{margin: "10px", maxWidth: "400px", width: "90%"}}>
                        <h4>Create a new election</h4>

                        <br/>

                        <div>
                            <label className="form-label">Election title</label>
                            <input 
                                className="form-control" 
                                placeholder="Add a suitable title for election" 
                            />
                            <br />

                            <label className="form-label">Election description</label>
                            <textarea
                                rows="4" 
                                className="form-control" 
                                placeholder="Describe your election" 
                            />
                            <br />
                        </div>
                    </div>
        
                    <Flex
                        px={4}
                        py={3}
                        borderTop={1}
                        borderColor={"#E8E8E8"}
                        justifyContent={"flex-end"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3}>Confirm</Button>
                    </Flex>
                </Card>
            </Modal>
        </div>
    );
  }

export default CreateElectionModal;