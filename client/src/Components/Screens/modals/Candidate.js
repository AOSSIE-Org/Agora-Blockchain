import { useState } from 'react';
import { Modal, Button, Card, Flex } from "rimble-ui";

import '../../styles/Modal.scss';
import { ethers } from "ethers";
import ElectionOrganizer from '../../../build/ElectionOrganizer.json';
import { CONTRACTADDRESS } from '../../constants';

export function Candidate({name, id, about, imageUrl, index, electionAddress, functionCall}) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateDetail, setCandidateDetail] = useState({cid : id, name : name, description : about, index : index})
    const [isUpdateCandidateModalOpen, setIsUpdateCandidateModalOpen] = useState(false);

    const closeModal = async () => {
        setIsOpen(false);
    };

    const openModal = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }; 
    
    const handleSubmitCandidateUpdate = async (e) => {
        e.preventDefault();
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const orgContract = new ethers.Contract(
                    CONTRACTADDRESS,
                    ElectionOrganizer.abi,
                    signer
                );
                const transaction = await orgContract.updateCandidateInfo(electionAddress, candidateDetail.name, candidateDetail.description, candidateDetail.index);
                await transaction.wait();

                console.log(`Successfully update the candidate, id - ${id}`);
                closeModal();       
                setIsUpdateCandidateModalOpen(false);
                await functionCall();
            }
          } catch(err) {
            console.log(err);
          }
    }
                
    const CandidateButton = () => {
        return (
            <div style={{display: "flex", marginBottom: "20px", cursor: "pointer"}} onClick={openModal}>
                <img src={imageUrl} style={{width: "40px", height: "40px", borderRadius: "25px"}} alt="profile-pic"/>
                <div style={{marginLeft: "10px", marginTop: "6px"}}>
                    <font style={{margin:5}} size="3">{name}</font>                    
                    <font size="2" className="text-muted">#{id}</font>
                </div>
            </div>
        )
    }

    const handleCandidateDetailChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setCandidateDetail({
            ...candidateDetail,
            [name]: value
        });
    }
    return (
        <div>
            <CandidateButton />
            
            <Modal isOpen={isOpen}>
                {/* here first card is for to display the candidate and second card for to update the candidate */}
                {isUpdateCandidateModalOpen === false ?  
                    <Card width={"90%"} height={"80%"} p={0} style={{maxWidth: "600px"}}>
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

                        <div style={{margin: "10px", width: "100%"}}>
                            <h5>About the candidate</h5>
                            <div style={{ display: "flex" }}>
                                <Button.Outline style={{marginLeft:'auto', marginRight:20}} onClick={() => {setIsUpdateCandidateModalOpen(!isUpdateCandidateModalOpen)}} ml={5}>Update Candidate </Button.Outline>
                            </div>

                            <br/><br/>

                            <div>
                                <Candidate name={name} id={id}  imageUrl={imageUrl}/>
                                <div style={{textAlign: "justify", width: "95%", overflowY: "scroll"}}>
                                    <font size="2">
                                        {
                                            about ||
                                            <>
                                                <p>
                                                    Hi, I am Raj Ranjan and I am standing for the Presidential elections.
                                                </p>
                                                <p>
                                                    Elections have been the usual mechanism by which modern representative democracy has operated since the 17th century. Elections may fill offices in the legislature, sometimes in the executive and judiciary, and for regional and local government. This process is also used in many other private and business organisations, from clubs to voluntary associations and corporations.
                                                </p>
                                                <p>
                                                    The universal use of elections as a tool for selecting representatives in modern representative democracies is in contrast with the practice in the democratic archetype, ancient Athens, where the Elections were not used were considered an oligarchic institution and most political offices were filled using sortition, also known as allotment, by which officeholders were chosen by lot.
                                                </p>
                                            </>
                                        }
                                    </font>
                                </div>
                            </div>
                        </div>
            
                        <div className="modalButtons">
                            <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                            <Button ml={3}>Confirm</Button>
                        </div>                    
                    </Card>
                :
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
                            <h5>Update candidates</h5>

                            <br/>

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
                            <Button ml={3} type="submit" onClick={handleSubmitCandidateUpdate}>Confirm</Button>
                        </Flex>
                    </Card>
                }
            </Modal>
        </div>
    );
}