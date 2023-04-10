import { useState } from 'react';
import { Modal, Button, Card } from "rimble-ui";

export function DeleteModal({isAdmin = false, isPending = false}) {
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
            {
                (isAdmin && isPending)
                &&
                <div className="voteButton deleteButton" style={{marginLeft:"15%"}} onClick={openModal}>
                    DELETE
                </div>
            }

            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"80%"} p={0} style={{maxWidth: "500px", maxHeight: "300px"}}>
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

                    <h5 style={{margin: "10px", maxWidth: "500px", width: "90%"}}>Delete this election?</h5>

                    <div style={{margin: "20px 10px"}}>
                        <div>
                            <div>
                                Are your sure, you want to delete this election? Once this transaction is confirmed, this cannot be undone.
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