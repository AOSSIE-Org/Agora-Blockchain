import Modal from 'react-bootstrap/Modal';
import Collapse from 'react-bootstrap/Collapse';
import Spinner from 'react-bootstrap/Spinner';
import styles from './CreateProcessPage.module.css';
import {ethers} from 'ethers';

//web3 imports
import { deployVotingProcess, deployTestContract, getTestContract } from '../web3/contracts'
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';



const CreateProcess = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [proposals, setProposals] = useState('');
    const [pending, setPending] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        navigate('/');
    }
    const [open, setOpen] = useState(false);
    const [transactionResult, setTransactionResult] = useState(null);

    const refValue = useRef(false);
    
    const createProcess = async (e) => {
        e.preventDefault();
        console.log("name: ", name);
        //format proposals
        let proposalArray = formatProposals(proposals);
        //check form inputs
        if(!isFormValid()){
            window.alert("Form is not valid");
            return;
        }
        setPending(true);
        refValue.current = true;
        //deploy new process contract
        const result = await deployVotingProcess(name, description, proposalArray,1000000,1000000);
        setTransactionResult(result);

        refValue.current = false;
        setPending(false);
        
        setShow(true);
    }

    const isFormValid = () => {
        if(proposals < 2)
            return false;
        return true;
    }

    const formatProposals = (input) => {
        let proposals = input.split(',');
        let array = []
        for(let i=0; i < proposals.length; i ++){
            array.push(ethers.utils.toUtf8Bytes(proposals[i].trim()));
        }
        return array;
    }


    useEffect(() => {
        // setPending(!pending);
    }, [pending])

    return (  
        <div >
            <div className={styles.createProcess}>
                <h1>Create new voting process</h1>
            </div>
            <form onSubmit={createProcess} className={styles.create}>
                <div>
                    <label>Process name:</label>
                    <input 
                        type="text"
                        required
                        value = {name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Process description:</label>
                    <input 
                        type="text"
                        required
                        value = {description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Proposals (separated with ","):</label>
                    <input 
                        type="text"
                        required
                        value = {proposals}
                        onChange={(e) => setProposals(e.target.value)}
                    />
                </div>
                <div>
                    <button className="baseButton">Create new process</button>
                </div>
                {refValue.current == true && <div style={{marginTop: "2em"}}>
                    <Spinner animation="border" />
                </div>}
            </form>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Transaction result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Transaction was executed.
                    </p>
                    <button
                        className="baseButton"
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                    >
                        Transaction details
                    </button>
                    { transactionResult && <Collapse in={open}>
                        <div id="example-collapse-text" className={styles.collapse}>
                            <div>
                                <h4>transaction hash: </h4>
                                <p>{transactionResult.hash}</p>
                            </div>
                            <div>
                                <h4>nonce: </h4>
                                <p>{transactionResult.nonce}</p>
                            </div>
                        </div>
                    </Collapse>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="baseButton" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
 
export default CreateProcess;