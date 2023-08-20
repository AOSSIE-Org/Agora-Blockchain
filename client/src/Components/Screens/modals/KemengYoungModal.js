import { useState, useEffect} from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionABI from '../../../build/Election.sol/Election.json'

import '../../styles/Modal.scss';

import { AVATARS, STATUS } from '../../constants';

export function KemengYoungModal ({Candidate, status, candidates, CurrentElection, account,contractAddress,ballotAddress}) {
            const [isOpen, setIsOpen] = useState(false);
            const [options, setoptions] = useState([]);
            const [preference, setpreference] = useState([]);
            
        
            let arr = new Array(candidates.length);
        
            const closeModal = e => {
                e.preventDefault();
                setIsOpen(false);
            };
        
            const openModal = e => {
                e.preventDefault();
                setIsOpen(true);
            };
        
            function arraymove(arr, fromIndex, toIndex) {
                const arrCopy = [...arr];
                var element = arrCopy[fromIndex];
                arrCopy.splice(fromIndex, 1);
                arrCopy.splice(toIndex, 0, element);
              
                return arrCopy;
              }
            function MoveUp(index) {
                if (index === 0) return;
            
                let updatedArray = arraymove(options, index, index - 1);
                setoptions(updatedArray);
                updatedArray = arraymove(preference, index, index - 1);
                setpreference(updatedArray);
             }
            
              function MoveDown(index) {
                if (index === options.length - 1) return;
            
                let updatedArray = arraymove(options, index, index + 1);
                setoptions(updatedArray);
                updatedArray = arraymove(preference, index, index + 1);
                setpreference(updatedArray);
              }
            
            const handleVoteSubmit = async (e) => {
                if(candidates.length == 0) throw  "No candidate is added"
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
                                        
                    let res  =await CurrentElection.vote(addr,1,4,preference);
                    console.log('you have succesfully voted ')
                    setIsOpen(false);
                }
                } catch(err) {
                    console.log(err)
                }
            }
        
            useEffect(() => {
                if(options.length === 0){
                    setoptions(candidates);
                }
                if(preference.length === 0){        
                    let arr = [];
                    for(let i=0; i<candidates.length; i++){
                        arr.push(i);
                    }
                    setpreference(arr);
                }
            }, [])
            
        
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
                                {/* <h5>Choose candidates according to your preferences</h5> */}
                                <h3 style={{textAlign:"center" ,paddingTop:"24px" ,fontWeight:"bold" , fontFamily:"monospace"}}>Give Preference to candidates</h3>
                                <p style={{textAlign:"center"}}>Move up/down the card to give preference</p>
        
        
        
                                {candidates.length === 0 ? 
                                    <div>
                                        <br /><br /><br /><br /><br />
                                        <h2 style={{textAlign:"center", color:"red"}}>Warning : No candidate is added</h2>
                                        <br /><br /><br /><br /><br /><br />
                                    </div>
                                    :
                                    <div>
                                        <br/>     
                                        <div>                       
                                            <div style={{display: "flex", flexWrap: "wrap", overflow:"scroll", height:"300px"}}>
                                                {
                                                    options?.map((candidate, index) => (                                 
                                                        <div className='card' style={{width:"30%", marginLeft:"1%",marginRight:"1%",marginBottom:"2%",padding:"6%"}}>
                                                            <Candidate name={candidate?.name} id={Number(candidate?.candidateID._hex)} about={candidate?.about} voteCount={candidate?.voteCount} ballotAddress={ballotAddress} imageUrl={AVATARS[candidate?.id % AVATARS?.length] || '/assets/avatar.png'}/> 
                                                            {/* <input type="number" className='' placeholder="Rank.." id="borda_input" name={candidate?.candidateID}  onChange={(e)=>handleVoteChange(e)}/> */}
                                                            <button style={{borderRadius:"15px", height:"30px", width: "101px", margin:"5px", textAlign:"center"}} onClick={() => MoveUp(index)}>Move Up</button>
                                                            <button style={{borderRadius:"15px", height:"30px", width: "101px", margin:"5px", textAlign:"center"}} onClick={() => MoveDown(index)}>Move Down</button>
                                                        </div>
                                                        
                                                    ))
                                                }
                                            </div>
                                        </div>
                                </div>
                                }
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