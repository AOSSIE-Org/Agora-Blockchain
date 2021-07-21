import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function CreateElectionModal({ UserContract, account }) {
    const [isOpen, setIsOpen] = useState(false);

    const [nda, setNda] = useState({
        name: "",
        description: "",
        algorithm: "General"
    });

    const [se, setSe] = useState({
        startTime: Date.now(),
        endTime: Date.now()
    });

    const handleNdaChange = (e) => {
        const { name, value } = e.target;
        setNda({
            ...nda,
            [name]: value
        });
    }

    const handleSeChange = (e, type) => {
        setSe(oldSe => (
            type === "start"
            ?
            {...oldSe, startTime: Date.parse(e)}
            :
            {...oldSe, endTime: Date.parse(e)}
        ));
    }

    const handleSubmitNewElection = async (e) => {
        e.preventDefault();
        try{
            await UserContract.createElection([nda.name, nda.description, nda.algorithm], [se.startTime, se.endTime]).send({from: account})
            setNda({
                name: "",
                description: "",
                algorithm: ""
            });
            setSe({
                startTime: Date.now(),
                endTime: Date.now()
            });
            setIsOpen(false);
        } catch {
            alert("Transaction failed")
        }
    }
  
    const closeModal = e => {
      e.preventDefault();
      setIsOpen(false);
    };
  
    const openModal = e => {
      e.preventDefault();
      setIsOpen(true);
    };
  
    return (
        <form>
            <div className="createElectionButton" onClick={openModal}>
                <img src="/assets/plus.png" alt="+" style={{width: "15px", height: "15px", marginRight: "10px"}}/>
                Create Election
            </div>
            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"max-content"} style={{maxWidth: "600px"}} p={0}>
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

                    <div style={{margin: "10px", maxWidth: "400px", width: "90%"}}>
                        <h4>Create a new election</h4>

                        <br/>

                        <div>
                            <label className="form-label">Election title</label>
                            <input 
                                className="form-control" 
                                placeholder="Add a suitable title for election"
                                name="name"
                                value={nda.name}
                                onChange={handleNdaChange}
                            />
                            <br />

                            <label className="form-label">Election description</label>
                            <textarea
                                rows="4" 
                                className="form-control" 
                                placeholder="Describe your election"
                                name="description"
                                value={nda.description}
                                onChange={handleNdaChange}
                            />
                            <br />

                            <div style={{display: "flex"}}>
                                <div>
                                    <label>Start Date</label>
                                    <div>
                                        <DatePicker
                                            required
                                            showTimeSelect
                                            dateFormat="yyyy/MM/dd hh:mm:ss"
                                            className = "form-control"
                                            name = "startTime"
                                            selected = {se.startTime}
                                            onChange = {(date) => handleSeChange(date, "start")}
                                        />
                                    </div>
                                </div>
                                
                                <div style={{marginLeft: "40px"}}>
                                    <label>End Date</label>
                                    <div>
                                        <DatePicker
                                            required
                                            showTimeSelect
                                            dateFormat="yyyy/MM/dd hh:mm:ss"
                                            className = "form-control"
                                            name = "endTime"
                                            selected = {se.endTime}
                                            onChange = {(date) => handleSeChange(date, "end")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <Flex
                        px={4}
                        py={3}
                        justifyContent={"flex-end"}
                    >
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button ml={3} type="submit" onClick={handleSubmitNewElection}>Confirm</Button>
                    </Flex>
                </Card>
            </Modal>
        </form>
    );
  }

export default CreateElectionModal;