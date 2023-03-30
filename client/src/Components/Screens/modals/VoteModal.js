import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionABI from '../../../build/Election.sol/Election.json'

import '../../styles/Modal.scss';

import { AVATARS, STATUS } from '../../constants';

export function VoteModal({Candidate, status, candidates, CurrentElection, account,contractAddress,ballotAddress}) {
    const [isOpen, setIsOpen] = useState(false);
    const [candidateId, setCandidateId] = useState(null);
    const [voteCount, setVoteCount] = useState([]);
    

    // console.log('cand',candidates.length)
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
              console.log(CurrentElection)
            
            
            
            console.log('voting')
            // window.toastProvider.addMessage("Processing your voting request.", {
            //     variant: "processing"
            // })
            console.log(CurrentElection)
            console.log('addr',addr)
            console.log('candidateId',candidateId)
            // let temp = [3,2,1];
            console.log('arr',voteCount)


            let res  =await CurrentElection.vote(addr,1,4,voteCount);
            // console.log('res',res);
            // window.toastProvider.addMessage("Voted", {
            //     secondaryMessage: "You have successfully voted! Thank you.",
            //     variant: "success"
            // });
            console.log('you have succesfully voted ')
            setCandidateId(null);
            setIsOpen(false);
        }
        } catch(err) {
            // window.toastProvider.addMessage("Failed", {
            //     secondaryMessage: "Transaction failed. Try again",
            //     variant: "failure"
            // });
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
                <div className="voteButton voteButtonDisabled">
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

                    <div style={{margin: "10px", maxWidth: "700px", width: "90%"}}>
                        {/* <h5>Choose candidates according to your preferences</h5> */}
                        <h5>Enter Preference order of candidates</h5>


                        <br/>

                        <div>
                            <b>1st Preference</b>
                            <br/><br/>

                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between"}}>
                                {
                                    candidates?.map((candidate) => (
                                        <label className="voteCandidate" >
                                            {/* <input type="radio" name="candidate" value={candidate?.candidateID} onChange={handleCandidateIdChange} className="voteCandiateInput"/> */}
                                            <input type="number" name={candidate?.candidateID} onChange={(e)=>handleVoteChange(e)}/>
                                            <Candidate name={candidate?.name} id={Number(candidate?.candidateID._hex)} about={candidate?.about} voteCount={candidate?.voteCount} ballotAddress={ballotAddress} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}/> 
                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-end"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={handleVoteSubmit}>Confirm</Button>
                    </Flex>                
                </Card>
            </Modal>
        </div>
    )
}