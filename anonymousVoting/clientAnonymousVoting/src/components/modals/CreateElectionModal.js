import { useState } from "react";
import { Flex, Modal, Button, Card } from "rimble-ui";
import DatePicker from "react-datepicker";
import { ethers } from "ethers";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { successtoast, dangertoast } from "../utilities/Toasts";
import { deployVotingProcess, deployTestContract, getTestContract } from '../../web3/contracts'

export function CreateElectionModal(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [ballotType, setBallotType] = useState(1);
  const [resultCalculator, setResultCalculator] = useState(1);
  const [proposals, setProposals] = useState('');

  const [nda, setNda] = useState({
    name: "",
    description: "",
    algorithm: "General",
  });
  const [se, setSe] = useState({
    startTime: parseInt(Date.now() / 1000),
    endTime: parseInt(Date.now() / 1000),
  });

  const handleNdaChange = (e) => {
    const { name, value } = e.target;
    setNda({
      ...nda,
      [name]: value,
    });
  };
const handleTypeChange = (e) => {
  console.log('type',e.target.value);
  if(e.target.value === 'Borda'){
    setBallotType(4);
    setResultCalculator(4);
  }
  if(e.target.value === 'General'){
    setBallotType(1);
    setResultCalculator(1);
  }
  if(e.target.value === 'Oklahoma'){
    setBallotType(2);
    setResultCalculator(1);
  }
  console.log('type',ballotType);
  console.log('type',resultCalculator);
};

  const handleSeChange = (e, type) => {
    console.log(e, Date.now(), Date.parse(e));
    setSe((oldSe) =>
      type === "start"
        ? { ...oldSe, startTime: parseInt(Date.parse(e) / 1000) }
        : { ...oldSe, endTime: parseInt(Date.parse(e) / 1000) }
    );
  };



  const handleSubmitNewElection = async (e) => {
    e.preventDefault();
    let id
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        id  = toast.loading("Processing Your Transaction",{theme: "dark",position: "top-center"})
    
        const result = await deployVotingProcess(nda.name,nda.description,se.startTime,se.endTime);

      
       successtoast(id, "Election Created Successfully")
        
      }
    } catch (err) {
      dangertoast(id, "Election Creation Failed");
      console.log(err);
    }
  };

  const closeModal = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <form>
      <div className="createElectionButton" onClick={openModal}>
        <img
          src="/assets/plus.png"
          alt="+"
          style={{ width: "15px", height: "15px", marginRight: "10px" }}
        />
        Create Election
      </div>

      <Modal isOpen={isOpen}>
        <Card
          width={"90%"}
          height={"max-content"}
          style={{ maxWidth: "600px" }}
          p={0}
        >
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

          <div style={{ margin: "10px", maxWidth: "400px", width: "90%" }}>
            <h4>Create a new election</h4>

            <br />

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

              <div className="">
                    <label className="labels UP_labels">Select Election Type</label>
                    <select
                      onChange={(e) => handleTypeChange(e)}
                      type="text"
                      name="ac"
                      className="form-control"
                      placeholder="select branch"
                    >
                      <option value="General">General</option>
                      <option value="Borda">Borda</option>
                      <option value="Oklahoma">Oklahoma</option>
                      
                    </select>
                  </div>
                  <br/>


                <br/>

              <div style={{ display: "flex" }}>
                <div>
                  <label>Start Date</label>
                  <div>
                    <DatePicker
                      required
                      showTimeSelect
                      dateFormat="yyyy/MM/dd hh:mm:ss"
                      className="form-control"
                      name="startTime"
                      selected={se.startTime * 1000}
                      onChange={(date) => handleSeChange(date, "start")}
                    />
                  </div>
                </div>

                <div style={{ marginLeft: "40px" }}>
                  <label>End Date</label>
                  <div>
                    <DatePicker
                      required
                      showTimeSelect
                      dateFormat="yyyy/MM/dd hh:mm:ss"
                      className="form-control"
                      name="endTime"
                      selected={se.endTime * 1000}
                      onChange={(date) => handleSeChange(date, "end")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Flex px={4} py={3} justifyContent={"flex-end"}>
            <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
            <Button ml={3} type="submit" onClick={handleSubmitNewElection}>
              Confirm
            </Button>
          </Flex>
        </Card>
      </Modal>
    </form>
  );
}
