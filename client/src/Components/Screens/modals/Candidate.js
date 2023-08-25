import { useState } from 'react';
import { Modal, Button, Card } from "rimble-ui";
import { useEffect } from 'react';

import '../../styles/Modal.scss';
import ballot from '../../../build/ballot/Ballot.sol/Ballot.json'
import { ethers } from "ethers";

export function Candidate({name, id, about, voteCount, imageUrl, modalEnabled = false}) {
    const [isOpen, setIsOpen] = useState(false);
    const [votes,setVotes] = useState(0);
    // ballotAddress = "0xAea9A82DF040538a0b84D28384A0eC3004b9892F"
    const closeModal = e => {
        e.preventDefault();
        setIsOpen(false);
    };

    const openModal = e => {
        if(modalEnabled) {
            e.preventDefault();
            setIsOpen(true);
        }
    };
    // const fetchVotes = async (e) => {
    //     try{


    //         const { ethereum } = window;
    // 		if (ethereum) {
    //             const provider = new ethers.providers.Web3Provider(ethereum);
    //             console.log('ba',ballotAddress)
    //             const signer = provider.getSigner();
    //             const ballotContract = new ethers.Contract(
    //                 ballotAddress,
    //                 ballot.abi,
    //                 signer
    //                 );
                    
    //             let cvotes = await ballotContract.getVoteCount(Number(id),1);
    //             setVotes(Number(cvotes._hex))
                
    //             }
    //         }catch(err){
    //             console.log(err)
    //         }
    //     }

        // useEffect(() => {
        //     fetchVotes()
        // },[]);
                
                
                
        const CandidateButton = () => {
        return (
            <div style={{display: "flex", marginBottom: "20px", cursor: "pointer"}} onClick={openModal}>
                <img src={imageUrl} style={{width: "40px", height: "40px", borderRadius: "25px"}} alt="profile-pic"/>
                
                <div style={{marginLeft: "10px", marginTop: "6px"}}>
                    <font size="3">{name}</font>
                    {/* <font size="2" className="text-muted"> ({votes} votes)</font> */}
                    
            

                    
                    <font size="2" className="text-muted">#{id}</font>
                </div>
            </div>
        )
    }

    return (
        <div>
            <CandidateButton />
            
            <Modal isOpen={isOpen}>
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

                        <br/>

                        <div>
                            <Candidate name={name} id={id} voteCount={voteCount} imageUrl={imageUrl}/>

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
            </Modal>
        </div>
    );
}