import ReactStars from 'react-stars'
import React from 'react'
import { render } from 'react-dom'
import { useState } from 'react';
import { Flex, Modal, Button, Card, ToastMessage } from "rimble-ui";
import '../../styles/Modal.scss';
import { AVATARS, STATUS } from '../../constants';
import { ethers } from 'ethers';
import ElectionABI from '../../../build/Election.sol/Election.json'

export function OklahomaModal({ Candidate, status, candidates, CurrentElection, account,contractAddress,ballotAddress  }) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateId, setCandidateId] = useState(null);
    const [id,setId]=useState(null);
    const [val,setValue] = useState(0);

    const closeModal = e => {
        e.preventDefault();
        setIsOpen(false);
    };
    
    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
        console.log('Candidates',candidates)
    };


    const handleVoteSubmit = async (e) => {
        e.preventDefault();
        // setIsOpen(false);
        console.log(e.target)
        console.log('hellooo')
        try {

            const { ethereum } = window;
            if (ethereum) {
              const provider = new ethers.providers.Web3Provider(ethereum);
              const signer = provider.getSigner();
              const addr = await signer.getAddress();
              const CurrentElection = new ethers.Contract(
                contractAddress,
                ElectionABI.abi,
                signer
              );
              console.log('candidateId',candidateId)
                console.log('id',id)
                console.log('val',val)
                let temp;
                if(val===5){
                    temp =1;
                }
                else if(val===4){
                    temp =2;
                }
                else if(val===3){
                    temp =3;
                }
                else if(val===2){
                    temp =4;
                }
                else if(val===1){
                    temp =5;
                }

                // the order is reversed because in the logic of oklahoma the candidates votes gets divided by priority every time
                // so the higher stars the lower priority in contract logic so to make it more intuitive we reversed the order
              let res  =await CurrentElection.vote(addr,id,temp,[]);
              console.log('res',res);

            //   console.log(CurrentElection)
              }

            setCandidateId(null);
            // setIsOpen(false);
        } catch (err) {
           console.log(err);
        }
    }
    let detail;


    return (
        <div>
            {
                status == STATUS.ACTIVE 
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
                <Card width={"90%"} height={"80%"} p={0} style={{ maxWidth: "700px", borderRadius: "5px" }}>
                    <Button.Text
                        style={{ margin: "0px" }}
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

                    <div style={{ margin: "10px", maxWidth: "700px", width: "90%" }}>
                        <h5>Choose candidates according to your preferences</h5>

                        <br />

                        <div>
                            <b>1st Preference</b>
                            <br /><br />

                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                                {
                                    candidates?.map((candidate) => (
                                        <div className="voteCandidate">
                                            
                                            <Candidate name={candidate?.name} id={candidate?.id} about={candidate?.about} voteCount={candidate?.voteCount} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'} />
                                            <div >
                                               

                                            <ReactStars onClick={()=>{}}
                                            className="voteCandiateInput"
                                            count={5}
                                            onChange={(newValue) => {
                                                 
                                                    setValue(newValue);
                                                    setId(Number(candidate?.candidateID?._hex));
                                                  }}
                                                size={24}
                                                color2={'#ffd700'}
                                                value={0}
                                                half={false} ></ReactStars>
                                                </div>
                                                
                                                <div>
                                            <Button.Outline ml={3} type="submit" onClick={(e)=>(handleVoteSubmit(e))}>Confirm</Button.Outline>
                                               
                                             </div>:
                                            <p></p>  
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                  
                    
                </Card>
            </Modal>
        </div>
    );
}

// export default OklahomaModal;