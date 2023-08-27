import { useState } from 'react';
import { Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { Oval } from 'react-loader-spinner';
import ElectionOrganizer from '../../../build/ElectionOrganizer.json';

export function DeleteModal({orgnizerAddress, electionAddress}) {
  const [showLoader, setShowLoader] = useState(false);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const closeModal = e => {
      setIsOpen(false);
    };
    
    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };
    
    const handleClick = () => {
      setShowLoader(true);
    };

    const handleDelete = async () => {
        try {            
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const electionOrgContract = new ethers.Contract(
                    orgnizerAddress,
                    ElectionOrganizer.abi,
                    signer
                    );
                const overrides = {
                    gasLimit: 8000000 // Specify the gas limit here
                };
                
                await electionOrgContract.deleteElection(electionAddress).then((data) => {
                    console.log(data);
                })

                handleClick();
                
                setTimeout(async () => {
                    const redirect = async () => {
                        closeModal();
                        setShowLoader(false);
                        navigate('/dashboard');   
                    }
                    await redirect();
                }, 15000);
                }
                } catch (error) {
                    console.log(error)
                }
            }
            
            return (
                <div>
            <div className="voteButton deleteButton" style={{marginLeft:"15%"}} onClick={openModal}>
                DELETE
            </div>

            <Modal isOpen={isOpen}>
                {showLoader ? 
                    <div>
                        <div style={{marginLeft:90}}>
                            <Oval
                                ariaLabel="loading-indicator"
                                height={100}
                                width={100}
                                strokeWidth={5}
                                strokeWidthSecondary={1}
                                color="blue"
                                secondaryColor="white"
                            /> 
                        </div>
                        <br />
                        <br />
                        <div>
                            <span style={{color:'white'}}>Redirecting to dashboard in 15 seconds...</span>
                        </div>
                    </div>
                    :
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
                            <Button ml={3} onClick={handleDelete}>Confirm</Button>
                        </div> 
                    </Card>
                }
            </Modal>
        </div>
    );
}