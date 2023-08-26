import '../styles/Navbar.scss';
import { useState } from "react";
import { Flex, Modal, Button, Card } from "rimble-ui";
import { ethers } from "ethers";
import Authentication from "../../build/Authentication.json";
import { CONTRACTADDRESS } from '../constants'
import { useNavigate } from "react-router-dom";


function Navbar({header, infoText, pictureUrl, address}) {
    console.log('Addredd - ', address);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }
    
    const logout = async () => {
        localStorage.setItem(address, null);
        setTimeout(async () => {
            const redirect = async () => {
                closeModal();
                navigate('/');   
            }
            await redirect();
        }, 1000);
    }

	return (
        <nav className="shadow-sm">
            <div className="navbarUserInfo">
                <img src={pictureUrl} alt="profile-pic" className="navbarProfilePic"/>
                <font size = "2" className="navbarUserText">
                    <span>{header}</span>
                    <span className="text-muted navbarAddress">{infoText}</span>
                </font>
            </div>

            <div className="navbarMenuOption">
                <img src="/assets/settings.png" className="navbarMenuIcon navbarMenuLeft" alt="settings"/>
                {/* <Link onClick={logout}><img src="/assets/logout.png" className="navbarMenuIcon" alt="logout"/></Link> */}
                <img onClick={openModal} src="/assets/logout.png" className="navbarMenuIcon" alt="logout"/>
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

                <br />
                <br />
                <div style={{ margin: "10px", maxWidth: "400px", width: "90%"}}>
                    <div style={{marginLeft:160, textAlign:'center',  font:'caption'}}>
                        <label >Are you sure, you want to logout?</label>
                        <br />
                        <br />
                   </div>
                </div>

                <Flex px={4} py={3} justifyContent={"center"}>
                    <Button.Outline onClick={closeModal}>Cancel</Button.Outline>
                    <Button ml={3} type="submit" onClick={logout}>
                    Confirm
                    </Button>
                </Flex>
                </Card>
            </Modal>
        </nav>
	)
}

export default Navbar;
