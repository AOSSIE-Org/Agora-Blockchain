import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionOrganiser from "../../../build/ElectionOrganizer.json";

export function AddCandidateModal({ organizerAddress, electionAddress, functionCall }) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateDetail, setCandidateDetail] = useState({
        name: '',
        description: ''
    });


    const handleCandidateDetailChange = (e) => {
        const { name, value } = e.target;
        setCandidateDetail({
            ...candidateDetail,
            [name]: value
        });
    }
    

    const handleSubmitCandidate = async (e) => {
        e.preventDefault();
        try {
            const { ethereum } = window;
            if (ethereum) {
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              const contract = new ethers.Contract(
                organizerAddress,
                ElectionOrganiser.abi,
                signer
              );
              const transaction = await contract.addCandidate(
                electionAddress
                ,
                  [1,
                  candidateDetail.name,candidateDetail.description]
              );
              await transaction.wait();
      
              console.log("Successfully added candidate");
              closeModal();
              await functionCall();             
            }
          } catch(err) {
            console.log(err);
          }
        
    }

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };

    return (
        <div>
            <div onClick={openModal} style={{cursor: "pointer"}}>
                <font size = '2'>Add Candidate</font>
            </div>
            
            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"max-content"} p={0} style={{maxWidth: "500px"}}>
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
                        <h5>Add candidates</h5>

                        <br/>

                        <div>
                            <b>Canidate Name</b>
                            <br/>
                            
                            <input 
                                className="form-control" 
                                placeholder="Name of the candidate"
                                name="name"
                                value={candidateDetail.name}
                                onChange={handleCandidateDetailChange}
                                style={{marginTop: "15px"}}
                            />
                            <br /><br />

                            <b>Canidate Description</b>
                            <br/>
                            
                            <textarea
                                className="form-control" 
                                placeholder="Name of the candidate"
                                name="description"
                                rows={6}
                                value={candidateDetail.description}
                                onChange={handleCandidateDetailChange}
                                style={{marginTop: "15px"}}
                            /> 
                            
                            <br /><br />
                        </div>
                    </div>
        
                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-end"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={handleSubmitCandidate}>Confirm</Button>
                    </Flex>
                </Card>
            </Modal>
        </div>
    );
}