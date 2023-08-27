import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionABI from '../../../build/Election.sol/Election.json'

import '../../styles/Modal.scss';

import { AVATARS, STATUS } from '../../constants';

export function BordaModal({Candidate, status, candidates, CurrentElection, account,contractAddress,ballotAddress}) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateId, setCandidateId] = useState(null);
    const [voteCount, setVoteCount] = useState([]);
    

    let arr = new Array(candidates.length);

    const closeModal = e => {
        e.preventDefault();
        setIsOpen(false);
    };

    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };

    const handleCandidateIdChange = (e) => {
        setCandidateId(e.target.value);
    }
    const handleVoteChange = (e) => {
        console.log('value',e.target.value);
        console.log('cid',typeof(Number(e.target.name)))
        let temp  = voteCount;
        temp[Number(e.target.name)-1001] = Number(e.target.value);
        setVoteCount(temp);
        console.log('arr',arr)
    }

    const handleVoteSubmit = async (e) => {
        e.preventDefault();
        setIsOpen(false);
        
        try{
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
            

            let res  =await CurrentElection.vote(addr,1,4,voteCount);
            console.log('you have succesfully voted ')
            setCandidateId(null);
            setIsOpen(false);
        }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {
                status === STATUS.ACTIVE
                ?
                <div className="voteButton" onClick={openModal}>
                    VOTE
                </div>
                :
                <div className="voteButton voteButtonDisabled" onClick={() => {console.log("Election is not started yet")}}>
                    VOTE
                </div>
            }
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
                        <h3 style={{textAlign:"center" ,paddingTop:"24px" ,fontWeight:"bold" , fontFamily:"monospace"}}>Enter Rank of candidates</h3>


                        <br/>

                        <div>
                           

                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
                                {
                                    candidates?.map((candidate) => (
                                            <div className='card' style={{display:"flex", marginLeft:"1%",marginRight:"1%",marginBottom:"2%",padding:"6%"}}>
                                            <Candidate name={candidate?.name} id={Number(candidate?.candidateID._hex)} about={candidate?.about} voteCount={candidate?.voteCount} ballotAddress={ballotAddress} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}/> 
                                            <input type="number" className='' placeholder="Rank.." id="borda_input" name={candidate?.candidateID}  onChange={(e)=>handleVoteChange(e)}/>
                                            </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-start"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={handleVoteSubmit}>Confirm</Button>
                    </Flex>                
                </Card>
            </Modal>
        </div>
    )
}