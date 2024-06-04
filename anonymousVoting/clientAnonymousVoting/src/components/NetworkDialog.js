import Modal from 'react-bootstrap/Modal';

const NetworkDialog = () => {
    return (  
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Network details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Transaction was executed.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
 
export default NetworkDialog;