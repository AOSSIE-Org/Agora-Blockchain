import { Link } from "react-router-dom";
import './styles/Navbar.scss';
import { useWeb3ModalAccount } from "@web3modal/ethers5/react";

function Navbar({pictureUrl}) {
    const { address, } = useWeb3ModalAccount()
	return (
        <nav className="shadow-sm">
            <div className="navbarUserInfo">
                <img src={pictureUrl} alt="profile-pic" className="navbarProfilePic"/>
                <font size = "2" className="navbarUserText">
                    <span>Wallet Address</span>
                    <span className="text-muted navbarAddress">{address}</span>
                </font>
            </div>

            <div className="navbarMenuOption">
                <img src="/assets/settings.png" className="navbarMenuIcon navbarMenuLeft" alt="settings"/>
                <Link to="/"><img src="/assets/logout.png" className="navbarMenuIcon" alt="logout"/></Link>
            </div>
        </nav>
	)
}

export default Navbar;
