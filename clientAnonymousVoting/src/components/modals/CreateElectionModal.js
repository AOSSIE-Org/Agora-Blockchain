import { useState } from "react";
import { Flex, Modal, Button, Card } from "rimble-ui";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dangertoast } from "../utilities/Toasts";
import { createVotingProcess } from "../../web3/contracts";
import "../styles/Modal.scss"

export function CreateElectionModal(props) {
  const [isOpen, setIsOpen] = useState(false);

  const [nda, setNda] = useState({
    name: "",
    description: "",
    algorithm: "",
  });
  const [se, setSe] = useState({
		startTime: new Date(),
		endTime: new Date(),
	});


  const handleNdaChange = (e) => {
    const { name, value } = e.target;
    setNda({
      ...nda,
      [name]: value,
    });
  };


  const handleSeChange = (e, type) => {
		console.log(e, Date.now(), Date.parse(e));
		setSe((oldSe) =>
			type === "start"
				? { ...oldSe, startTime: e }
				: { ...oldSe, endTime: e }
		);
	};





  const handleSubmitNewElection = async (e) => {
    e.preventDefault();
    let id
    try {
      await createVotingProcess(nda.name, nda.description, Date.parse(se.startTime)/1000,Date.parse(se.endTime)/1000);
      setIsOpen(false);
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
    
      <form >
        <div className="createElectionButton" onClick={openModal}>
          <img
            src="/assets/plus.png"
            alt="+"
            style={{
              width: "15px",
              height: "15px",
              marginRight: "10px",
            }}
          />
          Create Election
        </div>

        <Modal isOpen={isOpen}>
          <Card
            width={"90%"}
            height={"max-content"}
            style={{ maxWidth: "600px" }}
            p={20}
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

            <div className="createHolder">
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

                <label className="form-label">
                  Election description
                </label>
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="Describe your election"
                  name="description"
                  value={nda.description}
                  onChange={handleNdaChange}
                />
                <br />
                <label className="form-label">Election type</label>
                <select
                  className="form-control"
                  name="algorithm"
                  value={nda.algorithm}
                  onChange={handleNdaChange}
                >
                  <option value="">Select election type...</option>
                  <option value="general">
                    General elections
                  </option>
                  <option value="oklahoma">
                    Oklahoma election
                  </option>
                  <option value="range">Range election</option>
                </select>
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
											selected={se.startTime}
											onChange={(date) =>
												handleSeChange(date, "start")
											}
											minDate={new Date()}
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
											selected={se.endTime}
											onChange={(date) =>
												handleSeChange(date, "end")
											}
											minDate={new Date()}
										/>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Flex px={4} py={4} justifyContent={"space-around"}>
              <Button.Outline onClick={closeModal}>
                Cancel
              </Button.Outline>
              <Button
                ml={3}
                type="submit"
                onClick={handleSubmitNewElection}
              >
                Confirm
              </Button>
            </Flex>
          </Card>
        </Modal>
      </form>
  );
}
