import { useState, useEffect} from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionOrganizerABI from '../../../build/ElectionOrganizer.json'

import '../../styles/Modal.scss';

import { AVATARS, STATUS } from '../../constants';
import {CONTRACTADDRESS} from '../../constants'


export function InviteOrganizer ({organizerAddress, electionAddress}) {
    const contractAddress = CONTRACTADDRESS;
    const [isOpen, setIsOpen] = useState(false);  
    const [inputAddress, setInputAddress] = useState('');    
    const openModal = () => {
        setIsOpen(true);
    } 
    const closeModal = () => {
        setIsOpen(false);
    } 

    const handleChange = (e) => {
        e.preventDefault();
        setInputAddress(e.target.value);
        console.log(e.target.value);
    }

    const handleSubmit = async () => {
        try {           
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const organizerContract = new ethers.Contract(
                    contractAddress,
                    ElectionOrganizerABI.abi,
                    signer
                );
                console.log("Election Address - ",electionAddress);
                const data = await organizerContract.addOrganizerToInviteBasedElection(inputAddress, electionAddress);
                console.log(data);
                closeModal();
            }
        } catch (error) {
            console.log(error);
        }

    } 
    return (
        <div>
            <div className="voteButton" onClick={openModal}>
                Invite
            </div>

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

                    <div style={{margin: "10px", maxWidth: "700px", width: "96%"}}>
                        <h3 style={{textAlign:"center" ,paddingTop:"24px" ,fontWeight:"bold" , fontFamily:"monospace"}}>Invite Voter to election</h3>

                    <br />
                    <br />
                    <br />

                    <div style={{textAlign:'left', margin:50}}>
                        <h6>Voter Public Address</h6> <br />
                        <input style={{borderRadius:5, textAlign:'center', boxSizing:'border-box'}} placeholder='Public Address' onChange={handleChange}>{}</input>
                    </div>
                    </div>


                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-start"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={handleSubmit}>Add Voter to Election</Button>
                    </Flex>                
                </Card>
            </Modal>
        </div>
    )
}