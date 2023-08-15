import { useState, useEffect} from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionOrganizerABI from '../../../build/ElectionOrganizer.json'

import '../../styles/Modal.scss';

import { AVATARS, STATUS } from '../../constants';
import {CONTRACTADDRESS} from '../../constants'


export function InviteOrganizer () {
    const contractAddress = CONTRACTADDRESS;
    const [isOpen, setIsOpen] = useState(false);      
    const openModal = () => {
        setIsOpen(true);
    } 
    const closeModal = () => {
        setIsOpen(false);
    } 
    const getOrganizer = async () => {
        try {           
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const dashboardContract = new ethers.Contract(
                    contractAddress,
                    ElectionOrganizerABI.abi,
                    signer
                );

                console.log("djfron");                
                console.log(dashboardContract);
                const data = await dashboardContract.getElectionOrganizerByAddress("0x8fb3A7eCAc20e160a400D2b399933c941863938C");
                console.log(data);
                console.log(await dashboardContract.getElectionOrganizers());
            }
        } catch (error) {
            console.log("error");
            console.log(error);
            
        }
    }
    useEffect (() => {
        getOrganizer()
    }, [])
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
                        <h3 style={{textAlign:"center" ,paddingTop:"24px" ,fontWeight:"bold" , fontFamily:"monospace"}}>Invite Organizer to election</h3>
                    </div>

                    <button onClick={getOrganizer}>click me</button>

                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-start"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={() => {console.log('clicked confirm from invite');}}>Confirm</Button>
                    </Flex>                
                </Card>
            </Modal>
        </div>
    )
}