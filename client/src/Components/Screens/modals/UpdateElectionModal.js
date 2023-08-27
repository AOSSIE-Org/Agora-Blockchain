import { useState } from "react";
import { Flex, Modal, Button, Card } from "rimble-ui";
import DatePicker from "react-datepicker";
import { ethers } from "ethers";
import ElectionABI from '../../../build/Election.json'

export function UpdateElectionModal({contractAddress, electionDetails, functionCall}) {
  const [isOpen, setIsOpen] = useState(false);  
  const [nda, setNda] = useState({
    name: electionDetails?.name,
    description: electionDetails?.description,
  });
  const [se, setSe] = useState({
    startTime: parseInt(electionDetails.startDate),
    endTime: parseInt(electionDetails.endDate),
  });

  const handleNdaChange = (e) => {
    const { name, value } = e.target;
    setNda({
      ...nda,
      [name]: value,
    });
    console.log(nda); 
  };


  const handleSeChange = (e, type) => {
    console.log(e, Date.now(), parseInt(Date.parse(e)));
    setSe((oldSe) =>
      type === "start"
        ? { ...oldSe, startTime: parseInt(Date.parse(e) / 1000) }
        : { ...oldSe, endTime: parseInt(Date.parse(e) / 1000) }
    );
    console.log(se)
  };

  const handleSubmitNewElection = async (e) => {
    e.preventDefault();
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        console.log(signer);
        const contract = new ethers.Contract(
          contractAddress,
          ElectionABI.abi,
          signer
          );
          console.log(contract);

        
        let currElectionDetail = [Number(electionDetails.electionID), 
          nda?.name || electionDetails.name,
          nda?.description || electionDetails.description,
          se?.startTime || electionDetails.startDate,
          se?.endTime || electionDetails.endDate,]

        const transaction = await contract.updateElectionInfo(currElectionDetail);
        await transaction.wait();

        console.log("suceessss", currElectionDetail); 
        closeModal();
        functionCall();     
      }
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <form>
      <div className="voteButton" onClick={openModal}>
        Update 
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
            <h4>Update existing election</h4>

            <br />

            <div>
              <label className="form-label">Election title</label>
              <input
                className="form-control"
                placeholder="Add a suitable title for election"
                name="name"
                defaultValue={electionDetails?.name}
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
                defaultValue={electionDetails?.description}
                value={nda.description}
                onChange={handleNdaChange}
              />
              <br />



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
                      // selected={se.startTime * 1000}
                      selected={se.startTime*1000 || electionDetails.startDate * 1000}
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
                      selected={se.endTime*1000 || electionDetails.endDate * 1000}
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
