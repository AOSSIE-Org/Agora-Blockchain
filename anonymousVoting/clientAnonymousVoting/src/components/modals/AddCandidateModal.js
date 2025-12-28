import { useState } from 'react';
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import ElectionOrganiser from "../../build/ElectionOrganizer.json";
import { successtoast, dangertoast } from '../utilities/Toasts';
import { toast } from "react-toastify";
import { addProposal } from '../../web3/contracts';

export function AddCandidateModal({ electionId }) {
    const [isOpen, setIsOpen] = useState(false);

    const [candidateDetail, setCandidateDetail] = useState({
        name: '',
        description: ''
    });

    // ADDED: terms acceptance state
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleCandidateDetailChange = (e) => {
        const { name, value } = e.target;
        setCandidateDetail({
            ...candidateDetail,
            [name]: value
        });
    };

    const handleSubmitCandidate = async (e) => {
        e.preventDefault();

        // Enforce terms acceptance
        if (!acceptedTerms) {
            toast.error("You must accept the Terms & Conditions");
            return;
        }

        try {
            let tx = await addProposal(
                electionId,
                ethers.utils.toUtf8Bytes(candidateDetail.name.trim())
            );

            await tx.wait();
            console.log(tx);

            // successtoast("Candidate Added Successfully")
            setIsOpen(false);
            setAcceptedTerms(false);
        } catch (err) {
            dangertoast("Candidate Addition Failed");
            console.log(err);
        }
    };

    const closeModal = e => {
        e.preventDefault();
        setIsOpen(false);
        setAcceptedTerms(false);
    };

    const openModal = e => {
        e.preventDefault();
        setIsOpen(true);
    };

    return (
        <div>
            <div onClick={openModal} style={{ cursor: "pointer" }}>
                <font size='2'>Add Candidate</font>
            </div>

            <Modal isOpen={isOpen}>
                <Card width={"90%"} height={"max-content"} p={0} style={{ maxWidth: "500px" }}>
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
                        <h5>Add candidates</h5>
                        <br />

                        <div>
                            <b>Candidate Name</b>
                            <br />

                            <input
                                className="form-control"
                                placeholder="Name of the candidate"
                                name="name"
                                value={candidateDetail.name}
                                onChange={handleCandidateDetailChange}
                                style={{ marginTop: "15px" }}
                            />
                            <br /><br />

                            <b>Candidate Description</b>
                            <br />

                            <textarea
                                className="form-control"
                                placeholder="Description of the candidate"
                                name="description"
                                rows={6}
                                value={candidateDetail.description}
                                onChange={handleCandidateDetailChange}
                                style={{ marginTop: "15px" }}
                            />

                            <br /><br />

                            <div>
                                <label style={{ cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        style={{ marginRight: "8px" }}
                                    />
                                    I accept the Terms & Conditions
                                </label>
                            </div>
                        </div>
                    </div>

                    <Flex px={4} py={3} justifyContent={"flex-end"}>
                        <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                        <Button
                            ml={3}
                            type="submit"
                            onClick={handleSubmitCandidate}
                            disabled={!acceptedTerms}
                        >
                            Confirm
                        </Button>
                    </Flex>
                </Card>
            </Modal>
        </div>
    );
}
