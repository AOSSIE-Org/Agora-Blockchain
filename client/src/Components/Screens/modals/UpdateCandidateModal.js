import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionOrganiser from "../../../build/ElectionOrganizer.json";

export function UpdateCandidateModal({candidates, organizerAddress, electionAddress}) {
    console.log(candidates);
    const [isOpen, setIsOpen] = useState(false);
    const [candidateDetail, setCandidateDetail] = useState({
        candidateId:0,
        name: candidates?.name,
        description:candidates?.description
    });

    const handleCandidateDetailChange = (e) => {
        const { name, value } = e.target;
        setCandidateDetail({
            ...candidateDetail,
            [name]: value
        });
        console.log(candidateDetail)
    }

    const handleChange = (e) => {
        e.preventDefault();
        let tempDetail = candidateDetail
        let index = e.target.value;
        tempDetail.candidateId = index;
        tempDetail.name = candidates[index].name;
        tempDetail.description = candidates[index].description
        console.log(tempDetail);
        setCandidateDetail(tempDetail)
        console.log(candidateDetail);
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

            console.log(candidateDetail);

            const transaction = await contract.updateCandidateInfo(electionAddress, candidateDetail.name, candidateDetail.description, candidateDetail.candidateId);
            await transaction.wait();      
            closeModal();        
            console.log("suceessss");     
            }
          } catch(err) {
            console.log(err);
          }
        
    }

    const closeModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return (
        <div>    
            <div onClick={openModal} style={{cursor: "pointer"}}>
                <font size = '1'>Update Candidate</font>
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
                        <h5>Update candidate</h5>

                        <br/>

                        <select onChange={handleChange}>
                            {candidates?.map((candidate, index) => (
                                <option value={index}>{candidate?.name}</option>
                            ))}
                        </select>

                        <div>
                            <b>Canidate Name</b>
                            <br/>
                            
                            <input 
                                className="form-control" 
                                placeholder="Name of the candidate"
                                name="name"
                                value={candidateDetail?.name}
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
                                value={candidateDetail?.description}
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